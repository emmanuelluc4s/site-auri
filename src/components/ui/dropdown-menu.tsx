import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type ReactElement,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useReducedMotion } from '@/lib/animations'

interface DropdownContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const DropdownContext = createContext<DropdownContextValue | null>(null)

export function DropdownMenu({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </DropdownContext.Provider>
  )
}

interface DropdownMenuTriggerProps {
  children: ReactElement
  asChild?: boolean
}

interface TriggerChildProps {
  onClick?: (e: ReactMouseEvent) => void
}

export function DropdownMenuTrigger({ children }: DropdownMenuTriggerProps) {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('DropdownMenuTrigger dentro de DropdownMenu')
  if (!isValidElement(children)) return null

  const originalProps = children.props as TriggerChildProps
  return cloneElement(children as ReactElement<TriggerChildProps>, {
    onClick: (e: ReactMouseEvent) => {
      originalProps.onClick?.(e)
      ctx.setOpen(!ctx.open)
    },
  })
}

interface DropdownMenuContentProps {
  children: ReactNode
  align?: 'start' | 'end'
  className?: string
}

export function DropdownMenuContent({ children, align = 'end', className }: DropdownMenuContentProps) {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('DropdownMenuContent dentro de DropdownMenu')
  const ref = useRef<HTMLDivElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!ctx.open) return
    function onClickOutside(e: globalThis.MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) ctx?.setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') ctx?.setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      document.removeEventListener('keydown', onKey)
    }
  }, [ctx.open, ctx])

  return (
    <AnimatePresence>
      {ctx.open && (
        <motion.div
          ref={ref}
          initial={reduced ? false : { opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={reduced ? { duration: 0 } : { duration: 0.15 }}
          className={cn(
            'absolute z-30 mt-2 w-48 overflow-hidden rounded-md border border-ink-200 bg-background py-1 shadow-soft-lg dark:border-ink-700',
            align === 'end' ? 'right-0' : 'left-0',
            className,
          )}
          role="menu"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface DropdownMenuItemProps {
  children: ReactNode
  onClick?: () => void
  onSelect?: (e: Event) => void
  className?: string
  to?: string
}

export function DropdownMenuItem({ children, onClick, onSelect, className, to }: DropdownMenuItemProps) {
  const ctx = useContext(DropdownContext)
  if (!ctx) throw new Error('DropdownMenuItem dentro de DropdownMenu')

  function handleClick(e: ReactMouseEvent) {
    if (onSelect) {
      const fakeEvent = new Event('select', { cancelable: true })
      onSelect(fakeEvent)
      if (fakeEvent.defaultPrevented) {
        e.stopPropagation()
        return
      }
    }
    onClick?.()
    if (ctx) ctx.setOpen(false)
    e.stopPropagation()
  }

  const baseClass = cn(
    'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
    'text-ink-700 hover:bg-gold-500/10 hover:text-gold-600 dark:text-ink-200 dark:hover:text-gold-400',
    className,
  )

  if (to) {
    return (
      <Link to={to} onClick={handleClick} className={baseClass} role="menuitem">
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={handleClick} className={baseClass} role="menuitem">
      {children}
    </button>
  )
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return (
    <div
      role="separator"
      className={cn('my-1 h-px bg-ink-100 dark:bg-ink-700', className)}
    />
  )
}
