import { Link2, MessageCircle } from 'lucide-react'
import { FacebookIcon, InstagramIcon } from '@/components/shared/BrandIcons'
import { useToast } from '@/components/ui/toast'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const { toast } = useToast()

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url)
      toast('Link copiado!', 'success')
    } catch {
      toast('Não foi possível copiar o link', 'error')
    }
  }

  async function shareInstagram() {
    const shareData = { title, text: title, url }
    // Web Share API (mobile principalmente). Fallback: copia link.
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // usuário cancelou — sem erro pra mostrar
        return
      }
    }
    try {
      await navigator.clipboard.writeText(url)
      toast('Link copiado! Cole no seu Instagram', 'success')
    } catch {
      toast('Não foi possível copiar o link', 'error')
    }
  }

  const baseBtn =
    'group relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink-800 text-gold-400 ring-1 ring-gold-400/30 transition-all duration-300 hover:bg-gold-500 hover:text-ink-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500'

  return (
    <ul className="flex items-center gap-2">
      <li>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar via WhatsApp"
          title="Compartilhar via WhatsApp"
          className={baseBtn}
        >
          <MessageCircle className="h-4 w-4" aria-hidden="true" />
        </a>
      </li>
      <li>
        <a
          href={facebookHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Compartilhar no Facebook"
          title="Compartilhar no Facebook"
          className={baseBtn}
        >
          <FacebookIcon className="h-4 w-4" />
        </a>
      </li>
      <li>
        <button
          type="button"
          onClick={shareInstagram}
          aria-label="Compartilhar no Instagram"
          title="Compartilhar no Instagram"
          className={baseBtn}
        >
          <InstagramIcon className="h-4 w-4" />
        </button>
      </li>
      <li>
        <button
          type="button"
          onClick={copyLink}
          aria-label="Copiar link"
          title="Copiar link"
          className={baseBtn}
        >
          <Link2 className="h-4 w-4" aria-hidden="true" />
        </button>
      </li>
    </ul>
  )
}
