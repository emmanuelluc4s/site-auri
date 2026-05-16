import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SearchX, SlidersHorizontal } from 'lucide-react'

import { useCategory } from '@/hooks/useCategories'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import { setSEO } from '@/lib/seo'
import { fadeInUp, staggerContainer, useReducedMotion } from '@/lib/animations'

import Breadcrumb from '@/components/shared/Breadcrumb'
import FilterSidebar from '@/components/shared/FilterSidebar'
import CatalogToolbar from '@/components/shared/CatalogToolbar'
import ProductCard from '@/components/shared/ProductCard'
import QuickViewModal from '@/components/shared/QuickViewModal'
import EmptyState from '@/components/shared/EmptyState'
import GoldDivider from '@/components/shared/GoldDivider'
import Spinner from '@/components/shared/Spinner'
import { Button } from '@/components/ui/button'
import { Sheet } from '@/components/ui/sheet'

import type { ProductFilters, SortOption } from '@/types'

export default function Categoria() {
  const reduced = useReducedMotion()
  const { slug } = useParams<{ slug: string }>()
  const { category, loading: catLoading, error: catError } = useCategory(slug)

  const [filters, setFilters] = useState<ProductFilters>({
    sort: 'newest',
    category: slug,
  })
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Sincroniza o filtro de categoria quando a rota muda.
  useEffect(() => {
    setFilters(prev => ({ ...prev, category: slug }))
  }, [slug])

  // Garante que o filtro de categoria seja sempre o slug da rota.
  const effectiveFilters = useMemo<ProductFilters>(
    () => ({ ...filters, category: slug }),
    [filters, slug],
  )

  const { products, loading, hasMore, loadMore } = useInfiniteScroll({
    filters: effectiveFilters,
  })

  useEffect(() => {
    if (category) {
      setSEO({
        title: `${category.name} — AURI`,
        description:
          category.description ?? `Produtos da categoria ${category.name} na AURI.`,
        url: typeof window !== 'undefined' ? window.location.href : undefined,
        image: category.cover_url ?? '/logo.jpeg',
      })
    }
  }, [category])

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

  if (catLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Categoria inexistente → redireciona para o catálogo.
  if (catError || !category) {
    return <Navigate to="/catalogo" replace />
  }

  const activeFiltersCount =
    (filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0) +
    (filters.tags?.length ?? 0)

  return (
    <>
      {/* Banner de capa */}
      <section
        aria-label={`Categoria ${category.name}`}
        className="relative h-56 w-full bg-cover bg-center md:h-80"
        style={
          category.cover_url
            ? { backgroundImage: `url(${category.cover_url})` }
            : undefined
        }
      >
        {!category.cover_url && (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/40 via-ink-900/30 to-ink-900/85" />

        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-10 sm:px-6">
          <h1 className="font-serif text-4xl tracking-tight text-gold-400 sm:text-5xl md:text-6xl">
            {category.name}
          </h1>
          {category.description && (
            <p className="mt-2 max-w-2xl text-base text-ink-100 sm:text-lg">
              {category.description}
            </p>
          )}
          <GoldDivider className="mt-5 w-24" withDiamond={false} />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <Breadcrumb
          items={[
            { label: 'Catálogo', href: '/catalogo' },
            { label: category.name },
          ]}
        />

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={next => setFilters({ ...next, category: slug })}
                hideCategoryFilter
              />
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

            {products.length === 0 && !loading ? (
              <EmptyState
                icon={SearchX}
                title={`Sem produtos em ${category.name} no momento`}
                description="Em breve, novidades nesta categoria."
                action={{ label: 'Ver todo o catálogo', href: '/catalogo' }}
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
                      Você viu todos os produtos desta categoria.
                    </p>
                  )}
                </div>
              </>
            )}

            {/* Botão extra para abrir filtros mobile fora do toolbar (caso seja útil) */}
            {!mobileFiltersOpen && (
              <div className="fixed bottom-24 left-6 z-20 lg:hidden">
                <Button
                  variant="outline-gold"
                  size="sm"
                  onClick={() => setMobileFiltersOpen(true)}
                  aria-label="Abrir filtros"
                  className="rounded-full shadow-soft"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Sheet
        open={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
        side="left"
        ariaLabel="Filtros da categoria"
      >
        <div className="px-6 py-8">
          <FilterSidebar
            filters={filters}
            onFiltersChange={next => setFilters({ ...next, category: slug })}
            onClose={() => setMobileFiltersOpen(false)}
            hideCategoryFilter
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
