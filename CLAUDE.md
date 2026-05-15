# CLAUDE.md — Projeto AURI
> Documento de referência para desenvolvimento via Claude Code.
> Leia este arquivo **inteiro** antes de iniciar qualquer módulo.
> Gerado a partir de 100 perguntas respondidas pelo cliente.

---

## 🏪 Visão Geral do Projeto

**AURI** é uma loja online de acessórios e eletrônicos com identidade visual moderna e tecnológica. O site é um catálogo que direciona clientes ao WhatsApp para fechar pedidos, com painel administrativo multi-usuário completo.

| Item | Detalhe |
|---|---|
| Idioma | Português (pt-BR) |
| Público-alvo | Todos os perfis |
| Faixa de preço | R$ 50 a R$ 500 |
| Volume inicial | 11 a 50 produtos |
| Canais de venda | WhatsApp (principal), Instagram, Facebook, OLX |
| Catálogo | Em montagem — cadastro pelo painel após o site pronto |
| Loja física | Somente online |

---

## 🛠️ Stack Tecnológica (Padrão fixo — nunca alterar sem aprovação)

| Camada | Tecnologia |
|---|---|
| Frontend | React + Vite + TypeScript |
| Estilo | Tailwind CSS + shadcn/ui |
| Animações | Framer Motion (sutis: fade, slide) |
| Backend / DB | Supabase (Postgres + Auth + Edge Functions + Storage) |
| Deploy | Vercel |
| Versionamento | GitHub |

> ⚠️ Nunca sugerir tecnologias fora desta stack sem aprovação explícita.

---

## 🎨 Identidade Visual

- **Estilo:** Moderno e tecnológico
- **Logo e paleta:** Já definidos — solicitar assets antes do Módulo 2
- **Animações:** Framer Motion com fade/slide suaves. Sempre respeitar `prefers-reduced-motion`
- **Dark mode:** Suporte a modo escuro/claro (toggle pelo usuário)
- **Tom de voz:** Direto, confiante, moderno
- **Navbar:** Comportamento inteligente — esconde ao rolar para baixo, reaparece ao rolar para cima (hide-on-scroll)

> Antes do **Módulo 2**, solicitar ao cliente: logo (SVG), paleta hex, fontes.

---

## 📦 Categorias de Produtos

Categorias cadastradas no banco — **nunca hardcoded**. Novas categorias adicionadas pelo painel sem alteração de código.

| Categoria | Exemplos |
|---|---|
| Eletrônicos | Fones, smartwatches, gadgets |
| Acessórios | Óculos, carteiras |
| Perfumes | Fragrâncias variadas |
| Outros | Variedade — expansível |

---

## 🗺️ Mapa de Páginas

| Rota | Página |
|---|---|
| `/` | Home |
| `/catalogo` | Catálogo completo com filtros |
| `/categoria/:slug` | Página por categoria com banner e produtos |
| `/produto/:slug` | Detalhes do produto |
| `/promocoes` | Promoções ativas |
| `/lancamentos` | Lançamentos / Novidades |
| `/avaliacoes` | Avaliações de clientes |
| `/quem-somos` | Quem Somos |
| `/fale-conosco` | Fale Conosco |
| `/admin` | Painel administrativo (protegido) |

---

## 📄 Especificação das Páginas

### 1. Home (`/`)
- **Navbar** com hide-on-scroll + logo + links + busca + toggle dark mode
- **Hero** com vídeo de fundo em loop (muted, autoplay), texto sobreposto e CTA para WhatsApp. Vídeo gerenciado pelo admin
- **Seção de categorias** com ícones e link para `/categoria/:slug`
- **Vitrine de destaques** — produtos com `is_featured = true` (máx. 8), grade 3 colunas
- **Banner de promoções** — oculto automaticamente se não houver promoções ativas
- **Seção de lançamentos** — produtos com `is_new = true` (últimos X dias configurável)
- **Prévia de avaliações** — 3 mais recentes + link para `/avaliacoes`
- **Selo de Compra Segura** + ícones de formas de pagamento (meramente visual, sem integração)
- **Botão Voltar ao Topo** fixo (aparece após 300px de scroll)
- **Botões flutuantes** — WhatsApp + Instagram fixos no canto inferior direito
- SEO: meta tags + Open Graph por página

