// Supabase Edge Function — auto-deactivate-promotions
//
// Cron diário (agendado via pg_cron / Database > Cron Jobs no dashboard):
// define is_promotion = false em todos os produtos cuja promo_ends_at já passou.
//
// Idempotente — pode ser invocada múltiplas vezes sem efeitos colaterais.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabase
    .from('products')
    .update({ is_promotion: false })
    .lt('promo_ends_at', new Date().toISOString())
    .eq('is_promotion', true)
    .select('id, name')

  if (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }

  return new Response(
    JSON.stringify({
      success: true,
      deactivated_count: data?.length ?? 0,
      deactivated: data,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  )
})
