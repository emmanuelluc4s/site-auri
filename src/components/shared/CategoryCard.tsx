import { Link } from 'react-router-dom'
import { getIcon } from '@/lib/icons'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = getIcon(category.icon)

  return (
    <Link
      to={`/categoria/${category.slug}`}
      aria-label={`Ver categoria ${category.name}`}
      className="group flex aspect-square flex-col items-center justify-center gap-4 rounded-xl bg-ink-800 p-6 ring-1 ring-transparent transition-all duration-300 hover:bg-ink-700 hover:shadow-gold-glow hover:ring-gold-500/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
    >
      <Icon
        className="h-12 w-12 text-gold-500 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14"
        strokeWidth={1.5}
        aria-hidden="true"
      />
      <h3 className="font-serif text-lg text-ink-50 sm:text-xl">{category.name}</h3>
    </Link>
  )
}
