import { ArrowRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Dialog } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import GoldDivider from '@/components/shared/GoldDivider'
import Spinner from '@/components/shared/Spinner'
import { useProduct } from '@/hooks/useProducts'
import { trackWhatsAppClick } from '@/hooks/useTrackWhatsAppClick'
import {
  buildWhatsAppLink,
  calcDiscount,
  formatPrice,
  isPromoActive,
  truncate,
} from '@/lib/utils'

interface QuickViewModalProps {
  productSlug: string | null
  onClose: () => void
}

export default function QuickViewModal({ productSlug, onClose }: QuickViewModalProps) {
  const { product, loading } = useProduct(productSlug ?? undefined)
  const phone = import.meta.env.VITE_WHATSAPP_NUMBER
  const open = productSlug !== null

  const cover = product?.media?.[0]
  const promoActive = product ? isPromoActive(product) : false
  const totalStock = product?.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? null
  const isSoldOut = totalStock !== null && totalStock === 0
  const commentCount = product?.comments?.length ?? 0

  function handleWhatsApp() {
    if (!product) return
    trackWhatsAppClick(product.slug)
  }

  return (
    <Dialog open={open} onClose={onClose} ariaLabel="Visualização rápida do produto" maxWidth="max-w-4xl">
      {loading || !product ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Imagem */}
          <div className="relative aspect-square overflow-hidden bg-ink-100 dark:bg-ink-800">
            {cover ? (
              <img
                src={cover.url}
                alt={product.name}
                loading="eager"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <img
                  src="/logo.jpeg"
                  alt=""
                  className="h-24 w-24 rounded-full object-contain opacity-40"
                />
              </div>
            )}
            <div className="absolute left-4 top-4 flex flex-col gap-1.5">
              {promoActive && product.promo_price !== null && (
                <Badge variant="promo">
                  -{calcDiscount(product.price, product.promo_price)}%
                </Badge>
              )}
              {product.is_new && <Badge variant="new">Novo</Badge>}
              {isSoldOut && <Badge variant="soldout">Esgotado</Badge>}
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col gap-4 p-6 md:p-8">
            {product.category?.name && (
              <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
                {product.category.name}
              </p>
            )}

            <h2 className="font-serif text-2xl text-ink-800 dark:text-ink-50 sm:text-3xl">
              {product.name}
            </h2>

            {commentCount > 0 && (
              <p className="text-xs text-ink-500 dark:text-ink-400">
                {commentCount} comentário{commentCount === 1 ? '' : 's'} de clientes
              </p>
            )}

            <div className="flex items-baseline gap-3">
              {promoActive && product.promo_price !== null ? (
                <>
                  <span className="text-base text-ink-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-3xl font-bold text-gold-600 dark:text-gold-400">
                    {formatPrice(product.promo_price)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-ink-800 dark:text-ink-50">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {product.description && (
              <p className="line-clamp-4 text-sm text-ink-700 dark:text-ink-200">
                {truncate(product.description, 280)}
              </p>
            )}

            <GoldDivider withDiamond={false} />

            <div className="flex flex-col gap-3">
              <a
                href={phone ? buildWhatsAppLink(phone, product) : '#'}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsApp}
                aria-label={`Comprar ${product.name} pelo WhatsApp`}
                className="block"
              >
                <Button variant="gold" size="lg" className="w-full">
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  Comprar pelo WhatsApp
                </Button>
              </a>
              <Link
                to={`/produto/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1 text-sm font-medium text-gold-600 underline-offset-4 hover:underline dark:text-gold-400"
              >
                Ver todos os detalhes
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  )
}
