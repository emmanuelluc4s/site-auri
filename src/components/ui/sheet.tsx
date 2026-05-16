import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

type Side = 'left' | 'right'

interface SheetProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  side?: Side
  ariaLabel?: string
  className?: string
}

// Drawer lateral (usado para filtros no mobile).
export function Sheet({
  open,
  onClose,
  children,
  side = 'left',
  ariaLabel = 'Painel lateral',
  className,
}: SheetProps) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  const offscreen = side === 'left' ? '-100%' : '100%'
  const sidePosClass = side === 'left' ? 'left-0' : 'right-0'

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            className="absolute inset-0 bg-ink-900/60"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            initial={reduced ? false : { x: offscreen }}
            animate={{ x: 0 }}
            exit={reduced ? { opacity: 0 } : { x: offscreen }}
            transition={reduced ? { duration: 0 } : { duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'absolute top-0 h-full w-[88%] max-w-md overflow-y-auto bg-background shadow-soft-lg',
              sidePosClass,
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-700 transition-colors hover:bg-gold-500/10 hover:text-gold-600 dark:text-ink-200 dark:hover:text-gold-400"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {children}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
