import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/animations'
import { InstagramIcon } from '@/components/shared/BrandIcons'

// URL placeholder — preenchida via store_info quando o cliente fornecer.
const INSTAGRAM_URL = '#'

export default function InstagramButton() {
  const reduced = useReducedMotion()

  return (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir Instagram"
      title="Siga no Instagram"
      initial={reduced ? false : { opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.4, delay: 0.3 }}
      className="group fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-gold-400 to-ink-800 text-ink-50 ring-2 ring-gold-500/30 transition-all duration-300 hover:scale-105 hover:shadow-gold-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
    >
      <InstagramIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-ink-900 px-3 py-1.5 font-serif text-xs text-gold-400 opacity-0 shadow-soft transition-opacity duration-300 group-hover:opacity-100">
        Siga no Instagram
      </span>
    </motion.a>
  )
}
