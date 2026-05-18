import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className={cn(
        'animate-pulse rounded-md bg-ink-200/60 dark:bg-ink-700/60',
        className,
      )}
      {...props}
    />
  )
}
