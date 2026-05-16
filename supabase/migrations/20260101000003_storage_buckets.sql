-- ============================================
-- AURI — Storage buckets + policies
-- ============================================
-- Cria os buckets product-images e banners com leitura pública
-- e escrita restrita a admins (via função is_admin()).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true, 5242880,
   ARRAY['image/jpeg','image/png','image/webp','image/svg+xml']),
  ('banners',        'banners',        true, 5242880,
   ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- ============================================
-- Policies de Storage
-- ============================================
-- Leitura: já é pública pela flag public = true do bucket.
-- Escrita (insert/update/delete): apenas admins autenticados.

-- product-images
CREATE POLICY "product_images_insert_admin"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_update_admin"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

CREATE POLICY "product_images_delete_admin"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images' AND is_admin());

-- banners
CREATE POLICY "banners_insert_admin"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'banners' AND is_admin());

CREATE POLICY "banners_update_admin"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'banners' AND is_admin());

CREATE POLICY "banners_delete_admin"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'banners' AND is_admin());
