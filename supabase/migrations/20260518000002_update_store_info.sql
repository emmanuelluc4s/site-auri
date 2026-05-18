-- ============================================
-- AURI — Atualiza informações reais da loja
-- ============================================
-- Substitui placeholders do seed pelos canais e horário definitivos
-- definidos pelo cliente.

UPDATE store_info
SET whatsapp       = '5588996538469',
    instagram      = 'https://instagram.com/auripremium__',
    facebook       = NULL,
    olx            = NULL,
    business_hours = 'Segunda a Sábado: 9h às 18h',
    updated_at     = now();
