# Changelog AURI

Todas as mudanças notáveis no projeto são documentadas aqui.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/).

---

## [1.0.0] — 2026-05-18

### 🎉 Lançamento inicial

#### Parte pública do site
- **Home** com hero (vídeo YouTube em loop), destaques, categorias, promoções,
  lançamentos, prévia de avaliações e selos de confiança
- **Catálogo** (`/catalogo`) com busca em tempo real (debounce 300ms), filtros
  (categoria, preço, tags), ordenação, scroll infinito, Quick View modal e
  deep linking de filtros via URL
- **Categoria** (`/categoria/:slug`) com banner de capa e filtros
- **Produto** (`/produto/:slug`) com galeria fotos+vídeos com lightbox e zoom,
  variantes (cor/tamanho com estoque por variante), timer regressivo de
  promoção, prova social, compartilhamento, comentários, produtos relacionados
  em carrossel, navegação anterior/próximo e Sticky CTA mobile
- **Promoções** (`/promocoes`) com filtros, ordenação por maior desconto e
  timer compacto por card
- **Lançamentos** (`/lancamentos`) com banner cinematográfico editável
- **Avaliações** (`/avaliacoes`) com média geral, distribuição visual de notas
  e filtros por estrela
- **Quem Somos** e **Fale Conosco** com canais e horário

#### Painel administrativo (`/admin`)
- Login via Supabase Auth com toggle de tema e sidebar fixa
- Dashboard com 4 métricas + 2 alertas (estoque baixo, promoções expirando)
- CRUD completo de produtos (5 abas, upload de mídia, variantes, drag-and-drop,
  ações em lote, duplicar)
- CRUDs de categorias (drag-and-drop), avaliações, comentários por produto,
  banners (3 locations), conteúdo (hero + about) e loja (canais + horário)
- Gestão de usuários admin (somente owner) via Edge Function `invite-admin`
- Roles `owner` / `editor` com `AdminGuard requireOwner`
- AlertDialog em todas as ações destrutivas; toasts em todas as operações

#### Infraestrutura
- Banco Supabase com **9 tabelas** + RLS em todas
- **2 Edge Functions** deployadas: `auto-deactivate-promotions`, `invite-admin`
- **2 buckets de Storage**: `product-images`, `banners` (públicos, MIME restritos)
- **Identidade visual AURI**: paleta dourado/preto, Playfair Display + Inter,
  scrollbar dourada, seleção dourada, modo escuro padrão
- Code-splitting com `React.lazy()` em todas as páginas exceto Home
- Pré-conexões para Supabase, Google Fonts e YouTube
- Headers de segurança via `vercel.json` (X-Content-Type-Options, X-Frame-Options,
  Referrer-Policy, Permissions-Policy)
- Cache de assets imutáveis (1 ano) via `vercel.json`
- `robots.txt` e `sitemap.xml` estáticos
- Deploy via **Vercel** com CI/CD automático no `main`

#### Detalhes de implementação
- TypeScript estrito (sem `any`), `verbatimModuleSyntax: true`
- `prefers-reduced-motion` respeitado globalmente (CSS + Framer Motion variants)
- Acessibilidade: ARIA, focus visível, contraste WCAG AA
- `aspect-ratio` em todas as imagens (zero CLS)
- `loading="lazy"` em todas as imagens exceto hero
