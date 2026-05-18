import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertCircle,
  Flame,
  ImageIcon,
  Package,
  Plus,
  Sparkles,
  Star,
  Tag,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

import { supabase } from '@/lib/supabase'
import { setSEO } from '@/lib/seo'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardStats {
  totalProducts: number
  activeProducts: number
  promotionsActive: number
  newArrivals: number
  totalReviews: number
  averageRating: number
  lowStockProducts: Array<{ id: string; name: string; stock: number }>
  expiringPromos: Array<{ id: string; name: string; ends_at: string }>
}

interface ProductRow {
  id: string
  is_active: boolean
  is_promotion: boolean
  is_new: boolean
  promo_ends_at: string | null
}

interface VariantWithProduct {
  stock: number
  product: { id: string; name: string } | null
}

interface PromoExpiringRow {
  id: string
  name: string
  promo_ends_at: string | null
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSEO({ title: 'Dashboard — AURI Admin' })
    void fetchStats()
  }, [])

  async function fetchStats() {
    setLoading(true)
    const nowIso = new Date().toISOString()
    const inSevenDaysIso = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

    const [productsRes, reviewsRes, lowStockRes, expiringRes] = await Promise.all([
      supabase.from('products').select('id, is_active, is_promotion, is_new, promo_ends_at'),
      supabase.from('reviews').select('rating').eq('is_active', true),
      supabase
        .from('product_variants')
        .select('stock, product:products(id, name)')
        .lte('stock', 5)
        .gt('stock', 0)
        .limit(5),
      supabase
        .from('products')
        .select('id, name, promo_ends_at')
        .eq('is_promotion', true)
        .eq('is_active', true)
        .not('promo_ends_at', 'is', null)
        .lte('promo_ends_at', inSevenDaysIso)
        .gt('promo_ends_at', nowIso)
        .order('promo_ends_at', { ascending: true })
        .limit(5),
    ])

    const products = (productsRes.data as ProductRow[] | null) ?? []
    const reviews = (reviewsRes.data as Array<{ rating: number }> | null) ?? []
    const avg = reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

    const lowStock = ((lowStockRes.data as unknown as VariantWithProduct[] | null) ?? [])
      .filter(v => v.product)
      .map(v => ({
        id: v.product!.id,
        name: v.product!.name,
        stock: v.stock,
      }))

    const expiring = ((expiringRes.data as PromoExpiringRow[] | null) ?? [])
      .filter(p => p.promo_ends_at !== null)
      .map(p => ({ id: p.id, name: p.name, ends_at: p.promo_ends_at! }))

    setStats({
      totalProducts: products.length,
      activeProducts: products.filter(p => p.is_active).length,
      promotionsActive: products.filter(p =>
        p.is_promotion &&
        p.is_active &&
        (!p.promo_ends_at || new Date(p.promo_ends_at) > new Date()),
      ).length,
      newArrivals: products.filter(p => p.is_new && p.is_active).length,
      totalReviews: reviews.length,
      averageRating: Number(avg.toFixed(1)),
      lowStockProducts: lowStock,
      expiringPromos: expiring,
    })
    setLoading(false)
  }

  return (
    <div>
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-3xl text-ink-800 dark:text-ink-50 md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">Visão geral da AURI</p>
        </div>
        <Link to="/admin/produtos/novo">
          <Button variant="gold">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Novo produto
          </Button>
        </Link>
      </header>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Package} label="Produtos ativos" value={stats?.activeProducts ?? 0} total={stats?.totalProducts} loading={loading} href="/admin/produtos" />
        <StatCard icon={Flame} label="Em promoção" value={stats?.promotionsActive ?? 0} loading={loading} href="/admin/produtos" accent />
        <StatCard icon={Sparkles} label="Lançamentos" value={stats?.newArrivals ?? 0} loading={loading} href="/admin/produtos" />
        <StatCard icon={Star} label="Avaliações" value={stats?.totalReviews ?? 0} subtitle={stats ? `Média: ${stats.averageRating}★` : undefined} loading={loading} href="/admin/avaliacoes" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AlertCard
          icon={Flame}
          title="Promoções expirando em 7 dias"
          loading={loading}
          items={stats?.expiringPromos ?? []}
          emptyMessage="Nenhuma promoção expirando em breve."
          renderItem={p => ({
            label: p.name,
            href: `/admin/produtos/${p.id}`,
            badge: `Expira em ${formatRelativeFuture(p.ends_at)}`,
          })}
        />
        <AlertCard
          icon={AlertCircle}
          title="Variantes com estoque baixo (≤ 5)"
          loading={loading}
          items={stats?.lowStockProducts ?? []}
          emptyMessage="Estoques saudáveis em todas as variantes."
          renderItem={p => ({
            label: p.name,
            href: `/admin/produtos/${p.id}`,
            badge: `${p.stock} unid.`,
          })}
        />
      </div>

      <section className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700">
        <h2 className="mb-4 font-serif text-xl text-ink-800 dark:text-ink-50">Atalhos rápidos</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <QuickLink to="/admin/produtos/novo" icon={Plus} label="Novo produto" />
          <QuickLink to="/admin/categorias" icon={Tag} label="Categorias" />
          <QuickLink to="/admin/banners" icon={ImageIcon} label="Banners" />
          <QuickLink to="/admin/loja" icon={TrendingUp} label="Dados da loja" />
        </div>
      </section>
    </div>
  )
}

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: number
  total?: number
  subtitle?: string
  loading: boolean
  href: string
  accent?: boolean
}

