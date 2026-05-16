import { formatRelativeDate, getInitials } from '@/lib/utils'
import type { ProductComment } from '@/types'

interface ProductCommentsProps {
  comments: ProductComment[]
}

export default function ProductComments({ comments }: ProductCommentsProps) {
  const active = comments.filter(c => c.is_active)

  if (active.length === 0) {
    return (
      <p className="text-sm text-ink-500 dark:text-ink-300">
        Seja o primeiro a comentar sobre este produto — fale com a gente pelo WhatsApp!
      </p>
    )
  }

  return (
    <ul className="divide-y divide-ink-100 dark:divide-ink-700">
      {active.map(comment => (
        <li key={comment.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex items-start gap-3">
            <span
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-800 font-serif text-sm text-gold-400 ring-1 ring-gold-400/30"
              aria-hidden="true"
            >
              {getInitials(comment.author_name)}
            </span>
            <div className="flex-1">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <p className="font-medium text-ink-800 dark:text-ink-50">
                  {comment.author_name}
                </p>
                <p className="font-mono text-xs text-ink-400">
                  {formatRelativeDate(comment.created_at)}
                </p>
              </div>
              <p className="mt-1 text-sm text-ink-700 dark:text-ink-200">
                {comment.comment}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
