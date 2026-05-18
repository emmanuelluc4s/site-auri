import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Avatar({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative inline-flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700',
        className,
      )}
      {...props}
    />
  )
}

export function AvatarFallback({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center font-medium text-foreground',
        className,
      )}
      {...props}
    />
  )
}

interface AvatarImageProps {
  src: string
  alt?: string
  className?: string
}

export function AvatarImage({ src, alt = '', className }: AvatarImageProps) {
  return <img src={src} alt={alt} className={cn('h-full w-full object-cover', className)} />
}
