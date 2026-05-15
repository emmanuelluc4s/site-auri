import { useState } from 'react'
import type { Review } from '@/types'

// Placeholder — Supabase queries no Módulo 3+
export function useReviews() {
  const [reviews] = useState<Review[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  return { reviews, loading, error }
}
