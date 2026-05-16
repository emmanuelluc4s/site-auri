import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Banner } from '@/types'

type BannerLocation = 'home_hero' | 'home_promo' | 'lancamentos'

export function useBanners(location?: BannerLocation) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBanners() {
      try {
        let query = supabase
          .from('banners')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (location) query = query.eq('location', location)

        const { data, error: queryError } = await query
        if (queryError) throw queryError
        setBanners((data as Banner[]) ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar banners')
      } finally {
        setLoading(false)
      }
    }
    void fetchBanners()
  }, [location])

  return { banners, loading, error }
}
