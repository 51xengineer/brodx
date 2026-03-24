import React, { useState } from 'react'
import { Clock, CheckCircle, ArrowRight, ExternalLink, Calendar, ShieldCheck, Cpu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { useTheme } from '../context/ThemeContext'
import { GoogleMeetIcon } from '../components/Icons'

const SLOTS = [
    { date: '2026-03-25', label: 'Wed, 25 Mar', times: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'] },
    { date: '2026-03-26', label: 'Thu, 26 Mar', times: ['10:00 AM', '2:00 PM', '4:00 PM', '6:00 PM'] },
    { date: '2026-03-27', label: 'Fri, 27 Mar', times: ['11:00 AM', '1:00 PM', '3:30 PM'] },
    { date: '2026-03-28', label: 'Sat, 28 Mar', times: ['10:00 AM', '12:00 PM'] },
    { date: '2026-03-31', label: 'Mon, 31 Mar', times: ['9:00 AM', '11:00 AM', '3:00 PM', '5:00 PM', '7:00 PM'] },
]

const BookACall: React.FC = () => {
    const { } = useTheme()
    const [step, setStep] = useState<'pick' | 'details' | 'confirmed'>('pick')
    const [selectedDate, setSelectedDate] = useState('')
    const [selectedTime, setSelectedTime] = useState('')
    const [form, setForm] = useState({ name: '', email: '', goal: '' })
    const [booking, setBooking] = useState(false)

    const selectedSlot = SLOTS.find(s => s.date === selectedDate)
    const MEET_LINK = 'https://meet.google.com/brodx-premium-consult'

    const handleConfirm = async () => {
        if (!form.name || !form.email) { toast.error('Please provide name and email'); return }
        setBooking(true)
        await new Promise(r => setTimeout(r, 1500))
        setBooking(false)
        setStep('confirmed')
        toast.success('Strategy session confirmed')
    }

    if (step === 'confirmed') return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="max-w-md w-full text-center space-y-12 animate-in zoom-in-95 duration-500">
                <div className="relative inline-flex">
                    <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shadow-lg shadow-emerald-500/5">
                        <CheckCircle size={40} className="text-emerald-500" strokeWidth={2} />
                    </div>
                    <div className="absolute inset-0 rounded-full bg-emerald-500/5 animate-ping duration-[2000ms]" />
                </div>
                <div className="space-y-4">
                    <h1 className="text-5xl font-black tracking-tighter">You're All Set!</h1>
                    <p className="text-muted-foreground font-semibold italic opacity-90 leading-relaxed">
                        Confirmation for <span className="text-foreground font-black">{selectedSlot?.label}</span> at <span className="text-foreground font-black">{selectedTime} IST</span>.
                    </p>
                </div>
                <Card className="bg-card border-border shadow-premium rounded-[2.5rem] p-10 space-y-8 text-left border border-border transition-all">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center shadow-premium">
                            <GoogleMeetIcon size={28} />
                        </div>
                        <div>
                            <div className="text-[10px] text-primary font-black uppercase tracking-[0.3em] mb-1">Meeting Gateway</div>
                            <a href={MEET_LINK} target="_blank" rel="noopener noreferrer" className="text-sm font-mono text-foreground hover:text-primary transition-colors flex items-center gap-2 font-black">
                                {MEET_LINK.replace('https://', '')} <ExternalLink size={14} />
                            </a>
                        </div>
                    </div>
                </Card>
                <div className="flex flex-col gap-4">
                    <Button size="lg" className="w-full rounded-[1.5rem] h-16 font-black uppercase text-xs tracking-widest shadow-2xl shadow-primary/20 gap-3" asChild>
                        <a href={MEET_LINK} target="_blank" rel="noopener noreferrer">Launch Session <ArrowRight size={18} /></a>
                    </Button>
                    <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-all">Return to Repository</button>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen py-32 px-6 relative overflow-hidden">
            <div className="max-w-6xl mx-auto space-y-20 relative">
                {/* Header */}
                <div className="text-center space-y-8 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] backdrop-blur-md">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Free · 30 Min · Architectural Strategy
                    </div>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.85] italic">
                        RESERVE <br /> <span className="text-primary">SESSION.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-semibold leading-relaxed italic max-w-2xl mx-auto opacity-90">
                        Synchronize your vision with our lead architect. We'll map your technical path with precision.
                    </p>
                </div>

                {step === 'pick' ? (
                    <div className="grid lg:grid-cols-12 gap-12 items-start animate-in slide-in-from-bottom-8 duration-1000">
                        {/* Interactive Scheduler */}
                        <div className="lg:col-span-8 space-y-8">
                            <Card className="bg-card/40 backdrop-blur-2xl border border-border shadow-premium rounded-[3.5rem] p-12 space-y-16 transition-all border border-border overflow-hidden">
                                <div className="space-y-10">
                                    <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em] ml-2">
                                        <Calendar size={14} /> Available Epics
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                                        {SLOTS.map(slot => (
                                            <button
                                                key={slot.date}
                                                onClick={() => { setSelectedDate(slot.date); setSelectedTime('') }}
                                                className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-2 group ${selectedDate === slot.date
                                                        ? 'bg-primary border-primary text-white shadow-xl shadow-primary/25 scale-105'
                                                        : 'bg-muted/30 border-border hover:border-primary/40 hover:bg-muted/50'
                                                    }`}
                                            >
                                                <div className={`text-[9px] font-black uppercase tracking-widest ${selectedDate === slot.date ? 'text-white/70' : 'text-muted-foreground/60 group-hover:text-primary transition-colors'}`}>
                                                    {slot.label.split(', ')[0]}
                                                </div>
                                                <div className="text-2xl font-black italic">{slot.label.split(' ')[1]}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedSlot && (
                                    <div className="animate-in fade-in slide-in-from-top-6 duration-700 space-y-10">
                                        <div className="flex items-center gap-3 text-[10px] font-black text-primary uppercase tracking-[0.4em] ml-2">
                                            <Clock size={14} /> Select Epoch (IST)
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                            {selectedSlot.times.map(t => (
                                                <button
                                                    key={t}
                                                    onClick={() => setSelectedTime(t)}
                                                    className={`py-5 px-8 rounded-2xl border text-[11px] font-black tracking-widest uppercase transition-all ${selectedTime === t
                                                            ? 'bg-primary border-primary text-white shadow-xl shadow-primary/25 lg:scale-105'
                                                            : 'bg-muted/30 border-border hover:border-primary/30 hover:bg-muted/50'
                                                        }`}
                                                >
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </Card>

                            <Button
                                size="lg"
                                className="w-full h-20 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[.3em] gap-5 shadow-premium shadow-primary/10 transition-all hover:-translate-y-1 active:scale-[0.98]"
                                disabled={!selectedDate || !selectedTime}
                                onClick={() => setStep('details')}
                            >
                                CONTINUE TO PARAMETERS <ArrowRight size={20} strokeWidth={4} />
                            </Button>
                        </div>

                        {/* Summary Sidebar */}
                        <div className="lg:col-span-4 space-y-8 pt-4">
                            <Card className="bg-primary/5 border border-primary/20 rounded-[3rem] p-10 space-y-10 shadow-sm">
                                <div className="space-y-3">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/20">
                                        <Cpu size={24} />
                                    </div>
                                    <h3 className="text-2xl font-black tracking-tighter">Strategic Synthesis</h3>
                                    <p className="text-sm text-muted-foreground font-semibold italic opacity-85 leading-relaxed">1:1 Deep-dive with our lead architecture specialist.</p>
                                </div>
                                
                                <div className="space-y-6 pt-6 border-t border-primary/10">
                                    {[
                                        { icon: <Clock size={16} />, text: '30 Cycle Duration' },
                                        { icon: <GoogleMeetIcon size={16} />, text: 'HD Video Conference' },
                                        { icon: <ShieldCheck size={16} />, text: 'Commitment Zero' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            <div className="text-primary opacity-80">{item.icon}</div>
                                            {item.text}
                                        </div>
                                    ))}
                                </div>

                                {selectedDate && selectedTime && (
                                    <div className="p-8 bg-card/40 rounded-[2rem] border border-primary/20 animate-in zoom-in-95 duration-500 space-y-3">
                                        <div className="text-[9px] font-black uppercase tracking-widest text-primary opacity-60">Synchronized Slot</div>
                                        <div className="text-lg font-black italic">{selectedSlot?.label}</div>
                                        <div className="text-xs font-bold text-muted-foreground">{selectedTime} IST</div>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <Card className="bg-card/40 backdrop-blur-2xl border border-border rounded-[4rem] p-12 space-y-12 shadow-premium border border-border group transition-all">
                        <div className="space-y-3">
                            <div className="text-[10px] font-black text-primary uppercase tracking-[0.4em] ml-2">PHASE 02 — OBJECTIVES</div>
                            <h2 className="text-4xl font-black tracking-tighter italic">Almost Initialized.</h2>
                        </div>
                        
                        <div className="space-y-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Full Identity</Label>
                                <Input placeholder="Felix" className="h-16 bg-muted/20 border-border rounded-[1.5rem] focus:ring-primary/20 px-8 font-black text-sm" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Communication Endpoint</Label>
                                <Input type="email" placeholder="felix@example.com" className="h-16 bg-muted/20 border-border rounded-[1.5rem] px-8 font-black text-sm" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">Primary Objective</Label>
                                <Input placeholder="Scale technical infrastructure, architect AI products..." className="h-16 bg-muted/20 border-border rounded-[1.5rem] px-8 font-black text-sm italic" value={form.goal} onChange={e => setForm({ ...form, goal: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <Button 
                                className="w-full h-20 rounded-[2.5rem] text-[11px] font-black uppercase tracking-[.3em] gap-5 shadow-premium shadow-primary/20 transition-all hover:-translate-y-1" 
                                disabled={booking} 
                                onClick={handleConfirm}
                            >
                                {booking ? 'INITIALIZING...' : <><CheckCircle size={18} strokeWidth={4} /> CONFIRM SYNC</>}
                            </Button>
                            <button onClick={() => setStep('pick')} className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 hover:text-foreground transition-all">Go Back to Epochs</button>
                        </div>
                    </Card>
                </div>
                )}
            </div>
        </div>
    )
}

export default BookACall
