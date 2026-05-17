import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, SortOption } from '@/types'

interface UseNewArrivalsOptions {
  categorySlug?: string
  sort?: SortOption
  limit?: number
}

// Busca produtos marcados como lançamento (is_new = true).
export function useNewArrivals(options: UseNewArrivalsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchNewArrivals() {
      setLoading(true)
      setError(null)
      try {
        let query = supabase
          .from('products')
          .select('*, media:product_media(*), category:categories(*)')
          .eq('is_active', true)
          .eq('is_new', true)

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
            query = query.order('price', { ascending: true })
            break
          case 'price_desc':
            query = query.order('price', { ascending: false })
            break
          case 'popular':
            query = query.order('popularity', { ascending: false })
            break
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false })
        }

        if (options.limit) query = query.limit(options.limit)

        const { data, error: queryError } = await query
        if (queryError) throw queryError
        if (cancelled) return
        setProducts((data as unknown as Product[]) ?? [])
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Erro ao buscar lançamentos')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void fetchNewArrivals()
    return () => {
      cancelled = true
    }
  }, [options.categorySlug, options.sort, options.limit])

  return { products, loading, error }
}
