import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTheme } from '../context/ThemeContext'
import axios from 'axios'
import { API_BASE_URL } from '../config'

import { ASSET_MAP, DEFAULT_ASSET } from '../constants/services'

interface ServicesPageProps {
    onSelectService: (service: any) => void
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onSelectService }) => {
    const { theme } = useTheme()
    const isDark = theme === 'dark'
    const [services, setServices] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        const fetchServices = async () => {
            try {
                const { data } = await axios.get(`${API_BASE_URL}/services`)
                setServices(data)
            } catch (error) {
                console.error('Failed to fetch services:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchServices()
    }, [])

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen pb-40">
            {/* High-Impact Hero Banner */}
            <section className="relative pt-48 pb-24 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl space-y-8 animate-in slide-in-from-left duration-1000">
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-[0.3em]"
                        >
                            The Catalog
                        </motion.div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-shadow-glow">
                            OUR <br className="hidden md:block" /> 
                            <span className="text-primary italic">SERVICES.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-semibold italic max-w-2xl leading-relaxed opacity-90">
                            Explore high-value services designed to accelerate your engineering and career growth. Built by engineers, for elite execution.
                        </p>
                    </div>
                </div>
            </section>

            {/* Compact & Premium Services Grid */}
            <div className="container mx-auto px-6 py-20">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((s, i) => {
                        const assets = ASSET_MAP[s.title] || DEFAULT_ASSET
                        const minPrice = s.pricing && s.pricing.length > 0 
                            ? Math.min(...s.pricing.map((p: any) => p.price))
                            : 0

                        return (
                            <motion.div
                                key={s.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group flex flex-col bg-card border border-border rounded-[3rem] overflow-hidden hover:border-primary/50 transition-all hover:shadow-premium cursor-pointer"
                                onClick={() => onSelectService(s)}
                            >
                                <div className="relative aspect-video overflow-hidden border-b border-border/50">
                                    <img src={assets.image} alt={s.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${isDark ? 'from-background' : 'from-background/20'} via-transparent to-transparent opacity-60`} />
                                </div>

                                <div className="p-8 flex-1 flex flex-col space-y-7">
                                    {/* Icon + Category */}
                                    <div className="flex items-center justify-between">
                                        <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-all border border-primary/20 shadow-sm">
                                            <div className="text-primary w-6 h-6 flex items-center justify-center">
                                                {React.cloneElement(assets.icon as React.ReactElement<any>, { size: 24, strokeWidth: 2.5 })}
                                            </div>
                                        </div>
                                        {assets.badge && (
                                            <Badge className="text-[9px] font-black uppercase tracking-widest bg-primary text-white border-none px-3.5 py-1.5 rounded-full shadow-lg shadow-primary/25">
                                                {assets.badge}
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="space-y-3.5">
                                        <div className="text-[10px] font-black uppercase tracking-widest text-primary opacity-90">{assets.category}</div>
                                        <h2 className="text-2xl font-black tracking-tight group-hover:text-primary transition-colors leading-tight h-[3.5rem] overflow-hidden line-clamp-2">{s.title}</h2>
                                        <p className="text-sm text-muted-foreground leading-relaxed font-semibold opacity-90 line-clamp-2 h-[2.5rem]">{s.description}</p>
                                    </div>

                                    {/* Features (Mini) */}
                                    <div className="flex flex-wrap gap-2 pt-1 border-t border-border/50 mt-auto">
                                        {(s.pricing?.[0]?.features || []).slice(0, 3).map((f: string, i: number) => (
                                            <span key={i} className="text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg bg-muted text-muted-foreground border border-border/50 transition-colors">
                                                {f}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Price & CTA */}
                                    <div className="pt-6 flex items-center justify-between">
                                        <div className="text-xl font-black tracking-tighter">₹{minPrice.toLocaleString('en-IN')}</div>
                                        <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default ServicesPage
