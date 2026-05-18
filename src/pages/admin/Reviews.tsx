import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Edit, Plus, Star, Trash2 } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { cn, formatDateBR } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import CategoryChip from '@/components/shared/CategoryChip'

import type { Review } from '@/types'

interface ReviewFormState {
  id?: string
  customer_name: string
  rating: number
  comment: string
  is_active: boolean
}

const EMPTY: ReviewFormState = {
  customer_name: '',
  rating: 5,
  comment: '',
  is_active: true,
}

type RatingFilter = 0 | 1 | 2 | 3 | 4 | 5
type ActiveFilter = 'all' | 'active' | 'inactive'

export default function AdminReviews() {
  const { toast } = useToast()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [filterRating, setFilterRating] = useState<RatingFilter>(0)
  const [filterActive, setFilterActive] = useState<ActiveFilter>('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<ReviewFormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Avaliações — AURI Admin' })
    void fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    setReviews((data as Review[] | null) ?? [])
    setLoading(false)
  }

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      if (filterRating !== 0 && r.rating !== filterRating) return false
      if (filterActive === 'active' && !r.is_active) return false
      if (filterActive === 'inactive' && r.is_active) return false
      return true
    })
  }, [reviews, filterRating, filterActive])

  function openNew() {
    setEditing(EMPTY)
    setModalOpen(true)
  }

  function openEdit(review: Review) {
    setEditing({
      id: review.id,
      customer_name: review.customer_name,
      rating: review.rating,
      comment: review.comment ?? '',
      is_active: review.is_active,
    })
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editing.customer_name.trim()) {
      toast('Nome do cliente é obrigatório', 'error')
      return
    }
    if (editing.rating < 1 || editing.rating > 5) {
      toast('Nota deve ser entre 1 e 5', 'error')
      return
    }

    setSaving(true)
    const payload = {
      customer_name: editing.customer_name.trim(),
      rating: editing.rating,
      comment: editing.comment.trim() || null,
      is_active: editing.is_active,
    }
    const { error } = editing.id
      ? await supabase.from('reviews').update(payload).eq('id', editing.id)
      : await supabase.from('reviews').insert(payload)
    setSaving(false)

    if (error) {
      toast(`Erro: ${error.message}`, 'error')
      return
    }
    toast(editing.id ? 'Avaliação atualizada' : 'Avaliação criada', 'success')
    setModalOpen(false)
    void fetchData()
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('reviews').delete().eq('id', id)
    if (error) {
      toast(`Erro ao excluir: ${error.message}`, 'error')
      return
    }
    setReviews(prev => prev.filter(r => r.id !== id))
    toast('Avaliação excluída', 'success')
  }

  async function toggleActive(review: Review) {
    const { error } = await supabase
      .from('reviews')
      .update({ is_active: !review.is_active })
      .eq('id', review.id)
    if (error) {
      toast('Erro ao atualizar', 'error')
      return
    }
    setReviews(prev => prev.map(r => r.id === review.id ? { ...r, is_active: !review.is_active } : r))
    toast(`Avaliação ${!review.is_active ? 'ativada' : 'desativada'}`, 'success')
  }

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Avaliações</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {filtered.length} de {reviews.length} avaliações
          </p>
        </div>
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nova avaliação
        </Button>
      </header>

      {/* Filtros */}
      <div className="mb-4 flex flex-wrap gap-2">
        <CategoryChip label="Todas" active={filterRating === 0} onClick={() => setFilterRating(0)} />
        {[5, 4, 3, 2, 1].map(r => (
          <CategoryChip
            key={r}
            label={`${r}★`}
            active={filterRating === r}
            onClick={() => setFilterRating(r as RatingFilter)}
          />
        ))}
        <span className="mx-2 self-center text-xs text-ink-400">|</span>
        {(['all', 'active', 'inactive'] as ActiveFilter[]).map(f => (
          <CategoryChip
            key={f}
            label={f === 'all' ? 'Todos status' : f === 'active' ? 'Ativos' : 'Inativos'}
            active={filterActive === f}
            onClick={() => setFilterActive(f)}
            size="sm"
          />
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-ink-100 bg-card p-12 text-center dark:border-ink-700">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {reviews.length === 0 ? 'Nenhuma avaliação cadastrada.' : 'Nenhuma avaliação com esses filtros.'}
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {filtered.map(review => (
            <li
              key={review.id}
              className={cn(
                'rounded-lg border bg-card p-4 transition-colors dark:border-ink-700',
                review.rating <= 2 ? 'border-danger/30' : 'border-ink-100',
                !review.is_active && 'opacity-60',
              )}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Stars rating={review.rating} />
                    <span className="text-sm font-medium text-ink-800 dark:text-ink-50">
                      {review.customer_name}
                    </span>
                    {!review.is_active && (
                      <span className="rounded bg-ink-200 px-2 py-0.5 text-[10px] font-medium uppercase text-ink-700 dark:bg-ink-700 dark:text-ink-200">
                        Inativa
                      </span>
                    )}
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm italic text-ink-700 dark:text-ink-200">
                      "{review.comment}"
                    </p>
                  )}
                  <p className="mt-1 text-xs text-ink-400">{formatDateBR(review.created_at)}</p>
                </div>

                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(review)}>
                    {review.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(review)} aria-label="Editar">
                    <Edit className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <Button variant="ghost" size="icon" aria-label="Excluir" className="text-danger hover:text-danger">
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir avaliação?</AlertDialogTitle>
                        <AlertDialogDescription>
                          A avaliação de "{review.customer_name}" será removida permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel />
                        <AlertDialogAction onClick={() => handleDelete(review.id)}>Excluir</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-lg"
        ariaLabel={editing.id ? 'Editar avaliação' : 'Nova avaliação'}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="mb-4 font-serif text-2xl text-ink-800 dark:text-ink-50">
            {editing.id ? 'Editar avaliação' : 'Nova avaliação'}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="rv-name">Nome do cliente</Label>
              <Input
                id="rv-name"
                required
                value={editing.customer_name}
                onChange={e => setEditing(prev => ({ ...prev, customer_name: e.target.value }))}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Nota</Label>
              <div className="mt-1.5 flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setEditing(prev => ({ ...prev, rating: n }))}
                    aria-label={`${n} estrela${n === 1 ? '' : 's'}`}
                    className="rounded p-1 transition-transform hover:scale-110"
                  >
                    <Star
                      className={cn(
                        'h-8 w-8',
                        n <= editing.rating
                          ? 'fill-gold-500 text-gold-500 dark:fill-gold-400 dark:text-gold-400'
                          : 'text-ink-300 dark:text-ink-600',
                      )}
                      strokeWidth={1.5}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="rv-comment">Comentário (opcional)</Label>
              <Textarea
                id="rv-comment"
                rows={4}
                value={editing.comment}
                onChange={e => setEditing(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="O que o cliente disse?"
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-ink-100 bg-ink-50 p-3 dark:border-ink-700 dark:bg-ink-900">
              <div>
                <p className="text-sm font-medium">Visível no site</p>
                <p className="text-xs text-ink-500">Avaliações inativas não aparecem em /avaliacoes</p>
              </div>
              <Switch
                checked={editing.is_active}
                onCheckedChange={v => setEditing(prev => ({ ...prev, is_active: v }))}
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="gold" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`Nota ${rating} de 5`}>
      {[1, 2, 3, 4, 5].map(n => (
        <Star
          key={n}
          className={cn(
            'h-4 w-4',
            n <= rating
              ? 'fill-gold-500 text-gold-500 dark:fill-gold-400 dark:text-gold-400'
              : 'text-ink-300 dark:text-ink-600',
          )}
          strokeWidth={1.5}
        />
      ))}
    </span>
  )
}
