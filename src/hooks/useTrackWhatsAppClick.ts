import { supabase } from '@/lib/supabase'

// Fire-and-forget — não bloqueia a navegação para o WhatsApp.
// Incrementa popularity do produto via RPC SECURITY DEFINER.
export function trackWhatsAppClick(productSlug: string): void {
  supabase
    .rpc('increment_product_popularity', { product_slug: productSlug })
    .then(({ error }) => {
      if (error) console.warn('Erro ao registrar clique no WhatsApp:', error.message)
    })
}
