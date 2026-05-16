import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { Eye, MessageCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  buildWhatsAppLink,
  calcDiscount,
  cn,
  formatPrice,
  isPromoActive,
} from '@/lib/utils'
import { trackWhatsAppClick } from '@/hooks/useTrackWhatsAppClick'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  variant?: 'default' | 'compact'
  showQuickView?: boolean
  // Quando definido, o overlay "Ver detalhes" no hover (desktop) abre o Quick View
  // em vez de navegar para a página do produto.
  onQuickView?: () => void
}

export default function ProductCard({
  product,
  variant = 'default',
  showQuickView = false,
  onQuickView,
}: ProductCardProps) {
  const promoActive = isPromoActive(product)
  const cover = product.media?.[0]
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? null
  const isSoldOut = totalStock !== null && totalStock === 0
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER
  const productHref = `/produto/${product.slug}`
  const whatsAppHref = phone ? buildWhatsAppLink(phone, product) : '#'

  function handleWhatsApp(_e: MouseEvent<HTMLAnchorElement>) {
    trackWhatsAppClick(product.slug)
  }

  return (
    <Card
      className={cn(
        'group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg',
        variant === 'compact' && 'shadow-none',
      )}
    >
      {/* Link cobre tudo EXCETO o botão WhatsApp (evita <a> dentro de <a>). */}
      <Link
        to={productHref}
        aria-label={`Ver ${product.name}`}
        className="block focus-visible:outline-none"
      >
        {/* Imagem */}
        <div className="relative aspect-square overflow-hidden bg-ink-100 dark:bg-ink-800">
          {cover ? (
            <img
              src={cover.url}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src="/logo.jpeg"
                alt=""
                className="h-20 w-20 rounded-full object-contain opacity-40"
              />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {promoActive && product.promo_price !== null && (
              <Badge variant="promo">
                -{calcDiscount(product.price, product.promo_price)}%
              </Badge>
            )}
            {product.is_new && <Badge variant="new">Novo</Badge>}
            {isSoldOut && <Badge variant="soldout">Esgotado</Badge>}
          </div>

          {showQuickView && (
            <div className="absolute inset-0 hidden items-center justify-center bg-ink-900/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:flex">
              {onQuickView ? (
                <button
                  type="button"
                  onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    onQuickView()
                  }}
                  aria-label={`Ver preview de ${product.name}`}
                  className="inline-flex items-center gap-2 rounded-md bg-ink-900/85 px-4 py-2 font-sans text-xs uppercase tracking-wider text-gold-400 ring-1 ring-gold-400/40 backdrop-blur-sm transition-transform hover:scale-105"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Ver detalhes
                </button>
              ) : (
                <span className="pointer-events-none inline-flex items-center gap-2 rounded-md bg-ink-900/85 px-4 py-2 font-sans text-xs uppercase tracking-wider text-gold-400 ring-1 ring-gold-400/40 backdrop-blur-sm">
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Ver detalhes
                </span>
              )}
            </div>
          )}
        </div>

        {/* Conteúdo (sem o botão WhatsApp) */}
        <div className="flex flex-col gap-2 px-4 pt-4">
          {product.category?.name && (
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
              {product.category.name}
            </p>
          )}

          <h3 className="line-clamp-2 font-serif text-lg font-medium leading-snug text-ink-800 dark:text-ink-50">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 pt-1">
            {promoActive && product.promo_price !== null ? (
              <>
                <span className="text-sm text-ink-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl font-bold text-gold-600 dark:text-gold-400">
                  {formatPrice(product.promo_price)}
                </span>
              </>
            ) : (
              <span className="text-xl font-bold text-ink-800 dark:text-ink-50">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* CTA WhatsApp — FORA do Link para evitar <a> aninhado */}
      <div className="mt-3 flex flex-1 items-end px-4 pb-4">
        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsApp}
          aria-label={`Comprar ${product.name} pelo WhatsApp`}
          className="block w-full"
        >
          <Button variant="gold" size="sm" className="w-full">
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            Comprar pelo WhatsApp
          </Button>
        </a>
      </div>
    </Card>
  )
}
