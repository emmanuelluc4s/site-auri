import { useState } from 'react'
import type { StoreInfo } from '@/types'

// Placeholder — Supabase queries no Módulo 3+
export function useStoreInfo() {
  const [storeInfo] = useState<StoreInfo | null>(null)
  const [loading] = useState(false)
  const [error] = useState<string | null>(null)
  return { storeInfo, loading, error }
}
