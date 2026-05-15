import { Link } from 'react-router-dom'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '@/components/shared/BrandIcons'

const SITE_LINKS = [
  { to: '/', label: 'Início' },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/promocoes', label: 'Promoções' },
  { to: '/lancamentos', label: 'Lançamentos' },
  { to: '/avaliacoes', label: 'Avaliações' },
  { to: '/quem-somos', label: 'Quem Somos' },
  { to: '/fale-conosco', label: 'Fale Conosco' },
]

// URLs placeholder — serão preenchidas via store_info quando o cliente fornecer.
const SOCIAL_LINKS = [
  { href: '#', label: 'WhatsApp', icon: MessageCircle },
  { href: '#', label: 'Instagram', icon: InstagramIcon },
  { href: '#', label: 'Facebook', icon: FacebookIcon },
  { href: '#', label: 'OLX', icon: ShoppingBag },
]

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        {/* Coluna 1 — Marca */}
        <div>
          <Link to="/" className="inline-flex items-center gap-2" aria-label="AURI">
            <img src="/logo-placeholder.svg" alt="" className="h-8 w-auto" />
            <span className="sr-only">AURI</span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Acessórios e eletrônicos com identidade moderna e tecnológica. Atendimento direto pelo WhatsApp.
          </p>
        </div>

        {/* Coluna 2 — Links rápidos */}
        <nav aria-label="Links do rodapé">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Navegação</h2>
          <ul className="mt-4 space-y-2">
            {SITE_LINKS.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Coluna 3 — Redes sociais */}
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-foreground">Redes sociais</h2>
          <ul className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map(({ href, label, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Abrir ${label}`}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-4 py-4 text-center text-xs text-muted-foreground sm:px-6">
          © 2026 AURI. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
