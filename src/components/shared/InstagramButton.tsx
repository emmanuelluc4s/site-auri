import { motion } from 'framer-motion'
import { prefersReducedMotion } from '@/lib/utils'
import { InstagramIcon } from '@/components/shared/BrandIcons'

// URL placeholder — será substituída pelo @ real via store_info.
const INSTAGRAM_URL = '#'

export default function InstagramButton() {
  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

  return (
    <motion.a
      href={INSTAGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Abrir Instagram"
      title="Siga no Instagram"
      initial={reduced ? false : { opacity: 0, x: 32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={reduced ? { duration: 0 } : { duration: 0.3, delay: 0.35 }}
      className="group fixed bottom-24 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
      }}
    >
      <InstagramIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100">
        Siga no Instagram
      </span>
    </motion.a>
  )
}
