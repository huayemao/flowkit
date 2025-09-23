import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/server',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
    ssrManifest: true,
    ssr: "src/entry-server.tsx",
  },
  base: './',
})