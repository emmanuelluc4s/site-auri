import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { buildWhatsAppLink, formatPrice, isPromoActive } from '@/lib/utils'
import { trackWhatsAppClick } from '@/hooks/useTrackWhatsAppClick'
import { useReducedMotion } from '@/lib/animations'
import type { Product, ProductVariant } from '@/types'

interface StickyMobileCTAProps {
  product: Product
  selectedVariant: ProductVariant | null
  whatsappNumber: string
  disabled?: boolean
}

export default function StickyMobileCTA({
  product,
  selectedVariant,
  whatsappNumber,
  disabled = false,
}: StickyMobileCTAProps) {
  const reduced = useReducedMotion()
  const promoActive = isPromoActive(product)
  const price = promoActive && product.promo_price !== null
    ? product.promo_price
    : product.price

  const href = whatsappNumber
    ? buildWhatsAppLink(whatsappNumber, product, selectedVariant ?? undefined)
    : '#'

  function handleClick() {
    trackWhatsAppClick(product.slug)
  }

  return (
    <motion.div
      initial={reduced ? false : { y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={reduced ? { duration: 0 } : { duration: 0.3, delay: 0.2, ease: 'easeOut' }}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gold-500/20 bg-background/95 px-4 py-3 backdrop-blur-md shadow-soft-lg lg:hidden"
      role="region"
      aria-label="Comprar produto"
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <div className="flex flex-col">
          {promoActive && product.promo_price !== null && (
            <span className="text-[10px] text-ink-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
          <span className="text-lg font-bold text-gold-600 dark:text-gold-400">
            {formatPrice(price)}
          </span>
        </div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="ml-auto flex-1"
          aria-label={`Comprar ${product.name} pelo WhatsApp`}
        >
          <Button variant="gold" size="md" className="w-full" disabled={disabled}>
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            {disabled ? 'Esgotado' : 'Comprar no WhatsApp'}
          </Button>
        </a>
      </div>
    </motion.div>
  )
}
