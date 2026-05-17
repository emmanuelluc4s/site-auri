import { useEffect, type ComponentType, type SVGProps } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  ShoppingBag,
} from 'lucide-react'

import { useStoreInfo } from '@/hooks/useStoreInfo'
import { setSEO } from '@/lib/seo'
import { fadeInUp, staggerContainer, useReducedMotion } from '@/lib/animations'
import { cn } from '@/lib/utils'

import Breadcrumb from '@/components/shared/Breadcrumb'
import GoldDivider from '@/components/shared/GoldDivider'
import Spinner from '@/components/shared/Spinner'
import { FacebookIcon, InstagramIcon } from '@/components/shared/BrandIcons'
import { Button } from '@/components/ui/button'

type ChannelKey = 'whatsapp' | 'instagram' | 'facebook' | 'olx'

interface Channel {
  key: ChannelKey
  icon: ComponentType<SVGProps<SVGSVGElement>>
  title: string
  description: string
  cta: string
  href: string
  primary: boolean
}

// Cada canal tem sua paleta sutil de borda/fundo. Mantemos a marca dourada para todos
// no hover (continuidade visual com o resto do site).
const channelClasses: Record<ChannelKey, string> = {
  whatsapp:  'from-emerald-500/10 to-emerald-700/5 border-emerald-500/30 hover:border-gold-500',
  instagram: 'from-pink-500/10 to-purple-700/5 border-pink-500/30 hover:border-gold-500',
  facebook:  'from-sky-500/10 to-blue-700/5 border-sky-500/30 hover:border-gold-500',
  olx:       'from-gold-500/10 to-gold-700/5 border-gold-500/30 hover:border-gold-400',
}

export default function FaleConosco() {
  const reduced = useReducedMotion()
  const { storeInfo, loading } = useStoreInfo()

  useEffect(() => {
    setSEO({
      title: 'Fale Conosco — AURI',
      description:
        'Entre em contato com a AURI pelo WhatsApp, Instagram, Facebook ou OLX. Atendimento humano e ágil.',
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

  const channels: Channel[] = []
  if (storeInfo?.whatsapp) {
    channels.push({
      key: 'whatsapp',
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Tire dúvidas e finalize sua compra com atendimento humano.',
      cta: 'Abrir conversa',
      href: `https://wa.me/${storeInfo.whatsapp}?text=${encodeURIComponent('Olá! Vim pelo site da AURI.')}`,
      primary: true,
    })
  }
  if (storeInfo?.instagram) {
    channels.push({
      key: 'instagram',
      icon: InstagramIcon,
      title: 'Instagram',
      description: 'Acompanhe os lançamentos e inspirações em primeira mão.',
      cta: 'Seguir AURI',
      href: storeInfo.instagram,
      primary: false,
    })
  }
  if (storeInfo?.facebook) {
    channels.push({
      key: 'facebook',
      icon: FacebookIcon,
      title: 'Facebook',
      description: 'Veja novidades e converse pelo Messenger.',
      cta: 'Acessar página',
      href: storeInfo.facebook,
      primary: false,
    })
  }
  if (storeInfo?.olx) {
    channels.push({
      key: 'olx',
      icon: ShoppingBag,
      title: 'OLX',
      description: 'Confira nossos anúncios e ofertas exclusivas na OLX.',
      cta: 'Ver perfil OLX',
      href: storeInfo.olx,
      primary: false,
    })
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0 opacity-10" aria-hidden="true">
          <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-gold-500 blur-3xl" />
          <div className="absolute -bottom-12 -right-12 h-64 w-64 rounded-full bg-gold-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <Breadcrumb items={[{ label: 'Fale Conosco' }]} />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.6 }}
            className="mt-8 text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-4 py-2 text-sm text-gold-400">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <span className="font-medium uppercase tracking-[0.18em]">Estamos por aqui</span>
            </div>

            <h1 className="mb-4 font-serif text-4xl tracking-tight text-ink-50 sm:text-5xl md:text-7xl">
              Fale com a <span className="gold-gradient-text">AURI</span>
            </h1>
            <p className="mx-auto max-w-2xl text-base text-ink-300 sm:text-lg">
              Escolha o canal de sua preferência. A gente responde com agilidade e atenção.
            </p>
            <GoldDivider className="mx-auto mt-6 w-32" />
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 md:py-16">
        {channels.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-ink-500 dark:text-ink-400">
              Nossos canais de contato estarão disponíveis em breve.
            </p>
          </div>
        ) : (
          <motion.ul
            variants={reduced ? undefined : staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            {channels.map(channel => (
              <motion.li
                key={channel.key}
                variants={reduced ? undefined : fadeInUp}
                className={cn(channel.primary && 'md:col-span-2')}
              >
                <a
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={channel.title}
                  className={cn(
                    'group relative block overflow-hidden rounded-2xl border-2 bg-gradient-to-br p-8 transition-all duration-400 hover:-translate-y-1',
                    channelClasses[channel.key],
                  )}
                >
                  <div className="flex items-start gap-5">
                    <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white shadow-soft transition-transform duration-400 group-hover:scale-110 dark:bg-ink-800">
                      <channel.icon className="h-7 w-7 text-gold-600 dark:text-gold-400" />
                    </span>
                    <div className="flex-1">
                      <h3 className="mb-1 flex flex-wrap items-center gap-2 font-serif text-2xl text-ink-800 dark:text-ink-50">
                        {channel.title}
                        {channel.primary && (
                          <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.14em] text-ink-900">
                            Preferido
                          </span>
                        )}
                      </h3>
                      <p className="mb-4 text-sm text-ink-600 dark:text-ink-300 sm:text-base">
                        {channel.description}
                      </p>
                      <div className="inline-flex items-center gap-2 font-medium text-gold-600 transition-all duration-300 group-hover:gap-3 dark:text-gold-400">
                        {channel.cta}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}

        {/* Informações adicionais */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 md:grid-cols-2">
          {storeInfo?.business_hours && (
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={reduced ? { duration: 0 } : { duration: 0.5 }}
              className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700"
            >
              <div className="flex items-start gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400">
                  <Clock className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h4 className="mb-1 font-serif text-lg text-ink-800 dark:text-ink-50">
                    Horário de atendimento
                  </h4>
                  <p className="whitespace-pre-line text-ink-600 dark:text-ink-300">
                    {storeInfo.business_hours}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={reduced ? { duration: 0 } : { duration: 0.5, delay: 0.1 }}
            className="rounded-xl border border-ink-100 bg-card p-6 dark:border-ink-700"
          >
            <div className="flex items-start gap-4">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold-500/10 text-gold-600 dark:text-gold-400">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h4 className="mb-1 font-serif text-lg text-ink-800 dark:text-ink-50">
                  Loja 100% online
                </h4>
                <p className="text-ink-600 dark:text-ink-300">
                  Atendemos todo o Brasil com agilidade. A entrega é combinada diretamente com você
                  pelo WhatsApp.
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-12 text-center md:mt-16">
          <GoldDivider className="mx-auto mb-8 w-32" />
          <p className="mb-4 text-ink-500 dark:text-ink-400">
            Antes de falar conosco, que tal explorar o catálogo?
          </p>
          <Link to="/catalogo">
            <Button variant="outline-gold" size="lg">
              Ver produtos
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