### 2. Catálogo (`/catalogo`)
- Grid 3 colunas (desktop), 2 (tablet), 1 (mobile)
- **Busca em tempo real** com debounce (sugestão automática enquanto digita)
- **Filtros:** categoria, faixa de preço (slider), tags
- **Ordenação:** menor preço, maior preço, mais novos, mais populares
- **Scroll infinito** para carregamento dos produtos
- Estado vazio com sugestão de produtos similares
- Cada card: imagem, nome, preço (R$), badge promoção (preço antigo riscado + % desconto), badge "Novo" se lançamento, badge "Esgotado" se `stock = 0`

### 3. Página de Categoria (`/categoria/:slug`)
- Banner/imagem de capa da categoria (gerenciada pelo admin)
- Título e descrição da categoria
- Grid de produtos filtrados pela categoria
- Mesmos filtros e ordenação do catálogo

### 4. Detalhes do Produto (`/produto/:slug`)
- **Breadcrumb:** Home > Categoria > Nome do Produto
- **Galeria:** fotos + vídeos do YouTube juntos em carrossel com zoom (lightbox ao clicar)
- Vídeos do YouTube embutidos via `<iframe>` na galeria — admin cadastra URL do YouTube
- **Variantes:** seletor de cor e tamanho (quando aplicável). Estoque por variante
- **Contador de estoque:** "Apenas X unidades disponíveis!" quando `stock <= 10`
- **Timer de promoção:** contador regressivo se a promoção tiver `promo_ends_at` definido
- **Preço:** R$ com preço antigo riscado + badge % se em promoção
- **Prova social simulada:** "X pessoas viram isso hoje" — número aleatório por dia gerado via seed baseado no ID do produto + data (mesmo que ninguém acesse, o número muda diariamente)
- **CTA principal:** botão WhatsApp com mensagem: `"Olá! Tenho interesse no produto: [Nome] | Cor: [cor] | Tamanho: [tamanho]"` (inclui variantes selecionadas)
- **Compartilhar:** botões de WhatsApp, Instagram (Stories) e Facebook + copiar link
- **Badge "Novo"** se `is_new = true`
- **Produtos relacionados:** 4 produtos da mesma categoria (carrossel)
- **Comentários do produto:** cadastrados pelo admin manualmente
- **Navegação anterior/próximo:** entre produtos da mesma categoria
- **Quick view:** modal de preview rápido ativado ao passar o mouse no card da vitrine (desktop)

### 5. Promoções (`/promocoes`)
- Produtos com `is_promotion = true` E dentro do período (`promo_starts_at` / `promo_ends_at`)
- Preço antigo riscado + badge % de desconto
- Filtro por categoria (client-side)
- Contador regressivo por produto se tiver data de fim
- Estado vazio elegante se sem promoções ativas

### 6. Lançamentos (`/lancamentos`)
- Produtos com `is_new = true`
- Badge "Novo" automático
- Banner no topo gerenciado pelo admin
- Mesma grade e filtros do catálogo

### 7. Avaliações (`/avaliacoes`)
- Média geral com estrelas no topo
- Grid de cards: nome, estrelas (1–5), comentário, data
- Avaliações gerenciadas pelo admin (cadastro manual)
- CTA de compra ao final

### 8. Quem Somos (`/quem-somos`)
- Texto e imagem institucional (via `store_info`)
- Links para todas as redes sociais

### 9. Fale Conosco (`/fale-conosco`)
- Botões para WhatsApp, Instagram, Facebook e OLX
- Horário de atendimento (via `store_info`)

---

## 🔐 Painel Administrativo (`/admin`)

Multi-usuário com roles. Acesso exclusivo via Supabase Auth.

### Roles
| Role | Permissões |
|---|---|
| `owner` | Tudo, incluindo gerenciar outros admins |
| `editor` | CRUD de produtos, categorias, avaliações, comentários, banners |

### Módulos do Painel

