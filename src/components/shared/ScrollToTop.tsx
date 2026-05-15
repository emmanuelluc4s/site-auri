import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { prefersReducedMotion } from '@/lib/utils'

export default function ScrollToTop() {
  const [show, setShow] = useState(false)
  const reduced = typeof window !== 'undefined' && prefersReducedMotion()

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
          transition={reduced ? { duration: 0 } : { duration: 0.2 }}
          className="fixed bottom-6 left-6 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-foreground text-background shadow-lg ring-1 ring-black/5 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowUp className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
