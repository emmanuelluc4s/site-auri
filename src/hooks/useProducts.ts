import { useState } from 'react'
import type { Product } from '@/types'

// Placeholder — Supabase queries no Módulo 3+
export function useProducts() {
  const [products] = useState<Product[]>([])
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  return { products, loading, error }
}