| Rota | Função |
|---|---|
| `/admin/login` | Login com e-mail + senha |
| `/admin` | Dashboard: totais, promoções ativas, lançamentos |
| `/admin/produtos` | Listagem + busca + filtros + ações em lote |
| `/admin/produtos/novo` | Formulário de criação |
| `/admin/produtos/:id` | Formulário de edição |
| `/admin/categorias` | CRUD de categorias com imagem de capa |
| `/admin/avaliacoes` | CRUD de avaliações globais |
| `/admin/comentarios` | CRUD de comentários por produto |
| `/admin/banners` | Gerenciar slides/banners da Home e página de lançamentos |
| `/admin/conteudo` | Editar textos do hero, seções estáticas do site |
| `/admin/loja` | WhatsApp, redes sociais, horário, texto "Quem Somos" |
| `/admin/usuarios` | Gerenciar admins (somente owner) |

### Funcionalidades do Painel de Produtos
- CRUD completo com upload de múltiplas imagens (sem limite) e vídeos do YouTube
- Variantes de cor e tamanho com estoque individual por variante
- Campos: nome, descrição, preço, preço promocional, datas da promoção (`promo_starts_at`, `promo_ends_at`), categoria, tags, is_featured, is_new, is_active
- **Arrastar e soltar** para reordenar produtos (campo `sort_order`)
- **Ações em lote:** duplicar produto, ativar/desativar múltiplos
- Promoção com desativação automática via Supabase Edge Function (cron)

---

## 🗄️ Banco de Dados (Supabase / Postgres)

### `categories`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
name        text NOT NULL
slug        text UNIQUE NOT NULL
icon        text
cover_url   text
description text
created_at  timestamptz DEFAULT now()
```

### `products`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
name            text NOT NULL
slug            text UNIQUE NOT NULL
description     text
price           numeric(10,2) NOT NULL
promo_price     numeric(10,2)
promo_starts_at timestamptz
promo_ends_at   timestamptz
category_id     uuid REFERENCES categories(id) ON DELETE SET NULL
tags            text[]
is_featured     boolean DEFAULT false
is_new          boolean DEFAULT false
is_promotion    boolean DEFAULT false
is_active       boolean DEFAULT true
sort_order      int DEFAULT 0
popularity      int DEFAULT 0        -- incrementado a cada clique no WhatsApp
created_at      timestamptz DEFAULT now()
updated_at      timestamptz DEFAULT now()
```

### `product_media`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id  uuid REFERENCES products(id) ON DELETE CASCADE
type        text CHECK (type IN ('image', 'video')) NOT NULL
url         text NOT NULL            -- URL do Supabase Storage ou YouTube
sort_order  int DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### `product_variants`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id  uuid REFERENCES products(id) ON DELETE CASCADE
color       text
size        text
stock       int DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### `product_comments`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
product_id  uuid REFERENCES products(id) ON DELETE CASCADE
author_name text NOT NULL
comment     text NOT NULL
is_active   boolean DEFAULT true
created_at  timestamptz DEFAULT now()
```

### `reviews`
```sql
id             uuid PRIMARY KEY DEFAULT gen_random_uuid()
customer_name  text NOT NULL
rating         int CHECK (rating BETWEEN 1 AND 5) NOT NULL
comment        text
is_active      boolean DEFAULT true
created_at     timestamptz DEFAULT now()
```

### `banners`
```sql
id          uuid PRIMARY KEY DEFAULT gen_random_uuid()
title       text
subtitle    text
image_url   text
link        text
location    text CHECK (location IN ('home_hero', 'home_promo', 'lancamentos')) NOT NULL
is_active   boolean DEFAULT true
sort_order  int DEFAULT 0
created_at  timestamptz DEFAULT now()
```

### `store_info`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
whatsapp        text NOT NULL
instagram       text
facebook        text
olx             text
about_text      text
about_image_url text
business_hours  text
hero_title      text
hero_subtitle   text
updated_at      timestamptz DEFAULT now()
```

### `admin_users`
```sql
id          uuid PRIMARY KEY REFERENCES auth.users(id)
role        text CHECK (role IN ('owner', 'editor')) DEFAULT 'editor'
name        text
created_at  timestamptz DEFAULT now()
```

### RLS — Segurança
- Leitura pública: `products`, `categories`, `product_media`, `product_variants`, `product_comments`, `reviews`, `banners`, `store_info`
- Escrita: somente `admin_users` autenticados
- `admin_users`: leitura/escrita somente para `owner`
- Supabase Storage bucket `product-images`: upload autenticado, leitura pública

### Edge Function: `auto-deactivate-promotions`
- Cron job diário que define `is_promotion = false` nos produtos onde `promo_ends_at < now()`

