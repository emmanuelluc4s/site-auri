-- ============================================
-- AURI — Reset de senha do owner (provisório, fix de onboarding)
-- ============================================
-- Define uma senha conhecida para o owner auri.oficialbr@gmail.com,
-- já que o e-mail de recovery não está funcionando no plano gratuito.
-- O owner deve trocar a senha no primeiro acesso via dashboard.

UPDATE auth.users
SET encrypted_password = crypt('Auri2026!', gen_salt('bf')),
    updated_at = now()
WHERE email = 'auri.oficialbr@gmail.com';
