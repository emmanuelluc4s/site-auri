-- ============================================
-- AURI — Adiciona campo hero_video_url em store_info
-- ============================================
-- Permite ao admin definir a URL do vídeo do hero (YouTube ou MP4)
-- via painel administrativo (Módulo 9).

ALTER TABLE store_info
  ADD COLUMN IF NOT EXISTS hero_video_url text;

-- Vídeo de demonstração (pode ser substituído pelo admin depois).
UPDATE store_info
SET hero_video_url = 'https://www.youtube.com/watch?v=ScMzIvxBSi4'
WHERE hero_video_url IS NULL;
