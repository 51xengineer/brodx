import React, { useState, useEffect } from 'react'
import { ArrowLeft, Check, ShieldCheck, Zap, Code, Terminal, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { SERVICES, ASSET_MAP, DEFAULT_ASSET } from '../constants/services'
import { API_BASE_URL } from '../config'
import { GoogleMeetIcon, RazorpayIcon } from '../components/Icons'

interface ServiceDetailProps {
    service: any
    onBack: () => void
}

const ServiceDetail: React.FC<ServiceDetailProps> = ({ service: propService, onBack }) => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { } = useTheme()
    const [selectedTier, setSelectedTier] = useState<any>(null)
    const [service, setService] = useState<any>(propService)
    const [loading, setLoading] = useState(!propService)
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', requirements: '' })
    const [isBooking, setIsBooking] = useState(false)
    const [step, setStep] = useState(1)
    const [selectedDate, setSelectedDate] = useState('2026-03-25')
    const [selectedTime, setSelectedTime] = useState('14:00')

    if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
            </div>
        )
    }

    if (!service) {
        return (
            <div className="container mx-auto px-6 py-32 min-h-screen text-center">
                <h1 className="text-2xl font-black mb-4">Service Not Found</h1>
                <Button onClick={onBack}>Back to Services</Button>
            </div>
        )
    }

    const tiers = (service.pricing && service.pricing.length > 0) ? service.pricing : [
        { id: null, name: 'Basic', price: service.startingPrice || 9999, features: ['Core Deliverables', 'Email Support', '1 Revision', '3 Days Delivery'] },
        { id: null, name: 'Standard', price: Math.round((service.startingPrice || 9999) * 1.8), features: ['Enhanced Deliverables', 'Priority Support', '3 Revisions', '7 Days Delivery', 'Source Files'] },
        { id: null, name: 'Premium', price: Math.round((service.startingPrice || 9999) * 3.5), features: ['Full Suite Solutions', '24/7 Support', 'Unlimited Revisions', '14 Days Delivery', 'Post-launch Support', 'Consultation Call'] },
    ]

    useEffect(() => {
        if (!propService && id) {
            setLoading(true)
            axios.get(`${API_BASE_URL}/services`)
                .then(r => {
                    const found = r.data.find((s: any) => s.id === id)
                    if (found) {
                        setService(found)
                    } else {
                        // Fallback to static services if not in DB
                        const staticFound = SERVICES.find(s => s.id === id)
                        setService(staticFound || null)
                    }
                })
                .catch(() => {
                    const staticFound = SERVICES.find(s => s.id === id)
                    setService(staticFound || null)
                })
                .finally(() => setLoading(false))
        }
    }, [id, propService])

    useEffect(() => {
        if (service && service.pricing && service.pricing.length > 0 && !selectedTier) {
            setSelectedTier(service.pricing[0])
        }
    }, [service, selectedTier])

    const assets = service ? (ASSET_MAP[service.title] || DEFAULT_ASSET) : DEFAULT_ASSET

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await axios.post(`${API_BASE_URL}/orders`, {
                clientName: formData.name,
                email: formData.email,
                phone: formData.phone,
                serviceId: service.id,
                tierId: selectedTier.id || undefined,
                amount: selectedTier.price,
                requirements: `Date: ${selectedDate}, Time: ${selectedTime}. ${formData.requirements}`
            })

            const { orderId, keyId } = response.data

            const options = {
                key: keyId,
                amount: selectedTier.price * 100,
                currency: 'INR',
                name: 'BRODX',
                description: `${service.title} - ${selectedTier.name}`,
                order_id: orderId,
                handler: async (razorpayResponse: any) => {
                    try {
                        await axios.post(`${API_BASE_URL}/verify`, razorpayResponse)
                        toast.success("Payment Confirmed! 🥂")
                        setIsBooking(false)
                        setStep(1)
                        navigate(`/payment-success?orderId=${response.data.dbOrderId}&status=success`)
                    } catch (err) {
                        toast.error("Verification Failed")
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.phone
                },
                theme: { color: "#6366F1" }
            }

            const rzp = new (window as any).Razorpay(options)
            rzp.open()

        } catch (error) {
            toast.error("Booking Failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-6 py-32 min-h-screen">
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-12 group font-black uppercase text-[10px] tracking-widest"
            >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                Back to Synthesis
            </button>

            <div className="grid lg:grid-cols-3 gap-16">
                <div className="lg:col-span-2 space-y-16">
                    {/* Main Info */}
                    {/* Main Info */}
                    <div className="space-y-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
                                            {React.isValidElement(assets.icon)
                                                ? React.cloneElement(assets.icon as React.ReactElement<any>, { size: 32, strokeWidth: 2.5 })
                                                : null}
                                        </div>
                                        <Badge className="text-[10px] uppercase tracking-[0.2em] bg-primary/5 text-primary border-primary/20 px-3 py-1 font-black">
                                            {assets.category}
                                        </Badge>
                                    </div>
                                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight italic">
                                        {service.title}
                                    </h1>
                        <p className="text-xl md:text-2xl text-muted-foreground font-semibold italic leading-relaxed max-w-3xl opacity-90">
                            {service.description}
                        </p>
                    </div>

                    {/* Problem -> Outcome Grid */}
                    <div className="grid md:grid-cols-3 gap-10 pt-16 border-t border-border">
                        {[
                            { title: 'The Blockers', icon: <Terminal size={22} />, text: 'Legacy technical debt, architectural bottlenecks, and suboptimal scale.' },
                            { title: 'High-Fidelity Solution', icon: <Code size={22} />, text: 'Modern architecture, surgical code optimization, and elite scaling.' },
                            { title: 'Premium Outcome', icon: <Zap size={22} />, text: 'Ship products that win, scale without friction, and lead the market.' },
                        ].map((item, i) => (
                            <div key={i} className="space-y-5">
                                <div className="text-primary font-black uppercase tracking-widest text-xs flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center shadow-sm border border-primary/10">
                                        {item.icon}
                                    </div>
                                    {item.title}
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed font-semibold italic opacity-85">{item.text}</p>
                            </div>
                        ))}
                    </div>

    {/* Features Section */}
    <div className="space-y-10">
        <h3 className="text-3xl font-black tracking-tight">Core Deliverables</h3>
        <div className="grid sm:grid-cols-2 gap-5">
            {(service.features || []).map((f: string, i: number) => (
                <div key={i} className="flex items-center gap-4 p-5 bg-muted/40 border border-border rounded-2xl shadow-sm transition-colors hover:bg-muted/60">
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <Check size={14} strokeWidth={3} />
                    </div>
                    <span className="text-sm font-bold opacity-80 italic">{f}</span>
                </div>
            ))}
        </div>
    </div>
</div>

{/* Sidebar Sticky Panel */}
<div className="relative">
    <div className="sticky top-32 space-y-8">
        {/* Tier Selector */}
        <div className="p-1.5 bg-muted/50 border border-border rounded-2xl flex gap-1.5 shadow-sm">
            {tiers.map((t: any) => (
                <button
                    key={t.name}
                    onClick={() => setSelectedTier(t)}
                    className={`flex-1 py-3.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${selectedTier?.name === t.name
                        ? 'bg-primary text-white shadow-xl shadow-primary/25'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
                        }`}
                >
                    {t.name}
                </button>
            ))}
        </div>

        {selectedTier ? (
            <Card className="bg-card border-border shadow-premium rounded-[2.5rem] overflow-hidden border transition-all">
                <CardHeader className="p-10 pb-6 border-b border-border/50 bg-muted/20">
                    <div className="flex justify-between items-center mb-6">
                        <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-widest px-3 py-1.5">
                            {selectedTier.name} SYNTHESIS
                        </Badge>
                        <ShieldCheck className="text-primary opacity-60" size={24} />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-black tracking-tighter">₹{selectedTier.price?.toLocaleString('en-IN') || '0'}</span>
                        <span className="text-muted-foreground text-xs font-black uppercase tracking-widest">/ session</span>
                    </div>
                </CardHeader>
                                <CardContent className="p-10 space-y-5">
                                    <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-4">Functional Suite</div>
                                    {selectedTier.features.map((f: string, i: number) => (
                                        <div key={i} className="flex items-center gap-4 text-sm font-bold italic opacity-85">
                                            <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-all group-hover:bg-primary group-hover:text-white">
                                                <Check size={12} strokeWidth={4} />
                                            </div>
                                            {f}
                                        </div>
                                    ))}
                                </CardContent>
                                <CardFooter className="p-10 pt-0">
                                    <Dialog open={isBooking} onOpenChange={(open) => { setIsBooking(open); if (!open) setStep(1); }}>
                                        <DialogTrigger asChild>
                                            <Button className="w-full h-16 rounded-[1.25rem] font-black uppercase text-xs tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-1">
                                                Initialize Booking
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-3xl bg-card border-border rounded-[2.5rem] p-0 overflow-hidden shadow-premium">
                                            <div className="flex flex-col md:flex-row h-full md:h-[550px]">
                                                {/* Left Panel */}
                                                <div className="md:w-72 bg-muted/30 border-r border-border p-10 space-y-10 hidden md:block">
                                                    <div className="space-y-5">
                                                        <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                                            {React.isValidElement(assets.icon)
                                                                ? React.cloneElement(assets.icon as React.ReactElement<any>, { size: 28 })
                                                                : null}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black tracking-tight">{service.title}</h3>
                                                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1 opacity-80">{selectedTier.name} Access</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-6 pt-10 border-t border-border">
                                                        {[
                                                            { icon: <GoogleMeetIcon size={16} />, label: 'Google Meet conference' },
                                                            { icon: <Globe className="text-primary" size={16} />, label: 'Shared cloud workspace' },
                                                            { icon: <RazorpayIcon className="text-primary" size={16} />, label: 'Payment via Razorpay' }
                                                        ].map((l, i) => (
                                                            <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                                                                {l.icon}
                                                                {l.label}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Form Panel */}
                                                <div className="flex-1 p-10 flex flex-col">
                                                    <div className="flex items-center justify-between mb-10">
                                                        <div className="flex items-center gap-2">
                                                            {[1, 2, 3].map((s) => (
                                                                <div key={s} className={`w-10 h-1.5 rounded-full transition-all ${step >= s ? 'bg-primary' : 'bg-muted shadow-inner'}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Phase 0{step} / 03</span>
                                                    </div>

                                                    <div className="flex-1 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                        {step === 1 && (
                                                            <div className="space-y-6">
                                                                <div className="space-y-2">
                                                                    <h2 className="text-3xl font-black tracking-tight">Lead Details</h2>
                                                                    <p className="text-sm text-muted-foreground font-semibold italic">Initialize your profile in the ecosystem.</p>
                                                                </div>
                                                                <div className="space-y-5">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Name</Label>
                                                                        <Input placeholder="Felix" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="h-14 bg-muted/20 border-border rounded-2xl" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email Endpoint</Label>
                                                                        <Input type="email" placeholder="felix@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="h-14 bg-muted/20 border-border rounded-2xl" />
                                                                    </div>
                                                                    <Button className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-widest mt-4 shadow-lg shadow-primary/10" onClick={() => setStep(2)}>Continue to Sync</Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {step === 2 && (
                                                            <div className="space-y-6">
                                                                <div className="space-y-2">
                                                                    <h2 className="text-3xl font-black tracking-tight">Temporal Slot</h2>
                                                                    <p className="text-sm text-muted-foreground font-semibold italic">Sync your schedule with our lead engineer.</p>
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Date Selection</Label>
                                                                        <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="h-14 bg-muted/20 border-border rounded-2xl" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Neural Time (IST)</Label>
                                                                        <select className="flex h-14 w-full rounded-2xl border border-border bg-muted/20 px-4 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}>
                                                                            <option value="10:00">10:00 AM</option>
                                                                            <option value="12:00">12:00 PM</option>
                                                                            <option value="14:00">02:00 PM</option>
                                                                            <option value="16:00">04:00 PM</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                                <div className="flex gap-4 pt-4">
                                                                    <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest" onClick={() => setStep(1)}>Back</Button>
                                                                    <Button className="flex-2 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/10" onClick={() => setStep(3)}>Proceed to Synthesis</Button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {step === 3 && (
                                                            <div className="space-y-8 text-center pt-8">
                                                                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary shadow-inner border border-primary/20">
                                                                    <ShieldCheck size={36} strokeWidth={1.5} />
                                                                </div>
                                                                <div className="space-y-3">
                                                                    <h2 className="text-4xl font-black tracking-tighter">Finalize Sync</h2>
                                                                    <p className="text-sm text-muted-foreground font-semibold italic">Neural connection ready for {selectedTier.name} package.</p>
                                                                </div>
                                                                <div className="p-6 bg-muted/40 rounded-3xl border border-border flex justify-between items-center text-left">
                                                                    <div>
                                                                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Active Slot</div>
                                                                        <div className="font-black text-sm">{selectedDate} @ {selectedTime} IST</div>
                                                                    </div>
                                                                    <div className="text-right">
                                                                        <div className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Value</div>
                                                                        <div className="font-black text-xl text-primary tracking-tighter">₹{selectedTier.price.toLocaleString('en-IN')}</div>
                                                                    </div>
                                                                </div>
                                                                <Button className="w-full h-16 rounded-[1.25rem] font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 flex items-center justify-center gap-3" disabled={loading} onClick={handleBooking}>
                                                                    {loading ? 'Initializing...' : (
                                                                        <>
                                                                            Authorize with <RazorpayIcon size={20} />
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </CardFooter>
                            </Card>
                        ) : null}

                        {/* Security Badge */}
                        <div className="p-8 bg-muted/40 border border-border rounded-[2rem] flex items-center gap-5 transition-all hover:bg-muted/60 shadow-sm border border-border">
                            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 shrink-0 shadow-inner">
                                <ShieldCheck size={24} />
                            </div>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.15em] leading-relaxed">
                                Encrypted Session<br />
                                <span className="text-foreground opacity-80">Full Privacy Protected</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ServiceDetail
