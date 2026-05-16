interface SEOConfig {
  title: string
  description?: string
  image?: string
  url?: string
}

function upsertMeta(name: string, content: string, asProperty = false) {
  const attr = asProperty ? 'property' : 'name'
  let tag = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, name)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// Atualiza title + meta description + Open Graph tags da página.
export function setSEO({ title, description, image, url }: SEOConfig): void {
  if (typeof document === 'undefined') return

  document.title = title
  upsertMeta('og:title', title, true)
  upsertMeta('og:type', 'website', true)

  if (description) {
    upsertMeta('description', description)
    upsertMeta('og:description', description, true)
  }
  if (image) upsertMeta('og:image', image, true)
  if (url) upsertMeta('og:url', url, true)
}
