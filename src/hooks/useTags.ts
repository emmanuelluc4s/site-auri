import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

// Busca todas as tags únicas (deduplicadas e ordenadas) dos produtos ativos.
export function useTags() {
  const [tags, setTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTags() {
      try {
        const { data } = await supabase
          .from('products')
          .select('tags')
          .eq('is_active', true)
        const all = (data ?? []).flatMap((p: { tags: string[] | null }) => p.tags ?? [])
        setTags(Array.from(new Set(all)).sort((a, b) => a.localeCompare(b, 'pt-BR')))
      } finally {
        setLoading(false)
      }
    }
    void fetchTags()
  }, [])

  return { tags, loading }
}
