import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Product, ProductFilters, SortOption } from '@/types'

interface UseProductsOptions {
  filters?: ProductFilters
  limit?: number
  includeMedia?: boolean
  includeVariants?: boolean
  includeCategory?: boolean
}

interface UseProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const filtersKey = JSON.stringify(options.filters)

  async function fetchProducts() {
    setLoading(true)
    setError(null)

    try {
      const select = [
        '*',
        options.includeMedia ? 'media:product_media(*)' : null,
        options.includeVariants ? 'variants:product_variants(*)' : null,
        options.includeCategory ? 'category:categories(*)' : null,
      ].filter(Boolean).join(', ')

      let query = supabase.from('products').select(select).eq('is_active', true)

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
      setProducts((data as unknown as Product[]) ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar produtos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersKey, options.limit, options.includeMedia, options.includeVariants, options.includeCategory])

  return { products, loading, error, refetch: fetchProducts }
}

// Buscar um produto pelo slug, com todos os relacionamentos.
export function useProduct(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    async function fetchProduct() {
      setLoading(true)
      setError(null)
      try {
        const { data, error: queryError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*),
            media:product_media(*),
            variants:product_variants(*),
            comments:product_comments(*)
          `)
          .eq('slug', slug as string)
          .eq('is_active', true)
          .maybeSingle()
        if (queryError) throw queryError
        setProduct(data as unknown as Product | null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Produto não encontrado')
      } finally {
        setLoading(false)
      }
    }

    void fetchProduct()
  }, [slug])

  return { product, loading, error }
}
