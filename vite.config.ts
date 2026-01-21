import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

const config = defineConfig({
  server: {
    allowedHosts: true
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
        '/images/**': {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        },
        '/fonts/**': {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        },
        '/*.webp': {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        },
        '/*.png': {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        },
        '/*.ico': {
          headers: {
            'Cache-Control': 'public, max-age=31536000, immutable'
          }
        }
      }
    }),
    viteReact()
  ]
})

export default config
