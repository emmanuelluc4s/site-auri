import { useTheme } from '@/contexts/ThemeContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import StarRating from '@/components/shared/StarRating'
import Spinner from '@/components/shared/Spinner'
import SectionTitle from '@/components/shared/SectionTitle'
import GoldDivider from '@/components/shared/GoldDivider'

const GOLD_SCALE = [
  ['50', '#FBF6E9'],
  ['100', '#F5E9C4'],
  ['200', '#EBD394'],
  ['300', '#E0BC63'],
  ['400', '#D4A53A'],
  ['500', '#C9962C'],
  ['600', '#A87B22'],
  ['700', '#876119'],
  ['800', '#664810'],
  ['900', '#3D2B08'],
] as const

const INK_SCALE = [
  ['50', '#F5F5F5'],
  ['100', '#E5E5E5'],
  ['200', '#C4C4C4'],
  ['300', '#9E9E9E'],
  ['400', '#6E6E6E'],
  ['500', '#3F3F3F'],
  ['600', '#2A2A2A'],
  ['700', '#1A1A1A'],
  ['800', '#0F0F0F'],
  ['900', '#000000'],
] as const

const SEMANTIC = [
  ['success', '#1F8A4C'],
  ['danger',  '#B23A48'],
  ['warning', '#D4A53A'],
  ['info',    '#5A6E8C'],
] as const

function Swatch({ name, hex }: { name: string; hex: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="h-16 w-16 rounded-lg border border-ink-200 dark:border-ink-700"
        style={{ backgroundColor: hex }}
      />
      <div className="text-center">
        <p className="font-mono text-xs font-semibold text-ink-800 dark:text-ink-50">{name}</p>
        <p className="font-mono text-[10px] text-ink-500 dark:text-ink-400">{hex}</p>
      </div>
    </div>
  )
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <h3 className="font-serif text-2xl text-ink-800 dark:text-ink-50">{label}</h3>
      <div>{children}</div>
    </section>
  )
}

