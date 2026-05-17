import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowDown, Sparkles } from 'lucide-react'

import { useNewArrivals } from '@/hooks/useNewArrivals'
import { useCategories } from '@/hooks/useCategories'
import { useBanners } from '@/hooks/useBanners'
import { setSEO } from '@/lib/seo'
import { fadeInUp, staggerContainer, useReducedMotion } from '@/lib/animations'

import Breadcrumb from '@/components/shared/Breadcrumb'
import ProductCard from '@/components/shared/ProductCard'
import SectionTitle from '@/components/shared/SectionTitle'
import GoldDivider from '@/components/shared/GoldDivider'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import SortDropdown from '@/components/shared/SortDropdown'
import CategoryChip from '@/components/shared/CategoryChip'
import QuickViewModal from '@/components/shared/QuickViewModal'

import type { SortOption } from '@/types'

const VALID_SORTS: ReadonlyArray<SortOption> = ['newest', 'price_asc', 'price_desc', 'popular']

function isValidSort(value: string | null): value is SortOption {
  return value !== null && (VALID_SORTS as ReadonlyArray<string>).includes(value)
}

export default function Lancamentos() {
  const reduced = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()

  const [categorySlug, setCategorySlug] = useState<string | undefined>(
    searchParams.get('cat') ?? undefined,
  )
  const [sort, setSort] = useState<SortOption>(() => {
    const param = searchParams.get('sort')
    return isValidSort(param) ? param : 'newest'
  })
  const [quickViewSlug, setQuickViewSlug] = useState<string | null>(null)

  const { products, loading } = useNewArrivals({ categorySlug, sort })
  const { categories } = useCategories()
  const { banners } = useBanners('lancamentos')
  const heroBanner = banners[0]

  useEffect(() => {
    setSEO({
      title: 'Lançamentos AURI — Novidades da temporada',
      description:
        'Confira os lançamentos AURI: novidades em eletrônicos, acessórios e perfumes para quem busca o que há de mais novo.',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      image: heroBanner?.image_url ?? '/logo.jpeg',
    })
  }, [heroBanner])

  // Persiste filtros na URL.
  useEffect(() => {
    const next = new URLSearchParams()
    if (categorySlug) next.set('cat', categorySlug)
    if (sort !== 'newest') next.set('sort', sort)
    setSearchParams(next, { replace: true })
  }, [categorySlug, sort, setSearchParams])

  function scrollToProducts() {
    const el = document.getElementById('products-grid')
    if (el) el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <>
      {/* Banner cinematográfico */}
      <section
        aria-labelledby="lancamentos-title"
        className="relative h-[60vh] min-h-[480px] w-full overflow-hidden md:h-[80vh] md:min-h-[560px]"
      >
        {heroBanner?.image_url ? (
          <img
            src={heroBanner.image_url}
            alt=""
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/60 via-ink-900/40 to-ink-900/90" />

        <div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm text-gold-400 backdrop-blur-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium uppercase tracking-[0.18em]">Novidades</span>
            </div>

            <h1
              id="lancamentos-title"
              className="mb-4 max-w-4xl font-serif text-4xl text-ink-50 sm:text-6xl md:text-8xl"
            >
              {heroBanner?.title ?? 'Lançamentos AURI'}
            </h1>

            <p className="mb-8 font-serif text-lg italic text-gold-400 sm:text-xl md:text-2xl">
              {heroBanner?.subtitle ?? 'Presença que marca, agora em novas versões.'}
            </p>

            <GoldDivider className="mt-2 w-32" />

            <motion.button
              type="button"
              onClick={scrollToProducts}
              animate={reduced ? undefined : { y: [0, 10, 0] }}
              transition={reduced ? undefined : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="mt-12 inline-flex flex-col items-center gap-2 text-ink-200 transition-colors hover:text-gold-400"
              aria-label="Ver lançamentos"
            >
              <span className="text-xs uppercase tracking-[0.18em]">Descubra</span>
              <ArrowDown className="h-5 w-5" aria-hidden="true" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <div id="products-grid" className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <Breadcrumb items={[{ label: 'Lançamentos' }]} />

        <div className="mt-8">
          <SectionTitle
            as="h2"
            title="Acabaram de chegar"
            subtitle="As últimas adições ao catálogo AURI"
            align="left"
          />
        </div>

        {/* Toolbar */}
        <div className="mb-8 mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-2">
            <li>
              <CategoryChip
                label="Todas"
                active={!categorySlug}
                onClick={() => setCategorySlug(undefined)}
              />
            </li>
            {categories.map(cat => (
              <li key={cat.id}>
                <CategoryChip
                  label={cat.name}
                  active={categorySlug === cat.slug}
                  onClick={() => setCategorySlug(cat.slug)}
                />
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <span className="text-sm text-ink-500 dark:text-ink-400">Ordenar:</span>
            <SortDropdown<SortOption> value={sort} onChange={setSort} />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Sparkles}
            title="Sem lançamentos no momento"
            description={
              categorySlug
                ? 'Esta categoria ainda não tem lançamentos. Confira outras categorias.'
                : 'Em breve, novas adições ao catálogo AURI.'
            }
            action={
              categorySlug
                ? { label: 'Ver todos os lançamentos', onClick: () => setCategorySlug(undefined) }
                : { label: 'Ver catálogo', href: '/catalogo' }
            }
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-500 dark:text-ink-400">
              {products.length === 1 ? '1 lançamento' : `${products.length} lançamentos`}
            </p>
            <motion.div
              variants={reduced ? undefined : staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
          </>
        )}
      </div>

      <QuickViewModal
        productSlug={quickViewSlug}
        onClose={() => setQuickViewSlug(null)}
      />
    </>
  )
}
