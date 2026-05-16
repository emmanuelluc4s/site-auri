import { MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import GoldDivider from '@/components/shared/GoldDivider'

const ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Compra Segura',
    description: 'Suas informações protegidas',
  },
  {
    icon: MessageCircle,
    title: 'Atendimento WhatsApp',
    description: 'Tire dúvidas e compre com facilidade',
  },
  {
    icon: Truck,
    title: 'Entrega ágil',
    description: 'Combinamos a melhor forma de envio',
  },
  {
    icon: Sparkles,
    title: 'Produtos selecionados',
    description: 'Qualidade que carrega presença',
  },
] as const

const PAYMENT_METHODS = ['Pix', 'Visa', 'Mastercard', 'Elo'] as const

export default function TrustBadges() {
  return (
    <section
      aria-labelledby="trust-title"
      className="bg-ink-50 py-12 dark:bg-ink-900 md:py-16"
    >
      <div className="mx-auto max-w-7xl px-6">
        <h2
          id="trust-title"
          className="mb-10 text-center font-sans text-xs font-semibold uppercase tracking-[0.24em] text-ink-500 dark:text-ink-300"
        >
          Compra segura & atendimento humano
        </h2>

        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, description }) => (
            <li
              key={title}
              className="flex flex-col items-center gap-3 rounded-xl px-2 text-center"
            >
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold-500/40 text-gold-500 transition-colors duration-300 dark:text-gold-400">
                <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.5} />
              </span>
              <h3 className="font-serif text-base text-ink-800 dark:text-ink-50">
                {title}
              </h3>
              <p className="text-sm text-ink-500 dark:text-ink-300">{description}</p>
            </li>
          ))}
        </ul>

        <div className="mt-12">
          <GoldDivider />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="font-sans text-xs uppercase tracking-[0.18em] text-ink-500 dark:text-ink-400">
            Formas de pagamento aceitas
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_METHODS.map(method => (
              <li
                key={method}
                className="rounded-md border border-ink-200 bg-white px-3 py-1.5 font-sans text-xs font-medium text-ink-700 shadow-sm dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100"
              >
                {method}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
