import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ArrowLeft, Ghost } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NotFound: React.FC = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center container mx-auto px-6 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative mb-8"
            >
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
                <h1 className="relative text-[12rem] md:text-[18rem] font-black tracking-tighter leading-none text-primary/10">
                    404
                </h1>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Ghost size={80} className="text-primary animate-bounce" />
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="max-w-md"
            >
                <h2 className="text-4xl font-black tracking-tighter mb-4 uppercase italic">Lost in the void?</h2>
                <p className="text-muted-foreground mb-10 text-lg leading-relaxed">
                    The intelligence you're seeking hasn't been synthesized yet, or the path has been corrupted.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                        <Link to="/">
                            <Home className="mr-2" size={16} /> Return Home
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-14 px-8 rounded-2xl text-[10px] font-black uppercase tracking-widest border-primary/20 hover:bg-primary/5">
                        <button onClick={() => window.history.back()}>
                            <ArrowLeft className="mr-2" size={16} /> Go Back
                        </button>
                    </Button>
                </div>
            </motion.div>
        </div>
    )
}

export default NotFound
