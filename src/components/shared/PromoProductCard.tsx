import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MessageCircle } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  buildWhatsAppLink,
  calcDiscount,
  formatPrice,
} from '@/lib/utils'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { trackWhatsAppClick } from '@/hooks/useTrackWhatsAppClick'
import type { Product } from '@/types'

interface PromoProductCardProps {
  product: Product
}

// Variante de ProductCard para a página de Promoções:
// badge de desconto destacado, timer compacto e foco em conversão.
export default function PromoProductCard({ product }: PromoProductCardProps) {
  const { storeInfo } = useStoreInfo()
  const phone = storeInfo?.whatsapp ?? import.meta.env.VITE_WHATSAPP_NUMBER

  if (!product.promo_price) return null

  const discount = calcDiscount(product.price, product.promo_price)
  const cover = product.media?.[0]
  const productHref = `/produto/${product.slug}`
  const whatsAppHref = phone ? buildWhatsAppLink(phone, product) : '#'
  const hasTimer = Boolean(product.promo_ends_at)

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg">
      <Link
        to={productHref}
        aria-label={`Ver ${product.name}`}
        className="block focus-visible:outline-none"
      >
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

          {/* Desconto em destaque (canto superior esquerdo) */}
          <div className="absolute left-3 top-3">
            <Badge variant="promo" className="px-3 py-1.5 text-sm shadow-gold-glow">
              -{discount}%
            </Badge>
          </div>

          {/* Novo no canto direito (se for) */}
          {product.is_new && (
            <div className="absolute right-3 top-3">
              <Badge variant="new">Novo</Badge>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-1.5 px-4 pt-4">
          {product.category?.name && (
            <p className="font-sans text-[10px] uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
              {product.category.name}
            </p>
          )}
          <h3 className="line-clamp-2 font-serif text-lg font-medium leading-snug text-ink-800 dark:text-ink-50">
            {product.name}
          </h3>
        </div>
      </Link>

      <div className="mt-auto flex flex-col gap-3 px-4 pb-4">
        <div className="flex items-baseline gap-2 pt-2">
          <span className="text-2xl font-bold text-gold-600 dark:text-gold-400">
            {formatPrice(product.promo_price)}
          </span>
          <span className="text-sm text-ink-400 line-through">
            {formatPrice(product.price)}
          </span>
        </div>

        {hasTimer && product.promo_ends_at && (
          <div className="inline-flex items-center gap-1.5 text-xs text-gold-600 dark:text-gold-400">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Termina em</span>
            <CompactTimer endsAt={product.promo_ends_at} />
          </div>
        )}

        <a
          href={whatsAppHref}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick(product.slug)}
          aria-label={`Comprar ${product.name} pelo WhatsApp`}
          className="block"
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

// Timer compacto interno — atualiza a cada minuto.
// Formato: "Xd Yh" / "Yh Zm" / "Zm" / "Encerrada".
function CompactTimer({ endsAt }: { endsAt: string }) {
  const [text, setText] = useState(() => format(endsAt))

  useEffect(() => {
    function tick() {
      setText(format(endsAt))
    }
    tick()
    const interval = setInterval(tick, 60_000)
    return () => clearInterval(interval)
  }, [endsAt])

  return <span className="font-bold tabular-nums">{text}</span>
}

function format(endsAt: string): string {
  const diff = new Date(endsAt).getTime() - Date.now()
  if (diff <= 0) return 'Encerrada'
  const d = Math.floor(diff / (1000 * 60 * 60 * 24))
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const m = Math.floor((diff / (1000 * 60)) % 60)
  if (d > 0) return `${d}d ${h}h`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}
