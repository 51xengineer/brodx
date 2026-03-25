import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { CheckCircle, Download, ArrowLeft, Loader2, AlertCircle, Home, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import axios from 'axios'
import { API_BASE_URL } from '../config'
import { GoogleMeetIcon, RazorpayIcon } from '../components/Icons'

interface Order {
    id: string
    clientName: string
    email: string
    phone?: string
    amount: number
    status: string
    requirements?: string
    notes?: string
    razorpayOrderId?: string
    razorpayPaymentId?: string
    createdAt: string
    service?: { title: string; icon: string }
    tier?: { name: string; price: number }
}

const PaymentSuccess: React.FC = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status') || 'success'

    const [order, setOrder] = useState<Order | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
 
    const formatDate = (dateStr?: string, options?: Intl.DateTimeFormatOptions) => {
        if (!dateStr) return 'Pending...'
        try {
            const d = new Date(dateStr)
            if (isNaN(d.getTime())) return 'Invalid Date'
            return d.toLocaleDateString('en-IN', options)
        } catch (e) {
            return 'Invalid Date'
        }
    }
 
    useEffect(() => {
        if (!orderId) {
            setError('No order ID provided.')
            setLoading(false)
            return
        }
        axios.get(`${API_BASE_URL}/orders/${orderId}`)
            .then(r => setOrder(r.data))
            .catch(() => setError('Could not load order details.'))
            .finally(() => setLoading(false))
    }, [orderId])

    const handleDownloadInvoice = () => {
        if (!order) return
        const invoiceWindow = window.open('', '_blank')
        if (!invoiceWindow) return
 
        const date = formatDate(order.createdAt, {
            day: '2-digit', month: 'long', year: 'numeric'
        })
        const invoiceNo = `INV-${(order.id || 'xxxxxxx').substring(0, 8).toUpperCase()}`
        const serviceName = order.service?.title || order.notes?.substring(0, 40) || 'Custom Service'
        const tierName = order.tier?.name || 'Standard'

        invoiceWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Invoice ${invoiceNo} — BRODX</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; background:#fff; color:#111; padding:60px; max-width:780px; margin:auto; }
    .header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:48px; padding-bottom:24px; border-bottom:2px solid #111; }
    .brand { font-size:28px; font-weight:900; letter-spacing:-1px; }
    .brand span { color:#6366f1; }
    .invoice-meta { text-align:right; }
    .invoice-meta h2 { font-size:22px; font-weight:800; letter-spacing:-0.5px; }
    .invoice-meta p { font-size:13px; color:#555; margin-top:4px; }
    .status-badge { display:inline-block; background:#d1fae5; color:#065f46; padding:4px 14px; border-radius:99px; font-size:11px; font-weight:800; text-transform:uppercase; letter-spacing:0.15em; margin-top:8px; }
    .section { margin-bottom:36px; }
    .section-title { font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.2em; color:#888; margin-bottom:12px; }
    .info-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
    .info-item label { font-size:11px; color:#888; font-weight:600; display:block; margin-bottom:3px; }
    .info-item p { font-size:14px; font-weight:700; }
    table { width:100%; border-collapse:collapse; margin-top:12px; }
    th { background:#f9fafb; text-align:left; padding:12px 16px; font-size:10px; font-weight:900; text-transform:uppercase; letter-spacing:0.15em; color:#555; border-bottom:1px solid #e5e7eb; }
    td { padding:16px; font-size:14px; border-bottom:1px solid #f3f4f6; }
    .total-row td { font-weight:900; font-size:18px; padding-top:20px; border-bottom:none; }
    .footer { margin-top:60px; padding-top:24px; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; font-size:12px; color:#888; }
    @media print { body { padding:40px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="brand">BRO<span>DX</span></div>
    <div class="invoice-meta">
      <h2>INVOICE</h2>
      <p>${invoiceNo}</p>
      <p>${date}</p>
      <div class="status-badge">✓ PAID</div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Bill To</div>
    <div class="info-grid">
      <div class="info-item"><label>Client Name</label><p>${order.clientName}</p></div>
      <div class="info-item"><label>Email</label><p>${order.email}</p></div>
      ${order.phone ? `<div class="info-item"><label>Phone</label><p>${order.phone}</p></div>` : ''}
    </div>
  </div>

  <div class="section">
    <div class="section-title">Order Details</div>
    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th>Package</th>
          <th style="text-align:right">Amount (INR)</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>${serviceName}</td>
          <td>${tierName}</td>
          <td style="text-align:right;font-weight:700;">₹${order.amount.toLocaleString('en-IN')}</td>
        </tr>
        <tr class="total-row">
          <td colspan="2">Total Paid</td>
          <td style="text-align:right;">₹${order.amount.toLocaleString('en-IN')}</td>
        </tr>
      </tbody>
    </table>
  </div>

  ${order.razorpayPaymentId ? `
  <div class="section">
    <div class="section-title">Payment Reference</div>
    <div class="info-grid">
      <div class="info-item"><label>Payment ID</label><p style="font-family:monospace;font-size:12px;">${order.razorpayPaymentId}</p></div>
      <div class="info-item"><label>Order ID</label><p style="font-family:monospace;font-size:12px;">${order.razorpayOrderId || ''}</p></div>
    </div>
  </div>` : ''}

  <div class="footer">
    <div>BRODX — Premium Engineering Services<br/>hello@brodx.com</div>
    <div style="text-align:right">Thank you for your business.<br/>See you in the session! 🥂</div>
  </div>

  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`)
        invoiceWindow.document.close()
    }

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-muted">
                <Loader2 size={40} className="animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest">Loading your confirmation...</p>
            </div>
        </div>
    )

    if (error || !order) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 text-center max-w-sm">
                <AlertCircle size={48} className="text-red-400" />
                <div>
                    <h2 className="text-2xl font-black mb-2">Something went wrong</h2>
                    <p className="text-muted text-sm">{error || 'Order not found.'}</p>
                </div>
                <Button onClick={() => navigate('/')} className="gap-2">
                    <Home size={16} /> Go Home
                </Button>
            </div>
        </div>
    )

    const isPaid = order.status === 'paid' || status === 'success'
 
    const transactionDate = formatDate(order.createdAt, {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    })
    const invoiceNo = `INV-${(order.id || 'xxxxxxx').substring(0, 8).toUpperCase()}`

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Premium success banner */}
            <div className="border-b border-border/40 bg-card/30 backdrop-blur-xl sticky top-20 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/services')}
                        className="flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors group"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Services
                    </button>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => navigate('/')}>
                            <Home size={14} /> Home
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => navigate('/admin-page')}>
                            <LayoutDashboard size={14} /> Admin
                        </Button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 max-w-3xl space-y-10 md:space-y-12">
                {/* Success Hero */}
                <div className="text-center space-y-6">
                    <div className="relative inline-flex">
                        <div className="w-28 h-28 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center">
                            <CheckCircle size={56} className="text-accent" strokeWidth={1.5} />
                        </div>
                        <div className="absolute inset-0 rounded-full bg-accent/5 animate-ping" />
                    </div>

                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-black uppercase tracking-widest">
                            Payment Confirmed
                        </div>
                        <h1 className="text-3xl md:text-6xl font-black tracking-tighter leading-tight">
                            You're all <span className="text-primary italic serif">set</span>!
                        </h1>
                        <p className="text-muted text-lg max-w-xl mx-auto leading-relaxed">
                            Your booking is confirmed. A session confirmation has been sent to <strong className="text-foreground">{order.email}</strong>.
                        </p>
                    </div>
                </div>

                {/* Order Card */}
                <div className="bg-card border border-border/50 rounded-[2rem] overflow-hidden shadow-2xl shadow-primary/5">
                    {/* Card Header */}
                    <div className="bg-primary/5 border-b border-border/40 px-6 py-6 md:px-10 md:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-2">
                        <div>
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest mb-1">Invoice Number</div>
                            <div className="font-mono font-black text-lg md:text-xl tracking-tight">{invoiceNo}</div>
                        </div>
                        <div className="flex flex-col items-start sm:items-end gap-2">
                            <Badge className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isPaid ? 'bg-accent/10 text-accent border-accent/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                                {isPaid ? '✓ Paid' : order.status}
                            </Badge>
                            <div className="flex items-center gap-1.5 opacity-40 grayscale group-hover:grayscale-0 transition-all">
                                <span className="text-[8px] font-black uppercase tracking-widest">Secured by</span>
                                <RazorpayIcon size={12} className="text-primary" />
                            </div>
                        </div>
                    </div>

                    {/* Details Grid */}
                    <div className="px-6 py-6 md:px-10 md:py-8 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest">Client</div>
                            <div className="font-black text-base md:text-lg">{order.clientName}</div>
                            <div className="text-xs md:text-sm text-muted">{order.email}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest">Date</div>
                            <div className="font-bold text-sm md:text-base">{transactionDate}</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest">Service</div>
                            <div className="font-black text-sm md:text-base">{order.service?.title || order.notes?.substring(0, 40) || 'Custom Request'}</div>
                            {order.tier && <div className="text-xs md:text-sm text-muted">{order.tier.name} Package</div>}
                        </div>
                        <div className="space-y-1">
                            <div className="text-[10px] font-black text-muted uppercase tracking-widest">Amount Paid</div>
                            <div className="font-mono font-black text-2xl md:text-3xl tracking-tighter text-accent">₹{order.amount.toLocaleString('en-IN')}</div>
                        </div>
                        {order.razorpayPaymentId && (
                            <div className="col-span-1 sm:col-span-2 space-y-1 pt-4 border-t border-border/40">
                                <div className="text-[10px] font-black text-muted uppercase tracking-widest">Payment Reference</div>
                                <div className="font-mono text-[10px] md:text-sm text-muted bg-background/50 px-4 py-2 rounded-xl border border-border/40 break-all">{order.razorpayPaymentId}</div>
                            </div>
                        )}
                        {order.requirements && (
                            <div className="col-span-1 sm:col-span-2 space-y-1">
                                <div className="text-[10px] font-black text-muted uppercase tracking-widest">Session Notes</div>
                                <div className="text-xs md:text-sm text-muted bg-background/50 px-4 py-3 rounded-xl border border-border/40">{order.requirements}</div>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="px-6 pb-6 md:px-10 md:pb-10 flex flex-col sm:flex-row gap-4">
                        <Button
                            size="lg"
                            className="flex-1 h-12 md:h-14 rounded-2xl font-bold gap-2 shadow-xl shadow-primary/10 text-xs md:text-sm"
                            onClick={handleDownloadInvoice}
                        >
                            <Download size={18} />
                            Download Invoice
                        </Button>
                        <Button
                            size="lg"
                            variant="outline"
                            className="flex-1 h-12 md:h-14 rounded-2xl font-bold gap-2 text-xs md:text-sm"
                            onClick={() => navigate('/services')}
                        >
                            Book Another Session
                        </Button>
                    </div>
                </div>

                {/* What's Next */}
                <div className="bg-card/30 border border-border/40 rounded-[1.5rem] md:rounded-[2rem] p-6 md:p-10 space-y-6 md:space-y-8">
                    <div className="text-xs font-black text-muted uppercase tracking-widest">What Happens Next</div>
                    <div className="space-y-4">
                        {[
                            { step: '01', title: 'Check Your Email', desc: 'A session confirmation with your Google Meet link has been sent to your inbox.' },
                            { step: '02', title: 'Prepare Your Goals', desc: 'List your specific objectives for the session — the more detailed, the better the output.' },
                            { step: '03', title: 'Join the Session', desc: 'Click the Meet link at your scheduled time. Shared notes and resources will be provided post-session.' },
                        ].map((item) => (
                            <div key={item.step} className="flex items-start gap-5">
                                <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center shadow-sm">
                                    {item.step === '01' ? <GoogleMeetIcon size={20} /> : <div className="font-black text-primary text-xs">{item.step}</div>}
                                </div>
                                <div>
                                    <div className="font-black">{item.title}</div>
                                    <div className="text-sm text-muted mt-0.5">{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentSuccess
