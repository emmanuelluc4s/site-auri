-- ============================================
-- AURI — Seed de dados de desenvolvimento
-- ============================================
-- ATENÇÃO: TRUNCATE apaga tudo. Usar só em desenvolvimento.

TRUNCATE banners, product_comments, product_variants, product_media,
         products, reviews, categories, store_info RESTART IDENTITY CASCADE;

-- ============================================
-- CATEGORIES
-- ============================================
INSERT INTO categories (name, slug, icon, description, sort_order) VALUES
  ('Eletrônicos', 'eletronicos', 'smartphone', 'Fones, smartwatches e gadgets de última geração', 1),
  ('Acessórios', 'acessorios', 'glasses',     'Óculos, carteiras e itens de presença',          2),
  ('Perfumes',    'perfumes',    'sparkles',  'Fragrâncias importadas e nacionais selecionadas', 3),
  ('Variedades',  'variedades',  'package',   'Produtos diversos da AURI',                       4);

-- ============================================
-- PRODUCTS
-- ============================================
-- 1) Destaque + Promoção ativa
INSERT INTO products (
  name, slug, description, price, promo_price, promo_starts_at, promo_ends_at,
  category_id, tags, is_featured, is_new, is_promotion, is_active, sort_order
) VALUES (
  'Fone Bluetooth Premium AURI',
  'fone-bluetooth-premium-auri',
  'Fone de ouvido sem fio com cancelamento ativo de ruído, bateria de 30h e som imersivo. Estojo carregador incluso.',
  299.90, 219.90,
  now() - interval '1 day', now() + interval '15 days',
  (SELECT id FROM categories WHERE slug = 'eletronicos'),
  ARRAY['bluetooth', 'fone', 'sem fio', 'premium'],
  true, false, true, true, 1
);

-- 2) Lançamento + destaque
INSERT INTO products (
  name, slug, description, price, category_id, tags,
  is_featured, is_new, is_active, sort_order
) VALUES (
  'Smartwatch AURI Series X',
  'smartwatch-auri-series-x',
  'Relógio inteligente com monitoramento de saúde 24h, GPS integrado e tela AMOLED. Resistente à água.',
  459.00,
  (SELECT id FROM categories WHERE slug = 'eletronicos'),
  ARRAY['smartwatch', 'relogio', 'lancamento'],
  true, true, true, 2
);

-- 3) Acessório destaque
INSERT INTO products (
  name, slug, description, price, category_id, tags, is_featured, is_active, sort_order
) VALUES (
  'Óculos de Sol Elegante Dourado',
  'oculos-sol-elegante-dourado',
  'Armação metálica em tom dourado, lentes polarizadas com proteção UV400. Estojo de couro incluso.',
  189.90,
  (SELECT id FROM categories WHERE slug = 'acessorios'),
  ARRAY['oculos', 'dourado', 'sol'],
  true, true, 3
);

-- 4) Carteira (variantes)
INSERT INTO products (
  name, slug, description, price, category_id, tags, is_active, sort_order
) VALUES (
  'Carteira de Couro Slim',
  'carteira-couro-slim',
  'Carteira em couro legítimo com proteção RFID, design minimalista e múltiplos compartimentos.',
  129.00,
  (SELECT id FROM categories WHERE slug = 'acessorios'),
  ARRAY['carteira', 'couro', 'masculino'],
  true, 4
);

-- 5) Perfume promoção
INSERT INTO products (
  name, slug, description, price, promo_price, promo_starts_at, promo_ends_at,
  category_id, tags, is_promotion, is_active, sort_order
) VALUES (
  'Perfume AURI Noir 100ml',
  'perfume-auri-noir-100ml',
  'Fragrância amadeirada com notas de oud, baunilha e sândalo. Edição limitada AURI.',
  349.00, 279.00,
  now() - interval '2 days', now() + interval '7 days',
  (SELECT id FROM categories WHERE slug = 'perfumes'),
  ARRAY['perfume', 'masculino', 'amadeirado'],
  true, true, 5
);

-- 6) Lançamento perfume feminino
INSERT INTO products (
  name, slug, description, price, category_id, tags, is_new, is_active, sort_order
) VALUES (
  'Perfume AURI Lumière 75ml',
  'perfume-auri-lumiere-75ml',
  'Fragrância floral com notas de jasmim, peônia e almíscar. Lançamento exclusivo AURI.',
  299.00,
  (SELECT id FROM categories WHERE slug = 'perfumes'),
  ARRAY['perfume', 'feminino', 'floral'],
  true, true, 6
);

-- ============================================
-- PRODUCT_VARIANTS
-- ============================================
INSERT INTO product_variants (product_id, color, stock) VALUES
  ((SELECT id FROM products WHERE slug = 'fone-bluetooth-premium-auri'), 'Preto',   15),
  ((SELECT id FROM products WHERE slug = 'fone-bluetooth-premium-auri'), 'Dourado',  7),
  ((SELECT id FROM products WHERE slug = 'fone-bluetooth-premium-auri'), 'Branco',   3);

INSERT INTO product_variants (product_id, color, stock) VALUES
  ((SELECT id FROM products WHERE slug = 'smartwatch-auri-series-x'), 'Preto', 10),
  ((SELECT id FROM products WHERE slug = 'smartwatch-auri-series-x'), 'Prata',  8);

INSERT INTO product_variants (product_id, color, size, stock) VALUES
  ((SELECT id FROM products WHERE slug = 'carteira-couro-slim'), 'Marrom', 'Padrão', 20),
  ((SELECT id FROM products WHERE slug = 'carteira-couro-slim'), 'Preto',  'Padrão', 12);

-- ============================================
-- PRODUCT_MEDIA
-- (URLs de Unsplash — substituir por uploads reais via painel admin)
-- ============================================
INSERT INTO product_media (product_id, type, url, sort_order) VALUES
  ((SELECT id FROM products WHERE slug = 'fone-bluetooth-premium-auri'),
   'image', 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', 0),
  ((SELECT id FROM products WHERE slug = 'smartwatch-auri-series-x'),
   'image', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800', 0),
  ((SELECT id FROM products WHERE slug = 'oculos-sol-elegante-dourado'),
   'image', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800', 0),
  ((SELECT id FROM products WHERE slug = 'carteira-couro-slim'),
   'image', 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800', 0),
  ((SELECT id FROM products WHERE slug = 'perfume-auri-noir-100ml'),
   'image', 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=800', 0),
  ((SELECT id FROM products WHERE slug = 'perfume-auri-lumiere-75ml'),
   'image', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=800', 0);

-- ============================================
-- PRODUCT_COMMENTS
-- ============================================
INSERT INTO product_comments (product_id, author_name, comment) VALUES
  ((SELECT id FROM products WHERE slug = 'fone-bluetooth-premium-auri'),
   'Carlos M.', 'Som impressionante! Bateria dura mesmo o que prometeram.'),
  ((SELECT id FROM products WHERE slug = 'fone-bluetooth-premium-auri'),
   'Juliana R.', 'Cancelamento de ruído funciona muito bem no metrô.'),
  ((SELECT id FROM products WHERE slug = 'smartwatch-auri-series-x'),
   'Pedro L.', 'Tela linda e o monitoramento de sono é preciso.');

-- ============================================
-- REVIEWS
-- ============================================
INSERT INTO reviews (customer_name, rating, comment) VALUES
  ('Ana Beatriz', 5, 'Atendimento via WhatsApp foi excelente. Produto chegou rápido e bem embalado.'),
  ('Roberto S.',  5, 'Comprei o perfume e amei. Loja de confiança, recomendo!'),
  ('Mariana C.',  4, 'Produtos de qualidade, entrega rápida. Voltarei a comprar.');

-- ============================================
-- BANNERS
-- ============================================
INSERT INTO banners (title, subtitle, image_url, location, sort_order) VALUES
  ('AURI', 'Presença que marca.',
   'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920',
   'home_hero', 1),
  ('Promoções Especiais', 'Até 30% off em produtos selecionados',
   'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920',
   'home_promo', 1),
  ('Lançamentos AURI', 'Conheça as novidades da temporada',
   'https://images.unsplash.com/photo-1607082350899-7e105aa886ae?w=1920',
   'lancamentos', 1);

-- ============================================
-- STORE_INFO (singleton)
-- ============================================
INSERT INTO store_info (
  whatsapp, instagram, facebook, olx,
  about_text, business_hours, hero_title, hero_subtitle
) VALUES (
  '5588999999999',
  'https://instagram.com/auri',
  'https://facebook.com/auri',
  'https://olx.com.br/auri',
  'A AURI nasceu com o propósito de oferecer produtos selecionados que carregam presença e personalidade. Eletrônicos, acessórios e perfumes escolhidos a dedo para quem busca qualidade e elegância.',
  'Segunda a sábado: 9h às 18h',
  'AURI',
  'Presença que marca.'
);
