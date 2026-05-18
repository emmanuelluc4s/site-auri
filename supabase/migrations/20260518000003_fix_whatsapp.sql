-- ============================================
-- AURI — Corrige WhatsApp para o número real
-- ============================================

UPDATE store_info
SET whatsapp = '5588996538469',
    updated_at = now()
WHERE whatsapp != '5588996538469';
