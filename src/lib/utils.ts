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
// Omite campos vazios (sem cor ou sem tamanho).
export function buildWhatsAppLink(
  phone: string,
  product: Product,
  variant?: ProductVariant,
): string {
  const parts: string[] = [`Olá! Tenho interesse no produto: ${product.name}`]
  if (variant) {
    if (variant.color) parts.push(`Cor: ${variant.color}`)
    if (variant.size) parts.push(`Tamanho: ${variant.size}`)
  }
  const msg = parts.join(' | ')
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

// Data relativa em pt-BR ("Hoje", "Ontem", "Há 3 dias", "Há 2 semanas")
// ou dd/mm/yyyy para datas com mais de 30 dias.
export function formatRelativeDate(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'Hoje'
  if (days === 1) return 'Ontem'
  if (days < 7) return `Há ${days} dias`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'Há 1 semana' : `Há ${weeks} semanas`
  }
  return new Date(iso).toLocaleDateString('pt-BR')
}

// Mapeia nomes de cor comuns (pt-BR) → hex aproximado.
// Usado para colorir o seletor de variantes.
const COLOR_MAP: Record<string, string> = {
  preto:    '#000000',
  branco:   '#FFFFFF',
  dourado:  '#C9962C',
  prata:    '#C0C0C0',
  marrom:   '#5D4037',
  cinza:    '#9E9E9E',
  azul:     '#1976D2',
  vermelho: '#C62828',
  verde:    '#2E7D32',
  rosa:     '#EC407A',
  roxo:     '#7B1FA2',
  bege:     '#D7CCC8',
  amarelo:  '#FFC107',
  laranja:  '#FB8C00',
}

export function colorToHex(name: string | null | undefined): string | null {
  if (!name) return null
  return COLOR_MAP[name.trim().toLowerCase()] ?? null
}

// Inicial(is) para avatar (pega 1-2 chars do nome).
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}
