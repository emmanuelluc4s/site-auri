import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { truncate } from '@/lib/utils'

interface ProductNavigationProps {
  currentProductId: string
  categoryId: string
}

interface NeighborInfo {
  slug: string
  name: string
}

interface Neighbors {
  prev: NeighborInfo | null
  next: NeighborInfo | null
}

export default function ProductNavigation({
  currentProductId,
  categoryId,
}: ProductNavigationProps) {
  const [neighbors, setNeighbors] = useState<Neighbors>({ prev: null, next: null })

  useEffect(() => {
    let cancelled = false
    async function fetchSiblings() {
      const { data } = await supabase
        .from('products')
        .select('id, slug, name')
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (cancelled || !data) return

      const list = data as Array<{ id: string; slug: string; name: string }>
      const idx = list.findIndex(p => p.id === currentProductId)
      if (idx === -1) {
        setNeighbors({ prev: null, next: null })
        return
      }
      const prev = idx > 0 ? list[idx - 1] : null
      const next = idx < list.length - 1 ? list[idx + 1] : null
      setNeighbors({
        prev: prev ? { slug: prev.slug, name: prev.name } : null,
        next: next ? { slug: next.slug, name: next.name } : null,
      })
    }
    void fetchSiblings()
    return () => {
      cancelled = true
    }
  }, [categoryId, currentProductId])

  const hasAny = useMemo(() => Boolean(neighbors.prev || neighbors.next), [neighbors])
  if (!hasAny) return null

  return (
    <nav
      aria-label="Navegação entre produtos da categoria"
      className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      {neighbors.prev ? (
        <Link
          to={`/produto/${neighbors.prev.slug}`}
          className="group inline-flex items-center gap-3 rounded-lg border border-ink-100 px-4 py-3 text-left transition-colors hover:border-gold-500/40 hover:bg-gold-500/5 dark:border-ink-700"
        >
          <ArrowLeft className="h-4 w-4 shrink-0 text-gold-500 transition-transform group-hover:-translate-x-0.5 dark:text-gold-400" aria-hidden="true" />
          <span className="flex flex-col">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
              Produto anterior
            </span>
            <span className="font-serif text-sm text-ink-800 group-hover:text-gold-600 dark:text-ink-50 dark:group-hover:text-gold-400">
              {truncate(neighbors.prev.name, 40)}
            </span>
          </span>
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}

      {neighbors.next ? (
        <Link
          to={`/produto/${neighbors.next.slug}`}
          className="group inline-flex items-center gap-3 rounded-lg border border-ink-100 px-4 py-3 text-right transition-colors hover:border-gold-500/40 hover:bg-gold-500/5 dark:border-ink-700 sm:justify-end"
        >
          <span className="flex flex-col items-end">
            <span className="text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
              Próximo produto
            </span>
            <span className="font-serif text-sm text-ink-800 group-hover:text-gold-600 dark:text-ink-50 dark:group-hover:text-gold-400">
              {truncate(neighbors.next.name, 40)}
            </span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-gold-500 transition-transform group-hover:translate-x-0.5 dark:text-gold-400" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" />
      )}
    </nav>
  )
}
