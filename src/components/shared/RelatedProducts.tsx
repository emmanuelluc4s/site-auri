import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/shared/ProductCard'
import SectionTitle from '@/components/shared/SectionTitle'
import Spinner from '@/components/shared/Spinner'
import type { Product } from '@/types'

interface RelatedProductsProps {
  categoryId: string
  excludeProductId: string
  limit?: number
}

export default function RelatedProducts({
  categoryId,
  excludeProductId,
  limit = 8,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchRelated() {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*, media:product_media(*), category:categories(*)')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .neq('id', excludeProductId)
        .order('popularity', { ascending: false })
        .limit(limit)
      if (!cancelled) {
        setProducts((data as unknown as Product[]) ?? [])
        setLoading(false)
      }
    }
    void fetchRelated()
    return () => {
      cancelled = true
    }
  }, [categoryId, excludeProductId, limit])

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    const firstCard = el.querySelector<HTMLElement>('[data-card]')
    const cardWidth = firstCard?.clientWidth ?? 280
    el.scrollBy({
      left: direction === 'left' ? -(cardWidth + 24) : cardWidth + 24,
      behavior: 'smooth',
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (products.length < 2) return null

  return (
    <section aria-labelledby="related-title">
      <SectionTitle
        as="h2"
        title="Você também pode gostar"
        subtitle="Produtos da mesma categoria"
        align="left"
      />

      <div className="relative mt-8">
        <button
          type="button"
          onClick={() => scroll('left')}
          aria-label="Rolar para a esquerda"
          className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/90 text-gold-400 ring-1 ring-gold-400/30 backdrop-blur-sm transition-colors hover:bg-ink-900 lg:flex"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => scroll('right')}
          aria-label="Rolar para a direita"
          className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-4 items-center justify-center rounded-full bg-ink-900/90 text-gold-400 ring-1 ring-gold-400/30 backdrop-blur-sm transition-colors hover:bg-ink-900 lg:flex"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>

        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pr-1"
        >
          {products.map(p => (
            <div
              key={p.id}
              data-card
              className="w-[280px] shrink-0 snap-start sm:w-[300px]"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
