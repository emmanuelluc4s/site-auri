import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  ariaLabel?: string
  className?: string
  // Largura máxima do painel central (Tailwind class, ex: 'max-w-3xl')
  maxWidth?: string
}

// Modal genérico — portal + Framer Motion + fechamento por ESC e clique no overlay.
// Não depende de Radix; mais leve e suficiente para os modais do AURI.
export function Dialog({
  open,
  onClose,
  children,
  ariaLabel = 'Diálogo',
  className,
  maxWidth = 'max-w-3xl',
}: DialogProps) {
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    // Trava o scroll do body enquanto o modal está aberto.
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabel}
        >
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2 }}
            className="absolute inset-0 bg-ink-900/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Painel */}
          <motion.div
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={reduced ? { duration: 0 } : { duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'relative z-10 w-full overflow-hidden rounded-none bg-background shadow-soft-lg sm:rounded-2xl',
              maxWidth,
              className,
            )}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 inline-flex h-9 w-9 items-center justify-center rounded-full bg-ink-900/60 text-gold-400 ring-1 ring-gold-400/40 backdrop-blur-sm transition-colors hover:bg-ink-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
