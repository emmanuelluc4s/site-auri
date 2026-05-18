import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
  X,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { calcDiscount, cn, formatPrice, getYouTubeId, slugify } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Spinner from '@/components/shared/Spinner'

import type { Category, ProductMedia, ProductVariant } from '@/types'

interface ProductFormState {
  name: string
  slug: string
  description: string
  price: string
  promo_price: string
  promo_starts_at: string
  promo_ends_at: string
  category_id: string
  tags: string[]
  is_featured: boolean
  is_new: boolean
  is_promotion: boolean
  is_active: boolean
}

interface MediaItem {
  id?: string
  type: 'image' | 'video'
  url: string
  sort_order: number
  file?: File
  isNew?: boolean
  toDelete?: boolean
}

interface VariantItem {
  id?: string
  color: string
  size: string
  stock: number
  isNew?: boolean
  toDelete?: boolean
}

const EMPTY_FORM: ProductFormState = {
  name: '',
  slug: '',
  description: '',
  price: '',
  promo_price: '',
  promo_starts_at: '',
  promo_ends_at: '',
  category_id: '',
  tags: [],
  is_featured: false,
  is_new: false,
  is_promotion: false,
  is_active: true,
}

export default function AdminProductForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { toast } = useToast()
  const isEditing = Boolean(id)

  const [form, setForm] = useState<ProductFormState>(EMPTY_FORM)
  const [media, setMedia] = useState<MediaItem[]>([])
  const [variants, setVariants] = useState<VariantItem[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [youtubeUrlInput, setYoutubeUrlInput] = useState('')

  useEffect(() => {
    setSEO({ title: isEditing ? 'Editar produto — AURI Admin' : 'Novo produto — AURI Admin' })
    void fetchCategories()
    if (isEditing && id) void fetchProduct(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function fetchCategories() {
    const { data } = await supabase.from('categories').select('*').order('name')
    setCategories((data as Category[] | null) ?? [])
  }

  async function fetchProduct(productId: string) {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('*, media:product_media(*), variants:product_variants(*)')
      .eq('id', productId)
      .maybeSingle()
    if (error || !data) {
      toast('Produto não encontrado', 'error')
      navigate('/admin/produtos', { replace: true })
      return
    }
    type Row = {
      name: string
      slug: string
      description: string | null
      price: number
      promo_price: number | null
      promo_starts_at: string | null
      promo_ends_at: string | null
      category_id: string | null
      tags: string[] | null
      is_featured: boolean
      is_new: boolean
      is_promotion: boolean
      is_active: boolean
      media?: ProductMedia[]
      variants?: ProductVariant[]
    }
    const row = data as Row
    setForm({
      name: row.name,
      slug: row.slug,
      description: row.description ?? '',
      price: String(row.price),
      promo_price: row.promo_price !== null ? String(row.promo_price) : '',
      promo_starts_at: row.promo_starts_at?.split('T')[0] ?? '',
      promo_ends_at: row.promo_ends_at?.split('T')[0] ?? '',
      category_id: row.category_id ?? '',
      tags: row.tags ?? [],
      is_featured: row.is_featured,
      is_new: row.is_new,
      is_promotion: row.is_promotion,
      is_active: row.is_active,
    })
    setMedia(
      ((row.media ?? []).slice().sort((a, b) => a.sort_order - b.sort_order)).map(m => ({
        id: m.id,
        type: m.type,
        url: m.url,
        sort_order: m.sort_order,
      })),
    )
    setVariants(
      (row.variants ?? []).map(v => ({
        id: v.id,
        color: v.color ?? '',
        size: v.size ?? '',
        stock: v.stock,
      })),
    )
    setLoading(false)
  }

  // Auto-gerar slug a partir do nome (apenas em modo criação).
  useEffect(() => {
    if (!isEditing && form.name) {
      setForm(prev => ({ ...prev, slug: slugify(form.name) }))
    }
  }, [form.name, isEditing])

  // === Helpers tags ===
  function addTag() {
    const tag = tagInput.trim().toLowerCase()
    if (!tag || form.tags.includes(tag)) {
      setTagInput('')
      return
    }
    setForm(prev => ({ ...prev, tags: [...prev.tags, tag] }))
    setTagInput('')
  }

  function removeTag(tag: string) {
    setForm(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  // === Helpers mídia ===
  function handleImageUpload(files: FileList | null) {
    if (!files) return
    const next: MediaItem[] = []
    for (const file of Array.from(files)) {
      if (file.size > 5 * 1024 * 1024) {
        toast(`"${file.name}" ultrapassa 5MB`, 'error')
        continue
      }
      next.push({
        type: 'image',
        url: URL.createObjectURL(file),
        sort_order: media.length + next.length,
        file,
        isNew: true,
      })
    }
    if (next.length > 0) setMedia(prev => [...prev, ...next])
  }

  function addYouTubeVideo() {
    const url = youtubeUrlInput.trim()
    if (!url) return
    if (!getYouTubeId(url)) {
      toast('URL do YouTube inválida', 'error')
      return
    }
    setMedia(prev => [
      ...prev,
      { type: 'video', url, sort_order: prev.length, isNew: true },
    ])
    setYoutubeUrlInput('')
  }

  function removeMedia(index: number) {
    setMedia(prev =>
      prev.map((m, i) => (i === index ? { ...m, toDelete: true } : m)),
    )
  }

  // === Helpers variantes ===
  function addVariant() {
    setVariants(prev => [...prev, { color: '', size: '', stock: 0, isNew: true }])
  }

  function updateVariant<K extends keyof VariantItem>(index: number, field: K, value: VariantItem[K]) {
    setVariants(prev => prev.map((v, i) => (i === index ? { ...v, [field]: value } : v)))
  }

  function removeVariant(index: number) {
    setVariants(prev =>
      prev.map((v, i) => (i === index ? { ...v, toDelete: true } : v)),
    )
  }

  const visibleMedia = media.filter(m => !m.toDelete)
  const visibleVariants = variants.filter(v => !v.toDelete)

  const totalStock = useMemo(
    () => visibleVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0),
    [visibleVariants],
  )

  const discountPreview = useMemo(() => {
    const price = Number(form.price)
    const promo = Number(form.promo_price)
    if (!price || !promo || promo >= price) return null
    return calcDiscount(price, promo)
  }, [form.price, form.promo_price])

  // === Salvar ===
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Validações
    if (!form.name.trim()) {
      toast('Nome é obrigatório', 'error')
      return
    }
    if (!/^[a-z0-9-]+$/.test(form.slug)) {
      toast('Slug deve conter apenas letras minúsculas, números e hífens', 'error')
      return
    }
    const priceNum = Number(form.price)
    if (!priceNum || priceNum <= 0) {
      toast('Preço inválido', 'error')
      return
    }
    if (form.promo_price) {
      const promoNum = Number(form.promo_price)
      if (promoNum >= priceNum) {
        toast('Preço promocional deve ser menor que o preço', 'error')
        return
      }
    }

    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        slug: form.slug.trim(),
        description: form.description.trim() || null,
        price: priceNum,
        promo_price: form.promo_price ? Number(form.promo_price) : null,
        promo_starts_at: form.promo_starts_at || null,
        promo_ends_at: form.promo_ends_at || null,
        category_id: form.category_id || null,
        tags: form.tags,
        is_featured: form.is_featured,
        is_new: form.is_new,
        is_promotion: form.is_promotion,
        is_active: form.is_active,
      }

      let productId = id
      if (isEditing && id) {
        const { error } = await supabase.from('products').update(payload).eq('id', id)
        if (error) throw error
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert(payload)
          .select('id')
          .single()
        if (error) throw error
        productId = data.id
      }

      if (!productId) throw new Error('Produto sem id após salvar')

      // === Processa mídias ===
      for (let i = 0; i < media.length; i++) {
        const m = media[i]
        if (m.toDelete && m.id) {
          await supabase.from('product_media').delete().eq('id', m.id)
          continue
        }
        if (m.isNew) {
          let finalUrl = m.url
          if (m.file) {
            const safeName = m.file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
            const path = `${productId}/${Date.now()}-${safeName}`
            const { error: uploadError } = await supabase.storage
              .from('product-images')
              .upload(path, m.file, { cacheControl: '31536000' })
            if (uploadError) throw uploadError
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
            finalUrl = urlData.publicUrl
          }
          await supabase.from('product_media').insert({
            product_id: productId,
            type: m.type,
            url: finalUrl,
            sort_order: i,
          })
        } else if (m.id) {
          await supabase.from('product_media').update({ sort_order: i }).eq('id', m.id)
        }
      }

      // === Processa variantes ===
      for (const v of variants) {
        if (v.toDelete && v.id) {
          await supabase.from('product_variants').delete().eq('id', v.id)
          continue
        }
        if (v.isNew) {
          await supabase.from('product_variants').insert({
            product_id: productId,
            color: v.color || null,
            size: v.size || null,
            stock: Number(v.stock) || 0,
          })
        } else if (v.id) {
          await supabase
            .from('product_variants')
            .update({
              color: v.color || null,
              size: v.size || null,
              stock: Number(v.stock) || 0,
            })
            .eq('id', v.id)
        }
      }

      toast(isEditing ? 'Produto atualizado!' : 'Produto criado!', 'success')
      navigate('/admin/produtos')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      toast(`Erro ao salvar: ${message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link to="/admin/produtos">
            <Button type="button" variant="ghost" size="icon" aria-label="Voltar">
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Link>
          <h1 className="font-serif text-2xl text-ink-800 dark:text-ink-50 sm:text-3xl">
            {isEditing ? 'Editar produto' : 'Novo produto'}
          </h1>
        </div>
        <Button type="submit" variant="gold" disabled={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? 'Salvando…' : 'Salvar'}
        </Button>
      </header>

      <Tabs defaultValue="general">
        <TabsList className="mb-6 grid w-full grid-cols-3 gap-1 md:grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="pricing">Preço</TabsTrigger>
          <TabsTrigger value="media">Mídias</TabsTrigger>
          <TabsTrigger value="variants">Variantes</TabsTrigger>
          <TabsTrigger value="visibility">Visibilidade</TabsTrigger>
        </TabsList>

        {/* ABA GERAL */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <div className="space-y-4 p-6">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Fone Bluetooth Premium AURI"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  required
                  value={form.slug}
                  onChange={e => setForm(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="fone-bluetooth-premium-auri"
                  pattern="^[a-z0-9-]+$"
                  className="mt-1.5 font-mono text-xs"
                />
                <p className="mt-1 text-xs text-ink-500">
                  Aparece na URL: /produto/<span className="text-gold-600 dark:text-gold-400">{form.slug || 'seu-slug'}</span>
                </p>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  rows={6}
                  value={form.description}
                  onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o produto em detalhes…"
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <select
                  id="category"
                  value={form.category_id}
                  onChange={e => setForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="mt-1.5 flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm transition-colors focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
                >
                  <option value="">— Sem categoria —</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Tags</Label>
                <div className="mt-1.5 flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full border border-gold-500/40 bg-gold-500/10 px-3 py-1 text-xs font-medium text-gold-700 dark:text-gold-300"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        aria-label={`Remover tag ${tag}`}
                        className="rounded-full text-gold-700 hover:text-danger dark:text-gold-300"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-2 flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Digite uma tag e pressione Enter"
                    className="flex-1"
                  />
                  <Button type="button" variant="outline-gold" onClick={addTag}>
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ABA PREÇO */}
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <div className="space-y-4 p-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.price}
                    onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                    placeholder="299.90"
                    className="mt-1.5 tabular-nums"
                  />
                </div>
                <div>
                  <Label htmlFor="promo_price">Preço promocional (R$)</Label>
                  <Input
                    id="promo_price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.promo_price}
                    onChange={e => setForm(prev => ({ ...prev, promo_price: e.target.value }))}
                    placeholder="opcional"
                    className="mt-1.5 tabular-nums"
                  />
                  {discountPreview !== null && (
                    <p className="mt-1.5 text-xs text-gold-600 dark:text-gold-400">
                      Desconto: -{discountPreview}% (de {formatPrice(Number(form.price))} por {formatPrice(Number(form.promo_price))})
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="promo_start">Início da promoção</Label>
                  <Input
                    id="promo_start"
                    type="date"
                    value={form.promo_starts_at}
                    onChange={e => setForm(prev => ({ ...prev, promo_starts_at: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="promo_end">Fim da promoção</Label>
                  <Input
                    id="promo_end"
                    type="date"
                    value={form.promo_ends_at}
                    onChange={e => setForm(prev => ({ ...prev, promo_ends_at: e.target.value }))}
                    className="mt-1.5"
                  />
                </div>
              </div>

              <SwitchRow
                label="Promoção ativa"
                description={
                  form.promo_price
                    ? 'O preço promocional substitui o normal no site.'
                    : 'Defina um preço promocional para ativar.'
                }
                checked={form.is_promotion}
                disabled={!form.promo_price}
                onCheckedChange={v => setForm(prev => ({ ...prev, is_promotion: v }))}
              />
            </div>
          </Card>
        </TabsContent>

        {/* ABA MÍDIAS */}
        <TabsContent value="media" className="space-y-4">
          <Card>
            <div className="space-y-4 p-6">
              <div>
                <Label>Imagens (máx 5MB cada)</Label>
                <label
                  htmlFor="image-upload"
                  className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50 p-8 text-center transition-colors hover:border-gold-500 dark:border-ink-700 dark:bg-ink-900"
                >
                  <Upload className="h-8 w-8 text-gold-500 dark:text-gold-400" aria-hidden="true" />
                  <span className="text-sm font-medium">Clique para fazer upload</span>
                  <span className="text-xs text-ink-400">PNG, JPG, WebP ou SVG · até 5 MB</span>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/jpeg,image/png,image/webp,image/svg+xml"
                    onChange={e => handleImageUpload(e.target.files)}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <Label htmlFor="yt-url">Adicionar vídeo do YouTube</Label>
                <div className="mt-1.5 flex gap-2">
                  <Input
                    id="yt-url"
                    type="url"
                    value={youtubeUrlInput}
                    onChange={e => setYoutubeUrlInput(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="flex-1"
                  />
                  <Button type="button" variant="outline-gold" onClick={addYouTubeVideo}>
                    <Video className="h-4 w-4" aria-hidden="true" />
                    Adicionar
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm font-medium">
                  {visibleMedia.length} mídia{visibleMedia.length === 1 ? '' : 's'}
                  {visibleMedia.length > 0 && (
                    <span className="ml-2 text-xs text-ink-500">
                      ({visibleMedia.filter(m => m.type === 'image').length} foto{visibleMedia.filter(m => m.type === 'image').length === 1 ? '' : 's'} ·
                      {' '}{visibleMedia.filter(m => m.type === 'video').length} vídeo{visibleMedia.filter(m => m.type === 'video').length === 1 ? '' : 's'})
                    </span>
                  )}
                </p>
                {visibleMedia.length === 0 ? (
                  <p className="rounded-md border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400 dark:border-ink-700">
                    Nenhuma mídia adicionada ainda.
                  </p>
                ) : (
                  <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                    {media.map((m, idx) => {
                      if (m.toDelete) return null
                      return (
                        <li key={(m.id ?? 'new') + idx} className="group relative aspect-square overflow-hidden rounded-lg bg-ink-100 dark:bg-ink-900">
                          {m.type === 'image' ? (
                            <img src={m.url} alt="" className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-ink-800 text-gold-400">
                              <Video className="h-10 w-10" aria-hidden="true" />
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeMedia(idx)}
                            aria-label="Remover mídia"
                            className="absolute right-1.5 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ink-900/80 text-danger opacity-0 transition-opacity hover:bg-ink-900 group-hover:opacity-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                          {m.isNew && (
                            <span className="absolute left-1.5 top-1.5 rounded bg-gold-500 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-900">
                              Novo
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* ABA VARIANTES */}
        <TabsContent value="variants" className="space-y-4">
          <Card>
            <div className="space-y-4 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Variantes</Label>
                  <p className="text-xs text-ink-500">
                    {visibleVariants.length} variante{visibleVariants.length === 1 ? '' : 's'} · {totalStock} unidades no total
                  </p>
                </div>
                <Button type="button" variant="outline-gold" size="sm" onClick={addVariant}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Adicionar
                </Button>
              </div>

              {visibleVariants.length === 0 ? (
                <p className="rounded-md border border-dashed border-ink-200 p-6 text-center text-sm text-ink-400 dark:border-ink-700">
                  Sem variantes. Produtos sem variantes não exibem seletor de cor/tamanho.
                </p>
              ) : (
                <div className="space-y-2">
                  {variants.map((v, idx) => {
                    if (v.toDelete) return null
                    return (
                      <div
                        key={(v.id ?? 'new') + idx}
                        className="grid grid-cols-[1fr_1fr_100px_auto] items-center gap-2 rounded-md border border-ink-100 bg-ink-50 p-2 dark:border-ink-700 dark:bg-ink-900"
                      >
                        <Input
                          placeholder="Cor (ex: Preto)"
                          value={v.color}
                          onChange={e => updateVariant(idx, 'color', e.target.value)}
                          className="h-9"
                        />
                        <Input
                          placeholder="Tamanho (ex: M)"
                          value={v.size}
                          onChange={e => updateVariant(idx, 'size', e.target.value)}
                          className="h-9"
                        />
                        <Input
                          type="number"
                          min="0"
                          placeholder="Estoque"
                          value={v.stock}
                          onChange={e => updateVariant(idx, 'stock', Number(e.target.value))}
                          className="h-9 tabular-nums"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeVariant(idx)}
                          aria-label="Remover variante"
                          className="text-danger hover:text-danger"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* ABA VISIBILIDADE */}
        <TabsContent value="visibility" className="space-y-4">
          <Card>
            <div className="space-y-1 p-6">
              <SwitchRow
                label="Em destaque"
                description="Aparece na vitrine da Home (até 8 produtos)."
                checked={form.is_featured}
                onCheckedChange={v => setForm(prev => ({ ...prev, is_featured: v }))}
              />
              <SwitchRow
                label="Lançamento"
                description="Marcado como 'Novo' nos cards e aparece em /lancamentos."
                checked={form.is_new}
                onCheckedChange={v => setForm(prev => ({ ...prev, is_new: v }))}
              />
              <SwitchRow
                label="Visível no site"
                description="Quando desligado, o produto fica oculto para o público mas continua editável."
                checked={form.is_active}
                onCheckedChange={v => setForm(prev => ({ ...prev, is_active: v }))}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-xl border border-ink-100 bg-card dark:border-ink-700', className)}>
      {children}
    </div>
  )
}

interface SwitchRowProps {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

function SwitchRow({ label, description, checked, onCheckedChange, disabled }: SwitchRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-ink-800 dark:text-ink-50">{label}</p>
        <p className="text-xs text-ink-500 dark:text-ink-400">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} disabled={disabled} />
    </div>
  )
}
