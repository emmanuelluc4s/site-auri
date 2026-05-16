import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useReducedMotion } from '@/lib/animations'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    function onScroll() {
      setShow(window.scrollY > 300)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleClick() {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={handleClick}
          aria-label="Voltar ao topo"
          title="Voltar ao topo"
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          className="fixed bottom-6 left-6 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-gold-500/40 bg-ink-800 text-gold-500 shadow-gold-glow-sm transition-all duration-300 hover:scale-105 hover:bg-ink-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 dark:bg-gold-500 dark:text-ink-900 dark:hover:bg-gold-400"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
