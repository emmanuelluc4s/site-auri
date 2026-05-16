-- ============================================
-- AURI — Row Level Security (RLS)
-- ============================================

ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_media    ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews          ENABLE ROW LEVEL SECURITY;
ALTER TABLE banners          ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_info       ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users      ENABLE ROW LEVEL SECURITY;

-- ============================================
-- CATEGORIES
-- ============================================
CREATE POLICY "categories_select_public"
  ON categories FOR SELECT USING (true);
CREATE POLICY "categories_insert_admin"
  ON categories FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "categories_update_admin"
  ON categories FOR UPDATE USING (is_admin());
CREATE POLICY "categories_delete_admin"
  ON categories FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCTS — público vê só ativos; admin vê tudo
-- ============================================
CREATE POLICY "products_select_public_active"
  ON products FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "products_insert_admin"
  ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "products_update_admin"
  ON products FOR UPDATE USING (is_admin());
CREATE POLICY "products_delete_admin"
  ON products FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCT_MEDIA
-- ============================================
CREATE POLICY "product_media_select_public"
  ON product_media FOR SELECT USING (true);
CREATE POLICY "product_media_insert_admin"
  ON product_media FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "product_media_update_admin"
  ON product_media FOR UPDATE USING (is_admin());
CREATE POLICY "product_media_delete_admin"
  ON product_media FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCT_VARIANTS
-- ============================================
CREATE POLICY "product_variants_select_public"
  ON product_variants FOR SELECT USING (true);
CREATE POLICY "product_variants_insert_admin"
  ON product_variants FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "product_variants_update_admin"
  ON product_variants FOR UPDATE USING (is_admin());
CREATE POLICY "product_variants_delete_admin"
  ON product_variants FOR DELETE USING (is_admin());

-- ============================================
-- PRODUCT_COMMENTS — público vê só ativos
-- ============================================
CREATE POLICY "product_comments_select_public"
  ON product_comments FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "product_comments_insert_admin"
  ON product_comments FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "product_comments_update_admin"
  ON product_comments FOR UPDATE USING (is_admin());
CREATE POLICY "product_comments_delete_admin"
  ON product_comments FOR DELETE USING (is_admin());

-- ============================================
-- REVIEWS — público vê só ativos
-- ============================================
CREATE POLICY "reviews_select_public"
  ON reviews FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "reviews_insert_admin"
  ON reviews FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "reviews_update_admin"
  ON reviews FOR UPDATE USING (is_admin());
CREATE POLICY "reviews_delete_admin"
  ON reviews FOR DELETE USING (is_admin());

-- ============================================
-- BANNERS — público vê só ativos
-- ============================================
CREATE POLICY "banners_select_public"
  ON banners FOR SELECT USING (is_active = true OR is_admin());
CREATE POLICY "banners_insert_admin"
  ON banners FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "banners_update_admin"
  ON banners FOR UPDATE USING (is_admin());
CREATE POLICY "banners_delete_admin"
  ON banners FOR DELETE USING (is_admin());

-- ============================================
-- STORE_INFO
-- ============================================
CREATE POLICY "store_info_select_public"
  ON store_info FOR SELECT USING (true);
CREATE POLICY "store_info_insert_admin"
  ON store_info FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "store_info_update_admin"
  ON store_info FOR UPDATE USING (is_admin());
CREATE POLICY "store_info_delete_admin"
  ON store_info FOR DELETE USING (is_admin());

-- ============================================
-- ADMIN_USERS — só owner gerencia; cada um vê o próprio registro
-- ============================================
CREATE POLICY "admin_users_select_self_or_owner"
  ON admin_users FOR SELECT USING (id = auth.uid() OR is_owner());
CREATE POLICY "admin_users_insert_owner"
  ON admin_users FOR INSERT WITH CHECK (is_owner());
CREATE POLICY "admin_users_update_owner"
  ON admin_users FOR UPDATE USING (is_owner());
CREATE POLICY "admin_users_delete_owner"
  ON admin_users FOR DELETE USING (is_owner());
