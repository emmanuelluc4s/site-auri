import type { HTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center justify-center rounded-full font-sans text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors',
  {
    variants: {
      variant: {
        promo:
          'bg-gold-500 px-2.5 py-1 text-ink-900 shadow-gold-glow-sm',
        new:
          'border border-gold-500 bg-ink-800 px-2.5 py-1 text-ink-50 dark:bg-ink-50 dark:text-ink-900',
        soldout:
          'bg-danger px-2.5 py-1 text-white',
        tag:
          'border border-gold-500/40 bg-transparent px-2.5 py-1 text-gold-600 dark:text-gold-400',
      },
    },
    defaultVariants: {
      variant: 'tag',
    },
  },
)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { badgeVariants }
