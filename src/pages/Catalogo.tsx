import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchX } from 'lucide-react'

import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { useProducts } from '@/hooks/useProducts'
import { setSEO } from '@/lib/seo'
import { fadeInUp, staggerContainer, useReducedMotion } from '@/lib/animations'

import SearchBar from '@/components/shared/SearchBar'
import FilterSidebar from '@/components/shared/FilterSidebar'
import CatalogToolbar from '@/components/shared/CatalogToolbar'
import ProductCard from '@/components/shared/ProductCard'
import QuickViewModal from '@/components/shared/QuickViewModal'
import EmptyState from '@/components/shared/EmptyState'
import Breadcrumb from '@/components/shared/Breadcrumb'
import Spinner from '@/components/shared/Spinner'
import SectionTitle from '@/components/shared/SectionTitle'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'

import type { ProductFilters, SortOption } from '@/types'

const VALID_SORTS: ReadonlyArray<SortOption> = ['newest', 'price_asc', 'price_desc', 'popular']

function isValidSort(value: string | null): value is SortOption {
  return value !== null && (VALID_SORTS as ReadonlyArray<string>).includes(value)
}

// Restaura filtros e busca a partir dos query params da URL (deep linking).
function parseSearchParams(params: URLSearchParams): {
  filters: ProductFilters
  search: string
} {
  const sortParam = params.get('sort')
  const tagsParam = params.get('tags')
  const minParam = params.get('min')
  const maxParam = params.get('max')

  return {
    filters: {
      category: params.get('cat') ?? undefined,
      sort: isValidSort(sortParam) ? sortParam : 'newest',
      minPrice: minParam !== null ? Number(minParam) : undefined,
      maxPrice: maxParam !== null ? Number(maxParam) : undefined,
      tags: tagsParam ? tagsParam.split(',').filter(Boolean) : undefined,
    },
    search: params.get('q') ?? '',
  }
}

export default function Catalogo() {
  const reduced = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()

  // Estado inicial vem da URL (restauração no mount).
  const initial = useMemo(() => parseSearchParams(searchParams), [])
  const [filters, setFilters] = useState<ProductFilters>(initial.filters)
  const [search, setSearch] = useState(initial.search)
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Filtros efetivos: combina filtros + busca.
  const effectiveFilters = useMemo<ProductFilters>(
    () => ({ ...filters, search: search.trim() || undefined }),
    [filters, search],
  )

  const { products, loading, hasMore, loadMore, error } = useInfiniteScroll({
    filters: effectiveFilters,
  })

  // Sugestões para EmptyState quando busca não retorna nada.
  const { products: suggestions } = useProducts({
    filters: { sort: 'popular' },
    includeMedia: true,
    includeCategory: true,
    limit: 4,
  })

  // Persiste filtros + busca na URL (deep link).
  useEffect(() => {
    const next = new URLSearchParams()
    if (filters.category) next.set('cat', filters.category)
    if (filters.sort && filters.sort !== 'newest') next.set('sort', filters.sort)
    if (filters.minPrice !== undefined) next.set('min', String(filters.minPrice))
    if (filters.maxPrice !== undefined) next.set('max', String(filters.maxPrice))
    if (filters.tags && filters.tags.length > 0) next.set('tags', filters.tags.join(','))
    if (search.trim()) next.set('q', search.trim())
    setSearchParams(next, { replace: true })
  }, [filters, search, setSearchParams])

  useEffect(() => {
    setSEO({
      title: 'Catálogo — AURI',
      description: 'Conheça todos os produtos AURI: eletrônicos, acessórios e perfumes selecionados.',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      image: '/logo.jpeg',
    })
  }, [])

  // IntersectionObserver pro scroll infinito.
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) loadMore()
      },
      { rootMargin: '200px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasMore, loading, loadMore])

  const activeFiltersCount =
    (filters.category ? 1 : 0) +
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.tags?.length ?? 0)

  function resetAll() {
    setFilters({ sort: 'newest' })
    setSearch('')
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Breadcrumb items={[{ label: 'Catálogo' }]} />

        <div className="mt-6">
          <SectionTitle
            title="Catálogo AURI"
            subtitle="Encontre o produto que carrega sua presença"
            align="left"
          />
        </div>

        <div className="mt-8 max-w-2xl">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar produtos..."
            loading={loading && products.length === 0}
          />
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} onFiltersChange={setFilters} />
            </div>
          </aside>

          <div>
            <CatalogToolbar
              totalCount={products.length}
              sortValue={filters.sort ?? 'newest'}
              onSortChange={(value: SortOption) => setFilters({ ...filters, sort: value })}
              onOpenMobileFilters={() => setMobileFiltersOpen(true)}
              activeFiltersCount={activeFiltersCount}
            />

            {error ? (
              <div className="flex flex-col items-center gap-4 py-16 text-center">
                <p className="text-danger">Erro ao carregar produtos.</p>
                <Button variant="outline-gold" onClick={() => window.location.reload()}>
                  Tentar novamente
                </Button>
              </div>
            ) : products.length === 0 && !loading ? (
              <EmptyState
                icon={SearchX}
                title="Nenhum produto encontrado"
                description={
                  search
                    ? `Não encontramos resultados para "${search}". Tente outros termos ou ajuste os filtros.`
                    : 'Ajuste os filtros para ver mais produtos.'
                }
                suggestions={suggestions}
                action={
                  activeFiltersCount > 0 || search
                    ? { label: 'Limpar filtros', onClick: resetAll }
                    : undefined
                }
              />
            ) : (
              <>
                <motion.div
                  variants={reduced ? undefined : staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3"
                >
                  {products.map(product => (
                    <motion.div
                      key={product.id}
                      variants={reduced ? undefined : fadeInUp}
                    >
                      <ProductCard
                        product={product}
                        showQuickView
                        onQuickView={() => setQuickViewSlug(product.slug)}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                <div ref={sentinelRef} className="flex justify-center py-12">
                  {loading && <Spinner size="lg" />}
                  {!loading && !hasMore && products.length > 0 && (
                    <p className="text-sm text-ink-400">
                      Você viu todos os produtos disponíveis.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Sheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        side="left"
        ariaLabel="Filtros do catálogo"
      >
        <div className="px-6 py-8">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            onClose={() => setMobileFiltersOpen(false)}
            className="ring-0"
          />
        </div>
      </Sheet>

      <QuickViewModal
        productSlug={quickViewSlug}
        onClose={() => setQuickViewSlug(null)}
      />
    </>
  )
}
