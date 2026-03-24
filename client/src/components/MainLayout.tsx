import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import { useTheme } from '../context/ThemeContext'

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation()
    const { theme } = useTheme()
    const isDark = theme === 'dark'

    return (
        <div className="min-h-screen transition-colors duration-500">
            <Navbar />
            
            {/* Global Background Decoration: Premium Cross Lines */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <svg className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ${isDark ? 'opacity-[0.02]' : 'opacity-[0.04]'}`} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke={isDark ? "white" : "black"} strokeWidth="0.5"/>
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
                
                {/* Large Intersecting "Engineered" Lines */}
                <div className={`absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent transition-opacity duration-500 ${isDark ? 'opacity-10' : 'opacity-20'}`} />
                <div className={`absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-primary/10 to-transparent transition-opacity duration-500 ${isDark ? 'opacity-10' : 'opacity-20'}`} />
                <div className={`absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-opacity duration-500 ${isDark ? 'opacity-5' : 'opacity-10'}`} />
                <div className={`absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/5 to-transparent transition-opacity duration-500 ${isDark ? 'opacity-5' : 'opacity-10'}`} />
                
                {/* Subtle Radial Glows for Depth */}
                <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[140px] rounded-full transition-opacity duration-500 ${isDark ? 'opacity-60' : 'opacity-40'}`} />
                <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/3 blur-[120px] rounded-full transition-opacity duration-500 ${isDark ? 'opacity-40' : 'opacity-20'}`} />
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/2 blur-[160px] rounded-full transition-opacity duration-500 ${isDark ? 'opacity-30' : 'opacity-10'}`} />
            </div>

            <main className="relative z-10 pt-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        {children}
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Global Footer */}
            <footer className="relative z-10 border-t border-border bg-card/20 backdrop-blur-sm pt-20 pb-12">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center font-black text-white italic shadow-lg shadow-primary/20">B</div>
                                <span className="font-bold tracking-tighter text-2xl uppercase">BRODX<span className="text-primary">.</span></span>
                            </div>
                            <p className="text-muted-foreground max-w-sm leading-relaxed mb-8">
                                Synthesizing the future of web architecture and AI solutions. Engineered for impact, built for consistency.
                            </p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                                    <div className="w-4 h-4 bg-muted-foreground rounded-sm" />
                                </div>
                                <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/5 hover:border-primary/20 transition-all cursor-pointer">
                                    <div className="w-4 h-4 bg-muted-foreground rounded-full" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-primary">Platform</h4>
                            <ul className="space-y-4">
                                {['Services', 'Book Call'].map(item => (
                                    <li key={item}>
                                        <a href={`/${item.toLowerCase().replace(' ', '-')}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 text-primary">Intelligence</h4>
                            <ul className="space-y-4">
                                {[
                                    { name: 'About Me', path: '/about' },
                                    { name: 'Privacy Policy', path: '/privacy' },
                                    { name: 'Terms of Service', path: '/terms' }
                                ].map(link => (
                                    <li key={link.name}>
                                        <a href={link.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">{link.name}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="pt-12 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">
                            © 2026 BRODX • SYNTHESIZING THE FUTURE
                        </div>
                        <div className="flex gap-8">
                            <a href="/privacy" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all">Privacy</a>
                            <a href="/terms" className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-all">Terms</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default MainLayout
