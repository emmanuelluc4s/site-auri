import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, Info, X, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

type ToastVariant = 'default' | 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0
const DEFAULT_DURATION_MS = 3000

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const reduced = useReducedMotion()

  const toast = useCallback((message: string, variant: ToastVariant = 'default') => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, variant }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, DEFAULT_DURATION_MS)
  }, [])

  const value = useMemo<ToastContextValue>(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-[60] flex w-full max-w-sm -translate-x-1/2 flex-col items-center gap-2 px-4">
          <AnimatePresence>
            {toasts.map(t => (
              <motion.div
                key={t.id}
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
                transition={reduced ? { duration: 0 } : { duration: 0.2 }}
                role="status"
                aria-live="polite"
                className={cn(
                  'pointer-events-auto flex w-full items-center gap-3 rounded-lg px-4 py-3 shadow-soft-lg',
                  toastVariantClass(t.variant),
                )}
              >
                {toastIcon(t.variant)}
                <span className="flex-1 text-sm">{t.message}</span>
                <button
                  type="button"
                  onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
                  aria-label="Fechar"
                  className="ml-1 text-current opacity-70 hover:opacity-100"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

function toastVariantClass(variant: ToastVariant): string {
  switch (variant) {
    case 'success': return 'bg-ink-900 text-gold-400 ring-1 ring-gold-400/40'
    case 'error':   return 'bg-danger text-white'
    case 'info':    return 'bg-ink-900 text-ink-50 ring-1 ring-info/40'
    default:        return 'bg-ink-900 text-ink-50 ring-1 ring-gold-400/30'
  }
}

function toastIcon(variant: ToastVariant) {
  const className = 'h-5 w-5 shrink-0'
  switch (variant) {
    case 'success': return <CheckCircle2 className={className} aria-hidden="true" />
    case 'error':   return <AlertTriangle className={className} aria-hidden="true" />
    case 'info':    return <Info className={className} aria-hidden="true" />
    default:        return <CheckCircle2 className={className} aria-hidden="true" />
  }
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast deve ser usado dentro de ToastProvider')
  return ctx
}
