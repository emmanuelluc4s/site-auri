import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Retorna true se existe pelo menos um produto marcado como lançamento.
export function useHasNewArrivals(): boolean {
  const [hasNew, setHasNew] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function check() {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_new', true)
      if (!cancelled) setHasNew((count ?? 0) > 0)
    }
    void check()
    return () => {
      cancelled = true
    }
  }, [])

  return hasNew
}
