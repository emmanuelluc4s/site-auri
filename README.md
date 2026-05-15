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
```

## Variáveis de ambiente

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_WHATSAPP_NUMBER=5500000000000   # 55 + DDD + número
```

Veja [.env.example](./.env.example). Nunca commite `.env.local`.

## Documentação

Toda a especificação do projeto está em [CLAUDE.md](./CLAUDE.md). Leia antes de iniciar qualquer módulo.

## Status

- ✅ **Módulo 1 — Setup & Estrutura Base** (em revisão)
- ⏳ Módulo 2 — Identidade Visual & Design System (aguardando assets do cliente)
- ⏳ Módulos 3–10
