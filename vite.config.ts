// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  // 1. Set the base path for assets prefixing
  base: '/',
  plugins: [
    tanstackStart({
      prerender: {
        enabled: true,
      }
    }),
    react(),
    tailwindcss(),      // 2. ENABLE TAILWIND V4 COMPILER
    tsconfigPaths()     // 3. Enable TS alias resolution
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})

