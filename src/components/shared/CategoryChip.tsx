import { cn } from '@/lib/utils'

interface CategoryChipProps {
  label: string
  active: boolean
  onClick: () => void
  size?: 'sm' | 'md'
}

export default function CategoryChip({
  label,
  active,
  onClick,
  size = 'md',
}: CategoryChipProps) {
  const sizeClass = size === 'sm' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full font-medium transition-all duration-200',
        sizeClass,
        active
          ? 'bg-gold-500 text-ink-900 shadow-gold-glow-sm'
          : 'border border-ink-200 text-ink-700 hover:border-gold-500 hover:text-gold-600 dark:border-ink-700 dark:text-ink-200 dark:hover:text-gold-400',
      )}
    >
      {label}
    </button>
  )
}
