import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

import { usePromotions, type PromoSort } from '@/hooks/usePromotions'
import { useCategories } from '@/hooks/useCategories'
import { setSEO } from '@/lib/seo'
import { fadeInUp, staggerContainer, useReducedMotion } from '@/lib/animations'

import Breadcrumb from '@/components/shared/Breadcrumb'
import PromoProductCard from '@/components/shared/PromoProductCard'
import GoldDivider from '@/components/shared/GoldDivider'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import SortDropdown from '@/components/shared/SortDropdown'
import CategoryChip from '@/components/shared/CategoryChip'

const VALID_SORTS: ReadonlyArray<PromoSort> = [
  'discount_desc',
  'newest',
  'price_asc',
  'price_desc',
  'popular',
]

function isValidSort(value: string | null): value is PromoSort {
  return value !== null && (VALID_SORTS as ReadonlyArray<string>).includes(value)
}

export default function Promocoes() {
  const reduced = useReducedMotion()
  const [searchParams, setSearchParams] = useSearchParams()

  const [categorySlug, setCategorySlug] = useState<string | undefined>(
    searchParams.get('cat') ?? undefined,
  )
  const [sort, setSort] = useState<PromoSort>(() => {
    const param = searchParams.get('sort')
    return isValidSort(param) ? param : 'discount_desc'
  })

  const { products, loading } = usePromotions({ categorySlug, sort })
  const { categories } = useCategories()

  useEffect(() => {
    setSEO({
      title: 'Promoções AURI — Ofertas com desconto',
      description:
        'Confira as promoções ativas da AURI. Descontos especiais em eletrônicos, acessórios e perfumes selecionados.',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      image: '/logo.jpeg',
    })
  }, [])

  // Persiste filtros na URL.
  useEffect(() => {
    const next = new URLSearchParams()
    if (categorySlug) next.set('cat', categorySlug)
    if (sort !== 'discount_desc') next.set('sort', sort)
    setSearchParams(next, { replace: true })
  }, [categorySlug, sort, setSearchParams])

  const extraOptions = useMemo(
    () => [{ value: 'discount_desc' as PromoSort, label: 'Maior desconto' }],
    [],
  )

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gold-500 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-gold-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Promoções' }]} />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm text-gold-400">
              <Flame className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium uppercase tracking-[0.18em]">
                Ofertas Especiais
              </span>
            </div>

            <h1 className="mb-4 font-serif text-4xl tracking-tight text-ink-50 sm:text-5xl md:text-7xl">
              Promoções <span className="gold-gradient-text">AURI</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-ink-300 sm:text-lg">
              Aproveite descontos exclusivos por tempo limitado em produtos selecionados.
            </p>
            <GoldDivider className="mx-auto mt-6 w-32" />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {/* Toolbar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
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
            <SortDropdown<PromoSort>
              value={sort}
              onChange={setSort}
              extraOptions={extraOptions}
            />
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Flame}
            title="Nenhuma promoção ativa no momento"
            description={
              categorySlug
                ? 'Não há promoções nesta categoria. Confira outras categorias ou volte mais tarde.'
                : 'Volte em breve — sempre temos novidades em oferta.'
            }
            action={
              categorySlug
                ? { label: 'Ver todas as promoções', onClick: () => setCategorySlug(undefined) }
                : { label: 'Ver catálogo', href: '/catalogo' }
            }
          />
        ) : (
          <>
            <p className="mb-6 text-sm text-ink-500 dark:text-ink-400">
              {products.length === 1
                ? '1 produto em promoção'
                : `${products.length} produtos em promoção`}
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
                  <PromoProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          </>
        )}
      </div>
    </>
  )
}
