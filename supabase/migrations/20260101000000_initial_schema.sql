-- ============================================
-- AURI — Schema inicial do banco de dados
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: categories
-- ============================================
CREATE TABLE categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  slug        text UNIQUE NOT NULL,
  icon        text,
  cover_url   text,
  description text,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ============================================
-- TABELA: products
-- ============================================
CREATE TABLE products (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  slug            text UNIQUE NOT NULL,
  description     text,
  price           numeric(10,2) NOT NULL CHECK (price >= 0),
  promo_price     numeric(10,2) CHECK (promo_price >= 0),
  promo_starts_at timestamptz,
  promo_ends_at   timestamptz,
  category_id     uuid REFERENCES categories(id) ON DELETE SET NULL,
  tags            text[] DEFAULT ARRAY[]::text[],
  is_featured     boolean DEFAULT false,
  is_new          boolean DEFAULT false,
  is_promotion    boolean DEFAULT false,
  is_active       boolean DEFAULT true,
  sort_order      int DEFAULT 0,
  popularity      int DEFAULT 0,
  created_at      timestamptz DEFAULT now(),
  updated_at      timestamptz DEFAULT now(),
  CONSTRAINT promo_price_lower_than_price
    CHECK (promo_price IS NULL OR promo_price < price)
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_products_is_featured ON products(is_featured);
CREATE INDEX idx_products_is_promotion ON products(is_promotion);
CREATE INDEX idx_products_is_new ON products(is_new);
CREATE INDEX idx_products_popularity ON products(popularity DESC);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_products_updated_at
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: product_media
-- ============================================
CREATE TABLE product_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  type        text NOT NULL CHECK (type IN ('image', 'video')),
  url         text NOT NULL,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_product_media_product_id ON product_media(product_id);

-- ============================================
-- TABELA: product_variants
-- ============================================
CREATE TABLE product_variants (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color       text,
  size        text,
  stock       int DEFAULT 0 CHECK (stock >= 0),
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);

-- ============================================
-- TABELA: product_comments
-- ============================================
CREATE TABLE product_comments (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  comment     text NOT NULL,
  is_active   boolean DEFAULT true,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_product_comments_product_id ON product_comments(product_id);

-- ============================================
-- TABELA: reviews (avaliações globais)
-- ============================================
CREATE TABLE reviews (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name  text NOT NULL,
  rating         int NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment        text,
  is_active      boolean DEFAULT true,
  created_at     timestamptz DEFAULT now()
);
CREATE INDEX idx_reviews_is_active ON reviews(is_active);

-- ============================================
-- TABELA: banners
-- ============================================
CREATE TABLE banners (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text,
  subtitle    text,
  image_url   text,
  link        text,
  location    text NOT NULL CHECK (location IN ('home_hero', 'home_promo', 'lancamentos')),
  is_active   boolean DEFAULT true,
  sort_order  int DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_banners_location ON banners(location);
CREATE INDEX idx_banners_is_active ON banners(is_active);

-- ============================================
-- TABELA: store_info (singleton)
-- ============================================
CREATE TABLE store_info (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp        text NOT NULL,
  instagram       text,
  facebook        text,
  olx             text,
  about_text      text,
  about_image_url text,
  business_hours  text,
  hero_title      text,
  hero_subtitle   text,
  updated_at      timestamptz DEFAULT now()
);

CREATE TRIGGER trigger_update_store_info_updated_at
BEFORE UPDATE ON store_info
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABELA: admin_users
-- ============================================
CREATE TABLE admin_users (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role        text NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'editor')),
  name        text,
  created_at  timestamptz DEFAULT now()
);
CREATE INDEX idx_admin_users_role ON admin_users(role);

-- ============================================
-- HELPERS de RLS — usados nas policies da migration 2
-- ============================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_owner()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'owner'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;
