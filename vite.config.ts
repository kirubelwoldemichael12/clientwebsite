// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // or your specific framework plugin

export default defineConfig({
  // If your repo is named "my-ethiopian-travel-app", base should be "/my-ethiopian-travel-app/"
  base: process.env.NODE_ENV === 'production' ? '/clientwebsite/' : '/',
  plugins: [react()],
})
