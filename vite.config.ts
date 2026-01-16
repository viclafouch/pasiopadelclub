import type { Plugin as EsbuildPlugin } from 'esbuild'
import { nitro } from 'nitro/vite'
import { defineConfig } from 'vite'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

const tanstackExternalPlugin: EsbuildPlugin = {
  name: 'tanstack-external',
  setup(build) {
    build.onResolve({ filter: /^#tanstack-|^tanstack-start-/ }, () => {
      return {
        external: true
      }
    })
  }
}

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
    nitro(),
    viteReact()
  ],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [tanstackExternalPlugin]
    }
  },
  environments: {
    ssr: {
      optimizeDeps: {
        esbuildOptions: {
          plugins: [tanstackExternalPlugin]
        }
      }
    }
  }
})

export default config
