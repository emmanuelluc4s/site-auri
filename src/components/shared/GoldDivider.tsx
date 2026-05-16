import { cn } from '@/lib/utils'

interface GoldDividerProps {
  className?: string
  withDiamond?: boolean
}

export default function GoldDivider({ className, withDiamond = true }: GoldDividerProps) {
  if (!withDiamond) {
    return (
      <div
        className={cn(
          'h-px w-full bg-gradient-to-r from-transparent via-gold-500/60 to-transparent dark:via-gold-400/60',
          className,
        )}
        role="separator"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      className={cn('flex items-center gap-4', className)}
      role="separator"
      aria-hidden="true"
    >
      <span className="block h-px flex-1 bg-gradient-to-r from-transparent to-gold-500/60 dark:to-gold-400/60" />
      <span className="text-xs text-gold-500 dark:text-gold-400">◆</span>
      <span className="block h-px flex-1 bg-gradient-to-l from-transparent to-gold-500/60 dark:to-gold-400/60" />
    </div>
  )
}
