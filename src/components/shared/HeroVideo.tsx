import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import GoldDivider from '@/components/shared/GoldDivider'
import { useReducedMotion } from '@/lib/animations'
import { getYouTubeId } from '@/lib/utils'

interface HeroVideoProps {
  videoUrl?: string | null
  fallbackImageUrl?: string | null
  title: string
  subtitle?: string | null
  ctaText?: string
  ctaUrl?: string
}

export default function HeroVideo({
  videoUrl,
  fallbackImageUrl,
  title,
  subtitle,
  ctaText,
  ctaUrl,
}: HeroVideoProps) {
  const reduced = useReducedMotion()
  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null
  const isMp4 = videoUrl?.match(/\.(mp4|webm|ogg)(\?|$)/i)

  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex h-[80vh] min-h-[500px] w-full items-center justify-center overflow-hidden md:h-screen md:min-h-[600px]"
    >
      {/* Camada de fundo */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {youtubeId ? (
          // YouTube: iframe coberto via scale para preencher mantendo aspect ratio.
          <div className="absolute inset-0 h-full w-full">
            <iframe
              title="Vídeo decorativo de fundo"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&disablekb=1&fs=0&cc_load_policy=0&playlist=${youtubeId}`}
              allow="autoplay; encrypted-media"
              loading="lazy"
              tabIndex={-1}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2"
            />
            {/* Camada transparente bloqueia qualquer overlay/interação do player */}
            <div className="absolute inset-0" aria-hidden="true" />
          </div>
        ) : isMp4 && videoUrl ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            poster={fallbackImageUrl ?? undefined}
          >
            <source src={videoUrl} />
          </video>
        ) : fallbackImageUrl ? (
          <img
            src={fallbackImageUrl}
            alt=""
            loading="eager"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900" />
        )}

        {/* Overlay escuro pra legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900/70 via-ink-900/40 to-ink-900/85" />
      </div>

      {/* Conteúdo */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduced ? { duration: 0 } : { duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center"
      >
        <img
          src="/logo.jpeg"
          alt="AURI"
          className="h-20 w-20 rounded-full object-contain ring-1 ring-gold-400/50 sm:h-24 sm:w-24"
        />

        <h1
          id="hero-title"
          className="gold-gradient-text font-serif text-5xl font-bold leading-tight tracking-tight text-balance sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {title}
        </h1>

        {subtitle && (
          <p className="font-serif italic text-xl text-gold-300 sm:text-2xl md:text-3xl">
            {subtitle}
          </p>
        )}

        <GoldDivider className="w-48 max-w-full" />

        {ctaText && ctaUrl && (
          <motion.div
            whileHover={reduced ? undefined : { scale: 1.04 }}
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <a href={ctaUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="gold" size="lg" className="shadow-gold-glow">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
                {ctaText}
              </Button>
            </a>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
