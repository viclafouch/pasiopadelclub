import { clientEnv } from '@/env/client'
import type { AnyRouteMatch } from '@tanstack/react-router'

const SITE_NAME = 'Pasio Padel Club'

export const seo = ({
  title,
  description,
  keywords,
  image,
  pathname = '/'
}: {
  title: string
  description?: string
  image?: string
  keywords?: string
  pathname?: string
}) => {
  const fullTitle = `${title} | ${SITE_NAME}`

  let url = ''

  try {
    url = new URL(pathname, clientEnv.VITE_SITE_URL).href
  } catch {
    url = clientEnv.VITE_SITE_URL
  }

  const tags = [
    { title: fullTitle },
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: description },
    { name: 'og:type', content: 'website' },
    { name: 'og:site_name', content: SITE_NAME },
    { name: 'og:title', content: fullTitle },
    { name: 'og:description', content: description },
    { name: 'og:url', content: url },
    { name: 'og:locale', content: 'fr_FR' },
    ...(image
      ? [
          { name: 'twitter:image', content: image },
          { name: 'twitter:card', content: 'summary_large_image' },
          { name: 'og:image', content: image }
        ]
      : [])
  ] satisfies AnyRouteMatch['meta']

  return tags
}
