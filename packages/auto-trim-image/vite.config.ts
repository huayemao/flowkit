import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import type { PluginOption } from 'vite'

export default defineConfig({
  plugins: [
    react() as PluginOption,
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'AutoTrimImage',
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'lucide-react', '@flowkit/shared-ui'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'lucide-react': 'LucideReact',
          '@flowkit/shared-ui': 'SharedUI',
        },
      },
    },
    cssCodeSplit: false,
  },
})