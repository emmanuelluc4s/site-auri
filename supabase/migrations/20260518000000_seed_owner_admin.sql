-- ============================================
-- AURI — Seed do primeiro admin owner
-- ============================================
-- Vincula o usuário auri.oficialbr@gmail.com (criado via dashboard) como
-- owner do painel admin. Idempotente (não falha se rodado de novo).

INSERT INTO admin_users (id, role, name)
VALUES ('ae69875a-fa0e-43ef-b458-36e006a64f99', 'owner', 'Emmanuel Lucas')
ON CONFLICT (id) DO UPDATE
  SET role = EXCLUDED.role,
      name = EXCLUDED.name;
