import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Trilha de navegação" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2 text-ink-500 dark:text-ink-400">
        <li>
          <Link
            to="/"
            aria-label="Página inicial"
            className="inline-flex items-center gap-1 transition-colors hover:text-gold-600 dark:hover:text-gold-400"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={`${item.label}-${idx}`} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-ink-300 dark:text-ink-600" aria-hidden="true" />
            {item.href ? (
              <Link
                to={item.href}
                className="transition-colors hover:text-gold-600 dark:hover:text-gold-400"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current="page"
                className="font-medium text-ink-800 dark:text-ink-100"
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
