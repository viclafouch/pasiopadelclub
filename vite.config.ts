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
        '/images/**': { headers: IMMUTABLE_CACHE },
        '/fonts/**': { headers: IMMUTABLE_CACHE }
      }
    }),
    viteReact()
  ]
})

export default config
