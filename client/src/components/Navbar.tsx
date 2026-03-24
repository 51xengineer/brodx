import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Rocket, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme()
    
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative w-10 h-10 flex items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all overflow-hidden shadow-lg shadow-primary/5"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.div
                    key={theme}
                    initial={{ y: 20, opacity: 0, rotate: -90 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -20, opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                    {theme === 'dark' ? <Moon size={18} strokeWidth={2.5} /> : <Sun size={18} strokeWidth={2.5} />}
                </motion.div>
            </AnimatePresence>
        </motion.button>
    )
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Services', path: '/services' },
        { name: 'About', path: '/about' },
        { name: 'Book Call', path: '/book-call' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-8'}`}>
            <div className="container mx-auto px-6">
                <div className={`relative px-8 py-3 rounded-full border transition-all duration-500 flex items-center justify-between shadow-2xl ${scrolled ? 'bg-background/80 backdrop-blur-2xl border-primary/20 scale-[0.98]' : 'bg-transparent border-foreground/5'}`}>
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
                            <Rocket className="text-white" size={20} />
                        </div>
                        <span className="text-2xl font-black tracking-tighter">BRODX<span className="text-primary italic">.</span></span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-10">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                to={link.path}
                                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-primary relative group flex items-center gap-2 ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground'}`}
                            >
                                {link.name === 'About' && (
                                    <motion.div 
                                        animate={{ scale: [1, 1.2, 1] }} 
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" 
                                    />
                                )}
                                {link.name}
                                <span className={`absolute -bottom-2 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full ${location.pathname === link.path ? 'w-full' : ''}`} />
                            </Link>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <Button 
                            className="hidden md:flex h-11 px-8 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/10"
                            onClick={() => navigate('/services')}
                        >
                            Get Started
                        </Button>
                        
                        {/* Mobile Toggle */}
                        <button className="md:hidden p-2 text-foreground" onClick={() => setIsOpen(!isOpen)}>
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div 
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="absolute top-full left-6 right-6 mt-4 p-8 bg-background/95 backdrop-blur-2xl rounded-[2.5rem] border border-primary/20 shadow-2xl md:hidden space-y-8 overflow-hidden"
                        >
                            <div className="space-y-4">
                                {navLinks.map((link) => (
                                    <Link 
                                        key={link.name} 
                                        to={link.path}
                                        className={`block text-2xl font-black uppercase tracking-tighter transition-colors ${location.pathname === link.path ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </div>
                            <Button className="w-full h-16 rounded-[1.5rem] text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20" onClick={() => { navigate('/services'); setIsOpen(false) }}>
                                Get Started
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    )
}

export default Navbar
