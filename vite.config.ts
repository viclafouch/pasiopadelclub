import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

const IMMUTABLE_CACHE = {
  'Cache-Control': 'public, max-age=31536000, immutable'
}

const config = defineConfig({
  server: {
    allowedHosts: true
  },
  ssr: {
    external: ['@resvg/resvg-js', 'ws']
  },
  optimizeDeps: {
    exclude: ['@resvg/resvg-js', 'ws']
  },
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json']
    }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      rollupConfig: {
        external: ['@resvg/resvg-js', 'ws']
      },
      routeRules: {
        '/**': {
          headers: {
            'Strict-Transport-Security':
              'max-age=31536000; includeSubDomains; preload',
            'X-Frame-Options': 'DENY',
            'X-Content-Type-Options': 'nosniff',
            'Referrer-Policy': 'strict-origin-when-cross-origin'
          }
        },
        '/images/**': { headers: IMMUTABLE_CACHE },
        '/fonts/**': { headers: IMMUTABLE_CACHE },
        '/**/*.webp': { headers: IMMUTABLE_CACHE },
        '/**/*.png': { headers: IMMUTABLE_CACHE },
        '/**/*.ico': { headers: IMMUTABLE_CACHE }
      }
    }),
    viteReact()
  ]
})

export default config
