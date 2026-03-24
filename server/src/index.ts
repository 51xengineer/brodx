import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { PrismaClient } from '@prisma/client'
import Razorpay from 'razorpay'
import crypto from 'node:crypto'
import { jwt, sign, verify } from 'hono/jwt'
import { setCookie, getCookie, deleteCookie } from 'hono/cookie'
import 'dotenv/config'

const prisma = new PrismaClient()
const app = new Hono()

app.use('*', cors())

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
})

app.get('/', (c) => c.text('BRODX API is running'))

// GET all services with pricing
app.get('/api/services', async (c) => {
    try {
        const services = await prisma.service.findMany({
            include: { pricing: true }
        })
        return c.json(services)
    } catch (error) {
        return c.json({ error: 'Failed to fetch services' }, 500)
    }
})

// POST create order
app.post('/api/orders', async (c) => {
    try {
        const { clientName, email, phone, serviceId, tierId, amount, requirements } = await c.req.json()

        // 1. Create Razorpay Order
        const razorpayOrder = await razorpay.orders.create({
            amount: Math.round(amount * 100), // convert to paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
        })

        // 2. Validate serviceId/tierId – they may be slug-style (e.g. 'web2-dev') from
        //    the frontend's local services array. Only persist them if they exist in DB.
        let validServiceId: string | undefined = undefined
        let validTierId: string | undefined = undefined

        if (serviceId) {
            const svc = await prisma.service.findUnique({ where: { id: serviceId } })
            if (svc) validServiceId = serviceId
        }
        if (tierId) {
            const tier = await prisma.pricingTier.findUnique({ where: { id: tierId } })
            if (tier) validTierId = tierId
        }

        // 3. Save Order in DB
        const order = await prisma.order.create({
            data: {
                clientName,
                email,
                phone,
                serviceId: validServiceId,
                tierId: validTierId,
                amount,
                requirements,
                razorpayOrderId: razorpayOrder.id,
                status: 'created',
            }
        })

        return c.json({
            orderId: razorpayOrder.id,
            keyId: process.env.RAZORPAY_KEY_ID,
            dbOrderId: order.id
        })
    } catch (error) {
        console.error(error)
        return c.json({ error: 'Failed to create order' }, 500)
    }
})

// POST verify payment
app.post('/api/verify', async (c) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await c.req.json()

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id)
        const generatedSignature = hmac.digest('hex')

        if (generatedSignature === razorpay_signature) {
            await prisma.order.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: 'paid'
                }
            })
            return c.json({ status: 'success' })
        } else {
            await prisma.order.update({
                where: { razorpayOrderId: razorpay_order_id },
                data: { status: 'failed' }
            })
            return c.json({ status: 'failure' }, 400)
        }
    } catch (error) {
        return c.json({ error: 'Verification failed' }, 500)
    }
})

// GET single order by DB id (for success page)
app.get('/api/orders/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const order = await prisma.order.findUnique({
            where: { id },
            include: { service: true, tier: true }
        })
        if (!order) return c.json({ error: 'Order not found' }, 404)
        return c.json(order)
    } catch (error) {
        return c.json({ error: 'Failed to fetch order' }, 500)
    }
})

// ─── AUTHENTICATION ─────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'mneeraj2133@gmail.com').trim()

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000'
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
const REDIRECT_URI = `${BACKEND_URL}/api/auth/callback/google`