---

## 🚀 Módulos de Desenvolvimento

Desenvolva **um módulo por vez**. Só avance após aprovação explícita.

### Módulo 1 — Setup & Estrutura Base
- [ ] `npm create vite@latest auri -- --template react-ts`
- [ ] Instalar e configurar: Tailwind CSS, shadcn/ui, Framer Motion, React Router, Supabase client
- [ ] Criar estrutura de pastas completa
- [ ] Configurar todas as rotas em `App.tsx`
- [ ] Criar `<Navbar />` (hide-on-scroll + dark mode toggle)
- [ ] Criar `<Footer />` completo com links e redes sociais
- [ ] Criar `<WhatsAppButton />` e `<InstagramButton />` flutuantes
- [ ] Criar `<ScrollToTop />` (aparece após 300px)
- [ ] Criar `src/types/index.ts` com todas as interfaces
- [ ] Criar `src/lib/utils.ts` com helpers: `formatPrice`, `calcDiscount`, `buildWhatsAppLink`, `buildShareLinks`
- [ ] Commit: `feat: setup inicial do projeto AURI`

### Módulo 2 — Identidade Visual & Design System
- [ ] ⚠️ Aguardar assets do cliente (logo, paleta, fontes)
- [ ] Aplicar paleta + dark mode em `tailwind.config.ts`
- [ ] Logo no Navbar e Footer
- [ ] Tipografia global + variáveis CSS
- [ ] Componentes base: `Button`, `Card`, `Badge`, `StarRating`, `ProductCard`, `CategoryCard`
- [ ] Variantes de animação reutilizáveis (Framer Motion)
- [ ] Testar responsividade: 375px / 768px / 1280px / dark mode

### Módulo 3 — Banco de Dados & Supabase
- [ ] Criar todas as tabelas (SQL acima)
- [ ] Configurar RLS em todas as tabelas
- [ ] Criar bucket `product-images` e `product-videos` no Storage
- [ ] Edge Function `auto-deactivate-promotions` (cron diário)
- [ ] Seed: 4 categorias, 6 produtos (com variantes), 3 avaliações, 2 banners, 1 store_info
- [ ] Testar todas as queries antes de avançar

### Módulo 4 — Home
- [ ] Hero com vídeo de fundo (YouTube embed ou Storage), texto e CTA
- [ ] Seção de categorias com ícones
- [ ] Grid de destaques (3 colunas, máx. 8 produtos)
- [ ] Banner de promoções (auto-oculto)
- [ ] Seção de lançamentos
- [ ] Prévia de avaliações
- [ ] Selo Compra Segura + formas de pagamento (visual)
- [ ] SEO: meta tags + Open Graph

### Módulo 5 — Catálogo & Busca
- [ ] Página `/catalogo` com grid, scroll infinito e filtros
- [ ] Busca em tempo real com debounce (300ms)
- [ ] Estado vazio com sugestão de produtos similares
- [ ] Filtros: categoria, faixa de preço, tags
- [ ] Ordenação: preço ↑↓, novidade, popularidade
- [ ] Quick view modal no hover do card (desktop)
- [ ] Página `/categoria/:slug` com banner + produtos filtrados

### Módulo 6 — Página de Produto
- [ ] Galeria com carrossel de fotos + vídeos YouTube (lightbox + zoom)
- [ ] Seletor de variantes (cor + tamanho) com estoque por variante
- [ ] Contador "Apenas X unidades!" quando `stock <= 10`
- [ ] Timer regressivo de promoção (se `promo_ends_at` definido)
- [ ] Preço com promoção (riscado + badge %)
- [ ] Prova social simulada (número aleatório por dia via seed produto+data)
- [ ] CTA WhatsApp com nome + variantes na mensagem
- [ ] Botões de compartilhar (WhatsApp, Instagram, Facebook, copiar link)
- [ ] Breadcrumb
- [ ] Produtos relacionados (carrossel, mesma categoria)
- [ ] Comentários do produto
- [ ] Navegação anterior/próximo (mesma categoria)

### Módulo 7 — Promoções & Lançamentos
- [ ] `/promocoes` com timer regressivo por produto e filtro por categoria
- [ ] `/lancamentos` com banner gerenciado + badge "Novo"