export default function DesignSystem() {
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">
      {/* Header */}
      <header className="space-y-4 text-center">
        <h1 className="font-serif text-5xl tracking-tight text-ink-800 dark:text-ink-50 sm:text-6xl">
          AURI · Design System
        </h1>
        <p className="font-serif italic text-gold-500 dark:text-gold-400">Presença que marca.</p>
        <GoldDivider className="mx-auto w-48" />
        <p className="font-sans text-sm text-ink-500 dark:text-ink-300">
          Tema atual: <span className="font-medium">{theme}</span>
        </p>
        <Button variant="outline-gold" size="sm" onClick={toggleTheme}>
          Alternar para {theme === 'light' ? 'dark' : 'light'}
        </Button>
      </header>

      {/* Logo */}
      <Group label="Logo">
        <div className="flex flex-wrap items-end gap-8">
          {[40, 64, 96, 144].map(size => (
            <div key={size} className="flex flex-col items-center gap-2">
              <img
                src="/logo.jpeg"
                alt="AURI"
                className="rounded-full object-contain ring-1 ring-gold-500/40"
                style={{ width: size, height: size }}
              />
              <span className="font-mono text-xs text-ink-500 dark:text-ink-400">{size}px</span>
            </div>
          ))}
        </div>
      </Group>

      {/* Tipografia */}
      <Group label="Tipografia">
        <div className="space-y-6 rounded-xl border border-ink-100 bg-card p-8 dark:border-ink-700">
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-400">Serif · Playfair Display</p>
            <p className="font-serif text-5xl text-ink-800 dark:text-ink-50">Hero h1 · 48px</p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-400">Serif · Section title</p>
            <h2 className="font-serif text-3xl text-ink-800 dark:text-ink-50">Título de seção · 30px</h2>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-400">Serif · italic dourado</p>
            <p className="font-serif italic text-2xl text-gold-500 dark:text-gold-400">Presença que marca.</p>
          </div>
          <GoldDivider />
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-400">Sans · Inter · body</p>
            <p className="text-base text-ink-700 dark:text-ink-200">
              AURI é uma loja online de acessórios e eletrônicos com identidade visual moderna e tecnológica.
            </p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-400">Sans · caption</p>
            <p className="text-sm text-ink-500 dark:text-ink-400">Texto auxiliar em 14px.</p>
          </div>
          <div>
            <p className="mb-1 text-xs uppercase tracking-wider text-ink-400">Gold gradient text</p>
            <p className="gold-gradient-text font-serif text-3xl font-bold">AURI</p>
          </div>
        </div>
      </Group>

      {/* Paletas */}
      <Group label="Paleta — gold">
        <div className="flex flex-wrap gap-4">
          {GOLD_SCALE.map(([n, hex]) => (
            <Swatch key={n} name={n} hex={hex} />
          ))}
        </div>
      </Group>

      <Group label="Paleta — ink">
        <div className="flex flex-wrap gap-4">
          {INK_SCALE.map(([n, hex]) => (
            <Swatch key={n} name={n} hex={hex} />
          ))}
        </div>
      </Group>

      <Group label="Cores semânticas">
        <div className="flex flex-wrap gap-4">
          {SEMANTIC.map(([n, hex]) => (
            <Swatch key={n} name={n} hex={hex} />
          ))}
        </div>
      </Group>

      {/* Botões */}
      <Group label="Buttons">
        <div className="space-y-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-wider text-ink-400">Variantes · md</p>
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="gold">Comprar agora</Button>
              <Button variant="outline-gold">Outline gold</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Saiba mais</Button>
              <Button variant="destructive">Destructive</Button>
            </div>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-wider text-ink-400">Tamanhos · gold</p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="gold" size="sm">Small</Button>
              <Button variant="gold" size="md">Medium</Button>
              <Button variant="gold" size="lg">Large</Button>
            </div>
          </div>
        </div>
      </Group>

      {/* Cards */}
      <Group label="Cards">
        <div className="grid gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card padrão</CardTitle>
              <CardDescription>Borda fina, sombra suave, bordas arredondadas.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ink-700 dark:text-ink-200">
                Conteúdo do card. Tipografia Inter no corpo, Playfair no título.
              </p>
            </CardContent>
          </Card>
          <Card premium>
            <CardHeader>
              <CardTitle className="gold-gradient-text">Card premium</CardTitle>
              <CardDescription>Borda dourada com brilho sutil.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-ink-700 dark:text-ink-200">
                Use para destaques especiais — produtos featured, ofertas exclusivas, etc.
              </p>
            </CardContent>
          </Card>
        </div>
      </Group>

      {/* Badges */}
      <Group label="Badges">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="promo">-25%</Badge>
          <Badge variant="new">Novo</Badge>
          <Badge variant="soldout">Esgotado</Badge>
          <Badge variant="tag">Acessórios</Badge>
          <Badge variant="tag">Perfumes</Badge>
        </div>
      </Group>

      {/* StarRating */}
      <Group label="StarRating">
        <div className="space-y-4">
          <div className="flex items-center gap-6">
            <StarRating rating={5} />
            <StarRating rating={4.5} />
            <StarRating rating={3.5} />
            <StarRating rating={2} />
            <StarRating rating={0} />
          </div>
          <div className="flex items-center gap-6">
            <StarRating rating={4.5} size="sm" />
            <StarRating rating={4.5} size="md" />
            <StarRating rating={4.5} size="lg" />
          </div>
          <div>
            <p className="mb-2 text-xs uppercase tracking-wider text-ink-400">Interativo</p>
            <StarRating rating={3} interactive size="lg" />
          </div>
        </div>
      </Group>

      {/* Spinners */}
      <Group label="Spinner">
        <div className="flex items-center gap-6">
          <Spinner size="sm" />
          <Spinner size="md" />
          <Spinner size="lg" />
        </div>
      </Group>

      {/* SectionTitle */}
      <Group label="SectionTitle">
        <div className="space-y-12">
          <SectionTitle
            title="Alinhado à esquerda"
            subtitle="Subtítulo opcional em sans-serif menor."
          />
          <SectionTitle
            title="Centralizado"
            subtitle="Linha decorativa também central."
            align="center"
          />
        </div>
      </Group>

      {/* GoldDivider */}
      <Group label="GoldDivider">
        <div className="space-y-6">
          <GoldDivider />
          <GoldDivider withDiamond={false} />
        </div>
      </Group>

      <p className="pt-12 text-center font-mono text-xs text-ink-400">
        Esta página é temporária — será removida antes do deploy.
      </p>
    </div>
  )
}
