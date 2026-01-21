import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'

const OG_WIDTH = 1200
const OG_HEIGHT = 630
const FETCH_TIMEOUT_MS = 5000

const GOOGLE_FONT_URL =
  'https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,700;1,700&display=swap'

type OgImageParams = {
  title: string
  subtitle?: string
}

const fontCache = new Map<string, Buffer>()
let backgroundCache: string | null = null
let logoCache: string | null = null

async function fetchWithTimeout(url: string, options: RequestInit = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    return controller.abort()
  }, FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    return response
  } catch (error) {
    clearTimeout(timeoutId)
    throw error
  }
}

async function loadGoogleFont(weight: number, style: 'normal' | 'italic') {
  const cacheKey = `${weight}-${style}`
  const cached = fontCache.get(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const cssResponse = await fetchWithTimeout(GOOGLE_FONT_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; de-at) AppleWebKit/533.21.1 (KHTML, like Gecko) Version/5.0.5 Safari/533.21.1'
      }
    })

    const css = await cssResponse.text()
    const stylePattern =
      style === 'italic' ? 'font-style:\\s*italic' : 'font-style:\\s*normal'
    const fontUrlMatch = css.match(
      new RegExp(
        `@font-face\\s*{[^}]*${stylePattern}[^}]*font-weight:\\s*${weight}[^}]*url\\(([^)]+)\\)`
      )
    )

    if (!fontUrlMatch?.[1]) {
      return null
    }

    const fontResponse = await fetchWithTimeout(fontUrlMatch[1])
    const fontBuffer = Buffer.from(await fontResponse.arrayBuffer())

    fontCache.set(cacheKey, fontBuffer)

    return fontBuffer
  } catch {
    return null
  }
}

async function loadBackground() {
  if (backgroundCache) {
    return backgroundCache
  }

  try {
    const bgPath = join(
      process.cwd(),
      'public',
      'images',
      'background-hero.png'
    )
    const bgBuffer = await readFile(bgPath)

    backgroundCache = `data:image/png;base64,${bgBuffer.toString('base64')}`

    return backgroundCache
  } catch {
    return null
  }
}

async function loadLogo() {
  if (logoCache) {
    return logoCache
  }

  try {
    const logoPath = join(process.cwd(), 'public', 'android-chrome-512x512.png')
    const logoBuffer = await readFile(logoPath)

    logoCache = `data:image/png;base64,${logoBuffer.toString('base64')}`

    return logoCache
  } catch {
    return null
  }
}

export async function generateOgImage({ title, subtitle }: OgImageParams) {
  const [fontBold, fontBoldItalic, fontRegular, backgroundBase64, logoBase64] =
    await Promise.all([
      loadGoogleFont(700, 'normal'),
      loadGoogleFont(700, 'italic'),
      loadGoogleFont(400, 'normal'),
      loadBackground(),
      loadLogo()
    ])

  const fonts = [
    fontBold
      ? {
          name: 'DM Sans',
          data: fontBold,
          weight: 700 as const,
          style: 'normal' as const
        }
      : null,
    fontBoldItalic
      ? {
          name: 'DM Sans',
          data: fontBoldItalic,
          weight: 700 as const,
          style: 'italic' as const
        }
      : null,
    fontRegular
      ? {
          name: 'DM Sans',
          data: fontRegular,
          weight: 400 as const,
          style: 'normal' as const
        }
      : null
  ].filter((font): font is NonNullable<typeof font> => {
    return font !== null
  })

  const fontFamily = fontBold ? 'DM Sans' : 'sans-serif'

  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#1a1a2e'
      }}
    >
      {backgroundBase64 ? (
        <img
          src={backgroundBase64}
          alt=""
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />
      ) : null}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'linear-gradient(to right, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.2) 100%)',
          display: 'flex'
        }}
      />
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          width: '65%',
          height: '100%'
        }}
      >
        {logoBase64 ? (
          <img
            src={logoBase64}
            alt=""
            width={80}
            height={80}
            style={{
              marginBottom: 24,
              borderRadius: 16
            }}
          />
        ) : null}
        <div
          style={{
            fontSize: title.length > 35 ? 42 : title.length > 25 ? 48 : 56,
            fontFamily,
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'white',
            marginBottom: subtitle ? 16 : 24,
            lineHeight: 1.15,
            textShadow: '0 2px 20px rgba(0, 0, 0, 0.5)'
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              fontSize: 24,
              fontFamily,
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: 24,
              lineHeight: 1.4
            }}
          >
            {subtitle}
          </div>
        ) : null}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 20,
            fontFamily,
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.7)'
          }}
        >
          <span>Bayonne • Pays Basque • 7j/7</span>
        </div>
      </div>
    </div>,
    {
      width: OG_WIDTH,
      height: OG_HEIGHT,
      fonts
    }
  )

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: OG_WIDTH
    }
  })

  return resvg.render().asPng()
}