// 1. Redirect to Google Login
app.get('/api/auth/google', (c) => {
    const params = new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID || '',
        redirect_uri: REDIRECT_URI,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'select_account',
    })
    return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`)
})

// 2. Google OAuth Callback
app.get('/api/auth/callback/google', async (c) => {
    const code = c.req.query('code')
    if (!code) return c.json({ error: 'No code provided' }, 400)

    try {
        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: GOOGLE_CLIENT_ID || '',
                client_secret: GOOGLE_CLIENT_SECRET || '',
                redirect_uri: REDIRECT_URI,
                grant_type: 'authorization_code',
            }),
        })

        const tokens = await tokenResponse.json() as any
        if (tokens.error) return c.json({ error: tokens.error_description }, 400)

        // Get user info
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        })

        const user = await userResponse.json() as any

        // Verify if it's the admin email
        if (user.email !== ADMIN_EMAIL) {
            return c.text('Unauthorized: This account does not have admin access.', 403)
        }

        // Issue JWT
        const payload = {
            email: user.email,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
        }
        const token = await sign(payload, JWT_SECRET, 'HS256')

        // Redirect to frontend with token
        return c.redirect(`${FRONTEND_URL}/neeraj-vault?token=${token}`)
    } catch (error) {
        console.error('Auth Error:', error)
        return c.json({ error: 'Authentication failed' }, 500)
    }
})

// 3. Admin Middleware
const adminAuthMiddleware = async (c: any, next: any) => {
    const authHeader = c.req.header('Authorization')
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : c.req.query('token')

    if (!token) return c.json({ error: 'Unauthorized' }, 401)

    try {
        const decoded = await verify(token, JWT_SECRET, 'HS256') as any
        if (decoded.email !== ADMIN_EMAIL) return c.json({ error: 'Forbidden' }, 403)
        await next()
    } catch (err) {
        return c.json({ error: 'Invalid or expired token' }, 401)
    }
}

// GET admin orders
app.get('/api/admin/orders', adminAuthMiddleware, async (c) => {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { service: true, tier: true }
    })
    return c.json(orders)
})

// POST sync order status (Admin)
app.post('/api/admin/orders/:id/sync', adminAuthMiddleware, async (c) => {

    try {
        const id = c.req.param('id')
        const order = await prisma.order.findUnique({ where: { id } })
        if (!order || !order.paymentLinkId) return c.json({ error: 'Order not found' }, 404)

        // Fetch latest status from Razorpay
        const pl = await razorpay.paymentLink.fetch(order.paymentLinkId)
        
        const newStatus = pl.status === 'paid' ? 'paid' : (pl.status === 'expired' ? 'failed' : 'created')
        
        await prisma.order.update({
            where: { id },
            data: { status: newStatus }
        })

        return c.json({ status: newStatus })
    } catch (error) {
        return c.json({ error: 'Sync failed' }, 500)
    }
})

// POST create manual payment link (Admin)
app.post('/api/admin/payment-links', adminAuthMiddleware, async (c) => {

    try {
        const { clientName, email, amount, notes, serviceId } = await c.req.json()

        // 1. Create Razorpay Payment Link
        // https://razorpay.com/docs/api/payment-links/create/
        const paymentLink = await razorpay.paymentLink.create({
            amount: Math.round(amount * 100),
            currency: 'INR',
            accept_partial: false,
            description: notes || `Payment request for ${clientName}`,
            customer: {
                name: clientName,
                email: email,
            },
            notify: {
                sms: false,
                email: true,
            },
            reminder_enable: true,
            notes: {
                admin_note: notes
            },
            callback_url: `${process.env.FRONTEND_URL || 'http://localhost:5174'}/admin-page`,
            callback_method: 'get',
        })

        // 2. Save in DB
        const order = await prisma.order.create({
            data: {
                clientName,
                email,
                amount,
                notes,
                serviceId,
                paymentLinkId: paymentLink.id,
                paymentLinkUrl: paymentLink.short_url,
                status: 'created',
            }
        })

        return c.json({
            id: paymentLink.id,
            url: paymentLink.short_url,
            dbOrderId: order.id
        })
    } catch (error) {
        console.error('Razorpay Error:', error)
        return c.json({ error: 'Failed to create payment link' }, 500)
    }
})

import { serve } from '@hono/node-server'
import { swaggerUI } from '@hono/swagger-ui'

// ─── Swagger / OpenAPI docs at GET /docs ──────────────────────────────────────
const openApiSpec = {
    openapi: '3.0.0',
    info: { 
        title: 'BRODX API', 
        version: '1.2.0', 
        description: 'Premium Engineering & Career Growth Services API. Built with Hono & Prisma.',
        contact: { name: 'BRODX Support', url: 'https://brodx.com' }
    },
    servers: [
        { url: 'http://localhost:3000', description: 'Local Development Server' }
    ],
    paths: {
        '/api/services': {
            get: {
                summary: 'List all services',
                tags: ['Services'],
                responses: { '200': { description: 'Array of services with pricing tiers' } },
            }
        },
        '/api/orders': {
            post: {
                summary: 'Create a Razorpay order',
                tags: ['Orders'],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['clientName', 'email', 'amount'], properties: { clientName: { type: 'string' }, email: { type: 'string' }, phone: { type: 'string' }, serviceId: { type: 'string' }, tierId: { type: 'string' }, amount: { type: 'number' }, requirements: { type: 'string' } } } } } },
                responses: { '200': { description: 'Razorpay orderId, keyId, and dbOrderId' }, '500': { description: 'Server error' } },
            }
        },
        '/api/orders/{id}': {
            get: {
                summary: 'Get order by ID',
                tags: ['Orders'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'Order object with service and tier' }, '404': { description: 'Order not found' } },
            }
        },
        '/api/verify': {
            post: {
                summary: 'Verify Razorpay payment signature',
                tags: ['Payments'],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['razorpay_order_id', 'razorpay_payment_id', 'razorpay_signature'], properties: { razorpay_order_id: { type: 'string' }, razorpay_payment_id: { type: 'string' }, razorpay_signature: { type: 'string' } } } } } },
                responses: { '200': { description: 'Verification result' } },
            }
        },
        '/api/admin/orders': {
            get: {
                summary: 'Get all orders (Admin)',
                tags: ['Admin'],
                security: [{ BearerAuth: [] }],
                responses: { '200': { description: 'All orders with service/tier info' }, '401': { description: 'Unauthorized' } },
            }
        },
        '/api/admin/payment-links': {
            post: {
                summary: 'Create manual Razorpay payment link (Admin)',
                tags: ['Admin'],
                security: [{ BearerAuth: [] }],
                requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['clientName', 'email', 'amount'], properties: { clientName: { type: 'string' }, email: { type: 'string' }, amount: { type: 'number' }, notes: { type: 'string' } } } } } },
                responses: { '200': { description: 'Payment link id, url, and dbOrderId' } },
            }
        },
        '/api/admin/orders/{id}/sync': {
            post: {
                summary: 'Sync order status with Razorpay (Admin)',
                tags: ['Admin'],
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: { '200': { description: 'New order status' }, '404': { description: 'Order not found' } },
            }
        },
    },
    components: { securitySchemes: { BearerAuth: { type: 'http', scheme: 'bearer' } } }
}

app.get('/docs/spec', (c) => c.json(openApiSpec))
app.get('/docs', swaggerUI({ url: '/docs/spec' }))

const port = 3000
console.log(`Server is running on port ${port}`)
console.log(`Swagger docs available at http://localhost:${port}/docs`)

serve({ fetch: app.fetch, port })

export default app
