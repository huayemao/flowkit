import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 应用模式配置
export default defineConfig({
  plugins: [
    react(),
  ],
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
  },
  base: './',
})