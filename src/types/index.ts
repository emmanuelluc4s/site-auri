// Tipagens centrais do projeto AURI — todas espelham as tabelas do Supabase.
// Nenhum uso de `any` em nenhum ponto.

export interface Category {
  id: string
  name: string
  slug: string
  icon: string | null
  cover_url: string | null
  description: string | null
  created_at: string
}

export interface ProductVariant {
  id: string
  product_id: string
  color: string | null
  size: string | null
  stock: number
  created_at: string
}

export interface ProductMedia {
  id: string
  product_id: string
  type: 'image' | 'video'
  url: string
  sort_order: number
  created_at: string
}

export interface ProductComment {
  id: string
  product_id: string
  author_name: string
  comment: string
  is_active: boolean
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  promo_price: number | null
  promo_starts_at: string | null
  promo_ends_at: string | null
  category_id: string | null
  tags: string[]
  is_featured: boolean
  is_new: boolean
  is_promotion: boolean
  is_active: boolean
  sort_order: number
  popularity: number
  created_at: string
  updated_at: string
  // Relações (opcionais, populadas via joins)
  category?: Category
  variants?: ProductVariant[]
  media?: ProductMedia[]
  comments?: ProductComment[]
}

export interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  is_active: boolean
  created_at: string
}

export interface Banner {
  id: string
  title: string | null
  subtitle: string | null
  image_url: string | null
  link: string | null
  location: 'home_hero' | 'home_promo' | 'lancamentos'
  is_active: boolean
  sort_order: number
  created_at: string
}

export interface StoreInfo {
  id: string
  whatsapp: string
  instagram: string | null
  facebook: string | null
  olx: string | null
  about_text: string | null
  about_image_url: string | null
  business_hours: string | null
  hero_title: string | null
  hero_subtitle: string | null
  updated_at: string
}

export type AdminRole = 'owner' | 'editor'

export interface AdminUser {
  id: string
  role: AdminRole
  name: string | null
  created_at: string
}

// Tipos utilitários
export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'popular'

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  tags?: string[]
  sort?: SortOption
  search?: string
}
