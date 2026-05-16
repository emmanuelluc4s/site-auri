import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Review } from '@/types'

export function useReviews(limit?: number) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [average, setAverage] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReviews() {
      try {
        let query = supabase
          .from('reviews')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (limit) query = query.limit(limit)

        const { data, error: queryError } = await query
        if (queryError) throw queryError

        const list = (data as Review[]) ?? []
        setReviews(list)
        if (list.length > 0) {
          const sum = list.reduce((acc, r) => acc + r.rating, 0)
          setAverage(Number((sum / list.length).toFixed(1)))
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar avaliações')
      } finally {
        setLoading(false)
      }
    }
    void fetchReviews()
  }, [limit])

  return { reviews, average, loading, error }
}
