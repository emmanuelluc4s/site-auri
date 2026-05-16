import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { StoreInfo } from '@/types'

export function useStoreInfo() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStoreInfo() {
      try {
        const { data, error: queryError } = await supabase
          .from('store_info')
          .select('*')
          .limit(1)
          .maybeSingle()
        if (queryError) throw queryError
        setStoreInfo((data as StoreInfo | null) ?? null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao buscar dados da loja')
      } finally {
        setLoading(false)
      }
    }
    void fetchStoreInfo()
  }, [])

  return { storeInfo, loading, error }
}
