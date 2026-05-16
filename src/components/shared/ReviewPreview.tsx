import { Quote } from 'lucide-react'
import StarRating from '@/components/shared/StarRating'
import { Card } from '@/components/ui/card'
import { formatDateBR } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewPreviewProps {
  review: Review
}

export default function ReviewPreview({ review }: ReviewPreviewProps) {
  return (
    <Card className="relative h-full overflow-hidden p-6">
      <Quote
        className="absolute -right-2 -top-2 h-16 w-16 text-gold-500/15 dark:text-gold-400/15"
        aria-hidden="true"
        strokeWidth={1}
      />

      <div className="relative flex h-full flex-col gap-4">
        <StarRating rating={review.rating} size="sm" />

        {review.comment && (
          <p className="line-clamp-4 font-serif italic text-ink-700 dark:text-ink-200">
            “{review.comment}”
          </p>
        )}

        <div className="mt-auto">
          <p className="font-serif text-gold-600 dark:text-gold-400">
            {review.customer_name}
          </p>
          <p className="font-mono text-xs text-ink-400">
            {formatDateBR(review.created_at)}
          </p>
        </div>
      </div>
    </Card>
  )
}
