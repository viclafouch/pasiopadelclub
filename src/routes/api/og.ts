import { LRUCache } from 'lru-cache'
import { z } from 'zod'
import { generateOgImage } from '@/utils/og-image'
import { createFileRoute } from '@tanstack/react-router'

const OG_CACHE_SECONDS = 604800
const RATE_LIMIT_MAX = 10
const RATE_LIMIT_WINDOW_MS = 60000
const IMAGE_CACHE_MAX = 50
const IMAGE_CACHE_MAX_SIZE = 52428800
const MAX_TITLE_LENGTH = 100
const MAX_SUBTITLE_LENGTH = 150

const ogParamsSchema = z.object({
  title: z.string().trim().max(MAX_TITLE_LENGTH).default('Pasio Padel Club'),
  subtitle: z.string().trim().max(MAX_SUBTITLE_LENGTH).optional()
})

const rateLimitCache = new LRUCache<string, number>({
  max: 500,
  ttl: RATE_LIMIT_WINDOW_MS
})

const imageCache = new LRUCache<string, Uint8Array>({
  max: IMAGE_CACHE_MAX,
  ttl: OG_CACHE_SECONDS * 1000,
  maxSize: IMAGE_CACHE_MAX_SIZE,
  sizeCalculation: (value) => {
    return value.byteLength
  }
})

function getClientIp(request: Request) {
  return (
    request.headers.get('x-real-ip') ??
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  )
}

function checkRateLimit(ip: string) {
  const currentCount = rateLimitCache.get(ip) ?? 0
  const newCount = currentCount + 1

  rateLimitCache.set(ip, newCount)

  return {
    isLimited: newCount > RATE_LIMIT_MAX,
    remaining: Math.max(0, RATE_LIMIT_MAX - newCount)
  }
}

async function ogHandler({ request }: { request: Request }) {
  const ip = getClientIp(request)
  const { isLimited, remaining } = checkRateLimit(ip)

  if (isLimited) {
    return new Response('Trop de requêtes. Réessayez dans 1 minute.', {
      status: 429,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Retry-After': '60'
      }
    })
  }

  try {
    const url = new URL(request.url)

    const parseResult = ogParamsSchema.safeParse({
      title: url.searchParams.get('title') ?? undefined,
      subtitle: url.searchParams.get('subtitle') ?? undefined
    })

    if (!parseResult.success) {
      return new Response('Paramètres invalides', {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' }
      })
    }

    const { title, subtitle } = parseResult.data
    const cacheKey = `${title}|${subtitle ?? ''}`

    const cachedImage = imageCache.get(cacheKey)

    if (cachedImage) {
      return new Response(new Uint8Array(cachedImage), {
        status: 200,
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': `public, max-age=${OG_CACHE_SECONDS}, immutable`,
          'X-Cache': 'HIT',
          'X-RateLimit-Remaining': String(remaining)
        }
      })
    }

    const png = await generateOgImage({ title, subtitle })
    const imageData = new Uint8Array(png)

    imageCache.set(cacheKey, imageData)

    return new Response(imageData, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': `public, max-age=${OG_CACHE_SECONDS}, immutable`,
        'X-Cache': 'MISS',
        'X-RateLimit-Remaining': String(remaining)
      }
    })
  } catch {
    return new Response("Impossible de générer l'image", {
      status: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    })
  }
}

export const Route = createFileRoute('/api/og')({
  server: {
    handlers: {
      GET: ogHandler
    }
  }
})