### Módulo 8 — Avaliações, Quem Somos & Fale Conosco
- [ ] `/avaliacoes` com média geral e grid de cards
- [ ] `/quem-somos` com conteúdo de `store_info`
- [ ] `/fale-conosco` com botões de canal e horário

### Módulo 9 — Painel Administrativo
- [ ] Login + `<AdminGuard />` + `<AdminLayout />`
- [ ] Dashboard com métricas resumidas
- [ ] CRUD de produtos: formulário completo com upload de mídias, variantes, datas de promoção
- [ ] Drag-and-drop para reordenar produtos (`sort_order`)
- [ ] Ações em lote: duplicar, ativar/desativar múltiplos
- [ ] CRUD de categorias (com imagem de capa)
- [ ] CRUD de avaliações e comentários de produtos
- [ ] Gerenciador de banners (home_hero, home_promo, lancamentos)
- [ ] Editor de conteúdo estático (hero_title, hero_subtitle, textos)
- [ ] Edição de informações da loja
- [ ] Gerenciamento de usuários admin (somente owner)

### Módulo 10 — Deploy & Finalização
- [ ] Configurar variáveis de ambiente na Vercel
- [ ] Deploy + CI/CD via GitHub
- [ ] Smoke test completo em produção
- [ ] Teste de dark mode em todas as páginas
- [ ] Lighthouse: performance ≥ 80, acessibilidade ≥ 90
- [ ] Configurar domínio (quando cliente adquirir)
- [ ] `README.md` com instruções do painel

---

## 🔮 Roadmap Futuro (arquitetar pensando nisso, não implementar agora)

- **Frete:** Integração com Correios/Frenet para todo o Brasil. Campos `weight`, `height`, `width`, `length` já previstos na tabela `products` para adição futura sem quebrar o schema.
- **Pagamento online:** Não planejado. Modelo permanece catálogo + WhatsApp.
- **PWA:** Não planejado para o MVP.
- **Analytics:** Não planejado para o MVP.

---

## 📁 Estrutura de Pastas

```
auri/
├── public/
│   └── logo.svg
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui (gerado)
│   │   ├── layout/
│   │   │   ├── Navbar.tsx         # hide-on-scroll + dark mode toggle
│   │   │   ├── Footer.tsx
│   │   │   └── AdminLayout.tsx
│   │   └── shared/
│   │       ├── ProductCard.tsx    # com quick view no hover
│   │       ├── ProductGallery.tsx # fotos + vídeos YouTube + zoom
│   │       ├── VariantSelector.tsx
│   │       ├── PromoTimer.tsx     # contador regressivo
│   │       ├── SocialProof.tsx    # "X pessoas viram hoje"
│   │       ├── ShareButtons.tsx
│   │       ├── WhatsAppButton.tsx # flutuante
│   │       ├── InstagramButton.tsx# flutuante
│   │       ├── ScrollToTop.tsx
│   │       ├── Breadcrumb.tsx
│   │       ├── StarRating.tsx
│   │       ├── ReviewCard.tsx
│   │       ├── CategoryCard.tsx
│   │       ├── QuickViewModal.tsx
│   │       ├── TrustBadges.tsx    # Compra Segura + pagamentos
│   │       └── AdminGuard.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Catalogo.tsx
│   │   ├── Categoria.tsx          # /categoria/:slug
│   │   ├── Produto.tsx            # /produto/:slug
│   │   ├── Promocoes.tsx
│   │   ├── Lancamentos.tsx
│   │   ├── Avaliacoes.tsx
│   │   ├── QuemSomos.tsx
│   │   ├── FaleConosco.tsx
│   │   └── admin/
│   │       ├── Login.tsx
│   │       ├── Dashboard.tsx
│   │       ├── Products.tsx
│   │       ├── ProductForm.tsx
│   │       ├── Categories.tsx
│   │       ├── Reviews.tsx
│   │       ├── Comments.tsx
│   │       ├── Banners.tsx
│   │       ├── Content.tsx
│   │       ├── StoreInfo.tsx
│   │       └── AdminUsers.tsx
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── utils.ts               # formatPrice, calcDiscount, buildWhatsAppLink,
│   │                              # buildShareLinks, getDailyRandom (prova social)
│   ├── hooks/
│   │   ├── useProducts.ts
│   │   ├── useCategories.ts
│   │   ├── useReviews.ts
│   │   ├── useStoreInfo.ts
│   │   ├── useBanners.ts
│   │   └── useInfiniteScroll.ts
│   ├── types/
│   │   └── index.ts
│   ├── contexts/
│   │   ├── AuthContext.tsx
│   │   └── ThemeContext.tsx        # dark/light mode
│   └── App.tsx
├── supabase/
│   ├── migrations/
│   └── functions/
│       └── auto-deactivate-promotions/
├── .env.local                      # NÃO commitar
├── .env.example                    # Commitar com chaves vazias
├── CLAUDE.md
└── README.md
```

