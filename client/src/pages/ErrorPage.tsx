import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AlertCircle, RefreshCcw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

const ErrorPage: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-6 text-center">
            <motion.div
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: 0 }}
                className="w-24 h-24 bg-destructive/10 rounded-3xl flex items-center justify-center mb-8 border border-destructive/20"
            >
                <AlertCircle size={48} className="text-destructive" />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md"
            >
                <h1 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">System Failure</h1>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                    Something went wrong in the synthesis process. Our engineers are investigating the disturbance.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        onClick={() => window.location.reload()}
                        className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-destructive/10 bg-destructive hover:bg-destructive/90 text-white"
                    >
                        <RefreshCcw className="mr-2" size={16} /> Retry Session
                    </Button>
                    <Button asChild variant="outline" className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-border hover:bg-muted/50">
                        <Link to="/">
                            <Home className="mr-2" size={16} /> Home Baseline
                        </Link>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

export default ErrorPage
