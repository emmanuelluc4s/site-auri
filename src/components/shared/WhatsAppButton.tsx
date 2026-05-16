import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { useReducedMotion } from '@/lib/animations'

export default function WhatsAppButton() {
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER
  const href = phone ? `https://wa.me/${phone}` : '#'
  const reduced = useReducedMotion()

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir WhatsApp"
      title="Fale conosco"
      initial={reduced ? false : { opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.2 }}
      className="group fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full ring-2 ring-gold-500/30 transition-all duration-300 hover:scale-105 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 sm:h-14 sm:w-14"
      style={{ backgroundColor: '#25D366' }}
    >
      <MessageCircle className="h-7 w-7 text-white" aria-hidden="true" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-ink-900 px-3 py-1.5 font-serif text-xs text-gold-400 opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
        Fale conosco
      </span>
    </motion.a>
  )
}
