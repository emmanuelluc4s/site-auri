import { useEffect, useState, type FormEvent } from 'react'
import { Edit, GripVertical, Plus, Trash2 } from 'lucide-react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { cn, slugify } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'
import { getIcon } from '@/lib/icons'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
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

import type { Category } from '@/types'

interface CategoryFormState {
  id?: string
  name: string
  slug: string
  icon: string
  description: string
  cover_url: string | null
  coverFile?: File
}

const EMPTY: CategoryFormState = {
  name: '',
  slug: '',
  icon: '',
  description: '',
  cover_url: null,
}

export default function AdminCategories() {
  const { toast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [productCounts, setProductCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CategoryFormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    setSEO({ title: 'Categorias — AURI Admin' })
    void fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [catRes, prodRes] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('products').select('category_id').eq('is_active', true),
    ])
    const cats = (catRes.data as Category[] | null) ?? []
    setCategories(cats)
    const counts: Record<string, number> = {}
    for (const row of (prodRes.data as Array<{ category_id: string | null }> | null) ?? []) {
      if (row.category_id) counts[row.category_id] = (counts[row.category_id] ?? 0) + 1
    }
    setProductCounts(counts)
    setLoading(false)
  }

  function openNew() {
    setEditing(EMPTY)
    setModalOpen(true)
  }

  function openEdit(category: Category) {
    setEditing({
      id: category.id,
      name: category.name,
      slug: category.slug,
      icon: category.icon ?? '',
      description: category.description ?? '',
      cover_url: category.cover_url,
    })
    setModalOpen(true)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = categories.findIndex(c => c.id === active.id)
    const newIdx = categories.findIndex(c => c.id === over.id)
    if (oldIdx === -1 || newIdx === -1) return
    const reordered = arrayMove(categories, oldIdx, newIdx)
    setCategories(reordered)
    const updates = reordered.map((c, idx) =>
      supabase.from('categories').update({ sort_order: idx }).eq('id', c.id),
    )
    const results = await Promise.all(updates)
    if (results.some(r => r.error)) {
      toast('Erro ao reordenar', 'error')
      void fetchData()
    } else {
      toast('Ordem atualizada', 'success')
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!editing.name.trim()) {
      toast('Nome é obrigatório', 'error')
      return
    }
    if (!/^[a-z0-9-]+$/.test(editing.slug)) {
      toast('Slug inválido (use letras minúsculas, números e hífens)', 'error')
      return
    }

    setSaving(true)
    try {
      let coverUrl: string | null = editing.cover_url
      if (editing.coverFile) {
        const safeName = editing.coverFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
        const path = `categories/${Date.now()}-${safeName}`
        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(path, editing.coverFile)
        if (uploadError) throw uploadError
        coverUrl = supabase.storage.from('banners').getPublicUrl(path).data.publicUrl
      }

      const payload = {
        name: editing.name.trim(),
        slug: editing.slug.trim(),
        icon: editing.icon.trim() || null,
        description: editing.description.trim() || null,
        cover_url: coverUrl,
      }

      if (editing.id) {
        const { error } = await supabase.from('categories').update(payload).eq('id', editing.id)
        if (error) throw error
        toast('Categoria atualizada', 'success')
      } else {
        const { error } = await supabase
          .from('categories')
          .insert({ ...payload, sort_order: categories.length })
        if (error) throw error
        toast('Categoria criada', 'success')
      }

      setModalOpen(false)
      void fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      toast(`Erro: ${message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    if (error) {
      toast(`Erro ao excluir: ${error.message}`, 'error')
      return
    }
    setCategories(prev => prev.filter(c => c.id !== id))
    toast(`"${name}" excluída`, 'success')
  }

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Categorias</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {categories.length} categoria{categories.length === 1 ? '' : 's'}
          </p>
        </div>
        <Button variant="gold" onClick={openNew}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Nova categoria
        </Button>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-xl border border-ink-100 bg-card p-12 text-center dark:border-ink-700">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            Nenhuma categoria. Crie a primeira pelo botão acima.
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map(c => c.id)} strategy={verticalListSortingStrategy}>
            <ul className="space-y-2">
              {categories.map(category => (
                <SortableCategoryRow
                  key={category.id}
                  category={category}
                  productCount={productCounts[category.id] ?? 0}
                  onEdit={() => openEdit(category)}
                  onDelete={() => handleDelete(category.id, category.name)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-2xl"
        ariaLabel={editing.id ? 'Editar categoria' : 'Nova categoria'}
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="mb-4 font-serif text-2xl text-ink-800 dark:text-ink-50">
            {editing.id ? 'Editar categoria' : 'Nova categoria'}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Nome</Label>
              <Input
                id="cat-name"
                required
                value={editing.name}
                onChange={e => {
                  const name = e.target.value
                  setEditing(prev => ({
                    ...prev,
                    name,
                    slug: !prev.id ? slugify(name) : prev.slug,
                  }))
                }}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="cat-slug">Slug</Label>
              <Input
                id="cat-slug"
                required
                value={editing.slug}
                onChange={e => setEditing(prev => ({ ...prev, slug: e.target.value }))}
                pattern="^[a-z0-9-]+$"
                className="mt-1.5 font-mono text-xs"
              />
            </div>

            <div>
              <Label htmlFor="cat-icon">Ícone (nome do Lucide)</Label>
              <Input
                id="cat-icon"
                value={editing.icon}
                onChange={e => setEditing(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="ex: smartphone, sparkles, glasses"
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-ink-500">
                Suportados: smartphone, headphones, watch, glasses, shirt, shopping_bag, sparkles, package
              </p>
            </div>

            <div>
              <Label htmlFor="cat-desc">Descrição</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={editing.description}
                onChange={e => setEditing(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Aparece no banner da página da categoria"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="cat-cover">Imagem de capa</Label>
              {editing.cover_url && !editing.coverFile && (
                <div className="mt-2 overflow-hidden rounded-md">
                  <img
                    src={editing.cover_url}
                    alt=""
                    className="h-32 w-full object-cover"
                  />
                </div>
              )}
              <Input
                id="cat-cover"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (!file) return
                  if (file.size > 5 * 1024 * 1024) {
                    toast('Arquivo ultrapassa 5MB', 'error')
                    return
                  }
                  setEditing(prev => ({
                    ...prev,
                    coverFile: file,
                    cover_url: URL.createObjectURL(file),
                  }))
                }}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button type="button" variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="gold" disabled={saving}>
              {saving ? 'Salvando…' : 'Salvar'}
            </Button>
          </div>
        </form>
      </Dialog>
    </div>
  )
}

interface RowProps {
  category: Category
  productCount: number
  onEdit: () => void
  onDelete: () => void
}

function SortableCategoryRow({ category, productCount, onEdit, onDelete }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const Icon = getIcon(category.icon)

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-4 rounded-lg border border-ink-100 bg-card p-4 transition-colors hover:border-gold-500/40 dark:border-ink-700',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar"
        className="cursor-grab text-ink-400 hover:text-gold-600 dark:hover:text-gold-400"
      >
        <GripVertical className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-ink-800 text-gold-400">
        {category.cover_url ? (
          <img src={category.cover_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.5} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink-800 dark:text-ink-50">{category.name}</p>
        <p className="text-xs text-ink-500">
          /categoria/{category.slug} · {productCount} produto{productCount === 1 ? '' : 's'} ativo{productCount === 1 ? '' : 's'}
        </p>
        {category.description && (
          <p className="mt-1 line-clamp-1 text-xs text-ink-400">{category.description}</p>
        )}
      </div>

      <div className="flex gap-1">
        <Button type="button" variant="ghost" size="icon" onClick={onEdit} aria-label="Editar categoria">
          <Edit className="h-4 w-4" aria-hidden="true" />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger>
            <Button type="button" variant="ghost" size="icon" aria-label="Excluir categoria" className="text-danger hover:text-danger">
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir "{category.name}"?</AlertDialogTitle>
              <AlertDialogDescription>
                {productCount > 0
                  ? `${productCount} produto${productCount === 1 ? '' : 's'} ficarão sem categoria (não serão deletados).`
                  : 'Esta categoria não tem produtos vinculados.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel />
              <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </li>
  )
}
