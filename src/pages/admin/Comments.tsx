import { useEffect, useState, type FormEvent } from 'react'
import { Edit, Plus, Trash2 } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { cn, formatRelativeDate, getInitials } from '@/lib/utils'
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

import type { ProductComment } from '@/types'

interface ProductOption {
  id: string
  name: string
  slug: string
}

interface CommentFormState {
  id?: string
  author_name: string
  comment: string
  is_active: boolean
}

const EMPTY: CommentFormState = {
  author_name: '',
  comment: '',
  is_active: true,
}

export default function AdminComments() {
  const { toast } = useToast()
  const [products, setProducts] = useState<ProductOption[]>([])
  const [selectedProductId, setSelectedProductId] = useState<string>('')
  const [comments, setComments] = useState<ProductComment[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  const [loadingComments, setLoadingComments] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CommentFormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Comentários — AURI Admin' })
    void fetchProducts()
  }, [])

  useEffect(() => {
    if (selectedProductId) void fetchComments(selectedProductId)
    else setComments([])
  }, [selectedProductId])

  async function fetchProducts() {
    setLoadingProducts(true)
    const { data } = await supabase
      .from('products')
      .select('id, name, slug')
      .order('name')
    setProducts((data as ProductOption[] | null) ?? [])
    setLoadingProducts(false)
  }

  async function fetchComments(productId: string) {
    setLoadingComments(true)
    const { data } = await supabase
      .from('product_comments')
      .select('*')
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
    setComments((data as ProductComment[] | null) ?? [])
    setLoadingComments(false)
  }

  function openNew() {
    if (!selectedProductId) {
      toast('Selecione um produto primeiro', 'error')
      return
    }
    setEditing(EMPTY)
    setModalOpen(true)
  }

  function openEdit(comment: ProductComment) {
    setEditing({
      id: comment.id,
      author_name: comment.author_name,
      comment: comment.comment,
      is_active: comment.is_active,
    })
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editing.author_name.trim() || !editing.comment.trim()) {
      toast('Nome e comentário são obrigatórios', 'error')
      return
    }

    setSaving(true)
    const payload = {
      author_name: editing.author_name.trim(),
      comment: editing.comment.trim(),
      is_active: editing.is_active,
    }
    const { error } = editing.id
      ? await supabase.from('product_comments').update(payload).eq('id', editing.id)
      : await supabase.from('product_comments').insert({ ...payload, product_id: selectedProductId })
    setSaving(false)

    if (error) {
      toast(`Erro: ${error.message}`, 'error')
      return
    }
    toast(editing.id ? 'Comentário atualizado' : 'Comentário criado', 'success')
    setModalOpen(false)
    void fetchComments(selectedProductId)
  }

  async function handleDelete(id: string) {
    const { error } = await supabase.from('product_comments').delete().eq('id', id)
    if (error) {
      toast(`Erro ao excluir: ${error.message}`, 'error')
      return
    }
    setComments(prev => prev.filter(c => c.id !== id))
    toast('Comentário excluído', 'success')
  }

  async function toggleActive(comment: ProductComment) {
    const { error } = await supabase
      .from('product_comments')
      .update({ is_active: !comment.is_active })
      .eq('id', comment.id)
    if (error) {
      toast('Erro ao atualizar', 'error')
      return
    }
    setComments(prev => prev.map(c => c.id === comment.id ? { ...c, is_active: !comment.is_active } : c))
  }

  const selectedProduct = products.find(p => p.id === selectedProductId)

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Comentários</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Comentários cadastrados manualmente em cada produto
          </p>
        </div>
        <Button variant="gold" onClick={openNew} disabled={!selectedProductId}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Novo comentário
        </Button>
      </header>

      <div className="mb-4 rounded-xl border border-ink-100 bg-card p-4 dark:border-ink-700">
        <Label htmlFor="product-select">Produto</Label>
        <select
          id="product-select"
          value={selectedProductId}
          onChange={e => setSelectedProductId(e.target.value)}
          disabled={loadingProducts}
          className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        >
          <option value="">— Selecione um produto —</option>
          {products.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      {!selectedProductId ? (
        <div className="rounded-xl border border-ink-100 bg-card p-12 text-center dark:border-ink-700">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Selecione um produto acima para ver e gerenciar seus comentários.
          </p>
        </div>
      ) : loadingComments ? (
        <div className="space-y-2">
          {[1, 2].map(i => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl border border-ink-100 bg-card p-12 text-center dark:border-ink-700">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Nenhum comentário em "{selectedProduct?.name}". Clique em "Novo comentário" para adicionar.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {comments.map(comment => (
            <li
              key={comment.id}
              className={cn(
                'rounded-lg border border-ink-100 bg-card p-4 dark:border-ink-700',
                !comment.is_active && 'opacity-60',
              )}
            >
              <div className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-800 text-sm font-serif text-gold-400 ring-1 ring-gold-400/30">
                  {getInitials(comment.author_name)}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <p className="font-medium text-ink-800 dark:text-ink-50">{comment.author_name}</p>
                    <p className="font-mono text-xs text-ink-400">
                      {formatRelativeDate(comment.created_at)}
                    </p>
                    {!comment.is_active && (
                      <span className="rounded bg-ink-200 px-2 py-0.5 text-[10px] font-medium uppercase text-ink-700 dark:bg-ink-700 dark:text-ink-200">
                        Inativo
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-ink-700 dark:text-ink-200">{comment.comment}</p>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => toggleActive(comment)}>
                    {comment.is_active ? 'Desativar' : 'Ativar'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => openEdit(comment)} aria-label="Editar">
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
                        <AlertDialogTitle>Excluir comentário?</AlertDialogTitle>
                        <AlertDialogDescription>
                          O comentário de "{comment.author_name}" será removido permanentemente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel />
                        <AlertDialogAction onClick={() => handleDelete(comment.id)}>Excluir</AlertDialogAction>
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
        ariaLabel={editing.id ? 'Editar comentário' : 'Novo comentário'}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="mb-1 font-serif text-2xl text-ink-800 dark:text-ink-50">
            {editing.id ? 'Editar comentário' : 'Novo comentário'}
          </h2>
          {selectedProduct && (
            <p className="mb-4 text-xs text-ink-500">em {selectedProduct.name}</p>
          )}

          <div className="space-y-4">
            <div>
              <Label htmlFor="c-name">Nome do autor</Label>
              <Input
                id="c-name"
                required
                value={editing.author_name}
                onChange={e => setEditing(prev => ({ ...prev, author_name: e.target.value }))}
                placeholder="ex: Carlos M."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="c-comment">Comentário</Label>
              <Textarea
                id="c-comment"
                required
                rows={4}
                value={editing.comment}
                onChange={e => setEditing(prev => ({ ...prev, comment: e.target.value }))}
                placeholder="O que o cliente disse sobre o produto?"
                className="mt-1.5"
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-ink-100 bg-ink-50 p-3 dark:border-ink-700 dark:bg-ink-900">
              <div>
                <p className="text-sm font-medium">Visível no site</p>
                <p className="text-xs text-ink-500">Aparece no acordeão "Comentários" do produto</p>
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
