import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import SortDropdown from '@/components/shared/SortDropdown'
import type { SortOption } from '@/types'

interface CatalogToolbarProps {
  totalCount: number
  sortValue: SortOption
  onSortChange: (value: SortOption) => void
  // Quando definido, mostra o botão "Filtros" (mobile/tablet).
  onOpenMobileFilters?: () => void
  activeFiltersCount?: number
}

export default function CatalogToolbar({
  totalCount,
  sortValue,
  onSortChange,
  onOpenMobileFilters,
  activeFiltersCount = 0,
}: CatalogToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-4">
      <div className="flex items-center gap-3">
        {onOpenMobileFilters && (
          <Button
            variant="outline-gold"
            size="sm"
            onClick={onOpenMobileFilters}
            className="relative lg:hidden"
            aria-label={`Abrir filtros (${activeFiltersCount} ativo${activeFiltersCount === 1 ? '' : 's'})`}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filtros
            {activeFiltersCount > 0 && (
              <motion.span
                key={activeFiltersCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.2 }}
                className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gold-500 px-1 text-[10px] font-bold text-ink-900"
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </Button>
        )}

        <p className="text-sm text-ink-500 dark:text-ink-400">
          {totalCount === 0
            ? 'Nenhum produto'
            : totalCount === 1
              ? '1 produto encontrado'
              : `${totalCount} produtos encontrados`}
        </p>
      </div>

      <SortDropdown value={sortValue} onChange={onSortChange} />
    </div>
  )
}
