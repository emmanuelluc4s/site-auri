import { cn } from '@/lib/utils'

type SpinnerSize = 'sm' | 'md' | 'lg'

interface SpinnerProps {
  size?: SpinnerSize
  className?: string
  label?: string
}

const SIZE_MAP: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-[3px]',
}

export default function Spinner({ size = 'md', className, label = 'Carregando' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn(
        'inline-block animate-spin rounded-full border-gold-500/30 border-t-gold-500 dark:border-gold-400/30 dark:border-t-gold-400',
        SIZE_MAP[size],
        className,
      )}
    />
  )
}
