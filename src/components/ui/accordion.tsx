import { createContext, useContext, useState, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

type AccordionType = 'single' | 'multiple'

interface AccordionContextValue {
  type: AccordionType
  openItems: Set<string>
  toggle: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  type?: AccordionType
  defaultValue?: string | string[]
  children: ReactNode
  className?: string
}

export function Accordion({
  type = 'single',
  defaultValue,
  children,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => {
    if (!defaultValue) return new Set()
    if (Array.isArray(defaultValue)) return new Set(defaultValue)
    return new Set([defaultValue])
  })

  function toggle(value: string) {
    setOpenItems(prev => {
      const next = new Set(prev)
      if (next.has(value)) {
        next.delete(value)
      } else {
        if (type === 'single') next.clear()
        next.add(value)
      }
      return next
    })
  }

  return (
    <AccordionContext.Provider value={{ type, openItems, toggle }}>
      <div className={cn('divide-y divide-ink-100 dark:divide-ink-700', className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
}

const ItemContext = createContext<AccordionItemContextValue | null>(null)

interface AccordionItemProps {
  value: string
  children: ReactNode
  className?: string
}

export function AccordionItem({ value, children, className }: AccordionItemProps) {
  const ctx = useContext(AccordionContext)
  if (!ctx) throw new Error('AccordionItem deve estar dentro de Accordion')
  const isOpen = ctx.openItems.has(value)

  return (
    <ItemContext.Provider value={{ value, isOpen }}>
      <div className={cn('py-1', className)}>{children}</div>
    </ItemContext.Provider>
  )
}

interface AccordionTriggerProps {
  children: ReactNode
  className?: string
}

export function AccordionTrigger({ children, className }: AccordionTriggerProps) {
  const accordion = useContext(AccordionContext)
  const item = useContext(ItemContext)
  if (!accordion || !item) throw new Error('AccordionTrigger dentro de AccordionItem')

  return (
    <button
      type="button"
      onClick={() => accordion.toggle(item.value)}
      aria-expanded={item.isOpen}
      className={cn(
        'flex w-full items-center justify-between gap-4 py-3 text-left font-serif text-lg text-ink-800 transition-colors hover:text-gold-600 dark:text-ink-50 dark:hover:text-gold-400',
        className,
      )}
    >
      <span>{children}</span>
      <ChevronDown
        className={cn(
          'h-5 w-5 shrink-0 text-gold-600 transition-transform duration-300 dark:text-gold-400',
          item.isOpen && 'rotate-180',
        )}
        aria-hidden="true"
      />
    </button>
  )
}

interface AccordionContentProps {
  children: ReactNode
  className?: string
}

export function AccordionContent({ children, className }: AccordionContentProps) {
  const item = useContext(ItemContext)
  const reduced = useReducedMotion()
  if (!item) throw new Error('AccordionContent dentro de AccordionItem')

  return (
    <AnimatePresence initial={false}>
      {item.isOpen && (
        <motion.div
          initial={reduced ? false : { height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          className="overflow-hidden"
        >
          <div className={cn('pb-4 pt-1 text-sm text-ink-700 dark:text-ink-200', className)}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
