import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductFilters, SortOption } from '@/types'

const PAGE_SIZE = 12

interface UseInfiniteScrollOptions {
  filters?: ProductFilters
}

export function useInfiniteScroll(options: UseInfiniteScrollOptions = {}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const pageRef = useRef(0)

  const filtersKey = JSON.stringify(options.filters)

  const fetchPage = useCallback(async (page: number, reset = false) => {
    setLoading(true)
    setError(null)

    try {
      const from = page * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      let query = supabase
        .from('products')
        .select(`*, media:product_media(*), category:categories(*)`)
        .eq('is_active', true)
        .range(from, to)

      if (options.filters?.category) {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', options.filters.category)
          .maybeSingle()
        if (cat) query = query.eq('category_id', cat.id)
      }
      if (options.filters?.minPrice !== undefined) {
        query = query.gte('price', options.filters.minPrice)
      }
      if (options.filters?.maxPrice !== undefined) {
        query = query.lte('price', options.filters.maxPrice)
      }
      if (options.filters?.tags && options.filters.tags.length > 0) {
        query = query.overlaps('tags', options.filters.tags)
      }
      if (options.filters?.search) {
        query = query.ilike('name', `%${options.filters.search}%`)
      }

      const sort: SortOption = options.filters?.sort ?? 'newest'
      switch (sort) {
        case 'price_asc':  query = query.order('price', { ascending: true }); break
        case 'price_desc': query = query.order('price', { ascending: false }); break
        case 'popular':    query = query.order('popularity', { ascending: false }); break
        default:           query = query.order('created_at', { ascending: false })
      }

      const { data, error: queryError } = await query
      if (queryError) throw queryError

      const list = (data as unknown as Product[]) ?? []
      setProducts(prev => (reset ? list : [...prev, ...list]))
      setHasMore(list.length === PAGE_SIZE)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos')
    } finally {
      setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey])

  // Reset quando os filtros mudam.
  useEffect(() => {
    pageRef.current = 0
    void fetchPage(0, true)
  }, [filtersKey, fetchPage])

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return
    pageRef.current += 1
    void fetchPage(pageRef.current)
  }, [loading, hasMore, fetchPage])

  return { products, loading, hasMore, error, loadMore }
}
