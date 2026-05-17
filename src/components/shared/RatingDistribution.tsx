import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { useReducedMotion } from '@/lib/animations'
import type { Review } from '@/types'

interface RatingDistributionProps {
  reviews: Review[]
}

// Visualização da distribuição de notas (quantos clientes deram 5, 4, 3, 2, 1).
export default function RatingDistribution({ reviews }: RatingDistributionProps) {
  const reduced = useReducedMotion()
  const total = reviews.length
  if (total === 0) return null

  const distribution = [5, 4, 3, 2, 1].map(rating => {
    const count = reviews.filter(r => r.rating === rating).length
    const percentage = (count / total) * 100
    return { rating, count, percentage }
  })

  return (
    <ul className="space-y-3">
      {distribution.map(({ rating, count, percentage }) => (
        <li key={rating} className="flex items-center gap-3">
          <div className="flex min-w-[3.5rem] items-center gap-1">
            <span className="text-sm font-medium tabular-nums text-ink-700 dark:text-ink-200">
              {rating}
            </span>
            <Star
              className="h-3.5 w-3.5 fill-gold-500 text-gold-500 dark:fill-gold-400 dark:text-gold-400"
              aria-hidden="true"
            />
          </div>

          <div
            className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800"
            role="progressbar"
            aria-valuenow={Math.round(percentage)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${count} avaliação${count === 1 ? '' : 'ões'} com ${rating} estrela${rating === 1 ? '' : 's'}`}
          >
            <motion.div
              initial={reduced ? false : { width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={reduced ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-gold-500 to-gold-400"
            />
          </div>

          <span className="min-w-[2.5rem] text-right text-sm tabular-nums text-ink-500 dark:text-ink-400">
            {count}
          </span>
        </li>
      ))}
    </ul>
  )
}
