import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'rounded-md bg-ink-800 text-ink-50 hover:bg-ink-700 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-ink-50',
        gold:
          'rounded-md bg-gold-500 text-ink-900 uppercase tracking-[0.18em] font-semibold hover:bg-gold-400 hover:shadow-gold-glow',
        'outline-gold':
          'rounded-md border border-gold-500 bg-transparent text-gold-600 hover:bg-gold-500 hover:text-ink-900 dark:border-gold-400 dark:text-gold-400 dark:hover:bg-gold-400 dark:hover:text-ink-900',
        ghost:
          'rounded-md bg-transparent text-ink-700 hover:bg-gold-500/10 hover:text-gold-600 dark:text-ink-200 dark:hover:bg-gold-400/10 dark:hover:text-gold-400',
        link:
          'group relative bg-transparent text-gold-600 underline-offset-4 dark:text-gold-400',
        destructive:
          'rounded-md bg-danger text-white hover:bg-danger/90',
      },
      size: {
        sm:   'h-9  px-3 text-xs',
        md:   'h-10 px-5 text-sm',
        lg:   'h-12 px-7 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  },
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    const isLink = variant === 'link'

    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      >
        {children}
        {isLink && (
          <span
            className="absolute -bottom-0.5 left-0 h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-full dark:bg-gold-400"
            aria-hidden="true"
          />
        )}
      </button>
    )
  },
)
Button.displayName = 'Button'

export { buttonVariants }
