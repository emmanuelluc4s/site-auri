import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

type Size = 'sm' | 'md' | 'lg'

interface StarRatingProps {
  rating: number              // 0–5, aceita decimais (ex: 4.5)
  size?: Size
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
  label?: string
}

const SIZE_MAP: Record<Size, string> = {
  sm: 'h-3.5 w-3.5',
  md: 'h-5 w-5',
  lg: 'h-7 w-7',
}

const TOTAL_STARS = 5

export default function StarRating({
  rating,
  size = 'md',
  interactive = false,
  onChange,
  className,
  label,
}: StarRatingProps) {
  const [hover, setHover] = useState<number | null>(null)
  const display = interactive && hover !== null ? hover : rating
  const sizeClass = SIZE_MAP[size]
  const ariaLabel = label ?? `Nota ${rating.toFixed(1)} de ${TOTAL_STARS}`

  return (
    <div
      className={cn('inline-flex items-center gap-0.5', className)}
      role={interactive ? 'radiogroup' : 'img'}
      aria-label={ariaLabel}
    >
      {Array.from({ length: TOTAL_STARS }, (_, i) => {
        const value = i + 1
        const fillRatio = Math.max(0, Math.min(1, display - i))

        const star = (
          <span key={value} className="relative inline-block">
            {/* Estrela vazia (base) */}
            <Star
              className={cn(sizeClass, 'text-ink-300 dark:text-ink-600')}
              strokeWidth={1.5}
            />
            {/* Estrela preenchida — clipada pelo fillRatio (suporta meia estrela) */}
            {fillRatio > 0 && (
              <span
                className="pointer-events-none absolute inset-0 overflow-hidden"
                style={{ width: `${fillRatio * 100}%` }}
                aria-hidden="true"
              >
                <Star
                  className={cn(sizeClass, 'fill-gold-500 text-gold-500 dark:fill-gold-400 dark:text-gold-400')}
                  strokeWidth={1.5}
                />
              </span>
            )}
          </span>
        )

        if (!interactive) return star

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={Math.round(rating) === value}
            aria-label={`${value} de ${TOTAL_STARS}`}
            onClick={() => onChange?.(value)}
            onMouseEnter={() => setHover(value)}
            onMouseLeave={() => setHover(null)}
            className="rounded transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold-500"
          >
            {star}
          </button>
        )
      })}
    </div>
  )
}
