import { useState } from 'react'
import type { Category } from '@/types'

// Placeholder — Supabase queries no Módulo 3+
export function useCategories() {
  const [categories] = useState<Category[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  return { categories, loading, error }
}
