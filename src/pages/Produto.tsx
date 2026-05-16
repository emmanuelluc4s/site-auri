import { useEffect, useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Share2, ShoppingBag } from 'lucide-react'

import { useProduct } from '@/hooks/useProducts'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { trackWhatsAppClick } from '@/hooks/useTrackWhatsAppClick'
import { setSEO } from '@/lib/seo'
import {
  buildWhatsAppLink,
  calcDiscount,
  formatPrice,
  isPromoActive,
} from '@/lib/utils'
import { fadeInUp, useReducedMotion } from '@/lib/animations'

import Breadcrumb from '@/components/shared/Breadcrumb'
import ProductGallery from '@/components/shared/ProductGallery'
import VariantSelector from '@/components/shared/VariantSelector'
import PromoTimer from '@/components/shared/PromoTimer'
import SocialProof from '@/components/shared/SocialProof'
import StockIndicator from '@/components/shared/StockIndicator'
import ShareButtons from '@/components/shared/ShareButtons'
import RelatedProducts from '@/components/shared/RelatedProducts'
import ProductNavigation from '@/components/shared/ProductNavigation'
import ProductComments from '@/components/shared/ProductComments'
import StickyMobileCTA from '@/components/shared/StickyMobileCTA'
import GoldDivider from '@/components/shared/GoldDivider'
import Spinner from '@/components/shared/Spinner'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

import type { ProductVariant } from '@/types'

export default function Produto() {
  const reduced = useReducedMotion()
  const { slug } = useParams<{ slug: string }>()
  const { product, loading, error } = useProduct(slug)
  const { storeInfo } = useStoreInfo()

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  // Permite forçar re-render quando o timer expira (e o preço volta ao normal).
  const [promoExpired, setPromoExpired] = useState(false)

  // Seleciona primeira variante disponível por padrão.
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      const firstAvailable = product.variants.find(v => v.stock > 0) ?? product.variants[0]
      setSelectedVariant(firstAvailable)
    }
  }, [product, selectedVariant])

  // SEO dinâmico.
  useEffect(() => {
    if (!product) return
    setSEO({
      title: `${product.name} — AURI`,
      description: product.description ?? `${product.name} disponível na AURI.`,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      image: product.media?.[0]?.url ?? '/logo.jpeg',
    })
  }, [product])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !product) {
    return <Navigate to="/catalogo" replace />
  }

  const promoActive = !promoExpired && isPromoActive(product)
  const discount =
    promoActive && product.promo_price !== null
      ? calcDiscount(product.price, product.promo_price)
      : 0
  const phone = storeInfo?.whatsapp ?? import.meta.env.VITE_WHATSAPP_NUMBER
  const whatsappHref = phone
    ? buildWhatsAppLink(phone, product, selectedVariant ?? undefined)
    : '#'

  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0
  const hasVariants = (product.variants?.length ?? 0) > 0
  const variantStock = selectedVariant?.stock ?? totalStock
  const isOutOfStock = hasVariants && variantStock === 0

  function handleWhatsAppClick() {
    if (!product) return
    trackWhatsAppClick(product.slug)
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:pb-12">
        <Breadcrumb
          items={[
            { label: 'Catálogo', href: '/catalogo' },
            ...(product.category
              ? [{ label: product.category.name, href: `/categoria/${product.category.slug}` }]
              : []),
            { label: product.name },
          ]}
        />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12">
          {/* Galeria */}
          <motion.div
            variants={reduced ? undefined : fadeInUp}
            initial="hidden"
            animate="visible"
          >
            <ProductGallery media={product.media ?? []} productName={product.name} />
          </motion.div>

          {/* Detalhes */}
          <motion.div
            variants={reduced ? undefined : fadeInUp}
            initial="hidden"
            animate="visible"
            transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Categoria + badges */}
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="text-xs uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
                  {product.category.name}
                </span>
              )}
              {product.is_new && <Badge variant="new">Novo</Badge>}
              {isOutOfStock && <Badge variant="soldout">Esgotado</Badge>}
            </div>

            <h1 className="mt-3 font-serif text-3xl leading-tight tracking-tight text-ink-800 dark:text-ink-50 sm:text-4xl md:text-5xl">
              {product.name}
            </h1>

            <div className="mt-3">
              <SocialProof productId={product.id} />
            </div>

            <GoldDivider className="my-6 max-w-[160px]" withDiamond={false} />

            {/* Preço */}
            <div className="flex flex-wrap items-end gap-3">
              {promoActive && product.promo_price !== null ? (
                <>
                  <span className="font-serif text-4xl font-bold text-gold-600 dark:text-gold-400">
                    {formatPrice(product.promo_price)}
                  </span>
                  <span className="mb-1 text-lg text-ink-400 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <Badge variant="promo" className="mb-2">
                    -{discount}%
                  </Badge>
                </>
              ) : (
                <span className="font-serif text-4xl font-bold text-ink-800 dark:text-ink-50">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Timer */}
            {promoActive && product.promo_ends_at && (
              <div className="mt-4">
                <PromoTimer
                  endsAt={product.promo_ends_at}
                  onExpire={() => setPromoExpired(true)}
                />
              </div>
            )}

            {/* Variantes */}
            {hasVariants && product.variants && (
              <div className="mt-6">
                <VariantSelector
                  variants={product.variants}
                  selectedVariant={selectedVariant}
                  onSelect={setSelectedVariant}
                />
              </div>
            )}

            <StockIndicator stock={variantStock} />

            {/* CTA */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsAppClick}
              className="mt-6 block"
              aria-label={`Comprar ${product.name} pelo WhatsApp`}
            >
              <Button
                variant="gold"
                size="lg"
                className="w-full text-base"
                disabled={isOutOfStock}
              >
                <ShoppingBag className="h-5 w-5" aria-hidden="true" />
                {isOutOfStock ? 'Produto esgotado' : 'Comprar pelo WhatsApp'}
              </Button>
            </a>

            {/* Compartilhar */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-sm text-ink-500 dark:text-ink-400">
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Compartilhar:
              </span>
              <ShareButtons
                url={typeof window !== 'undefined' ? window.location.href : ''}
                title={product.name}
              />
            </div>

            {/* Descrição + Comentários em acordeão */}
            <div className="mt-8">
              <Accordion type="multiple" defaultValue={['description']}>
                <AccordionItem value="description">
                  <AccordionTrigger>Descrição</AccordionTrigger>
                  <AccordionContent>
                    <p className="whitespace-pre-line leading-relaxed">
                      {product.description ?? 'Sem descrição disponível.'}
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="comments">
                  <AccordionTrigger>
                    Comentários{' '}
                    {product.comments && product.comments.length > 0 && (
                      <span className="ml-1 text-sm font-normal text-ink-500 dark:text-ink-400">
                        ({product.comments.length})
                      </span>
                    )}
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProductComments comments={product.comments ?? []} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </motion.div>
        </div>

        {/* Navegação anterior/próximo */}
        {product.category_id && (
          <div className="mt-16">
            <GoldDivider className="mb-8" />
            <ProductNavigation
              currentProductId={product.id}
              categoryId={product.category_id}
            />
          </div>
        )}

        {/* Produtos relacionados */}
        {product.category_id && (
          <div className="mt-16">
            <RelatedProducts
              categoryId={product.category_id}
              excludeProductId={product.id}
              limit={8}
            />
          </div>
        )}
      </div>

      {/* Sticky CTA mobile */}
      <StickyMobileCTA
        product={product}
        selectedVariant={selectedVariant}
        whatsappNumber={phone ?? ''}
        disabled={isOutOfStock}
      />
    </>
  )
}
