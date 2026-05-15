// Supabase Edge Function — auto-deactivate-promotions
//
// Cron job diário (configurado no Módulo 3 via Supabase Scheduler) que define
// `is_promotion = false` em todos os produtos cuja `promo_ends_at` já passou.
// Implementação real ficará no Módulo 3, junto com a criação das tabelas.
//
// Esboço esperado:
//   import { createClient } from 'jsr:@supabase/supabase-js@2'
//   const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)
//   await supabase
//     .from('products')
//     .update({ is_promotion: false })
//     .lt('promo_ends_at', new Date().toISOString())
//
// Placeholder mantém o diretório versionado.
export {}