function StatCard({ icon: Icon, label, value, total, subtitle, loading, href, accent }: StatCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        'block rounded-xl border bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-soft',
        accent
          ? 'border-gold-500/40 hover:border-gold-500'
          : 'border-ink-100 hover:border-gold-500/40 dark:border-ink-700',
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            accent ? 'bg-gold-500 text-ink-900' : 'bg-gold-500/10 text-gold-600 dark:text-gold-400',
          )}
        >
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      {loading ? (
        <Skeleton className="mb-1 h-8 w-16" />
      ) : (
        <p className="text-3xl font-bold text-ink-800 dark:text-ink-50">
          {value}
          {total !== undefined && (
            <span className="text-base font-normal text-ink-400"> / {total}</span>
          )}
        </p>
      )}
      <p className="mt-1 text-sm text-ink-500 dark:text-ink-400">{label}</p>
      {subtitle && <p className="mt-1 text-xs text-gold-600 dark:text-gold-400">{subtitle}</p>}
    </Link>
  )
}

interface RenderedAlertItem {
  label: string
  href: string
  badge: string
}

interface AlertCardProps<T> {
  icon: LucideIcon
  title: string
  items: T[]
  loading: boolean
  renderItem: (item: T) => RenderedAlertItem
  emptyMessage: string
}

function AlertCard<T>({ icon: Icon, title, items, loading, renderItem, emptyMessage }: AlertCardProps<T>) {
  let body: ReactNode
  if (loading) {
    body = (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    )
  } else if (items.length === 0) {
    body = <p className="py-6 text-center text-sm text-ink-400">{emptyMessage}</p>
  } else {
    body = (
      <ul className="space-y-2">
        {items.map((item, idx) => {
          const rendered = renderItem(item)
          return (
            <li key={idx}>
              <Link
                to={rendered.href}
                className="flex items-center justify-between gap-2 rounded-lg bg-ink-50 p-3 transition-colors hover:bg-gold-500/10 dark:bg-ink-900"
              >
                <span className="truncate text-sm font-medium">{rendered.label}</span>
                <span className="whitespace-nowrap text-xs font-medium text-gold-600 dark:text-gold-400">
                  {rendered.badge}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    )
  }

  return (
    <section className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700">
      <h2 className="mb-4 flex items-center gap-2 font-serif text-lg text-ink-800 dark:text-ink-50">
        <Icon className="h-5 w-5 text-gold-500 dark:text-gold-400" aria-hidden="true" />
        {title}
      </h2>
      {body}
    </section>
  )
}

interface QuickLinkProps {
  to: string
  icon: LucideIcon
  label: string
}

function QuickLink({ to, icon: Icon, label }: QuickLinkProps) {
  return (
    <Link
      to={to}
      className="flex flex-col items-center gap-2 rounded-lg bg-ink-50 p-4 text-center transition-colors hover:bg-gold-500/10 hover:text-gold-600 dark:bg-ink-900 dark:hover:text-gold-400"
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  )
}

function formatRelativeFuture(date: string): string {
  const diff = new Date(date).getTime() - Date.now()
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  if (days <= 0) return 'hoje'
  if (days === 1) return '1 dia'
  return `${days} dias`
}
