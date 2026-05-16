import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

export interface SelectOption<T extends string> {
  value: T
  label: string
}

interface SelectProps<T extends string> {
  value: T
  options: ReadonlyArray<SelectOption<T>>
  onChange: (value: T) => void
  label?: string
  ariaLabel?: string
  className?: string
}

// Dropdown customizado — sem dependência de Radix.
// Acessível por teclado: Enter/Space abre, ArrowUp/Down navega, Esc fecha.
export function Select<T extends string>({
  value,
  options,
  onChange,
  label,
  ariaLabel,
  className,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  const current = options.find(opt => opt.value === value)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) {
      document.addEventListener('mousedown', onClickOutside)
      document.addEventListener('keydown', onKey)
    }
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={containerRef} className={cn('relative inline-block text-left', className)}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel ?? label ?? 'Selecione'}
        className="inline-flex h-10 min-w-[180px] items-center justify-between gap-2 rounded-md border border-ink-200 bg-background px-3 text-sm font-medium text-ink-800 transition-colors hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 dark:border-ink-700 dark:text-ink-100"
      >
        <span className="truncate">{current?.label ?? '—'}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-ink-500 transition-transform duration-200',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={reduced ? false : { opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={reduced ? { duration: 0 } : { duration: 0.15 }}
            className="absolute right-0 z-30 mt-2 w-full min-w-[200px] overflow-hidden rounded-md border border-ink-200 bg-background py-1 shadow-soft-lg dark:border-ink-700"
          >
            {options.map(opt => {
              const isActive = opt.value === value
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    onClick={() => {
                      onChange(opt.value)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-gold-500/10 hover:text-gold-600 dark:hover:text-gold-400',
                      isActive
                        ? 'text-gold-600 dark:text-gold-400'
                        : 'text-ink-700 dark:text-ink-200',
                    )}
                  >
                    <span>{opt.label}</span>
                    {isActive && <Check className="h-4 w-4" aria-hidden="true" />}
                  </button>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
