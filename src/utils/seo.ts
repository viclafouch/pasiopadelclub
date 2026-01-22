import { clientEnv } from '@/env/client'

const SITE_NAME = 'Pasio Padel Club'
const OG_IMAGE_WIDTH = 1200
const OG_IMAGE_HEIGHT = 630
const DEFAULT_OG_IMAGE = '/images/og-image.webp'

type SeoParams = {
  title: string
  description?: string
  image?: string
  imageAlt?: string
  keywords?: string
  pathname?: string
}

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }

function buildUrl(pathname: string) {
  try {
    return new URL(pathname, clientEnv.VITE_SITE_URL).href
  } catch {
    return clientEnv.VITE_SITE_URL
  }
}

function buildOgImageUrl(image: string | undefined) {
  const imagePath = image ?? DEFAULT_OG_IMAGE

  if (imagePath.startsWith('http')) {
    return imagePath
  }

  return new URL(imagePath, clientEnv.VITE_SITE_URL).href
}

export function seo({
  title,
  description,
  keywords,
  image,
  imageAlt,
  pathname = '/'
}: SeoParams) {
  const fullTitle = `${title} | ${SITE_NAME}`
  const url = buildUrl(pathname)
  const ogImage = buildOgImageUrl(image)
  const ogImageAlt =
    imageAlt ?? `${title} - ${SITE_NAME} - Courts de padel à Bayonne`

  const baseMeta: MetaTag[] = [
    { title: fullTitle },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: SITE_NAME },
    { property: 'og:title', content: fullTitle },
    { property: 'og:url', content: url },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:width', content: String(OG_IMAGE_WIDTH) },
    { property: 'og:image:height', content: String(OG_IMAGE_HEIGHT) },
    { property: 'og:image:alt', content: ogImageAlt },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:image:alt', content: ogImageAlt }
  ]

  const descriptionMeta: MetaTag[] = description
    ? [
        { name: 'description', content: description },
        { property: 'og:description', content: description },
        { name: 'twitter:description', content: description }
      ]
    : []

  const keywordsMeta: MetaTag[] = keywords
    ? [{ name: 'keywords', content: keywords }]
    : []

  const meta = [...baseMeta, ...descriptionMeta, ...keywordsMeta]
  const links = [{ rel: 'canonical', href: url }]

  return { meta, links }
}
