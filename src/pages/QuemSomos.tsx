import { useEffect, type ComponentType, type SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Shield, ShoppingBag, Sparkles, type LucideIcon } from 'lucide-react'

import { useStoreInfo } from '@/hooks/useStoreInfo'
import { setSEO } from '@/lib/seo'
import { useReducedMotion } from '@/lib/animations'

import Breadcrumb from '@/components/shared/Breadcrumb'
import SectionTitle from '@/components/shared/SectionTitle'
import GoldDivider from '@/components/shared/GoldDivider'
import Spinner from '@/components/shared/Spinner'
import { FacebookIcon, InstagramIcon } from '@/components/shared/BrandIcons'
import { Button } from '@/components/ui/button'

const PILLARS = [
  {
    icon: Sparkles,
    title: 'Curadoria',
    description:
      'Cada produto é escolhido com cuidado para representar elegância, presença e personalidade.',
  },
  {
    icon: Heart,
    title: 'Atendimento humano',
    description:
      'Você fala diretamente com a gente pelo WhatsApp — sem robôs, sem fila, sem complicação.',
  },
  {
    icon: Shield,
    title: 'Confiança',
    description:
      'Produtos selecionados, entrega combinada e suporte de verdade. Sua satisfação é o que constrói nossa marca.',
  },
] as const

export default function QuemSomos() {
  const reduced = useReducedMotion()
  const { storeInfo, loading } = useStoreInfo()

  useEffect(() => {
    setSEO({
      title: 'Quem Somos — AURI',
      description:
        'Conheça a história da AURI: presença que marca em acessórios, eletrônicos e perfumes selecionados.',
      url: typeof window !== 'undefined' ? window.location.href : undefined,
      image: '/logo.jpeg',
    })
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  const aboutText = storeInfo?.about_text
  const aboutImage = storeInfo?.about_image_url

  return (
    <>
      {/* Hero editorial */}
      <section className="relative overflow-hidden bg-ink-50 py-16 dark:bg-ink-900 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Quem Somos' }]} />

          <div className="mt-12 grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-12">
            <motion.div
              initial={reduced ? false : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.7 }}
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm text-gold-600 dark:text-gold-400">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                <span className="font-medium uppercase tracking-[0.18em]">
                  Nossa história
                </span>
              </div>

              <h1 className="mb-4 font-serif text-4xl leading-tight tracking-tight text-ink-800 dark:text-ink-50 sm:text-5xl md:text-6xl lg:text-7xl">
                Presença <br />
                <span className="gold-gradient-text italic">que marca</span>
              </h1>
              <GoldDivider className="my-6 w-24" withDiamond={false} />
              <p className="text-base leading-relaxed text-ink-600 dark:text-ink-300 sm:text-lg">
                A AURI é mais que uma loja — é uma curadoria de produtos que carregam estilo,
                qualidade e identidade. Acessórios, eletrônicos e fragrâncias selecionados
                para quem entende que pequenos detalhes constroem grandes presenças.
              </p>
            </motion.div>

            <motion.div
              initial={reduced ? false : { opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={reduced ? { duration: 0 } : { duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-soft-lg">
                {aboutImage ? (
                  <img
                    src={aboutImage}
                    alt="AURI — Quem somos"
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-ink-800 via-ink-900 to-ink-800">
                    <img
                      src="/logo.jpeg"
                      alt=""
                      className="h-48 w-48 rounded-full object-contain opacity-80 ring-1 ring-gold-400/40"
                    />
                  </div>
                )}
                <div
                  className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-gold-500/20"
                  aria-hidden="true"
                />
              </div>
              <div
                className="absolute -right-4 -top-4 -z-10 h-16 w-16 rounded-lg border-2 border-gold-500/40"
                aria-hidden="true"
              />
              <div
                className="absolute -bottom-4 -left-4 -z-10 h-24 w-24 rounded-lg border-2 border-gold-500/20"
                aria-hidden="true"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Texto institucional do admin */}
      {aboutText && (
        <section aria-labelledby="quemsomos-essencia" className="py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6">
            <SectionTitle
              as="h2"
              title="Nossa essência"
              subtitle="O que nos move a cada dia"
              align="center"
            />
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={reduced ? { duration: 0 } : { duration: 0.6 }}
              className="mt-10 whitespace-pre-line text-center font-serif text-lg leading-relaxed text-ink-700 dark:text-ink-200"
            >
              {aboutText}
            </motion.p>
          </div>
        </section>
      )}

      {/* Pilares */}
      <section aria-labelledby="quemsomos-pilares" className="bg-ink-50 py-16 dark:bg-ink-900 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionTitle
            as="h2"
            title="Nossos pilares"
            subtitle="Aquilo em que acreditamos"
            align="center"
          />
          <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {PILLARS.map((pillar, idx) => (
              <Pillar key={pillar.title} {...pillar} delay={idx * 0.1} />
            ))}
          </ul>
        </div>
      </section>

      {/* CTA com redes */}
      <section className="bg-ink-900 py-16 text-ink-50 md:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h2 className="mb-4 font-serif text-4xl md:text-5xl">Vamos nos conectar?</h2>
          <p className="mx-auto mb-8 max-w-xl text-ink-300">
            Acompanhe a AURI nas redes ou fale com a gente diretamente — estamos sempre por perto.
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            {storeInfo?.whatsapp && (
              <SocialLink
                href={`https://wa.me/${storeInfo.whatsapp}`}
                icon={MessageCircle}
                label="WhatsApp"
              />
            )}
            {storeInfo?.instagram && (
              <SocialLink href={storeInfo.instagram} icon={InstagramIcon} label="Instagram" />
            )}
            {storeInfo?.facebook && (
              <SocialLink href={storeInfo.facebook} icon={FacebookIcon} label="Facebook" />
            )}
            {storeInfo?.olx && (
              <SocialLink href={storeInfo.olx} icon={ShoppingBag} label="OLX" />
            )}
          </div>

          <GoldDivider className="mx-auto mt-12 w-32" />
          <div className="mt-8">
            <Link to="/catalogo">
              <Button variant="outline-gold" size="lg">
                Ver catálogo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

interface PillarProps {
  icon: LucideIcon
  title: string
  description: string
  delay: number
}

function Pillar({ icon: Icon, title, description, delay }: PillarProps) {
  const reduced = useReducedMotion()
  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={reduced ? { duration: 0 } : { duration: 0.6, delay }}
      className="rounded-xl border border-ink-100 bg-card p-8 text-center shadow-soft transition-all duration-300 hover:border-gold-500/30 hover:shadow-gold-glow-sm dark:border-ink-700"
    >
      <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400">
        <Icon className="h-7 w-7" aria-hidden="true" strokeWidth={1.5} />
      </span>
      <h3 className="mb-2 font-serif text-xl text-ink-800 dark:text-ink-50">{title}</h3>
      <p className="text-sm leading-relaxed text-ink-500 dark:text-ink-300">{description}</p>
    </motion.li>
  )
}

interface SocialLinkProps {
  href: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
}

function SocialLink({ href, icon: Icon, label }: SocialLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Abrir ${label}`}
      className="group flex items-center gap-2 rounded-full border border-ink-700 bg-ink-800 px-5 py-3 transition-all duration-300 hover:border-gold-500 hover:bg-gold-500 hover:text-ink-900"
    >
      <Icon className="h-5 w-5 text-gold-400 group-hover:text-ink-900" />
      <span className="font-medium">{label}</span>
    </a>
  )
}
