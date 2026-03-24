import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    // Clear existing data
    await prisma.order.deleteMany()
    await prisma.pricingTier.deleteMany()
    await prisma.service.deleteMany()

    const web2 = await prisma.service.create({
        data: {
            title: 'Web Development (Web2)',
            description: 'High-performance, modern web applications built with React, Node.js, and the latest tech stack.',
            icon: 'Rocket',
            pricing: {
                create: [
                    { name: 'Basic', price: 499, features: ['Core Deliverables', 'Email Support', '1 Revision'] },
                    { name: 'Standard', price: 899, features: ['Enhanced Deliverables', 'Priority Support', '3 Revisions'] },
                    { name: 'Premium', price: 1749, features: ['Full Suite Solutions', '24/7 Support', 'Unlimited Revisions'] },
                ]
            }
        }
    })

    const ai = await prisma.service.create({
        data: {
            title: 'AI Solutions',
            description: 'Integrate cutting-edge AI features into your existing platforms or build AI-first products from scratch.',
            icon: 'Cpu',
            pricing: {
                create: [
                    { name: 'Basic', price: 799, features: ['LLM Integration', 'Custom RAG'] },
                    { name: 'Standard', price: 1449, features: ['Workflow Automation', 'ML Model Hosting'] },
                    { name: 'Premium', price: 2799, features: ['Full Suite AI Solutions', 'Scale Consultancy'] },
                ]
            }
        }
    })

    const mentorship = await prisma.service.create({
        data: {
            title: '1:1 Mentorship',
            description: 'Fast-track your career with personalized guidance on DSA, System Design, and CS Fundamentals.',
            icon: 'GraduationCap',
            pricing: {
                create: [
                    { name: 'Basic', price: 99, features: ['DSA Masterclass', 'Interview Prep'] },
                    { name: 'Standard', price: 179, features: ['System Design', 'Resume Review'] },
                    { name: 'Premium', price: 349, features: ['Full Career Strategy', 'Direct Referral Support'] },
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
