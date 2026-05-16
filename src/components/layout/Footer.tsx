import { Link } from 'react-router-dom'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '@/components/shared/BrandIcons'
import GoldDivider from '@/components/shared/GoldDivider'

const SITE_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/promocoes', label: 'Promoções' },
  { to: '/lancamentos', label: 'Lançamentos' },
  { to: '/avaliacoes', label: 'Avaliações' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/fale-conosco', label: 'Fale Conosco' },
]

// URLs placeholder — preenchidas via store_info quando o cliente fornecer.
const SOCIAL_LINKS = [
  { href: '#', label: 'WhatsApp', icon: MessageCircle },
  { href: '#', label: 'Instagram', icon: InstagramIcon },
  { href: '#', label: 'Facebook', icon: FacebookIcon },
  { href: '#', label: 'OLX', icon: ShoppingBag },
]

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-50">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Coluna 1 — Marca */}
          <div className="text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-3" aria-label="AURI">
              <img
                src="/logo.jpeg"
                alt="AURI"
                className="h-16 w-16 rounded-full object-contain ring-1 ring-gold-400/40"
              />
              <span className="font-serif text-2xl tracking-wider text-ink-50">AURI</span>
            </Link>
            <p className="mt-4 font-serif italic text-gold-400">Presença que marca.</p>
            <p className="mt-4 text-sm text-ink-300">
              Acessórios, eletrônicos e perfumes selecionados. Atendimento direto pelo WhatsApp.
            </p>
          </div>

          {/* Coluna 2 — Links rápidos */}
          <nav aria-label="Links do rodapé" className="text-center md:text-left">
            <h2 className="font-serif text-lg tracking-wider text-gold-400">Navegação</h2>
            <ul className="mt-4 space-y-2">
              {SITE_LINKS.map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-ink-300 transition-colors duration-300 hover:text-gold-400"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Coluna 3 — Redes sociais + horário */}
          <div className="text-center md:text-left">
            <h2 className="font-serif text-lg tracking-wider text-gold-400">Redes sociais</h2>
            <ul className="mt-4 flex justify-center gap-3 md:justify-start">
              {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Abrir ${label}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold-400/40 text-gold-400 transition-all duration-300 hover:border-gold-400 hover:bg-gold-400/10 hover:shadow-gold-glow-sm"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs uppercase tracking-wider text-ink-400">
              Horário de atendimento
            </p>
            <p className="mt-1 text-sm text-ink-300">
              Em breve {/* será preenchido via store_info */}
            </p>
          </div>
        </div>

        <div className="mt-12">
          <GoldDivider />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-xs text-ink-400">
            © 2026 AURI. Todos os direitos reservados.
          </p>
          {/* Linha decorativa art déco — diamantes dourados */}
          <div className="flex items-center gap-2 text-gold-400/60">
            <span className="block h-px w-8 bg-gold-400/40" aria-hidden="true" />
            <span className="text-[8px]" aria-hidden="true">◆</span>
            <span className="text-[6px]" aria-hidden="true">◆</span>
            <span className="text-[8px]" aria-hidden="true">◆</span>
            <span className="block h-px w-8 bg-gold-400/40" aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  )
}
