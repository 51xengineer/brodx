import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Rocket, Target, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const AboutPage: React.FC = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    }

    const sections = [
        {
            title: "WORK",
            icon: <Rocket className="text-primary" size={24} />,
            items: ["Web applications", "AI solutions", "Structural Mentorship", "Career guidance"]
        },
        {
            title: "APPROACH",
            icon: <Target className="text-primary" size={24} />,
            content: "Understand the problem. Figure it out. Build and ship. I focus on consistency over everything."
        },
        {
            title: "EXPERIENCE",
            icon: <Shield className="text-primary" size={24} />,
            content: "30+ clients (India + global). Work delivered. Systems running."
        }
    ]

    return (
        <div className="min-h-screen pb-20 pt-10">
            <div className="container mx-auto px-6">
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="relative rounded-[3rem] border border-primary/20 bg-card/30 backdrop-blur-xl p-12 mb-16 overflow-hidden"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <Rocket size={200} />
                    </div>
                    
                    <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center md:items-start">
                        {/* Profile Photo */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6 }}
                            className="relative"
                        >
                            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden border-2 border-primary/20 shadow-2xl shadow-primary/10 group">
                                <img 
                                    src="/neeraj-profile.jpg" 
                                    alt="Neeraj - 51xEngineer" 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white shadow-xl shadow-primary/30">
                                <Rocket size={24} />
                            </div>
                        </motion.div>

                        <div className="flex-1 text-center md:text-left">
                            <motion.div {...fadeIn} className="flex items-center justify-center md:justify-start gap-3 mb-6">
                                <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
                                    51xEngineer
                                </div>
                            </motion.div>
                            
                            <motion.h1 
                                {...fadeIn}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-none"
                            >
                                Neeraj <span className="text-primary italic">—</span> <br/>
                                <span className="text-muted-foreground">Synthesizing Results.</span>
                            </motion.h1>
                            
                            <motion.p 
                                {...fadeIn}
                                transition={{ delay: 0.2 }}
                                className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-2xl"
                            >
                                I build software and put in the work until it’s done right. 
                                No shortcuts, no unnecessary noise.
                            </motion.p>
                            
                            <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center md:justify-start gap-4">
                                <Button className="h-14 px-10 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/20">
                                    Let's Build
                                </Button>
                                <div className="flex items-center gap-2">
                                    {[Github, Twitter, Linkedin].map((Icon, i) => (
                                        <Button key={i} variant="outline" size="icon" className="w-14 h-14 rounded-2xl border-primary/20 hover:bg-primary/5">
                                            <Icon size={20} />
                                        </Button>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-20">
                    {sections.map((section, index) => (
                        <motion.div
                            key={section.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                            className="p-8 rounded-[2.5rem] border border-border bg-card/20 hover:border-primary/30 transition-all group"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                                {section.icon}
                            </div>
                            <h3 className="text-xs font-black uppercase tracking-widest mb-6 text-muted-foreground">{section.title}</h3>
                            {section.items ? (
                                <ul className="space-y-4">
                                    {section.items.map(item => (
                                        <li key={item} className="flex items-center gap-3 text-lg font-bold">
                                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-lg font-bold leading-relaxed">
                                    {section.content}
                                </p>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Philosophy Section */}
                <motion.div 
                    {...fadeIn}
                    transition={{ delay: 0.8 }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <div className="mb-12 inline-block">
                        <div className="w-20 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto mb-8" />
                        <h2 className="text-3xl md:text-4xl font-black tracking-tighter mb-4 italic uppercase">
                            "Show up, put in the effort, do better each time."
                        </h2>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">A reminder to myself</span>
                    </div>
                    
                    <div className="p-12 rounded-[3.5rem] border border-primary/10 bg-gradient-to-br from-card/30 to-background/30 backdrop-blur-sm">
                        <p className="text-xl text-muted-foreground leading-relaxed mb-10 italic">
                            If you’re serious about building something, we can work together.
                        </p>
                        <Button variant="ghost" className="group text-primary hover:text-primary hover:bg-primary/5 transition-all text-sm font-black uppercase tracking-widest">
                            Reach Out <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default AboutPage
