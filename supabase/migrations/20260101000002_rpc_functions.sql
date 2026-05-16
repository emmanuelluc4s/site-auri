-- ============================================
-- AURI — Funções RPC públicas
-- ============================================

-- Incrementa popularidade do produto a cada clique no WhatsApp.
-- SECURITY DEFINER permite gravar mesmo via cliente anônimo,
-- e o filtro por slug + is_active evita escrita arbitrária.
CREATE OR REPLACE FUNCTION increment_product_popularity(product_slug text)
RETURNS void AS $$
BEGIN
  UPDATE products
  SET popularity = popularity + 1
  WHERE slug = product_slug AND is_active = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION increment_product_popularity(text) TO anon, authenticated;
