import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Retorna true se existe pelo menos um produto em promoção ativa hoje.
// Usado para mostrar indicador pulsante no Navbar.
export function useHasActivePromotions(): boolean {
  const [hasPromos, setHasPromos] = useState(false)

  useEffect(() => {
    let cancelled = false
    async function check() {
      const nowIso = new Date().toISOString()
      // Promoção ativa = is_promotion=true + (sem data fim OU data fim no futuro)
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)
        .eq('is_promotion', true)
        .or(`promo_ends_at.is.null,promo_ends_at.gt.${nowIso}`)
      if (!cancelled) setHasPromos((count ?? 0) > 0)
    }
    void check()
    return () => {
      cancelled = true
    }
  }, [])

  return hasPromos
}
