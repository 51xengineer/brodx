import React from 'react'
import { motion } from 'framer-motion'
import { Gavel, CheckCircle, Scale, ScrollText } from 'lucide-react'

const TermsOfService: React.FC = () => {
    const terms = [
        {
            title: "Service Delivery",
            icon: <CheckCircle className="text-primary" size={20} />,
            content: "BRODX provides software solutions and AI synthesis as-is. We strive for 99.9% uptime and high-fidelity output."
        },
        {
            title: "Intellectual Property",
            icon: <Scale className="text-primary" size={20} />,
            content: "Upon completion of services and payment, intellectual property rights for custom-built software are transferred to the client."
        },
        {
            title: "User Responsibility",
            icon: <Gavel className="text-primary" size={20} />,
            content: "Users are responsible for the content they provide and the way they utilize the synthesized software built by BRODX."
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
                            <ScrollText className="text-primary" size={24} />
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter uppercase italic">Terms <span className="text-primary">of Service</span></h1>
                    </div>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        The framework for our collaboration. These terms define the parameters of the BRODX ecosystem.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-1 gap-8">
                    {terms.map((term, index) => (
                        <motion.div
                            key={term.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-10 rounded-[3rem] border border-border bg-card/20 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Scale size={100} />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    {term.icon}
                                    <h3 className="text-lg font-black uppercase tracking-widest">{term.title}</h3>
                                </div>
                                <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl">
                                    {term.content}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 p-12 rounded-[3.5rem] bg-card/10 border border-border text-center"
                >
                    <p className="text-muted-foreground italic mb-0">
                        By using BRODX services, you agree to synthesize within these parameters.
                    </p>
                </motion.div>
            </div>
        </div>
    )
}

export default TermsOfService
