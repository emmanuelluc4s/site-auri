import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Product, ProductVariant } from '@/types'

// Utilitário shadcn/ui — concatena classes Tailwind com merge inteligente.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formata preço em Real brasileiro.
export function formatPrice(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Calcula percentual de desconto (arredondado).
export function calcDiscount(price: number, promoPrice: number): number {
  return Math.round((1 - promoPrice / price) * 100)
}

// Verifica se a promoção está dentro da janela de datas e habilitada.
export function isPromoActive(product: Product): boolean {
  if (!product.is_promotion || !product.promo_price) return false
  const now = new Date()
  if (product.promo_starts_at && new Date(product.promo_starts_at) > now) return false
  if (product.promo_ends_at && new Date(product.promo_ends_at) < now) return false
  return true
}

// Monta link do WhatsApp com mensagem pré-preenchida incluindo variantes.
export function buildWhatsAppLink(
  phone: string,
  product: Product,
  variant?: ProductVariant,
): string {
  const variantInfo = variant
    ? ` | Cor: ${variant.color ?? '-'} | Tamanho: ${variant.size ?? '-'}`
    : ''
  const msg = `Olá! Tenho interesse no produto: ${product.name}${variantInfo}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}

export interface ShareLinks {
  whatsapp: string
  facebook: string
  instagram: string
  copy: string
}

// Monta links de compartilhamento social para o produto.
export function buildShareLinks(url: string, title: string): ShareLinks {
  const encodedUrl = encodeURIComponent(url)
  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    // Instagram não tem API de compartilhamento via URL — link para o perfil.
    instagram: `https://www.instagram.com/`,
    copy: url,
  }
}

// Gera número "aleatório" mas consistente por produto por dia (prova social simulada).
export function getDailyRandom(productId: string, min = 10, max = 80): number {
  const seed = productId + new Date().toISOString().split('T')[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return min + Math.abs(hash) % (max - min)
}

// Gera slug a partir de um texto livre.
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

// Trunca texto com reticências.
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Hook utilitário para respeitar preferência de movimento reduzido.
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Extrai o ID do vídeo de uma URL do YouTube (curta ou longa).
export function getYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}

// Formata data ISO em pt-BR (ex: "15 mai 2026").
export function formatDateBR(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso))
}
