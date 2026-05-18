import { useEffect, useState, type FormEvent } from 'react'
import { MessageCircle, Phone, Save, ShoppingBag } from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { useToast } from '@/components/ui/toast'
import { FacebookIcon, InstagramIcon } from '@/components/shared/BrandIcons'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'

import type { StoreInfo } from '@/types'

interface StoreFormState {
  whatsapp: string
  instagram: string
  facebook: string
  olx: string
  business_hours: string
}

const EMPTY: StoreFormState = {
  whatsapp: '',
  instagram: '',
  facebook: '',
  olx: '',
  business_hours: '',
}

export default function AdminStoreInfo() {
  const { toast } = useToast()
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [form, setForm] = useState<StoreFormState>(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setSEO({ title: 'Loja — AURI Admin' })
    void fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    const { data } = await supabase.from('store_info').select('*').limit(1).maybeSingle()
    const row = data as StoreInfo | null
    if (row) {
      setStoreInfo(row)
      setForm({
        whatsapp: row.whatsapp ?? '',
        instagram: row.instagram ?? '',
        facebook: row.facebook ?? '',
        olx: row.olx ?? '',
        business_hours: row.business_hours ?? '',
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
    // Validação simples: WhatsApp só dígitos
    const cleanedWhatsapp = form.whatsapp.replace(/\D/g, '')
    if (!cleanedWhatsapp || cleanedWhatsapp.length < 12) {
      toast('WhatsApp inválido (use 55 + DDD + número, ex: 5588999998888)', 'error')
      return
    }

    setSaving(true)
    const payload = {
      whatsapp: cleanedWhatsapp,
      instagram: form.instagram.trim() || null,
      facebook: form.facebook.trim() || null,
      olx: form.olx.trim() || null,
      business_hours: form.business_hours.trim() || null,
    }
    const { error } = await supabase.from('store_info').update(payload).eq('id', storeInfo.id)
    setSaving(false)

    if (error) {
      toast(`Erro: ${error.message}`, 'error')
      return
    }
    toast('Informações da loja atualizadas', 'success')
    void fetchData()
  }

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
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Loja</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">
            Canais de atendimento e horário de funcionamento
          </p>
        </div>
        <Button type="submit" variant="gold" disabled={saving}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {saving ? 'Salvando…' : 'Salvar'}
        </Button>
      </header>

      <div className="space-y-6">
        <section className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700">
          <h2 className="mb-4 font-serif text-xl text-ink-800 dark:text-ink-50">Canais de contato</h2>

          <div className="space-y-4">
            <ChannelField
              id="wa"
              icon={<Phone className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden="true" />}
              label="WhatsApp"
              hint="Formato: 55 + DDD + número (sem espaços ou traços). Ex: 5588999998888"
              value={form.whatsapp}
              onChange={v => setForm(prev => ({ ...prev, whatsapp: v }))}
              placeholder="5588999998888"
            />

            <ChannelField
              id="ig"
              icon={<InstagramIcon className="h-4 w-4 text-gold-600 dark:text-gold-400" />}
              label="Instagram"
              hint="URL completa do perfil"
              value={form.instagram}
              onChange={v => setForm(prev => ({ ...prev, instagram: v }))}
              placeholder="https://instagram.com/seuusuario"
            />

            <ChannelField
              id="fb"
              icon={<FacebookIcon className="h-4 w-4 text-gold-600 dark:text-gold-400" />}
              label="Facebook"
              hint="URL completa da página"
              value={form.facebook}
              onChange={v => setForm(prev => ({ ...prev, facebook: v }))}
              placeholder="https://facebook.com/suapagina"
            />

            <ChannelField
              id="olx"
              icon={<ShoppingBag className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden="true" />}
              label="OLX"
              hint="URL completa do perfil ou loja"
              value={form.olx}
              onChange={v => setForm(prev => ({ ...prev, olx: v }))}
              placeholder="https://olx.com.br/..."
            />
          </div>
        </section>

        <section className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700">
          <h2 className="mb-4 font-serif text-xl text-ink-800 dark:text-ink-50">Horário de atendimento</h2>
          <Textarea
            rows={4}
            value={form.business_hours}
            onChange={e => setForm(prev => ({ ...prev, business_hours: e.target.value }))}
            placeholder={`Segunda a sexta: 9h às 18h\nSábado: 9h às 13h`}
          />
          <p className="mt-1 text-xs text-ink-500">
            Quebras de linha são respeitadas. Aparece em /fale-conosco e no rodapé do site.
          </p>
        </section>

        <section className="rounded-xl border border-gold-500/30 bg-gold-500/5 p-6">
          <h3 className="mb-2 flex items-center gap-2 font-serif text-base text-ink-800 dark:text-ink-50">
            <MessageCircle className="h-4 w-4 text-gold-600 dark:text-gold-400" aria-hidden="true" />
            Preview do botão WhatsApp
          </h3>
          <p className="text-xs text-ink-500">
            Mensagem que será enviada ao clicar em "Comprar pelo WhatsApp":
          </p>
          <code className="mt-2 block rounded bg-ink-900 px-3 py-2 font-mono text-xs text-gold-400">
            https://wa.me/{form.whatsapp.replace(/\D/g, '') || '<vazio>'}
          </code>
        </section>
      </div>
    </form>
  )
}

interface ChannelFieldProps {
  id: string
  icon: React.ReactNode
  label: string
  hint: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

function ChannelField({ id, icon, label, hint, value, onChange, placeholder }: ChannelFieldProps) {
  return (
    <div>
      <Label htmlFor={id} className="flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Input
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="mt-1.5"
      />
      <p className="mt-1 text-xs text-ink-500">{hint}</p>
    </div>
  )
}
