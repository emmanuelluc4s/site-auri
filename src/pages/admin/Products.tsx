import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Copy,
  Edit,
  Eye,
  EyeOff,
  GripVertical,
  MoreVertical,
  Plus,
  Search,
  Trash2,
} from 'lucide-react'
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
import { cn, formatPrice } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

import type { Category, Product } from '@/types'

type AdminProduct = Product & { media?: Array<{ url: string }> }

type FilterType = 'all' | 'active' | 'inactive' | 'promo' | 'new'

export default function AdminProducts() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [products, setProducts] = useState<AdminProduct[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  useEffect(() => {
    setSEO({ title: 'Produtos — AURI Admin' })
    void fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const [prodRes, catRes] = await Promise.all([
      supabase
        .from('products')
        .select('*, media:product_media(url)')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ])
    setProducts((prodRes.data as AdminProduct[] | null) ?? [])
    setCategories((catRes.data as Category[] | null) ?? [])
    setLoading(false)
  }

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoryFilter && p.category_id !== categoryFilter) return false
      if (filter === 'active' && !p.is_active) return false
      if (filter === 'inactive' && p.is_active) return false
      if (filter === 'promo' && !p.is_promotion) return false
      if (filter === 'new' && !p.is_new) return false
      return true
    })
  }, [products, search, filter, categoryFilter])

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = filteredProducts.findIndex(p => p.id === active.id)
    const newIndex = filteredProducts.findIndex(p => p.id === over.id)
    if (oldIndex === -1 || newIndex === -1) return

    const reordered = arrayMove(filteredProducts, oldIndex, newIndex)

    // Optimistic UI: aplica nova ordem imediatamente
    setProducts(prev => {
      const map = new Map(reordered.map((p, idx) => [p.id, idx]))
      const others = prev.filter(p => !map.has(p.id))
      return [...reordered, ...others]
    })

    // Persiste sort_order no banco em paralelo
    const updates = reordered.map((p, idx) =>
      supabase.from('products').update({ sort_order: idx }).eq('id', p.id),
    )
    const results = await Promise.all(updates)
    const hasError = results.some(r => r.error)
    if (hasError) {
      toast('Erro ao reordenar. Recarregando…', 'error')
      void fetchData()
    } else {
      toast('Ordem atualizada', 'success')
    }
  }

  async function handleDelete(id: string, name: string) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) {
      toast('Erro ao excluir produto', 'error')
      return
    }
    setProducts(prev => prev.filter(p => p.id !== id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    toast(`"${name}" excluído`, 'success')
  }

  async function handleToggleActive(product: AdminProduct) {
    const newActive = !product.is_active
    const { error } = await supabase
      .from('products')
      .update({ is_active: newActive })
      .eq('id', product.id)
    if (error) {
      toast('Erro ao atualizar', 'error')
      return
    }
    setProducts(prev => prev.map(p => (p.id === product.id ? { ...p, is_active: newActive } : p)))
    toast(`Produto ${newActive ? 'ativado' : 'desativado'}`, 'success')
  }

  async function handleDuplicate(product: AdminProduct) {
    // Remove campos que não vão pro insert
    const {
      id: _id,
      created_at: _ca,
      updated_at: _ua,
      slug,
      media: _m,
      category: _c,
      variants: _v,
      comments: _co,
      ...rest
    } = product as AdminProduct & { category?: unknown; variants?: unknown; comments?: unknown }
    const newSlug = `${slug}-copia-${Date.now()}`
    const { data, error } = await supabase
      .from('products')
      .insert({ ...rest, name: `${product.name} (cópia)`, slug: newSlug, is_active: false })
      .select('id')
      .single()
    if (error || !data) {
      toast(`Erro ao duplicar: ${error?.message ?? 'desconhecido'}`, 'error')
      return
    }
    toast('Produto duplicado (criado como inativo)', 'success')
    navigate(`/admin/produtos/${data.id}`)
  }

  async function handleBulkToggle(active: boolean) {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    const { error } = await supabase.from('products').update({ is_active: active }).in('id', ids)
    if (error) {
      toast('Erro nas alterações em lote', 'error')
      return
    }
    setProducts(prev => prev.map(p => (ids.includes(p.id) ? { ...p, is_active: active } : p)))
    setSelectedIds(new Set())
    toast(`${ids.length} produto${ids.length === 1 ? '' : 's'} ${active ? 'ativado' : 'desativado'}${ids.length === 1 ? '' : 's'}`, 'success')
  }

  async function handleBulkDelete() {
    const ids = Array.from(selectedIds)
    if (ids.length === 0) return
    const { error } = await supabase.from('products').delete().in('id', ids)
    if (error) {
      toast('Erro ao excluir em lote', 'error')
      return
    }
    setProducts(prev => prev.filter(p => !ids.includes(p.id)))
    setSelectedIds(new Set())
    toast(`${ids.length} produto${ids.length === 1 ? '' : 's'} excluído${ids.length === 1 ? '' : 's'}`, 'success')
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)))
    }
  }

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Produtos</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            {filteredProducts.length} de {products.length} produto{products.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link to="/admin/produtos/novo">
          <Button variant="gold">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo produto
          </Button>
        </Link>
      </header>

      {/* Filtros */}
      <div className="mb-4 rounded-xl border border-ink-100 bg-card p-4 dark:border-ink-700">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_200px_200px]">
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              aria-hidden="true"
            />
            <Input
              placeholder="Buscar por nome..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
              aria-label="Buscar produto por nome"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            aria-label="Filtrar por categoria"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          >
            <option value="">Todas as categorias</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as FilterType)}
            aria-label="Filtrar por status"
            className="h-10 rounded-md border border-input bg-background px-3 text-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
          >
            <option value="all">Todos os status</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
            <option value="promo">Em promoção</option>
            <option value="new">Lançamentos</option>
          </select>
        </div>
      </div>

      {/* Barra de ações em lote */}
      {selectedIds.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-col gap-2 rounded-lg border border-gold-500/30 bg-gold-500/10 p-3 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm font-medium text-ink-800 dark:text-ink-100">
            {selectedIds.size} produto{selectedIds.size === 1 ? '' : 's'} selecionado{selectedIds.size === 1 ? '' : 's'}
          </p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="ghost" onClick={() => handleBulkToggle(true)}>
              Ativar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => handleBulkToggle(false)}>
              Desativar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger>
                <Button size="sm" variant="ghost" className="text-danger hover:text-danger">
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir {selectedIds.size} produto{selectedIds.size === 1 ? '' : 's'}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Os produtos serão removidos permanentemente do banco.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel />
                  <AlertDialogAction onClick={handleBulkDelete}>Excluir</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())}>
              Limpar
            </Button>
          </div>
        </motion.div>
      )}

      {/* Tabela */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-xl border border-ink-100 bg-card p-12 text-center dark:border-ink-700">
          <p className="text-sm text-ink-500 dark:text-ink-400">
            {products.length === 0
              ? 'Nenhum produto cadastrado. Crie o primeiro pelo botão acima.'
              : 'Nenhum produto encontrado com esses filtros.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-ink-100 bg-card dark:border-ink-700">
          {/* Cabeçalho da tabela com select-all */}
          <div className="flex items-center gap-3 border-b border-ink-100 bg-ink-50 px-4 py-2 text-xs uppercase tracking-[0.14em] text-ink-500 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-400">
            <span className="w-5" aria-hidden="true" />
            <Checkbox
              checked={selectedIds.size > 0 && selectedIds.size === filteredProducts.length}
              onCheckedChange={toggleSelectAll}
              aria-label="Selecionar todos"
            />
            <span className="w-12" aria-hidden="true" />
            <span className="flex-1">Produto</span>
            <span className="hidden md:block">Preço</span>
            <span className="w-9" aria-hidden="true" />
          </div>

          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={filteredProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
              {filteredProducts.map(product => (
                <SortableProductRow
                  key={product.id}
                  product={product}
                  selected={selectedIds.has(product.id)}
                  onToggleSelect={() => toggleSelect(product.id)}
                  onToggleActive={() => handleToggleActive(product)}
                  onDuplicate={() => handleDuplicate(product)}
                  onDelete={() => handleDelete(product.id, product.name)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  )
}

interface RowProps {
  product: AdminProduct
  selected: boolean
  onToggleSelect: () => void
  onToggleActive: () => void
  onDuplicate: () => void
  onDelete: () => void
}

function SortableProductRow({ product, selected, onToggleSelect, onToggleActive, onDuplicate, onDelete }: RowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: product.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const image = product.media?.[0]?.url

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-3 border-b border-ink-100 p-4 transition-colors last:border-b-0 hover:bg-ink-50 dark:border-ink-700 dark:hover:bg-ink-900',
        selected && 'bg-gold-500/5',
      )}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label="Arrastar para reordenar"
        className="cursor-grab text-ink-400 hover:text-gold-600 active:cursor-grabbing dark:hover:text-gold-400"
      >
        <GripVertical className="h-5 w-5" aria-hidden="true" />
      </button>

      <Checkbox checked={selected} onCheckedChange={onToggleSelect} aria-label={`Selecionar ${product.name}`} />

      <div className="h-12 w-12 shrink-0 overflow-hidden rounded bg-ink-100 dark:bg-ink-900">
        {image ? (
          <img src={image} alt="" loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-[10px] text-ink-400">
            Sem foto
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <Link
          to={`/admin/produtos/${product.id}`}
          className="block truncate font-medium text-ink-800 transition-colors hover:text-gold-600 dark:text-ink-50 dark:hover:text-gold-400"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-1.5">
          {product.is_promotion && <Badge variant="promo">Promo</Badge>}
          {product.is_new && <Badge variant="new">Novo</Badge>}
          {product.is_featured && <Badge variant="tag">Destaque</Badge>}
          {!product.is_active && <Badge variant="soldout">Inativo</Badge>}
        </div>
      </div>

      <div className="hidden text-right md:block">
        <p className="text-sm font-medium tabular-nums text-ink-800 dark:text-ink-50">
          {formatPrice(product.price)}
        </p>
        {product.promo_price && (
          <p className="text-xs tabular-nums text-gold-600 dark:text-gold-400">
            → {formatPrice(product.promo_price)}
          </p>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button variant="ghost" size="icon" aria-label="Ações do produto">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem to={`/admin/produtos/${product.id}`}>
            <Edit className="h-4 w-4" aria-hidden="true" /> Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onDuplicate}>
            <Copy className="h-4 w-4" aria-hidden="true" /> Duplicar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onToggleActive}>
            {product.is_active ? (
              <>
                <EyeOff className="h-4 w-4" aria-hidden="true" /> Desativar
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" aria-hidden="true" /> Ativar
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger>
              <DropdownMenuItem
                onSelect={e => e.preventDefault()}
                className="text-danger hover:bg-danger/10 hover:text-danger"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Excluir
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir produto?</AlertDialogTitle>
                <AlertDialogDescription>
                  "{product.name}" será removido permanentemente. Esta ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel />
                <AlertDialogAction onClick={onDelete}>Excluir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
