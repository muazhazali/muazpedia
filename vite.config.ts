import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
        remarkPlugins: [remarkGfm],
      }),
    },
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})