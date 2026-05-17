import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, MessageCircleHeart } from 'lucide-react'

import { useReviews } from '@/hooks/useReviews'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { setSEO } from '@/lib/seo'
import { fadeInUp, staggerContainer, useReducedMotion } from '@/lib/animations'
import { cn } from '@/lib/utils'

import Breadcrumb from '@/components/shared/Breadcrumb'
import ReviewCard from '@/components/shared/ReviewCard'
import RatingDistribution from '@/components/shared/RatingDistribution'
import StarRating from '@/components/shared/StarRating'
import GoldDivider from '@/components/shared/GoldDivider'
import EmptyState from '@/components/shared/EmptyState'
import Spinner from '@/components/shared/Spinner'
import { Button } from '@/components/ui/button'

type FilterRating = 0 | 1 | 2 | 3 | 4 | 5

export default function Avaliacoes() {
  const reduced = useReducedMotion()
  const { reviews, average, loading } = useReviews()
  const { storeInfo } = useStoreInfo()
  const [filterRating, setFilterRating] = useState<FilterRating>(0)

  useEffect(() => {
    setSEO({
      title: 'Avaliações de Clientes — AURI',
      description:
        'Veja o que nossos clientes dizem sobre a AURI. Avaliações reais de quem comprou pelo WhatsApp.',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      image: '/logo.jpeg',
    })
  }, [])

  const filteredReviews =
    filterRating === 0 ? reviews : reviews.filter(r => r.rating === filterRating)

  const feedbackWhatsAppLink = storeInfo?.whatsapp
    ? `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent('Olá! Comprei na AURI e gostaria de deixar minha avaliação.')}`
    : '#'

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 py-16 md:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-gold-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Avaliações' }]} />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm text-gold-400">
              <MessageCircleHeart className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium uppercase tracking-[0.18em]">
                Confiança que cresce
              </span>
            </div>

            <h1 className="mb-4 font-serif text-4xl tracking-tight text-ink-50 sm:text-5xl md:text-6xl lg:text-7xl">
              O que dizem sobre a <span className="gold-gradient-text">AURI</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-ink-300 sm:text-lg">
              Cada presença marcada começa com uma escolha. Veja as histórias de quem já fez a sua.
            </p>
            <GoldDivider className="mx-auto mt-6 w-32" />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {loading ? (
          <div className="flex justify-center py-24">
            <Spinner size="lg" />
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={MessageCircleHeart}
            title="Ainda não temos avaliações por aqui"
            description="Seja o primeiro a deixar seu depoimento sobre a AURI! Compartilhe sua experiência pelo WhatsApp."
            action={{ label: 'Falar pelo WhatsApp', href: feedbackWhatsAppLink }}
          />
        ) : (
          <>
            {/* Painel resumo: média + distribuição + CTA */}
            <div className="mb-16 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_2fr_1fr] lg:gap-8">
              <motion.div
                initial={reduced ? false : { opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.6 }}
                className="flex flex-col items-center justify-center rounded-xl border border-ink-100 bg-card p-8 text-center shadow-soft dark:border-ink-700"
              >
                <p className="gold-gradient-text font-serif text-6xl font-bold md:text-7xl">
                  {average.toFixed(1)}
                </p>
                <div className="mt-2">
                  <StarRating rating={average} size="lg" />
                </div>
                <p className="mt-3 text-sm text-ink-500 dark:text-ink-400">
                  Baseado em {reviews.length}{' '}
                  {reviews.length === 1 ? 'avaliação' : 'avaliações'}
                </p>
              </motion.div>

              <motion.div
                initial={reduced ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.1 }}
                className="rounded-xl border border-ink-100 bg-card p-8 shadow-soft dark:border-ink-700"
              >
                <h2 className="mb-4 font-serif text-lg text-ink-800 dark:text-ink-50">
                  Distribuição das avaliações
                </h2>
                <RatingDistribution reviews={reviews} />
              </motion.div>

              <motion.div
                initial={reduced ? false : { opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={reduced ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
                className="flex flex-col justify-center rounded-xl border border-gold-500/30 bg-gradient-to-br from-ink-800 to-ink-900 p-8 text-center"
              >
                <MessageCircle
                  className="mx-auto mb-3 h-10 w-10 text-gold-500 dark:text-gold-400"
                  aria-hidden="true"
                />
                <h2 className="mb-2 font-serif text-xl text-ink-50">
                  Já comprou na AURI?
                </h2>
                <p className="mb-4 text-sm text-ink-300">
                  Conte sua experiência — adoraríamos publicar aqui!
                </p>
                <a
                  href={feedbackWhatsAppLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Deixar avaliação pelo WhatsApp"
                  className="block"
                >
                  <Button variant="gold" size="sm" className="w-full">
                    Deixar avaliação
                  </Button>
                </a>
              </motion.div>
            </div>

            <GoldDivider className="my-8" />

            {/* Filtros */}
            <div className="mb-8 flex flex-wrap items-center gap-3">
              <span className="text-sm text-ink-500 dark:text-ink-400">Filtrar por:</span>
              <FilterButton
                label="Todas"
                active={filterRating === 0}
                onClick={() => setFilterRating(0)}
                count={reviews.length}
              />
              {[5, 4, 3, 2, 1].map(rating => {
                const count = reviews.filter(r => r.rating === rating).length
                if (count === 0) return null
                return (
                  <FilterButton
                    key={rating}
                    label={`${rating}★`}
                    active={filterRating === rating}
                    onClick={() => setFilterRating(rating as FilterRating)}
                    count={count}
                  />
                )
              })}
            </div>

            {/* Grid */}
            {filteredReviews.length === 0 ? (
              <EmptyState
                icon={MessageCircleHeart}
                title={`Nenhuma avaliação com ${filterRating} estrela${filterRating > 1 ? 's' : ''}`}
                description="Tente outro filtro para ver mais depoimentos."
                action={{ label: 'Ver todas', onClick: () => setFilterRating(0) }}
              />
            ) : (
              <motion.div
                variants={reduced ? undefined : staggerContainer}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
              >
                {filteredReviews.map(review => (
                  <motion.div
                    key={review.id}
                    variants={reduced ? undefined : fadeInUp}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* CTA final */}
            <div className="mt-16 text-center">
              <h2 className="mb-2 font-serif text-2xl text-ink-800 dark:text-ink-50">
                Pronto para fazer parte dessa história?
              </h2>
              <p className="mb-6 text-ink-500 dark:text-ink-400">
                Explore o catálogo e marque sua presença.
              </p>
              <Link to="/catalogo">
                <Button variant="gold" size="lg">
                  Ver catálogo
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

interface FilterButtonProps {
  label: string
  active: boolean
  onClick: () => void
  count: number
}

function FilterButton({ label, active, onClick, count }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all',
        active
          ? 'bg-gold-500 text-ink-900 shadow-gold-glow-sm'
          : 'border border-ink-200 text-ink-700 hover:border-gold-500 hover:text-gold-600 dark:border-ink-700 dark:text-ink-200 dark:hover:text-gold-400',
      )}
    >
      {label}
      <span className={cn('text-xs', active ? 'text-ink-900/70' : 'text-ink-400')}>
        ({count})
      </span>
    </button>
  )
}
