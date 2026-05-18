import { useEffect, useState, type FormEvent } from 'react'
import { Save, Upload, Video } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { getYouTubeId } from '@/lib/utils'
import { useToast } from '@/components/ui/toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'

import type { StoreInfo } from '@/types'

interface ContentFormState {
  hero_title: string
  hero_subtitle: string
  hero_video_url: string
  about_text: string
  about_image_url: string | null
}

const EMPTY: ContentFormState = {
  hero_title: '',
  hero_subtitle: '',
  hero_video_url: '',
  about_text: '',
  about_image_url: null,
}

export default function AdminContent() {
  const { toast } = useToast()
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [form, setForm] = useState<ContentFormState>(EMPTY)
  const [aboutFile, setAboutFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Conteúdo — AURI Admin' })
    void fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('store_info').select('*').limit(1).maybeSingle()
    const row = data as StoreInfo | null
    if (row) {
      setStoreInfo(row)
      setForm({
        hero_title: row.hero_title ?? '',
        hero_subtitle: row.hero_subtitle ?? '',
        hero_video_url: row.hero_video_url ?? '',
        about_text: row.about_text ?? '',
        about_image_url: row.about_image_url,
      })
    }
    setLoading(false)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!storeInfo) {
      toast('Registro store_info não encontrado', 'error')
      return
    }

    setSaving(true)
    try {
      let aboutImageUrl: string | null = form.about_image_url
      if (aboutFile) {
        const safeName = aboutFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '_')
        const path = `about/${Date.now()}-${safeName}`
        const { error: uploadError } = await supabase.storage
          .from('banners')
          .upload(path, aboutFile)
        if (uploadError) throw uploadError
        aboutImageUrl = supabase.storage.from('banners').getPublicUrl(path).data.publicUrl
      }

      const payload = {
        hero_title: form.hero_title.trim() || null,
        hero_subtitle: form.hero_subtitle.trim() || null,
        hero_video_url: form.hero_video_url.trim() || null,
        about_text: form.about_text.trim() || null,
        about_image_url: aboutImageUrl,
      }

      const { error } = await supabase.from('store_info').update(payload).eq('id', storeInfo.id)
      if (error) throw error

      toast('Conteúdo atualizado', 'success')
      setAboutFile(null)
      void fetchData()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      toast(`Erro: ${message}`, 'error')
    } finally {
      setSaving(false)
    }
  }

  const youtubeId = form.hero_video_url ? getYouTubeId(form.hero_video_url) : null

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Conteúdo</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Textos e mídias dinâmicas das páginas públicas
          </p>
        </div>
        <Button type="submit" variant="gold" disabled={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? 'Salvando…' : 'Salvar'}
        </Button>
      </header>

      <div className="space-y-6">
        <section className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700">
          <h2 className="mb-4 font-serif text-xl text-ink-800 dark:text-ink-50">Hero da Home</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ht">Título do hero</Label>
              <Input
                id="ht"
                value={form.hero_title}
                onChange={e => setForm(prev => ({ ...prev, hero_title: e.target.value }))}
                placeholder="Ex: AURI"
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="hs">Subtítulo (slogan)</Label>
              <Input
                id="hs"
                value={form.hero_subtitle}
                onChange={e => setForm(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                placeholder="Ex: Presença que marca."
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="hv">URL do vídeo do hero (YouTube)</Label>
              <Input
                id="hv"
                type="url"
                value={form.hero_video_url}
                onChange={e => setForm(prev => ({ ...prev, hero_video_url: e.target.value }))}
                placeholder="https://www.youtube.com/watch?v=..."
                className="mt-1.5"
              />
              {form.hero_video_url && !youtubeId && (
                <p className="mt-1 text-xs text-danger">URL inválida — use um link do YouTube.</p>
              )}
              {youtubeId && (
                <div className="mt-3 overflow-hidden rounded-lg">
                  <div className="relative aspect-video w-full max-w-sm bg-ink-900">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
                      title="Preview do vídeo"
                      allow="accelerometer; encrypted-media; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink-500">
                    <Video className="mr-1 inline h-3 w-3" aria-hidden="true" />
                    Preview do vídeo que será exibido como background do hero.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700">
          <h2 className="mb-4 font-serif text-xl text-ink-800 dark:text-ink-50">Quem Somos</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="at">Texto institucional</Label>
              <Textarea
                id="at"
                rows={8}
                value={form.about_text}
                onChange={e => setForm(prev => ({ ...prev, about_text: e.target.value }))}
                placeholder="História da marca, propósito, valores…"
                className="mt-1.5"
              />
              <p className="mt-1 text-xs text-ink-500">
                Use parágrafos separados por linha em branco. Aparece em /quem-somos na seção "Nossa essência".
              </p>
            </div>

            <div>
              <Label>Imagem institucional</Label>
              {form.about_image_url && (
                <div className="mt-2 overflow-hidden rounded-md">
                  <img src={form.about_image_url} alt="" className="h-48 w-full object-cover" />
                </div>
              )}
              <label
                htmlFor="about-img"
                className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-ink-200 bg-ink-50 p-6 text-center transition-colors hover:border-gold-500 dark:border-ink-700 dark:bg-ink-900"
              >
                <Upload className="h-6 w-6 text-gold-500 dark:text-gold-400" aria-hidden="true" />
                <span className="text-sm">
                  {aboutFile ? `Selecionada: ${aboutFile.name}` : 'Clique para subir uma imagem'}
                </span>
                <span className="text-xs text-ink-400">PNG, JPG ou WebP · até 5 MB · recomendado retrato 4:5</span>
                <input
                  id="about-img"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={e => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    if (file.size > 5 * 1024 * 1024) {
                      toast('Arquivo ultrapassa 5MB', 'error')
                      return
                    }
                    setAboutFile(file)
                    setForm(prev => ({ ...prev, about_image_url: URL.createObjectURL(file) }))
                  }}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  )
}
