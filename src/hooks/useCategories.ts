import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        const { data, error: queryError } = await supabase
          .from('categories')
          .select('*')
          .order('sort_order', { ascending: true })
        if (queryError) throw queryError
        setCategories((data as Category[]) ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar categorias')
      } finally {
        setLoading(false)
      }
    }
    void fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Buscar uma categoria pelo slug.
export function useCategory(slug: string | undefined) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    async function fetchCategory() {
      try {
        const { data, error: queryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug as string)
          .maybeSingle()
        if (queryError) throw queryError
        setCategory((data as Category | null) ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Categoria não encontrada')
      } finally {
        setLoading(false)
      }
    }

    void fetchCategory()
  }, [slug])

  return { category, loading, error }
}
