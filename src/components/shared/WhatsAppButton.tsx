import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/utils'

export default function WhatsAppButton() {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER
  const href = phone ? `https://wa.me/${phone}` : '#'
  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir WhatsApp"
      title="Fale conosco"
      initial={reduced ? false : { opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.3, delay: 0.2 }}
      className="group fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{ backgroundColor: '#25D366' }}
    >
      <MessageCircle className="h-7 w-7 text-white" aria-hidden="true" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
        Fale conosco
      </span>
    </motion.a>
  )
}
