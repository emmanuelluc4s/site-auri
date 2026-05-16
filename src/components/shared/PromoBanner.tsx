import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Banner } from '@/types'

interface PromoBannerProps {
  banner: Banner
}

export default function PromoBanner({ banner }: PromoBannerProps) {
  const linkTo = banner.link ?? '/promocoes'

  return (
    <div className="group relative isolate flex min-h-[180px] w-full items-center justify-center overflow-hidden rounded-2xl md:min-h-[240px]">
      {banner.image_url && (
        <img
          src={banner.image_url}
          alt=""
          loading="lazy"
          className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 -z-10 bg-ink-900/60" aria-hidden="true" />

      <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
        {banner.title && (
          <h3 className="font-serif text-3xl text-gold-400 sm:text-4xl">
            {banner.title}
          </h3>
        )}
        {banner.subtitle && (
          <p className="font-sans text-base text-ink-50 sm:text-lg">
            {banner.subtitle}
          </p>
        )}
        <Link to={linkTo} className="mt-3 inline-flex">
          <Button variant="outline-gold" size="lg">
            Ver promoções
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
