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

const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
}

const config = defineConfig({
  server: {
    allowedHosts: true
  },
  optimizeDeps: {
    exclude: ['ws']
  },
  plugins: [
    devtools(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json']
    }),
    tailwindcss(),
    tanstackStart(),
    nitro({
      routeRules: {
        '/**': { headers: SECURITY_HEADERS },
        '/images/**': { headers: { ...SECURITY_HEADERS, ...IMMUTABLE_CACHE } },
        '/fonts/**': { headers: { ...SECURITY_HEADERS, ...IMMUTABLE_CACHE } }
      },
      rollupConfig: {
        external: ['ws']
      }
    }),
    viteReact()
  ]
})

export default config
