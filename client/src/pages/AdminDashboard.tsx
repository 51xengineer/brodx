import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { 
    RefreshCw, 
    DollarSign, 
    Users, 
    TrendingUp, 
    Briefcase,
    Copy,
    Check,
    Plus,
    Search
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { API_BASE_URL } from '../config'

const AdminDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [orders, setOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [generatedLink, setGeneratedLink] = useState('')
    const [copied, setCopied] = useState(false)
    
    const [formData, setFormData] = useState({
        clientName: '',
        email: '',
        amount: '',
        notes: ''
    })

    // ─── AUTHENTICATION LOGIC ──────────────────────────────────────────────────
    useEffect(() => {
        const urlToken = searchParams.get('token')
        if (urlToken) {
            localStorage.setItem('admin_token', urlToken)
            // Clear token from URL for security
            searchParams.delete('token')
            setSearchParams(searchParams, { replace: true })
        }

        const token = localStorage.getItem('admin_token')
        if (!token) {
            // Redirect to login if no token found
            window.location.href = `${API_BASE_URL}/auth/google`
        }
    }, [searchParams])

    const getAuthHeader = () => {
        const token = localStorage.getItem('admin_token')
        return { Authorization: `Bearer ${token}` }
    }

    // Handle Razorpay callback params
    useEffect(() => {
        const paymentId = searchParams.get('razorpay_payment_id')
        const status = searchParams.get('razorpay_payment_link_status')
        if (paymentId && status === 'paid') {
            fetchOrders()
            // Clear params after handling
            setSearchParams({}, { replace: true })
        }
    }, [searchParams])
    const fetchOrders = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/admin/orders`, {
                headers: getAuthHeader()
            })
            setOrders(data)
        } catch (err: any) {
            console.error('Fetch failed:', err)
            if (err.response?.status === 401 || err.response?.status === 403) {
                localStorage.removeItem('admin_token')
                window.location.href = `${API_BASE_URL}/auth/google`
            }
        } finally {
            setLoading(false)
            setRefreshing(false)
        }
    }

    useEffect(() => { fetchOrders() }, [])

    const handleRefresh = () => {
        setRefreshing(true)
        fetchOrders()
    }

    const handleCreateLink = async () => {
        if (!formData.clientName || !formData.amount) return
        setIsSubmitting(true)
        try {
            const { data } = await axios.post(`${API_BASE_URL}/admin/payment-links`, {
                ...formData,
                amount: parseFloat(formData.amount)
            }, {
                headers: getAuthHeader()
            })
            setGeneratedLink(data.paymentLinkUrl)
            fetchOrders()
        } catch (err) {
            console.error('Create failed:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    const syncStatus = async (orderId: string) => {
        try {
            await axios.post(`${API_BASE_URL}/admin/orders/${orderId}/sync`, {}, {
                headers: getAuthHeader()
            })
            fetchOrders()
        } catch (err) {
            console.error('Sync failed:', err)
        }
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const stats = [
        { label: 'Total Revenue', value: `₹${orders.reduce((acc, o) => acc + (o.status === 'paid' ? o.amount : 0), 0).toLocaleString('en-IN')}`, icon: <DollarSign size={18} />, color: 'text-emerald-500' },
        { label: 'Active Links', value: orders.filter(o => o.status === 'created').length, icon: <Briefcase size={18} />, color: 'text-blue-500' },
        { label: 'Total Clients', value: new Set(orders.map(o => o.email)).size, icon: <Users size={18} />, color: 'text-primary' },
        { label: 'Success Rate', value: orders.length ? `${Math.round((orders.filter(o => o.status === 'paid').length / orders.length) * 100)}%` : '0%', icon: <TrendingUp size={18} />, color: 'text-accent' },
    ]

    const filtered = orders.filter(o => 
        o.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const statusColor = (s: string) => s === 'paid'
        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
        : s === 'failed'
            ? 'bg-red-500/10 text-red-500 border-red-500/20'
            : 'bg-primary/10 text-primary border-primary/20'

    return (
        <div className="container mx-auto px-6 py-32 max-w-[1200px] space-y-12 pb-40">
            {/* Minimal Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tight flex items-center gap-3">
                        Dashboard
                        {refreshing && <RefreshCw size={18} className="animate-spin text-primary" />}
                    </h1>
                    <p className="text-muted-foreground text-sm font-semibold opacity-90">Manage your revenue and client links in one place.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-full h-10 px-4 gap-2 hover:bg-primary/10 hover:text-primary transition-colors font-bold text-xs"
                        onClick={handleRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                        Sync Data
                    </Button>

                    <Dialog open={isCreateModalOpen} onOpenChange={(open) => {
                        setIsCreateModalOpen(open)
                        if (!open) { setGeneratedLink(''); setFormData({ clientName: '', email: '', amount: '', notes: '' }) }
                    }}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="gap-2 rounded-full h-10 px-5 font-bold text-xs shadow-lg shadow-primary/20">
                                <Plus size={14} /> New Link
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-card border-border sm:max-w-[420px] rounded-[2rem] p-8">
                            <DialogHeader className="space-y-1 text-left">
                                <DialogTitle className="text-2xl font-black tracking-tight">Generate Link</DialogTitle>
                                <p className="text-muted-foreground text-xs font-medium">Create a custom payment request for your client.</p>
                            </DialogHeader>
                            {generatedLink ? (
                                <div className="space-y-6 pt-6">
                                    <div className="p-5 bg-primary/5 rounded-2xl border border-primary/20 space-y-4">
                                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Share this link</div>
                                        <div className="flex items-center gap-2">
                                            <Input readOnly value={generatedLink} className="bg-background border-border font-mono text-xs rounded-xl h-10" />
                                            <Button size="icon" variant="outline" onClick={() => copyToClipboard(generatedLink)} className="shrink-0 rounded-xl w-10 h-10">
                                                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                            </Button>
                                        </div>
                                    </div>
                                    <Button className="w-full rounded-2xl h-12 font-bold" onClick={() => setIsCreateModalOpen(false)}>Close</Button>
                                </div>
                            ) : (
                                <div className="space-y-5 pt-6">
                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Client Name</Label>
                                            <Input placeholder="John Doe" className="bg-muted/30 border-border h-11 rounded-xl focus:ring-primary/20" value={formData.clientName} onChange={e => setFormData({ ...formData, clientName: e.target.value })} />
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Email Address</Label>
                                            <Input type="email" placeholder="john@example.com" className="bg-muted/30 border-border h-11 rounded-xl" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="col-span-2 space-y-1.5">
                                                <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Amount (INR)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">₹</span>
                                                    <Input type="number" placeholder="0.00" className="pl-8 bg-muted/30 border-border h-11 rounded-xl" value={formData.amount} onChange={e => setFormData({ ...formData, amount: e.target.value })} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ml-1">Description (Optional)</Label>
                                            <Textarea placeholder="What is this for?" className="bg-muted/30 border-border min-h-[100px] text-sm rounded-xl py-3" value={formData.notes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, notes: e.target.value })} />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button className="w-full rounded-2xl h-12 font-bold shadow-lg shadow-primary/10" disabled={isSubmitting} onClick={handleCreateLink}>
                                            {isSubmitting ? 'Generating...' : 'Create Payment link'}
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((s, i) => (
                    <Card key={i} className="bg-card border-border shadow-premium rounded-2xl px-6 py-5 flex items-center justify-between transition-all hover:scale-[1.02] border border-border">
                        <div>
                            <div className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{s.label}</div>
                            <div className="text-2xl font-black tracking-tight">{s.value}</div>
                        </div>
                        <div className={`${s.color} bg-current/10 p-2.5 rounded-xl`}>{s.icon}</div>
                    </Card>
                ))}
            </div>

            {/* Table Area */}
            <Card className="bg-card border-border rounded-3xl overflow-hidden shadow-premium border border-border">
                <div className="px-8 py-7 border-b border-border/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-muted/20">
                    <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]" />
                        <h2 className="font-black text-sm uppercase tracking-widest">Project Ledger</h2>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-72">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={16} />
                            <Input
                                className="pl-11 h-11 bg-background border-border rounded-full text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-muted/40 border-b border-border text-left">
                                {['Client', 'Service', 'Amount', 'Status', 'Date', 'Actions'].map((h, i) => (
                                    <th key={i} className={`px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/70 ${i >= 2 && i <= 4 ? 'text-right' : ''}`}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr><td colSpan={6} className="py-24 text-center text-muted-foreground font-semibold italic text-sm">Synchronizing ecosystem data...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="py-24 text-center text-muted-foreground font-semibold italic text-sm">No neural records identified.</td></tr>
                            ) : filtered.map((o: any) => (
                                <tr key={o.id} className="hover:bg-muted/20 transition-all group">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-xs shrink-0 shadow-sm">
                                                {o.clientName?.charAt(0)}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm leading-tight text-foreground">{o.clientName}</div>
                                                <div className="text-[11px] text-muted-foreground/70 font-medium">{o.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-semibold italic text-muted-foreground/80">
                                        {o.service?.title || <span className="text-primary font-bold">Custom Synthesis</span>}
                                    </td>
                                    <td className="px-8 py-5 text-right font-mono font-black text-foreground">₹{o.amount?.toLocaleString('en-IN')}</td>
                                    <td className="px-8 py-5 text-right">
                                        <Badge className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border-none shadow-sm ${statusColor(o.status)}`}>
                                            {o.status}
                                        </Badge>
                                    </td>
                                    <td className="px-8 py-5 text-right text-xs font-bold text-muted-foreground/60">
                                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {o.status !== 'paid' && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                                                    onClick={() => syncStatus(o.id)}
                                                    title="Sync with Razorpay"
                                                >
                                                    <RefreshCw size={14} />
                                                </Button>
                                            )}
                                            {o.paymentLinkUrl && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-9 w-9 rounded-xl hover:bg-primary/10 hover:text-primary transition-all shadow-sm"
                                                    onClick={() => copyToClipboard(o.paymentLinkUrl)}
                                                    title="Copy Payment Link"
                                                >
                                                    <Copy size={14} />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="px-8 py-6 bg-muted/40 border-t border-border text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <span className="opacity-70">{filtered.length} Orders Synchronized</span>
                        <div className="flex items-center gap-2.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
                            <span className="opacity-70">Neural Link Active</span>
                        </div>
                    </div>
                    <button onClick={handleRefresh} className="hover:text-primary transition-all flex items-center gap-2 group font-black">
                        <RefreshCw size={12} className={`group-hover:rotate-180 transition-transform duration-700 ${refreshing ? 'animate-spin' : ''}`} />
                        Sync Ecosystem
                    </button>
                </div>
            </Card>
        </div>
    )
}

export default AdminDashboard
