import { useState } from 'react'
import type { Banner } from '@/types'

// Placeholder — Supabase queries no Módulo 3+
export function useBanners() {
  const [banners] = useState<Banner[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  return { banners, loading, error }
}
