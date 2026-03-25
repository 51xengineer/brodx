import { PrismaClient } from '@prisma/client'
import process from 'node:process'
const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.order.deleteMany()
    await prisma.pricingTier.deleteMany()
    await prisma.service.deleteMany()

    const web = await prisma.service.create({
        data: {
            title: 'Elite Web Synthesis',
            description: 'Blazing fast, high-performance web applications built for extreme scale and surgical precision.',
            icon: 'Rocket',
            pricing: {
                create: [
                    { name: 'Basic', price: 99, features: ['Core Deliverables', 'Email Support'] },
                    { name: 'Standard', price: 199, features: ['Enhanced Deliverables', 'Priority Support'] },
                    { name: 'Premium', price: 499, features: ['Full Suite Solutions', '24/7 Support'] },
                ]
            }
        }
    })

    const ai = await prisma.service.create({
        data: {
            title: 'Neural Architecture',
            description: 'Integrating advanced LLMs and specialized ML models into your ecosystem.',
            icon: 'Brain',
            pricing: {
                create: [
                    { name: 'Basic', price: 149, features: ['Core Deliverables', 'Email Support'] },
                    { name: 'Standard', price: 299, features: ['Enhanced Deliverables', 'Priority Support'] },
                    { name: 'Premium', price: 599, features: ['Full Suite Solutions', '24/7 Support'] },
                ]
            }
        }
    })

    const mentorship = await prisma.service.create({
        data: {
            title: 'Structural Mentorship',
            description: 'Deep-dive session to re-architect your engineering path.',
            icon: 'GraduationCap',
            pricing: {
                create: [
                    { name: 'Basic', price: 49, features: ['Core Deliverables', 'Email Support'] },
                    { name: 'Standard', price: 99, features: ['Enhanced Deliverables', 'Priority Support'] },
                    { name: 'Premium', price: 199, features: ['Full Suite Solutions', '24/7 Support'] },
                ]
            }
        }
    })

    const career = await prisma.service.create({
        data: {
            title: 'Placement Strategy',
            description: 'Personal consultancy to navigate the global tech market.',
            icon: 'Users',
            pricing: {
                create: [
                    { name: 'Basic', price: 29, features: ['Core Deliverables', 'Email Support'] },
                    { name: 'Standard', price: 59, features: ['Enhanced Deliverables', 'Priority Support'] },
                    { name: 'Premium', price: 129, features: ['Full Suite Solutions', '24/7 Support'] },
                ]
            }
        }
    })

    const debug = await prisma.service.create({
        data: {
            title: 'Payment Integration Test',
            description: 'A special service for testing end-to-end payment flows with a minimum cost of ₹1.',
            icon: 'Activity',
            pricing: {
                create: [
                    { name: 'Test Tier', price: 1, features: ['Minimum Payment', 'Secure Transaction', 'Instant Verification'] },
                ]
            }
        }
    })

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
