# AURI

Loja online de acessórios e eletrônicos — catálogo com checkout via WhatsApp e painel administrativo multi-usuário.

## Stack

React 19 + Vite 8 + TypeScript 6 · Tailwind CSS 3 + shadcn/ui · Framer Motion · React Router 7 · Supabase (Postgres + Auth + Storage + Edge Functions) · Deploy na Vercel.

## Pré-requisitos

- Node.js LTS (24+) e npm 11+
- Conta no Supabase (Módulo 3 em diante)
- Conta na Vercel (Módulo 10)

## Configuração local

```bash
# Copiar o template das variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY e VITE_WHATSAPP_NUMBER

# Instalar dependências
npm install

# Subir o dev server (http://localhost:5173)
npm run dev
```

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o dev server do Vite na porta 5173 |
| `npm run build` | Type-check + build de produção em `dist/` |
| `npm run preview` | Pré-visualiza o build de produção |
| `npm run lint` | ESLint em todo o projeto |
| `npm run typecheck` | `tsc -b --noEmit` (apenas valida tipos) |

## Estrutura

```
src/
├── components/
│   ├── layout/   # Navbar, Footer, AdminLayout
│   ├── shared/   # ProductCard, Galeria, BrandIcons, AdminGuard, etc.
│   └── ui/       # Componentes shadcn/ui (gerados no Módulo 2)
├── contexts/     # ThemeContext, AuthContext
├── hooks/        # useProducts, useCategories, useStoreInfo, …
├── lib/          # supabase client + utils (formatPrice, calcDiscount, …)
├── pages/        # Páginas públicas e /admin/*
└── types/        # Tipagens de Product, Category, Banner, AdminUser, …
supabase/
├── migrations/   # Schema, RLS e RPCs (versionado)
├── functions/    # Edge Functions (auto-deactivate-promotions)
└── seed.sql      # Dados de desenvolvimento
```

## Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_...
VITE_WHATSAPP_NUMBER=5500000000000   # 55 + DDD + número
```

Veja [.env.example](./.env.example). Nunca commite `.env.local`.

## 🗄️ Banco de Dados (Supabase)

### Configuração inicial (uma vez por projeto)

```bash
# 1. Instalar Supabase CLI (Windows — baixar binário, macOS — brew)
#    Windows: https://github.com/supabase/cli/releases/latest (supabase_windows_amd64.tar.gz)
#    macOS:   brew install supabase/tap/supabase

# 2. Autenticar (abre browser uma vez)
supabase login

# 3. Vincular ao projeto remoto
supabase link --project-ref <PROJECT_REF>

# 4. Aplicar migrations (cria 9 tabelas, RLS, RPCs, índices)
supabase db push

# 5. Aplicar seed de desenvolvimento (opcional, só em ambiente dev)
#    Dashboard > SQL Editor > colar conteúdo de supabase/seed.sql > Run
```

### Migrations (`supabase/migrations/`)

| Arquivo | O que faz |
|---|---|
| `20260101000000_initial_schema.sql` | Cria 9 tabelas, índices, triggers, funções `is_admin()`/`is_owner()` |
| `20260101000001_rls_policies.sql` | Row Level Security em todas as tabelas (leitura pública, escrita admin) |
| `20260101000002_rpc_functions.sql` | RPC `increment_product_popularity` (chamada pelo botão WhatsApp) |

### Storage

Dois buckets públicos, criados manualmente no dashboard (**Storage → New bucket**):

| Bucket | Public | MIME | Tamanho máx |
|---|---|---|---|
| `product-images` | ✅ | image/jpeg, png, webp, svg+xml | 5 MB |
| `banners` | ✅ | image/jpeg, png, webp | 5 MB |

Policies de upload/update/delete protegidas por `is_admin()` — configuradas via SQL no dashboard (Storage → Policies → New Policy).

> Vídeos são hospedados no YouTube — apenas a URL é salva em `product_media`.

### Edge Function `auto-deactivate-promotions`

Cron diário (03:00 UTC) que define `is_promotion = false` em produtos com `promo_ends_at < now()`.

```bash
# Deploy
supabase functions deploy auto-deactivate-promotions

# Invocação manual (teste)
# Dashboard > Edge Functions > auto-deactivate-promotions > Invoke
```

Agendamento via **Database → Cron Jobs** no dashboard (pg_cron).

### Adicionar um novo admin

1. Dashboard → **Authentication → Users → Add user**
2. Defina e-mail + senha temporária
3. Copie o `User UID` que aparece na lista
4. Dashboard → **Table Editor → admin_users → Insert row**:
   - `id`: cole o UID
   - `role`: `owner` (controla outros admins) ou `editor` (CRUD de conteúdo)
   - `name`: nome do admin

### Páginas temporárias (remover antes do deploy)

- `/design-system` — paleta, tipografia, componentes
- `/data-test` — valida que os hooks estão consumindo o Supabase

## Documentação

Toda a especificação do projeto está em [CLAUDE.md](./CLAUDE.md). Leia antes de iniciar qualquer módulo.

## Status

- ✅ Módulo 1 — Setup & Estrutura Base
- ✅ Módulo 2 — Identidade Visual & Design System
- 🔄 Módulo 3 — Banco de Dados & Supabase
- ⏳ Módulos 4–10
