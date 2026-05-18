import { useEffect, useState, type FormEvent } from 'react'
import { Edit, ImageIcon, Upload } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { useToast } from '@/components/ui/toast'

import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'

import type { Banner } from '@/types'

type Location = 'home_hero' | 'home_promo' | 'lancamentos'

interface BannerFormState {
  id?: string
  title: string
  subtitle: string
  image_url: string | null
  link: string
  is_active: boolean
  imageFile?: File
}

const EMPTY: BannerFormState = {
  title: '',
  subtitle: '',
  image_url: null,
  link: '',
  is_active: true,
}

const LOCATION_META: Record<Location, { label: string; description: string }> = {
  home_hero:    { label: 'Hero da Home',     description: 'Banner principal acima de tudo na home (vídeo é controlado em Conteúdo).' },
  home_promo:   { label: 'Promoção da Home', description: 'Banner intermediário entre destaques e lançamentos. Auto-oculta se sem banner ativo.' },
  lancamentos:  { label: 'Lançamentos',      description: 'Banner cinematográfico no topo de /lancamentos.' },
}

export default function AdminBanners() {
  const { toast } = useToast()
  const [active, setActive] = useState<Location>('home_hero')
  const [byLocation, setByLocation] = useState<Record<Location, Banner | null>>({
    home_hero: null,
    home_promo: null,
    lancamentos: null,
  })
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BannerFormState>(EMPTY)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Banners — AURI Admin' })
    void fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')
    const list = (data as Banner[] | null) ?? []
    setByLocation({
      home_hero:  list.find(b => b.location === 'home_hero') ?? null,
      home_promo: list.find(b => b.location === 'home_promo') ?? null,
      lancamentos:list.find(b => b.location === 'lancamentos') ?? null,
    })
    setLoading(false)
  }

  function openEdit(location: Location) {
    const existing = byLocation[location]
    if (existing) {
      setEditing({
        id: existing.id,
        title: existing.title ?? '',
        subtitle: existing.subtitle ?? '',
        image_url: existing.image_url,
        link: existing.link ?? '',
        is_active: existing.is_active,
      })
    } else {
      setEditing(EMPTY)
    }
    setModalOpen(true)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      let imageUrl: string | null = editing.image_url
      if (editing.imageFile) {
        const safeName = editing.imageFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
        const path = `${active}/${Date.now()}-${safeName}`
        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(path, editing.imageFile)
        if (uploadError) throw uploadError
        imageUrl = supabase.storage.from('banners').getPublicUrl(path).data.publicUrl
      }

      const payload = {
        title: editing.title.trim() || null,
        subtitle: editing.subtitle.trim() || null,
        image_url: imageUrl,
        link: editing.link.trim() || null,
        location: active,
        is_active: editing.is_active,
        sort_order: 0,
      }

      if (editing.id) {
        const { error } = await supabase.from('banners').update(payload).eq('id', editing.id)
        if (error) throw error
        toast('Banner atualizado', 'success')
      } else {
        // Desativa o anterior dessa location (se houver outro ativo)
        await supabase
          .from('banners')
          .update({ is_active: false })
          .eq('location', active)
          .eq('is_active', true)
        const { error } = await supabase.from('banners').insert(payload)
        if (error) throw error
        toast('Banner criado', 'success')
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

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Banners</h1>
        <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
          Imagens grandes mostradas em cada seção do site público.
        </p>
      </header>

      <Tabs value={active} onValueChange={v => setActive(v as Location)} defaultValue="home_hero">
        <TabsList className="mb-6 grid w-full grid-cols-3 gap-1">
          <TabsTrigger value="home_hero">Hero Home</TabsTrigger>
          <TabsTrigger value="home_promo">Promo Home</TabsTrigger>
          <TabsTrigger value="lancamentos">Lançamentos</TabsTrigger>
        </TabsList>

        {(['home_hero', 'home_promo', 'lancamentos'] as Location[]).map(loc => (
          <TabsContent key={loc} value={loc}>
            <BannerPanel
              location={loc}
              banner={byLocation[loc]}
              loading={loading}
              onEdit={() => openEdit(loc)}
            />
          </TabsContent>
        ))}
      </Tabs>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        maxWidth="max-w-2xl"
        ariaLabel="Editar banner"
      >
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="mb-1 font-serif text-2xl text-ink-800 dark:text-ink-50">
            {LOCATION_META[active].label}
          </h2>
          <p className="mb-4 text-xs text-ink-500">{LOCATION_META[active].description}</p>

          <div className="space-y-4">
            <div>
              <Label htmlFor="b-title">Título</Label>
              <Input
                id="b-title"
                value={editing.title}
                onChange={e => setEditing(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Ex: Lançamentos AURI"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="b-subtitle">Subtítulo</Label>
              <Input
                id="b-subtitle"
                value={editing.subtitle}
                onChange={e => setEditing(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Ex: Presença que marca, agora em novas versões."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="b-link">Link (opcional)</Label>
              <Input
                id="b-link"
                type="url"
                value={editing.link}
                onChange={e => setEditing(prev => ({ ...prev, link: e.target.value }))}
                placeholder="/promocoes ou https://..."
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>Imagem</Label>
              {editing.image_url && (
                <div className="mt-2 overflow-hidden rounded-md">
                  <img src={editing.image_url} alt="" className="h-40 w-full object-cover" />
                </div>
              )}
              <label
                htmlFor="banner-image"
                className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50 p-6 text-center transition-colors hover:border-gold-500 dark:border-ink-700 dark:bg-ink-900"
              >
                <Upload className="h-6 w-6 text-gold-500 dark:text-gold-400" aria-hidden="true" />
                <span className="text-sm">
                  {editing.imageFile ? `Selecionada: ${editing.imageFile.name}` : 'Clique para subir uma nova imagem'}
                </span>
                <span className="text-xs text-ink-400">PNG, JPG ou WebP · até 5 MB · recomendado 1920×800</span>
                <input
                  id="banner-image"
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
                      imageFile: file,
                      image_url: URL.createObjectURL(file),
                    }))
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-ink-100 bg-ink-50 p-3 dark:border-ink-700 dark:bg-ink-900">
              <div>
                <p className="text-sm font-medium">Ativo</p>
                <p className="text-xs text-ink-500">Quando desligado, o banner some do site.</p>
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

interface BannerPanelProps {
  location: Location
  banner: Banner | null
  loading: boolean
  onEdit: () => void
}

function BannerPanel({ location, banner, loading, onEdit }: BannerPanelProps) {
  const meta = LOCATION_META[location]

  return (
    <div className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-serif text-xl text-ink-800 dark:text-ink-50">{meta.label}</h2>
          <p className="mt-1 text-xs text-ink-500">{meta.description}</p>
        </div>
        <Button variant="outline-gold" onClick={onEdit}>
          <Edit className="h-4 w-4" aria-hidden="true" />
          {banner ? 'Editar' : 'Criar'}
        </Button>
      </div>

      {loading ? (
        <Skeleton className="h-48 w-full" />
      ) : !banner ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-ink-200 bg-ink-50 p-12 text-center dark:border-ink-700 dark:bg-ink-900">
          <ImageIcon className="h-10 w-10 text-ink-300 dark:text-ink-600" aria-hidden="true" />
          <p className="text-sm text-ink-500">Nenhum banner ativo. Clique em "Criar" para adicionar.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative overflow-hidden rounded-lg">
            {banner.image_url ? (
              <img src={banner.image_url} alt="" className="h-48 w-full object-cover md:h-64" />
            ) : (
              <div className="flex h-48 w-full items-center justify-center bg-ink-100 text-ink-400 dark:bg-ink-900">
                Sem imagem
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-ink-50">
              <p className="font-serif text-2xl">{banner.title ?? '—'}</p>
              {banner.subtitle && <p className="text-sm text-gold-400">{banner.subtitle}</p>}
            </div>
          </div>
          {banner.link && (
            <p className="text-xs text-ink-500">
              Link: <span className="font-mono text-gold-600 dark:text-gold-400">{banner.link}</span>
            </p>
          )}
        </div>
      )}
    </div>
  )
}
