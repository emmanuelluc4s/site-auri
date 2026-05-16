import { Link } from 'react-router-dom'
import { SearchX, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/shared/ProductCard'
import type { Product } from '@/types'

interface EmptyStateAction {
  label: string
  onClick?: () => void
  href?: string
}

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  suggestions?: Product[]
  action?: EmptyStateAction
}

export default function EmptyState({
  icon: Icon = SearchX,
  title,
  description,
  suggestions,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <span
        className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-gold-500/30 text-gold-500 dark:text-gold-400"
        aria-hidden="true"
      >
        <Icon className="h-12 w-12" strokeWidth={1.5} />
      </span>

      <h2 className="font-serif text-3xl text-ink-800 dark:text-ink-50">{title}</h2>
      {description && (
        <p className="max-w-md text-ink-500 dark:text-ink-300">{description}</p>
      )}

      {action && (
        <div className="pt-2">
          {action.href ? (
            <Link to={action.href}>
              <Button variant="outline-gold" size="md">{action.label}</Button>
            </Link>
          ) : (
            <Button variant="outline-gold" size="md" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}

      {suggestions && suggestions.length > 0 && (
        <div className="mt-12 w-full max-w-5xl">
          <p className="mb-6 font-serif text-lg text-ink-700 dark:text-ink-200">
            Você pode gostar de:
          </p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {suggestions.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
