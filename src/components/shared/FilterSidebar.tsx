import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import GoldDivider from '@/components/shared/GoldDivider'
import { useCategories } from '@/hooks/useCategories'
import { useTags } from '@/hooks/useTags'
import { usePriceRange } from '@/hooks/usePriceRange'
import { cn, formatPrice } from '@/lib/utils'
import type { ProductFilters } from '@/types'

interface FilterSidebarProps {
  filters: ProductFilters
  onFiltersChange: (filters: ProductFilters) => void
  onClose?: () => void
  // Quando true, não fixa categoria mesmo que `filters.category` esteja definido
  // (a categoria já está fixa pela rota).
  hideCategoryFilter?: boolean
  className?: string
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h3 className="font-serif text-lg text-ink-800 dark:text-ink-50">{children}</h3>
      <span className="mt-1 block h-px w-10 bg-gold-500 dark:bg-gold-400" aria-hidden="true" />
    </div>
  )
}

export default function FilterSidebar({
  filters,
  onFiltersChange,
  onClose,
  hideCategoryFilter = false,
  className,
}: FilterSidebarProps) {
  const { categories } = useCategories()
  const { tags } = useTags()
  const { range } = usePriceRange()

  const [minPrice, setMinPrice] = useState<string>(
    filters.minPrice !== undefined ? String(filters.minPrice) : '',
  )
  const [maxPrice, setMaxPrice] = useState<string>(
    filters.maxPrice !== undefined ? String(filters.maxPrice) : '',
  )

  // Sincroniza inputs locais com filtros externos (deep link, reset).
  useEffect(() => {
    setMinPrice(filters.minPrice !== undefined ? String(filters.minPrice) : '')
    setMaxPrice(filters.maxPrice !== undefined ? String(filters.maxPrice) : '')
  }, [filters.minPrice, filters.maxPrice])

  function applyPriceRange() {
    const min = minPrice === '' ? undefined : Number(minPrice)
    const max = maxPrice === '' ? undefined : Number(maxPrice)
    onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
  }

  function toggleTag(tag: string) {
    const current = filters.tags ?? []
    const next = current.includes(tag)
      ? current.filter(t => t !== tag)
      : [...current, tag]
    onFiltersChange({ ...filters, tags: next.length ? next : undefined })
  }

  function selectCategory(slug: string | undefined) {
    onFiltersChange({ ...filters, category: slug })
    onClose?.()
  }

  function clearAll() {
    onFiltersChange({ sort: filters.sort })
  }

  const hasActiveFilters = Boolean(
    filters.category ||
    filters.minPrice !== undefined ||
    filters.maxPrice !== undefined ||
    (filters.tags && filters.tags.length > 0),
  )

  return (
    <div
      className={cn(
        'flex flex-col gap-6 rounded-xl bg-card p-6 ring-1 ring-ink-100 dark:ring-ink-700',
        className,
      )}
    >
      <header className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-ink-800 dark:text-ink-50">Filtros</h2>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-medium uppercase tracking-wider text-gold-600 hover:underline dark:text-gold-400"
          >
            Limpar
          </button>
        )}
      </header>

      {!hideCategoryFilter && (
        <section>
          <SectionHeading>Categoria</SectionHeading>
          <ul className="space-y-1.5">
            <li>
              <button
                type="button"
                onClick={() => selectCategory(undefined)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                  !filters.category
                    ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400'
                    : 'text-ink-700 hover:bg-gold-500/5 hover:text-gold-600 dark:text-ink-200 dark:hover:text-gold-400',
                )}
              >
                Todas as categorias
              </button>
            </li>
            {categories.map(cat => {
              const isActive = filters.category === cat.slug
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => selectCategory(cat.slug)}
                    aria-pressed={isActive}
                    className={cn(
                      'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-sm transition-colors',
                      isActive
                        ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400'
                        : 'text-ink-700 hover:bg-gold-500/5 hover:text-gold-600 dark:text-ink-200 dark:hover:text-gold-400',
                    )}
                  >
                    {cat.name}
                  </button>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <GoldDivider withDiamond={false} />

      <section>
        <SectionHeading>Faixa de preço</SectionHeading>
        <div className="flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Preço mínimo</span>
            <input
              type="number"
              inputMode="numeric"
              min={range.min}
              max={range.max}
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              onBlur={applyPriceRange}
              placeholder={`Min ${formatPrice(range.min).replace('R$', 'R$')}`}
              className="w-full rounded-md border border-ink-200 bg-background px-3 py-2 text-sm text-ink-800 outline-none focus-visible:border-gold-500 focus-visible:ring-1 focus-visible:ring-gold-500 dark:border-ink-700 dark:text-ink-50"
            />
          </label>
          <span className="text-ink-400">—</span>
          <label className="flex-1">
            <span className="sr-only">Preço máximo</span>
            <input
              type="number"
              inputMode="numeric"
              min={range.min}
              max={range.max}
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              onBlur={applyPriceRange}
              placeholder={`Max ${formatPrice(range.max).replace('R$', 'R$')}`}
              className="w-full rounded-md border border-ink-200 bg-background px-3 py-2 text-sm text-ink-800 outline-none focus-visible:border-gold-500 focus-visible:ring-1 focus-visible:ring-gold-500 dark:border-ink-700 dark:text-ink-50"
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-ink-500 dark:text-ink-400">
          Disponível: {formatPrice(range.min)} – {formatPrice(range.max)}
        </p>
      </section>

      {tags.length > 0 && (
        <>
          <GoldDivider withDiamond={false} />
          <section>
            <SectionHeading>Tags</SectionHeading>
            <ul className="flex flex-wrap gap-2">
              {tags.map(tag => {
                const isActive = filters.tags?.includes(tag) ?? false
                return (
                  <li key={tag}>
                    <button
                      type="button"
                      onClick={() => toggleTag(tag)}
                      aria-pressed={isActive}
                      className={cn(
                        'rounded-full px-3 py-1 text-xs font-medium transition-all',
                        isActive
                          ? 'bg-gold-500 text-ink-900 shadow-gold-glow-sm'
                          : 'border border-ink-200 text-ink-700 hover:border-gold-500 hover:text-gold-600 dark:border-ink-700 dark:text-ink-200 dark:hover:text-gold-400',
                      )}
                    >
                      {tag}
                    </button>
                  </li>
                )
              })}
            </ul>
          </section>
        </>
      )}

      {hasActiveFilters && (
        <Button variant="outline-gold" size="md" onClick={clearAll}>
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
