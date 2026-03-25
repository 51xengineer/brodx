import { motion, useScroll, useTransform } from 'framer-motion'
import { Rocket, Cpu, Users, GraduationCap, ArrowRight, MousePointer2 } from 'lucide-react'
import { GoogleMeetIcon, RazorpayIcon } from '../components/Icons'
import { Button } from '@/components/ui/button'
import { useTheme } from '../context/ThemeContext'

interface LandingPageProps {
    onExplore: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onExplore }) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])
    
    return (
        <div className="overflow-x-hidden">
            {/* Immersive Hero */}
            <section className="relative min-h-[95vh] flex items-center justify-center pt-20 overflow-hidden">
                <motion.div 
                    style={{ opacity, scale }}
                    className="container mx-auto px-6 relative z-10 text-center space-y-12"
                >
                    <div className="space-y-8 max-w-5xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            Premium Engineering Standard
                        </motion.div>
                        
                        <motion.h1 
                            className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.85] text-shadow-glow"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                        >
                            ENGINEER<br />STANDARDS<span className="text-primary italic">.</span>
                        </motion.h1>
                        
                        <motion.p 
                            className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-semibold italic opacity-90"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 1, delay: 0.4 }}
                        >
                            High-fidelity technical services for engineers and founders who refuse to compromise on quality. 
                            Build elite products, ship fast, and scale smart.
                        </motion.p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8"
                    >
                        <Button size="lg" className="h-20 px-12 text-xs font-black uppercase tracking-[.25em] rounded-full shadow-premium hover:shadow-primary/40 transition-all hover:-translate-y-1 group" onClick={onExplore}>
                            Explore Ecosystem
                            <ArrowRight size={18} className="ml-3 group-hover:translate-x-1.5 transition-transform" />
                        </Button>
                        <button className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[.3em] text-muted-foreground hover:text-foreground transition-all group">
                            <div className="w-14 h-14 rounded-full border border-border flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                                <MousePointer2 size={18} />
                            </div>
                            The Manifesto
                        </button>
                    </motion.div>
                </motion.div>

                {/* Local Section Gradients */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl aspect-square bg-primary/5 blur-[160px] rounded-full mix-blend-screen opacity-40 shadow-premium" />
                </div>
            </section>

            {/* The Process: Adaptive Containers */}
            <section className="container mx-auto px-6 py-48 bg-muted/30 rounded-[4rem] border border-border transition-colors duration-500">
                <div className="max-w-6xl mx-auto space-y-32">
                    <div className="text-center space-y-6">
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The BRODX Protocol</div>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">Engineered for <br className="md:hidden" /><span className="text-primary italic">Absolute</span> Performance</h2>
                    </div>

                    <div className="relative">
                        <div className={`absolute left-[31px] md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-transparent hidden md:block`} />
                        
                        <div className="space-y-40">
                            {[
                                { title: 'Deep Discovery', desc: 'Decoding the DNA of your product. We identify bottlenecks before they exist with surgical precision.', step: '01', align: 'left' },
                                { title: 'Elite Architecture', desc: 'Structural integrity that withstands 100k+ concurrent users and complex technical debt.', step: '02', align: 'right' },
                                { title: 'Velocity Synthesis', desc: 'Blazing fast build cycles with 100% type safety and zero compromise on user experience.', step: '03', align: 'left' },
                                { title: 'Strategic Scale', desc: 'Deploying not just code, but an ecosystem. Monitoring, infrastructure, and growth metrics.', step: '04', align: 'right' },
                            ].map((s, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className={`relative flex flex-col md:flex-row items-center gap-16 ${s.align === 'right' ? 'md:flex-row-reverse' : ''}`}
                                >
                                    <div className="w-20 h-20 rounded-full bg-background border-2 border-primary/30 flex items-center justify-center text-primary font-black z-10 shadow-premium text-xl italic transition-colors">
                                        {s.step}
                                    </div>
                                    <div className={`md:w-1/2 ${s.align === 'right' ? 'text-left' : 'text-left md:text-right'} space-y-6`}>
                                        <h3 className="text-4xl font-black tracking-tight">{s.title}</h3>
                                        <p className="text-muted-foreground text-xl italic font-semibold leading-relaxed max-w-md ml-auto mr-auto md:ml-0 md:mr-0 opacity-90">{s.desc}</p>
                                    </div>
                                    <div className="md:w-1/2 hidden md:block" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Editorial Founder Section */}
            <section className="container mx-auto px-6 py-48">
                <div className="grid lg:grid-cols-2 gap-32 items-center">
                    <div className="relative group">
                        <div className="aspect-[4/5] bg-muted rounded-[4rem] overflow-hidden border border-border relative transition-colors">
                            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Founder" className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000 scale-105 group-hover:scale-100" />
                            <div className={`absolute inset-x-0 bottom-0 p-16 bg-gradient-to-t ${isDark ? 'from-black via-black/60' : 'from-white via-white/80'} to-transparent transition-all`}>
                                <div className="text-[10px] font-black uppercase tracking-[.5em] text-primary mb-3">Lead Engineer</div>
                                <div className="text-5xl font-black tracking-tighter">Felix R.</div>
                            </div>
                        </div>
                        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-all duration-700" />
                    </div>

                    <div className="space-y-12">
                        <div className="space-y-8">
                            <div className="w-16 h-1.5 text-primary bg-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
                            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] italic">
                                "YOUR CAREER IS AN<br /> 
                                <span className="text-primary italic opacity-95">ARCHITECTURE</span><br />
                                PROBLEM."
                            </h2>
                        </div>
                        <div className="space-y-10 text-xl md:text-2xl text-muted-foreground font-semibold leading-relaxed italic opacity-95">
                            <p>
                                Most engineers are stuck in the "Tutorial Hell" of their professional journey. 
                                I founded BRODX to provide the high-fidelity execution and 
                                structural mentorship needed to break through.
                            </p>
                            <p>
                                I treat every project with a personal obsession for perfection. No shortcuts—just high-velocity engineering.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-12 pt-12 border-t border-border transition-colors">
                            {[
                                { label: 'USERS SCALED', value: '100K+' },
                                { label: 'APPS SHIPPED', value: '30+' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-2">
                                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{stat.label}</div>
                                    <div className="text-5xl font-black italic tracking-tighter">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Services At A Glance */}
            <section className="container mx-auto px-6 py-48 border-t border-border/40">
                <div className="grid lg:grid-cols-2 gap-32 items-center">
                    <div className="space-y-12">
                        <div className="space-y-6">
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.5em]">The Ecosystem</div>
                            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
                                ELITE <br />
                                <span className="text-primary italic">CATEGORIES.</span>
                            </h2>
                            <p className="text-xl text-muted-foreground font-semibold max-w-lg italic leading-relaxed opacity-90">
                                Surgical expertise across the high-performance engineering spectrum. We don't just build; we architect excellence.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            {[
                                { icon: <Rocket size={20} />, title: 'Web2 Dev', desc: 'High-performance React & Node foundations.' },
                                { icon: <Cpu size={20} />, title: 'AI Solutions', desc: 'LLM & Agentic flow integration.', brand: <GoogleMeetIcon size={14} /> },
                                { icon: <GraduationCap size={20} />, title: 'Structural Mentorship', desc: 'Structural path to technical mastery.' },
                                { icon: <Users size={20} />, title: 'Career Strategy', desc: 'Elite placement and referral sync.' },
                            ].map((s, i) => (
                                <div 
                                    key={i} 
                                    className="group flex items-center justify-between p-8 rounded-3xl hover:bg-muted/50 border border-transparent hover:border-border transition-all cursor-pointer"
                                    onClick={onExplore}
                                >
                                    <div className="flex items-center gap-8">
                                        <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            {s.icon}
                                        </div>
                                        <div>
                                            <div className="text-xl font-black tracking-tight">{s.title}</div>
                                            <div className="text-sm text-muted-foreground font-semibold italic opacity-80">{s.desc}</div>
                                        </div>
                                    </div>
                                    <ArrowRight className="opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-primary" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative">
                        <div className="aspect-square bg-muted/20 rounded-[4rem] border border-border overflow-hidden relative group p-12 flex flex-col justify-between">
                            <div className="space-y-8">
                                <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-accent/5 border border-accent/20 text-accent text-[10px] font-black uppercase tracking-[.3em]">
                                    Trust Protocol Active
                                </div>
                                <h3 className="text-4xl font-black tracking-tighter italic leading-tight">
                                    Integrated with <br /> Global Standards.
                                </h3>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 bg-card rounded-[2.5rem] border border-border shadow-premium space-y-4 hover:-translate-y-2 transition-transform">
                                    <GoogleMeetIcon size={32} />
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Meeting Standards</div>
                                </div>
                                <div className="p-8 bg-card rounded-[2.5rem] border border-border shadow-premium space-y-4 hover:-translate-y-2 transition-transform">
                                    <RazorpayIcon size={32} className="text-primary" />
                                    <div className="text-[10px] font-black uppercase tracking-widest opacity-60">Payment Protocol</div>
                                </div>
                            </div>

                            {/* Floating elements for depth */}
                            <div className="absolute top-1/2 right-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
                            <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-accent/10 blur-[50px] rounded-full" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA: Immersive */}
            <section className="container mx-auto px-6 py-48">
                <div className="relative p-24 md:p-48 rounded-[5.5rem] bg-card border border-border overflow-hidden text-center space-y-16 shadow-premium transition-colors">
                    <div className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,${isDark ? '0.1' : '0.05'}),transparent_70%)]`} />
                    <div className="absolute -top-32 -left-32 w-[30rem] h-[30rem] bg-primary/10 blur-[160px] rounded-full opacity-30 px-6" />
                    
                    <div className="relative z-10 space-y-8 max-w-4xl mx-auto">
                        <h2 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] italic">
                            READY TO <span className="text-primary">BUILD?</span>
                        </h2>
                        <p className="text-xl md:text-3xl text-muted-foreground font-semibold italic opacity-90 leading-relaxed">
                            Stop waiting for the perfect moment. <br className="hidden md:block" />
                            Start building elite engineering foundations today.
                        </p>
                    </div>

                    <div className="relative z-10 flex flex-col items-center gap-12 pt-8">
                        <Button size="lg" className="h-24 px-16 text-sm font-black uppercase tracking-[.4em] rounded-full shadow-premium hover:shadow-primary/40 transition-all hover:-translate-y-2 group" onClick={onExplore}>
                            Initialize Session
                            <ArrowRight size={22} className="ml-5 group-hover:translate-x-3 transition-transform duration-500" />
                        </Button>
                        <div className="flex items-center gap-4 text-[11px] font-black text-muted-foreground uppercase tracking-[0.3em] bg-muted px-6 py-2 rounded-full border border-border transition-colors">
                            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            Next available slot: Q2 2026
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default LandingPage
