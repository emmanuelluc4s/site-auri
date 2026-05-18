import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
  type MouseEvent as ReactMouseEvent,
} from 'react'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Subset compatível com a API shadcn/ui AlertDialog.

interface AlertDialogContextValue {
  open: boolean
  setOpen: (open: boolean) => void
}

const AlertDialogContext = createContext<AlertDialogContextValue | null>(null)

interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: ReactNode
}

export function AlertDialog({ open: controlled, onOpenChange, children }: AlertDialogProps) {
  const [internal, setInternal] = useState(false)
  const open = controlled ?? internal
  function setOpen(next: boolean) {
    setInternal(next)
    onOpenChange?.(next)
  }
  return (
    <AlertDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </AlertDialogContext.Provider>
  )
}

interface AlertDialogTriggerProps {
  children: ReactElement
  asChild?: boolean
}

interface TriggerChildProps {
  onClick?: (e: ReactMouseEvent) => void
}

export function AlertDialogTrigger({ children }: AlertDialogTriggerProps) {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) throw new Error('AlertDialogTrigger dentro de AlertDialog')
  if (!isValidElement(children)) return null
  const originalProps = children.props as TriggerChildProps
  return cloneElement(children as ReactElement<TriggerChildProps>, {
    onClick: (e: ReactMouseEvent) => {
      originalProps.onClick?.(e)
      ctx.setOpen(true)
    },
  })
}

interface AlertDialogContentProps {
  children: ReactNode
  className?: string
}

export function AlertDialogContent({ children, className }: AlertDialogContentProps) {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) throw new Error('AlertDialogContent dentro de AlertDialog')
  return (
    <Dialog
      open={ctx.open}
      onClose={() => ctx.setOpen(false)}
      maxWidth="max-w-md"
      className={className}
      ariaLabel="Confirmação"
    >
      <div className="p-6">{children}</div>
    </Dialog>
  )
}

export function AlertDialogHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('mb-4 flex flex-col gap-2', className)}>{children}</div>
}

export function AlertDialogTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn('font-serif text-xl text-ink-800 dark:text-ink-50', className)}>{children}</h2>
  )
}

export function AlertDialogDescription({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('text-sm text-ink-500 dark:text-ink-300', className)}>{children}</p>
  )
}

export function AlertDialogFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}>
      {children}
    </div>
  )
}

interface AlertDialogActionProps {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function AlertDialogAction({ children, onClick, className }: AlertDialogActionProps) {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) throw new Error('AlertDialogAction dentro de AlertDialog')
  return (
    <Button
      variant="destructive"
      onClick={() => {
        onClick?.()
        ctx.setOpen(false)
      }}
      className={className}
    >
      {children}
    </Button>
  )
}

export function AlertDialogCancel({ children, className }: { children?: ReactNode; className?: string }) {
  const ctx = useContext(AlertDialogContext)
  if (!ctx) throw new Error('AlertDialogCancel dentro de AlertDialog')
  return (
    <Button variant="outline-gold" onClick={() => ctx.setOpen(false)} className={className}>
      {children ?? 'Cancelar'}
    </Button>
  )
}
