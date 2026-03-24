import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, FileText } from 'lucide-react'

const PrivacyPolicy: React.FC = () => {
    const sections = [
        {
            title: "Data Collection",
            icon: <Eye className="text-primary" size={20} />,
            content: "We collect minimal data necessary to provide our services and improve your experience. This includes basic contact information and usage analytics."
        },
        {
            title: "Security Measures",
            icon: <Lock className="text-primary" size={20} />,
            content: "Your data is encrypted and stored in secure environments. We implement high-standard protocols to prevent unauthorized access."
        },
        {
            title: "Compliance",
            icon: <ShieldCheck className="text-primary" size={20} />,
            content: "We adhere to global data protection standards (GDPR, CCPA) to ensure the highest level of privacy for our users."
        }
    ]

    return (
        <div className="min-h-screen py-20 pb-40">
            <div className="container max-w-4xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-16"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FileText className="text-primary" size={24} />
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Privacy <span className="text-primary">Policy</span></h1>
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Transparency is our baseline. This document outlines how BRODX handles your intelligence and information.
                    </p>
                </motion.div>

                <div className="space-y-12">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-8 rounded-[2.5rem] border border-border bg-card/20"
                        >
                            <div className="flex items-center gap-4 mb-6">
                                {section.icon}
                                <h3 className="text-lg font-black uppercase tracking-widest">{section.title}</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {section.content}
                            </p>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 p-8 rounded-[2.5rem] bg-primary/5 border border-primary/10 text-sm text-muted-foreground italic text-center"
                >
                    Last updated: March 2026 • © BRODX Synthesis Systems
                </motion.div>
            </div>
        </div>
    )
}

export default PrivacyPolicy
