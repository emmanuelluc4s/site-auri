import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { ChevronLeft, ChevronRight, Play, ZoomIn } from 'lucide-react'
import { Dialog } from '@/components/ui/dialog'
import { cn, getYouTubeId } from '@/lib/utils'
import type { ProductMedia } from '@/types'

interface ProductGalleryProps {
  media: ProductMedia[]
  productName: string
}

interface ZoomState {
  active: boolean
  x: number
  y: number
}

export default function ProductGallery({ media, productName }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [zoom, setZoom] = useState<ZoomState>({ active: false, x: 50, y: 50 })
  const swipeStartX = useRef<number | null>(null)

  const items = media.slice().sort((a, b) => a.sort_order - b.sort_order)
  const active = items[activeIndex]
  const total = items.length

  const goTo = useCallback((idx: number) => {
    if (total === 0) return
    const next = ((idx % total) + total) % total
    setActiveIndex(next)
    setZoom({ active: false, x: 50, y: 50 })
  }, [total])

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  // Setas do teclado no lightbox.
  useEffect(() => {
    if (!lightboxOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [lightboxOpen, next, prev])

  // Swipe no mobile.
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    swipeStartX.current = e.clientX
  }
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (swipeStartX.current === null) return
    const delta = e.clientX - swipeStartX.current
    if (Math.abs(delta) > 50) {
      if (delta < 0) next()
      else prev()
    }
    swipeStartX.current = null
  }

  // Zoom on hover (apenas para imagens, desktop).
  function onImageMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!active || active.type !== 'image') return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoom({ active: true, x, y })
  }
  function onImageMouseLeave() {
    setZoom(prev => ({ ...prev, active: false }))
  }

  // Estado vazio.
  if (!active) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center rounded-2xl bg-ink-100 dark:bg-ink-800">
        <img
          src="/logo.jpeg"
          alt=""
          className="h-24 w-24 rounded-full object-contain opacity-40"
        />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row">
      {/* Thumbnails (vertical desktop, horizontal mobile) */}
      {total > 1 && (
        <div className="order-2 flex gap-2 overflow-x-auto md:order-1 md:max-h-[600px] md:flex-col md:overflow-y-auto md:overflow-x-hidden">
          {items.map((item, idx) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(idx)}
              aria-label={`Ver mídia ${idx + 1} de ${productName}`}
              aria-current={idx === activeIndex}
              className={cn(
                'relative aspect-square w-16 shrink-0 overflow-hidden rounded-md ring-1 transition-all duration-200 md:w-20',
                idx === activeIndex
                  ? 'ring-2 ring-gold-500 dark:ring-gold-400'
                  : 'ring-ink-200 dark:ring-ink-700 hover:ring-gold-400/60',
              )}
            >
              {item.type === 'image' ? (
                <img src={item.url} alt="" loading="lazy" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-ink-900">
                  <Play className="h-6 w-6 text-gold-400" aria-hidden="true" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Item ativo */}
      <div className="relative order-1 flex-1 md:order-2">
        <div
          className="group relative aspect-square w-full overflow-hidden rounded-2xl bg-ink-100 dark:bg-ink-800"
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onMouseMove={onImageMouseMove}
          onMouseLeave={onImageMouseLeave}
        >
          {active.type === 'image' ? (
            <>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Abrir imagem em tela cheia: ${productName}`}
                className="absolute inset-0 z-10 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
              >
                <span className="sr-only">Abrir em tela cheia</span>
              </button>

              {/* Imagem normal — desktop esconde ao zoom ativar */}
              <img
                src={active.url}
                alt={productName}
                loading="eager"
                className={cn(
                  'h-full w-full object-cover transition-opacity duration-200',
                  zoom.active && 'md:opacity-0',
                )}
              />

              {/* Camada de zoom (apenas desktop) */}
              {zoom.active && (
                <div
                  className="pointer-events-none absolute inset-0 hidden bg-no-repeat md:block"
                  style={{
                    backgroundImage: `url(${active.url})`,
                    backgroundSize: '200%',
                    backgroundPosition: `${zoom.x}% ${zoom.y}%`,
                  }}
                  aria-hidden="true"
                />
              )}

              <div className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1.5 rounded-full bg-ink-900/70 px-3 py-1.5 text-xs text-gold-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:flex">
                <ZoomIn className="h-3 w-3" aria-hidden="true" />
                Ampliar
              </div>
            </>
          ) : (
            <YouTubeEmbed url={active.url} title={productName} />
          )}

          {/* Setas (desktop) */}
          {total > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="Mídia anterior"
                className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 text-gold-400 ring-1 ring-gold-400/40 backdrop-blur-sm transition-colors hover:bg-ink-900 md:flex"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="Próxima mídia"
                className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 text-gold-400 ring-1 ring-gold-400/40 backdrop-blur-sm transition-colors hover:bg-ink-900 md:flex"
              >
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </button>
            </>
          )}

          {/* Indicadores (mobile) */}
          {total > 1 && (
            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-1.5 md:hidden">
              {items.map((_, idx) => (
                <span
                  key={idx}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    idx === activeIndex ? 'w-6 bg-gold-400' : 'w-1.5 bg-ink-50/60',
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {active.type === 'image' && (
        <Dialog
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          ariaLabel={`Imagem em tela cheia: ${productName}`}
          maxWidth="max-w-[95vw]"
          className="bg-ink-900"
        >
          <div className="relative flex items-center justify-center" style={{ minHeight: '60vh' }}>
            <img
              src={active.url}
              alt={productName}
              className="max-h-[85vh] w-full object-contain"
            />
            {total > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Anterior"
                  className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 text-gold-400 ring-1 ring-gold-400/40 hover:bg-ink-900"
                >
                  <ChevronLeft className="h-6 w-6" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Próximo"
                  className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ink-900/80 text-gold-400 ring-1 ring-gold-400/40 hover:bg-ink-900"
                >
                  <ChevronRight className="h-6 w-6" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
        </Dialog>
      )}
    </div>
  )
}

function YouTubeEmbed({ url, title }: { url: string; title: string }) {
  const id = getYouTubeId(url)
  if (!id) return null
  return (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`}
      title={`Vídeo do produto: ${title}`}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      loading="lazy"
      className="absolute inset-0 h-full w-full"
    />
  )
}