---

## 🔗 Variáveis de Ambiente

```env
# .env.local — nunca commitar
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxx
VITE_WHATSAPP_NUMBER=5500000000000
```

> Formato do WhatsApp: `55` + DDD + número. Ex: `558800000000`

---

## 🧠 Lógica de Negócio Importante

### Prova Social Simulada
```typescript
// Gera número "aleatório" mas consistente por produto por dia
function getDailyRandom(productId: string, min = 10, max = 80): number {
  const seed = productId + new Date().toISOString().split('T')[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return min + Math.abs(hash) % (max - min)
}
```

### Mensagem WhatsApp com Variantes
```typescript
function buildWhatsAppLink(phone: string, product: Product, variant?: Variant): string {
  const variantInfo = variant
    ? ` | Cor: ${variant.color || '-'} | Tamanho: ${variant.size || '-'}`
    : ''
  const msg = `Olá! Tenho interesse no produto: ${product.name}${variantInfo}`
  return `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
}
```

### Cálculo de Desconto
```typescript
function calcDiscount(price: number, promoPrice: number): number {
  return Math.round((1 - promoPrice / price) * 100)
}
```

### Verificação de Promoção Ativa
```typescript
function isPromoActive(product: Product): boolean {
  if (!product.is_promotion || !product.promo_price) return false
  const now = new Date()
  if (product.promo_starts_at && new Date(product.promo_starts_at) > now) return false
  if (product.promo_ends_at && new Date(product.promo_ends_at) < now) return false
  return true
}
```

---

## ✅ Convenções e Boas Práticas

- TypeScript estrito (`strict: true`) — **nunca usar `any`**
- Componentes em PascalCase, hooks em camelCase
- Comentários em português
- Commits semânticos: `feat:`, `fix:`, `chore:`, `refactor:`, `style:`
- Mobile-first — testar em 375px antes de fechar qualquer módulo
- Imagens: WebP, máx. 1MB, via Supabase Storage
- Vídeos: link YouTube — nunca upload de vídeo direto no Storage
- Links WhatsApp: sempre `https://wa.me/{numero}?text={encodeURIComponent(msg)}`
- Nenhuma chave de API no repositório — usar `.env.local`
- Animações sempre com `prefers-reduced-motion` respeitado
- Dark mode via `ThemeContext` + classe `dark` no `<html>`

---

## 📌 Informações Pendentes

| Item | Necessário no Módulo | Status |
|---|---|---|
| Número do WhatsApp | Módulo 1 | ⏳ Aguardando |
| Logo (SVG/PNG) | Módulo 2 | ⏳ Aguardando |
| Paleta de cores (hex) | Módulo 2 | ⏳ Aguardando |
| Fontes da marca | Módulo 2 | ⏳ Aguardando |
| @ Instagram | Módulo 1 | ⏳ Aguardando |
| Link Facebook | Módulo 1 | ⏳ Aguardando |
| Link OLX | Módulo 1 | ⏳ Aguardando |
| E-mail do admin owner | Módulo 9 | ⏳ Aguardando |
| Texto "Quem Somos" | Módulo 8 | ⏳ Aguardando |
| Foto institucional | Módulo 8 | ⏳ Aguardando |
| Horário de atendimento | Módulo 8 | ⏳ Aguardando |
| Vídeo do hero | Módulo 4 | ⏳ Aguardando |
| Fotos dos produtos | Pós-deploy | ⏳ Aguardando |

---

*CLAUDE.md definitivo — Projeto AURI — gerado a partir de 100 perguntas.*
*Atualizar sempre que novas decisões forem tomadas.*
