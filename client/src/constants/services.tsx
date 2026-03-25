import React from 'react'
import { Rocket, Brain, GraduationCap, Users } from 'lucide-react'

export interface PricingTier {
    id: string | null
    name: string
    price: number
    features: string[]
}

export interface Service {
    id: string
    title: string
    description: string
    category: string
    price: string
    image: string
    icon: React.ReactNode
    features: string[]
    badge?: string
    pricing?: PricingTier[]
}

export const ASSET_MAP: Record<string, { icon: React.ReactNode, image: string, badge?: string, category: string }> = {
    'Elite Web Synthesis': {
        icon: <Rocket />,
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        badge: 'POPULAR',
        category: 'ENGINEERING'
    },
    'Neural Architecture': {
        icon: <Brain />,
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        category: 'INTELLIGENCE'
    },
    'Structural Mentorship': {
        icon: <GraduationCap />,
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        badge: 'HIGH VALUE',
        category: 'GROWTH'
    },
    'Placement Strategy': {
        icon: <Users />,
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2959d43?auto=format&fit=crop&q=80&w=800',
        badge: 'STRATEGY',
        category: 'STRATEGY'
    }
}

export const DEFAULT_ASSET = {
    icon: <Rocket />,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800',
    category: 'SERVICE'
}

export const SERVICES: Service[] = [
    {
        id: 'web-dev',
        title: 'Elite Web Synthesis',
        description: 'Blazing fast, high-performance web applications built for extreme scale and surgical precision. React, Next.js, and technical excellence.',
        category: 'ENGINEERING',
        price: '₹49,999',
        image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        icon: <Rocket />,
        features: ['100k+ Scale', 'Type-Safe', 'Cloud Ready'],
        badge: 'POPULAR',
        pricing: [
            { id: 'web-basic', name: 'Basic', price: 49999, features: ['Core Deliverables', 'Email Support', '1 Revision', '3 Days Delivery'] },
            { id: 'web-std', name: 'Standard', price: 89999, features: ['Enhanced Deliverables', 'Priority Support', '3 Revisions', '7 Days Delivery', 'Source Files'] },
            { id: 'web-prem', name: 'Premium', price: 174999, features: ['Full Suite Solutions', '24/7 Support', 'Unlimited Revisions', '14 Days Delivery', 'Post-launch Support', 'Consultation Call'] },
        ]
    },
    {
        id: 'ai-solutions',
        title: 'Neural Architecture',
        description: 'Integrating advanced LLMs and specialized ML models into your ecosystem. Intelligent products that think and evolve.',
        category: 'INTELLIGENCE',
        price: '₹74,999',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        icon: <Brain />,
        features: ['LLM Ops', 'Agentic Flow', 'Vectorized'],
        pricing: [
            { id: 'ai-basic', name: 'Basic', price: 74999, features: ['Core Deliverables', 'Email Support', '1 Revision', '3 Days Delivery'] },
            { id: 'ai-std', name: 'Standard', price: 134999, features: ['Enhanced Deliverables', 'Priority Support', '3 Revisions', '7 Days Delivery', 'Source Files'] },
            { id: 'ai-prem', name: 'Premium', price: 262499, features: ['Full Suite Solutions', '24/7 Support', 'Unlimited Revisions', '14 Days Delivery', 'Post-launch Support', 'Consultation Call'] },
        ]
    },
    {
        id: 'mentorship',
        title: 'Structural Mentorship',
        description: 'Deep-dive session to re-architect your engineering path. From DSA to System Design, we build elite technical foundations.',
        category: 'GROWTH',
        price: '₹14,999',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        icon: <GraduationCap />,
        features: ['1:1 Sessions', 'Mock Debits', 'Roadmaps'],
        badge: 'HIGH VALUE',
        pricing: [
            { id: 'ment-basic', name: 'Basic', price: 14999, features: ['Core Deliverables', 'Email Support', '1 Revision', '3 Days Delivery'] },
            { id: 'ment-std', name: 'Standard', price: 26999, features: ['Enhanced Deliverables', 'Priority Support', '3 Revisions', '7 Days Delivery', 'Source Files'] },
            { id: 'ment-prem', name: 'Premium', price: 52499, features: ['Full Suite Solutions', '24/7 Support', 'Unlimited Revisions', '14 Days Delivery', 'Post-launch Support', 'Consultation Call'] },
        ]
    },
    {
        id: 'career-consulting',
        title: 'Placement Strategy',
        description: 'Personal consultancy to navigate the global tech market. Resume engineering, referral networks, and interview synthesis.',
        category: 'STRATEGY',
        price: '₹9,999',
        image: 'https://images.unsplash.com/photo-1521791136064-7986c2959d43?auto=format&fit=crop&q=80&w=800',
        icon: <Users />,
        features: ['Global Network', 'Resume Sync', 'Negotiation'],
        pricing: [
            { id: 'career-basic', name: 'Basic', price: 9999, features: ['Core Deliverables', 'Email Support', '1 Revision', '3 Days Delivery'] },
            { id: 'career-std', name: 'Standard', price: 17999, features: ['Enhanced Deliverables', 'Priority Support', '3 Revisions', '7 Days Delivery', 'Source Files'] },
            { id: 'career-prem', name: 'Premium', price: 34999, features: ['Full Suite Solutions', '24/7 Support', 'Unlimited Revisions', '14 Days Delivery', 'Post-launch Support', 'Consultation Call'] },
        ]
    }
]
