import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useReviews } from '@/hooks/useReviews'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useBanners } from '@/hooks/useBanners'

// Página temporária — valida visualmente que os hooks estão consumindo o Supabase.
// Será removida antes do deploy final.
export default function DataTest() {
  const { products, loading: pLoading, error: pErr } = useProducts({
    includeMedia: true,
    includeCategory: true,
    limit: 10,
  })
  const { categories, loading: cLoading, error: cErr } = useCategories()
  const { reviews, average, loading: rLoading, error: rErr } = useReviews()
  const { storeInfo, loading: sLoading, error: sErr } = useStoreInfo()
  const { banners, loading: bLoading, error: bErr } = useBanners()

  return (
    <div className="mx-auto max-w-5xl space-y-10 p-8">
      <header className="space-y-2">
        <h1 className="font-serif text-4xl text-gold-500 dark:text-gold-400">
          Teste de Dados — AURI
        </h1>
        <p className="text-sm text-ink-500 dark:text-ink-300">
          Página temporária para validar a integração com o Supabase.
        </p>
      </header>

      <Section title={`Categorias (${cLoading ? '…' : categories.length})`} error={cErr}>
        {JSON.stringify(categories, null, 2)}
      </Section>

      <Section title={`Produtos (${pLoading ? '…' : products.length})`} error={pErr}>
        {JSON.stringify(products, null, 2)}
      </Section>

      <Section title={`Avaliações (${rLoading ? '…' : reviews.length}) · Média: ${average}`} error={rErr}>
        {JSON.stringify(reviews, null, 2)}
      </Section>

      <Section title="Store Info" error={sErr}>
        {sLoading ? 'Carregando…' : JSON.stringify(storeInfo, null, 2)}
      </Section>

      <Section title={`Banners (${bLoading ? '…' : banners.length})`} error={bErr}>
        {JSON.stringify(banners, null, 2)}
      </Section>
    </div>
  )
}

interface SectionProps {
  title: string
  error: string | null
  children: React.ReactNode
}

function Section({ title, error, children }: SectionProps) {
  return (
    <section className="space-y-3">
      <h2 className="font-serif text-2xl text-ink-800 dark:text-ink-50">{title}</h2>
      {error && (
        <p className="rounded-md border border-danger/30 bg-danger/10 px-4 py-2 text-sm text-danger">
          Erro: {error}
        </p>
      )}
      <pre className="max-h-80 overflow-auto rounded-lg bg-ink-800 p-4 font-mono text-xs text-ink-50">
        {children}
      </pre>
    </section>
  )
}
