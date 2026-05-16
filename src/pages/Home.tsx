import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { useReviews } from '@/hooks/useReviews'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useBanners } from '@/hooks/useBanners'

import HeroVideo from '@/components/shared/HeroVideo'
import CategoryCard from '@/components/shared/CategoryCard'
import ProductCard from '@/components/shared/ProductCard'
import ReviewPreview from '@/components/shared/ReviewPreview'
import PromoBanner from '@/components/shared/PromoBanner'
import TrustBadges from '@/components/shared/TrustBadges'
import SectionTitle from '@/components/shared/SectionTitle'
import StarRating from '@/components/shared/StarRating'
import Spinner from '@/components/shared/Spinner'
import { Button } from '@/components/ui/button'

import { fadeInUp, staggerContainer, useReducedMotion } from '@/lib/animations'
import { setSEO } from '@/lib/seo'

// Limite generoso o bastante pra cobrir o catálogo pequeno (≤ 50 produtos).
// Quando o catálogo crescer, adicionar filtros booleanos no useProducts.
const MAX_PRODUCTS = 50

export default function Home() {
  const reduced = useReducedMotion()
  const { storeInfo } = useStoreInfo()
  const { categories, loading: catLoading } = useCategories()

  // Uma única chamada — filtramos client-side para evitar duas requests duplicadas.
  const { products, loading: productsLoading } = useProducts({
    filters: { sort: 'newest' },
    includeMedia: true,
    includeCategory: true,
    limit: MAX_PRODUCTS,
  })

  const { reviews, average } = useReviews(3)
  const { banners: heroBanners } = useBanners('home_hero')
  const { banners: promoBanners } = useBanners('home_promo')

  const featuredProducts = useMemo(
    () => products.filter(p => p.is_featured).slice(0, 8),
    [products],
  )
  const newProducts = useMemo(
    () => products.filter(p => p.is_new).slice(0, 4),
    [products],
  )

  const heroBanner = heroBanners[0]
  const promoBanner = promoBanners[0]

  useEffect(() => {
    setSEO({
      title: 'AURI — Presença que marca.',
      description:
        'Acessórios, eletrônicos e perfumes selecionados. Atendimento direto pelo WhatsApp.',
      image: '/logo.jpeg',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    })
  }, [])

  const heroCtaUrl = storeInfo?.whatsapp
    ? `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent('Olá! Quero conhecer os produtos da AURI.')}`
    : undefined

  return (
    <>
      {/* 1. HERO */}
      <HeroVideo
        videoUrl={storeInfo?.hero_video_url ?? null}
        fallbackImageUrl={heroBanner?.image_url ?? null}
        title={storeInfo?.hero_title ?? 'AURI'}
        subtitle={storeInfo?.hero_subtitle ?? 'Presença que marca.'}
        ctaText={heroCtaUrl ? 'Fale conosco no WhatsApp' : undefined}
        ctaUrl={heroCtaUrl}
      />

      {/* 2. CATEGORIAS */}
      {(catLoading || categories.length > 0) && (
        <section
          aria-labelledby="home-categories"
          className="bg-ink-50 py-16 dark:bg-ink-900 md:py-24"
        >
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              as="h2"
              title="Categorias"
              subtitle="Encontre exatamente o que combina com você"
              align="center"
              className="[&>h2]:!text-3xl sm:[&>h2]:!text-4xl"
            />
            {catLoading ? (
              <div className="flex justify-center py-12">
                <Spinner size="lg" />
              </div>
            ) : (
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={reduced ? undefined : staggerContainer}
                className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6"
              >
                {categories.map(cat => (
                  <motion.div key={cat.id} variants={reduced ? undefined : fadeInUp}>
                    <CategoryCard category={cat} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>
      )}

      {/* 3. DESTAQUES */}
      <section aria-labelledby="home-featured" className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6">
          <SectionTitle
            as="h2"
            title="Destaques da AURI"
            subtitle="Selecionados a dedo para você"
            align="center"
          />

          {productsLoading ? (
            <div className="flex justify-center py-12">
              <Spinner size="lg" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-12">
              <p className="text-center text-ink-500 dark:text-ink-300">
                Em breve, novos destaques.
              </p>
              <Link to="/catalogo">
                <Button variant="outline-gold" size="md">
                  Ver todo o catálogo
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-50px' }}
                variants={reduced ? undefined : staggerContainer}
                className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {featuredProducts.map(product => (
                  <motion.div
                    key={product.id}
                    variants={reduced ? undefined : fadeInUp}
                  >
                    <ProductCard product={product} showQuickView />
                  </motion.div>
                ))}
              </motion.div>
              <div className="mt-12 flex justify-center">
                <Link to="/catalogo">
                  <Button variant="outline-gold" size="lg">
                    Ver todo o catálogo
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* 4. BANNER DE PROMOÇÕES */}
      {promoBanner && (
        <section className="mx-auto max-w-7xl px-6">
          <PromoBanner banner={promoBanner} />
        </section>
      )}

      {/* 5. LANÇAMENTOS */}
      {newProducts.length > 0 && (
        <section
          aria-labelledby="home-launches"
          className="bg-ink-50 py-16 dark:bg-ink-900 md:py-24"
        >
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              as="h2"
              title="Lançamentos"
              subtitle="Novidades que chegaram para marcar presença"
              align="center"
            />
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={reduced ? undefined : staggerContainer}
              className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {newProducts.map(product => (
                <motion.div
                  key={product.id}
                  variants={reduced ? undefined : fadeInUp}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-12 flex justify-center">
              <Link to="/lancamentos">
                <Button variant="ghost" size="lg" className="text-gold-600 dark:text-gold-400">
                  Ver todos os lançamentos
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. PRÉVIA DE AVALIAÇÕES */}
      {reviews.length > 0 && (
        <section aria-labelledby="home-reviews" className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6">
            <SectionTitle
              as="h2"
              title="O que dizem sobre a AURI"
              subtitle={`${average.toFixed(1)} de 5 estrelas — avaliações reais de clientes`}
              align="center"
            />
            <div className="mt-6 mb-12 flex justify-center">
              <StarRating rating={average} size="lg" />
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={reduced ? undefined : staggerContainer}
              className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
              {reviews.map(review => (
                <motion.div
                  key={review.id}
                  variants={reduced ? undefined : fadeInUp}
                >
                  <ReviewPreview review={review} />
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-12 flex justify-center">
              <Link to="/avaliacoes">
                <Button variant="outline-gold" size="lg">
                  Ver todas as avaliações
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. SELOS DE CONFIANÇA */}
      <TrustBadges />
    </>
  )
}
