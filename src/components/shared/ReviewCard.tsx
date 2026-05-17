import { Quote } from 'lucide-react'
import { Card } from '@/components/ui/card'
import StarRating from '@/components/shared/StarRating'
import { formatDateBR, getInitials } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

// Versão completa do ReviewPreview — usada em /avaliacoes.
export default function ReviewCard({ review }: ReviewCardProps) {
  const formatted = new Date(review.created_at).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Card className="relative h-full overflow-hidden p-6 md:p-8">
      <Quote
        className="absolute right-4 top-4 h-20 w-20 text-gold-500/10 dark:text-gold-400/10"
        strokeWidth={1}
        aria-hidden="true"
      />

      <div className="relative flex h-full flex-col gap-4">
        <StarRating rating={review.rating} size="md" />

        {review.comment && (
          <p className="font-serif italic leading-relaxed text-ink-700 dark:text-ink-200">
            “{review.comment}”
          </p>
        )}

        <div
          className="my-1 h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent dark:via-gold-400/30"
          aria-hidden="true"
        />

        <div className="mt-auto flex items-center gap-3">
          <span
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-700 font-serif text-sm font-bold text-ink-900 ring-1 ring-gold-500/30"
            aria-hidden="true"
            title={review.customer_name}
          >
            {getInitials(review.customer_name)}
          </span>
          <div>
            <p className="font-serif font-medium text-gold-600 dark:text-gold-400">
              {review.customer_name}
            </p>
            <p className="text-xs text-ink-400 dark:text-ink-500">{formatted || formatDateBR(review.created_at)}</p>
          </div>
        </div>
      </div>
    </Card>
  )
}
