# AURI — Loja Online

> Site oficial da loja **AURI** — *Presença que marca.*
> Acessórios, eletrônicos e perfumes selecionados.

---

## 📋 Sumário

- [Sobre o projeto](#sobre-o-projeto)
- [Tecnologias usadas](#tecnologias-usadas)
- [Como rodar localmente](#como-rodar-localmente)
- [Como o painel admin funciona](#como-o-painel-admin-funciona)
- [Como adicionar produtos](#como-adicionar-produtos)
- [Como gerenciar banners](#como-gerenciar-banners)
- [Como editar conteúdo do site](#como-editar-conteúdo-do-site)
- [Como adicionar novos admins](#como-adicionar-novos-admins)
- [Backup do banco de dados](#backup-do-banco-de-dados)
- [Manutenção e suporte](#manutenção-e-suporte)
- [Roadmap futuro](#roadmap-futuro)
- [Estrutura do projeto](#estrutura-do-projeto)

---

## Sobre o projeto

A AURI é uma loja 100% online focada em produtos selecionados. O site é um catálogo
visual que direciona clientes para o **WhatsApp** para fechar pedidos — não há
checkout online, o atendimento é humano e personalizado.

**Funcionalidades:**

- Catálogo com busca em tempo real, filtros (categoria, preço, tags) e ordenação
- Categorias dinâmicas com banner próprio
- Página de detalhes do produto com galeria (fotos + vídeos YouTube), variantes,
  timer regressivo de promoção e prova social
- Páginas de Promoções e Lançamentos com filtros
- Avaliações de clientes com filtro por nota
- Quem Somos institucional + 3 pilares da marca
- Fale Conosco com múltiplos canais (WhatsApp, Instagram, Facebook, OLX)
- Modo claro/escuro (lembra a preferência)
- 100% responsivo (mobile-first)
- Painel administrativo completo para gestão sem código

---

## Tecnologias usadas

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + Vite 8 + TypeScript 6 |
| Estilo | Tailwind CSS 3 + componentes customizados |
| Animações | Framer Motion |
| Roteamento | React Router 7 |
| Backend / Banco | Supabase (PostgreSQL + Auth + Storage + Edge Functions) |
| Deploy | Vercel (CI/CD automático via GitHub) |
| Versionamento | GitHub |

---

## Como rodar localmente

### Pré-requisitos

- Node.js 20+ instalado ([download](https://nodejs.org))
- Conta no Supabase (gratuita) — projeto já criado
- Acesso ao repositório no GitHub

### Passos

```bash
# 1. Clonar o repositório
git clone https://github.com/<USUARIO>/auri.git
cd auri

# 2. Instalar dependências
npm install

# 3. Copiar variáveis de ambiente
cp .env.example .env.local
# Editar .env.local com os valores reais (Project URL, anon key, WhatsApp)

# 4. Rodar em modo de desenvolvimento
npm run dev
```

Acesse **http://localhost:5173**.

### Scripts disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia o dev server (porta 5173) |
| `npm run build` | Build de produção (type-check + Vite build) |
| `npm run preview` | Pré-visualiza o build local |
| `npm run lint` | Roda ESLint em todo o projeto |
| `npm run typecheck` | Apenas verifica tipos TypeScript |

---

## Como o painel admin funciona

O painel está em **`/admin`** e exige login.

### Permissões

- **Owner** → acesso total, incluindo gestão de outros admins
- **Editor** → acesso a tudo exceto `/admin/usuarios`

### Áreas do painel

| Página | O que faz |
|---|---|
| **Dashboard** | Visão geral: métricas, alertas de estoque baixo e promoções expirando |
| **Produtos** | CRUD com upload de fotos, vídeos YouTube, variantes, drag-and-drop |
| **Categorias** | CRUD com imagem de capa e ícone |
| **Avaliações** | CRUD das avaliações globais com filtro por estrela |
| **Comentários** | CRUD dos comentários por produto |
| **Banners** | Gerencia 3 banners (Home Hero, Home Promoção, Lançamentos) |
| **Conteúdo** | Texto do hero, vídeo do hero (YouTube), texto e foto institucional |
| **Loja** | WhatsApp, redes sociais e horário de atendimento |
| **Usuários** | (Só owner) Gerencia outros admins |

---

## Como adicionar produtos

1. Acesse **Admin → Produtos → Novo produto** (botão dourado)
2. **Aba Geral:** nome, slug (auto-gerado), descrição, categoria, tags
3. **Aba Preço:** preço normal e (opcional) preço promocional com data de fim
4. **Aba Mídias:** subir fotos (até 5 MB cada) e/ou colar URL de vídeo do YouTube
5. **Aba Variantes:** adicionar cor + tamanho + estoque (deixe vazio se não tiver variantes)
6. **Aba Visibilidade:**
   - **Em destaque** → aparece na vitrine da Home
   - **Lançamento** → aparece em `/lancamentos` com badge "Novo"
   - **Visível no site** → desligue para ocultar sem deletar
7. Clique em **Salvar** (topo direito)

**Dicas:**
- Use imagens **quadradas** (1:1, ex: 1200×1200 px) para melhor exibição
- WebP é o melhor formato (menor + qualidade); JPG/PNG também funcionam
- Tags como `couro`, `dourado`, `feminino` facilitam a busca pelo cliente
- Para reordenar produtos, arraste pelo ícone **⠿** na listagem

---

## Como gerenciar banners

O site tem **3 locais de banner** geridos no painel:

1. **Hero da Home** — imagem grande do topo da página inicial
2. **Promoção da Home** — banner intermediário entre destaques e lançamentos
3. **Lançamentos** — banner cinematográfico no topo de `/lancamentos`

### Editar banner

1. Vá em **Admin → Banners**
2. Selecione a aba do banner que quer editar
3. Atualize título, subtítulo, link e imagem (upload, até 5 MB)
4. Marque "Ativo" se quiser que apareça no site
5. **Salvar** — atualização aparece no site imediatamente

> Ao salvar um banner novo em uma location, o anterior é **automaticamente desativado**.

---

## Como editar conteúdo do site

### Vídeo / título do hero da Home

1. **Admin → Conteúdo**
2. Atualize "Título do hero", "Subtítulo" e/ou URL do YouTube
3. O preview do vídeo aparece logo abaixo do input
4. **Salvar**

### Texto institucional (Quem Somos)

1. **Admin → Conteúdo** → seção "Quem Somos"
2. Edite o texto (use linhas em branco para separar parágrafos)
3. Suba uma foto institucional (formato retrato 4:5 recomendado)
4. **Salvar**

### WhatsApp, redes sociais e horário

1. **Admin → Loja**
2. WhatsApp: formato `55 + DDD + número` (só dígitos, ex: `5588999998888`)
3. Instagram, Facebook, OLX: URLs completas (`https://…`)
4. Horário: texto livre com quebras de linha
5. **Salvar**

---

## Como adicionar novos admins

> ⚠️ Apenas o **owner** pode adicionar admins.

### Opção 1 — Pelo painel (recomendado)

1. **Admin → Usuários** → "Convidar admin"
2. Preencha nome, e-mail e role (`editor` ou `owner`)
3. **Enviar convite** — o novo admin recebe e-mail com link para definir senha
4. Pronto, ele já pode acessar `/admin`

### Opção 2 — Manualmente pelo Supabase (caso o e-mail não chegue)

1. Dashboard Supabase → **Authentication → Users → Add user → Create new user**
2. Marque **Auto Confirm User** e defina uma senha temporária
3. Copie o **User UID** que aparece na lista
4. Dashboard Supabase → **Table Editor → admin_users → Insert row**:
   - `id` = UID copiado
   - `role` = `owner` ou `editor`
   - `name` = nome do admin

---

## Backup do banco de dados

### Backup automático (Supabase)

O plano **Free** do Supabase mantém **backup automático por 7 dias** —
para restaurar: Dashboard → **Database → Backups**.

### Backup manual via CLI

```bash
# Dump completo (schema + dados)
supabase db dump --linked > backup-$(date +%Y%m%d).sql

# Só dados
supabase db dump --linked --data-only > backup-data-$(date +%Y%m%d).sql
```

Para retenção mais longa, considerar o plano **Pro** ($25/mês).

---

## Manutenção e suporte

### Atualizações de conteúdo
Tudo é gerenciado pelo painel admin. **Você não precisa de programador** para:
- Adicionar / remover / editar produtos
- Atualizar banners e imagens
- Editar texto institucional, WhatsApp, redes sociais
- Convidar novos admins

### Atualizações técnicas
Caso seja necessário alterar funcionalidades (não conteúdo), entre em contato
com a equipe técnica que desenvolveu o projeto.

### Monitoramento
- **Vercel Dashboard** — deploys, erros em produção, logs
- **Supabase Dashboard** — uso do banco, queries lentas, logs
- **Lighthouse** (DevTools do Chrome) — rodar mensalmente

### Custos mensais estimados

| Serviço | Custo |
|---|---|
| Vercel (Hobby) | Gratuito |
| Supabase (Free) | Gratuito até 500 MB banco + 1 GB Storage |
| Domínio `.com.br` | ~R$ 40/ano (~R$ 3,30/mês) |
| **Total inicial** | **~R$ 3/mês** |

Quando crescer:
- **Vercel Pro** ($20/mês) — recomendado a partir de 100k visitas/mês
- **Supabase Pro** ($25/mês) — recomendado a partir de 500 MB de banco

---

## Roadmap futuro

Funcionalidades **arquitetadas mas não implementadas no MVP**:

- **Cálculo de frete** — integração com Correios/Frenet
- **Sitemap dinâmico** — geração automática com URLs de produtos via Edge Function
- **PWA** — instalável como app no celular
- **Analytics próprio** — painel de cliques no WhatsApp, produtos mais vistos
- **Pagamento online** — Pix e cartão integrados (se a estratégia mudar)

---

## Estrutura do projeto

```
auri/
├── public/                  # Assets estáticos (logo, favicon, robots.txt, sitemap.xml)
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes do design system
│   │   ├── layout/          # Navbar, Footer, AdminLayout
│   │   └── shared/          # ProductCard, Galeria, Toast etc.
│   ├── contexts/            # AuthContext, ThemeContext
│   ├── hooks/               # useProducts, useCategories, etc.
│   ├── lib/                 # supabase client, utils, animations, seo
│   ├── pages/               # Páginas públicas + /admin/*
│   ├── types/               # Tipagens TypeScript
│   └── App.tsx              # Componente raiz com rotas + code-splitting
├── supabase/
│   ├── migrations/          # Schema do banco (versionado)
│   ├── functions/           # Edge Functions (auto-deactivate-promotions, invite-admin)
│   └── seed.sql             # Dados iniciais (apenas desenvolvimento)
├── vercel.json              # Config Vercel (rewrites + headers de segurança)
├── CLAUDE.md                # Documentação técnica completa
├── CHANGELOG.md             # Histórico de versões
└── README.md                # Este arquivo
```

---

## Licença

Projeto privado da **AURI**. Todos os direitos reservados.

---

**Desenvolvido com 💛 — Presença que marca, agora também na web.**
