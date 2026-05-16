import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface PriceRange {
  min: number
  max: number
}

// Retorna o intervalo [min, max] entre todos os produtos ativos.
// Útil para configurar limites de slider de preço.
export function usePriceRange() {
  const [range, setRange] = useState<PriceRange>({ min: 0, max: 1000 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRange() {
      try {
        const [minRes, maxRes] = await Promise.all([
          supabase
            .from('products')
            .select('price')
            .eq('is_active', true)
            .order('price', { ascending: true })
            .limit(1)
            .maybeSingle(),
          supabase
            .from('products')
            .select('price')
            .eq('is_active', true)
            .order('price', { ascending: false })
            .limit(1)
            .maybeSingle(),
        ])
        const minPrice = (minRes.data as { price: number } | null)?.price
        const maxPrice = (maxRes.data as { price: number } | null)?.price
        if (typeof minPrice === 'number' && typeof maxPrice === 'number') {
          setRange({ min: Math.floor(minPrice), max: Math.ceil(maxPrice) })
        }
      } finally {
        setLoading(false)
      }
    }
    void fetchRange()
  }, [])

  return { range, loading }
}
