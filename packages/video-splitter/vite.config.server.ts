import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 服务器端渲染配置
export default defineConfig({
  plugins: [
    react()
  ],
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/core', "@ffmpeg/util"],
    // 启用冷启动优化
    esbuildOptions: {
      // 增加目标兼容性
      target: 'es2020',
      // 启用并行构建
      loader: {
        '.jsx': 'jsx',
        '.tsx': 'tsx'
      }
    },
    // 启用依赖缓存
    force: process.env.FORCE_REBUILD === 'true'
  },

  build: {
    outDir: 'dist/server',
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
    },
    ssrManifest: true,
    ssr: "src/entry-server.tsx",
    sourcemap: false, // 生产环境禁用sourcemap以减小构建体积
    minify: 'esbuild', // 使用esbuild进行代码压缩，比terser更快
    chunkSizeWarningLimit: 1000, // 增大chunk大小警告阈值
  },
  base: './',
  // 配置解析选项
  resolve: {
    // 配置路径别名以简化导入
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@i18n': resolve(__dirname, 'src/i18n')
    }
  }
})