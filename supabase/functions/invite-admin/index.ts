// Supabase Edge Function — invite-admin
//
// Cria um novo usuário no Supabase Auth e o registra em admin_users.
// Restrito a usuários com role 'owner'. Envia link de recovery por e-mail
// para o convidado definir a senha.
//
// POST { email: string, name?: string, role: 'owner' | 'editor' }

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS })
  }
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'Missing Authorization header' }, 401)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!

  // Cliente do usuário (pra verificar quem está chamando)
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  })
  const { data: { user }, error: userError } = await userClient.auth.getUser()
  if (userError || !user) return json({ error: 'Unauthorized' }, 401)

  // Cliente service_role (bypassa RLS pra checar role e criar user)
  const admin = createClient(supabaseUrl, serviceKey)

  const { data: requester, error: requesterError } = await admin
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()
  if (requesterError) return json({ error: requesterError.message }, 500)
  if (requester?.role !== 'owner') {
    return json({ error: 'Only owner can invite admins' }, 403)
  }

  let payload: { email?: string; name?: string; role?: string }
  try {
    payload = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const email = payload.email?.trim().toLowerCase()
  const name = payload.name?.trim() ?? null
  const role = payload.role

  if (!email || !email.includes('@')) {
    return json({ error: 'Invalid email' }, 400)
  }
  if (role !== 'owner' && role !== 'editor') {
    return json({ error: 'Invalid role (must be owner or editor)' }, 400)
  }

  // Cria usuário no Auth com senha aleatória (admin definirá via recovery)
  const tempPassword = crypto.randomUUID()
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  })
  if (createError || !created.user) {
    return json({ error: createError?.message ?? 'Failed to create user' }, 500)
  }

  // Insere em admin_users
  const { error: insertError } = await admin.from('admin_users').insert({
    id: created.user.id,
    role,
    name,
  })
  if (insertError) {
    // Rollback: tenta deletar o user do Auth se falhou inserir
    await admin.auth.admin.deleteUser(created.user.id)
    return json({ error: insertError.message }, 500)
  }

  // Gera link de recovery pro novo usuário definir a senha
  // O Supabase envia o e-mail automaticamente quando esse método é chamado
  // (se as templates de e-mail estão configuradas no dashboard).
  await admin.auth.admin.generateLink({ type: 'recovery', email })

  return json({
    success: true,
    user_id: created.user.id,
    email,
    role,
    message: 'Convite criado. O usuário receberá e-mail para definir a senha.',
  })
})

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  })
}
