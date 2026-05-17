import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { isPromoActive } from '@/lib/utils'
import type { Product, SortOption } from '@/types'

export type PromoSort = SortOption | 'discount_desc'

interface UsePromotionsOptions {
  categorySlug?: string
  sort?: PromoSort
  limit?: number
}

// Busca produtos com promoção VÁLIDA (dentro da janela de datas).
// O filtro de período é client-side pois o Postgres exigiria OR complexo.
export function usePromotions(options: UsePromotionsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPromotions() {
      setLoading(true)
      setError(null)
      try {
        let query = supabase
          .from('products')
          .select('*, media:product_media(*), category:categories(*)')
          .eq('is_active', true)
          .eq('is_promotion', true)
          .not('promo_price', 'is', null)

        if (options.categorySlug) {
          const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', options.categorySlug)
            .maybeSingle()
          if (cat) query = query.eq('category_id', cat.id)
        }

        switch (options.sort) {
          case 'price_asc':
            query = query.order('promo_price', { ascending: true })
            break
          case 'price_desc':
            query = query.order('promo_price', { ascending: false })
            break
          case 'popular':
            query = query.order('popularity', { ascending: false })
            break
          case 'newest':
            query = query.order('created_at', { ascending: false })
            break
          case 'discount_desc':
          default:
            // Ordenação por desconto é client-side; pega tudo por data.
            query = query.order('created_at', { ascending: false })
        }

        if (options.limit) query = query.limit(options.limit)

        const { data, error: queryError } = await query
        if (queryError) throw queryError
        if (cancelled) return

        let list = (data as unknown as Product[]) ?? []
        list = list.filter(p => isPromoActive(p))

        if (options.sort === 'discount_desc' || !options.sort) {
          list.sort((a, b) => {
            const da = a.promo_price ? 1 - a.promo_price / a.price : 0
            const db = b.promo_price ? 1 - b.promo_price / b.price : 0
            return db - da
          })
        }

        setProducts(list)
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Erro ao buscar promoções')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchPromotions()
    return () => {
      cancelled = true
    }
  }, [options.categorySlug, options.sort, options.limit])

  return { products, loading, error }
}
