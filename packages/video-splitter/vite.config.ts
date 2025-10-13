import { defineConfig } from "vite";
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// 应用模式配置
export default defineConfig({
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg','@ffmpeg/core',"@ffmpeg/util"],
    // 启用冷启动优化
    esbuildOptions: {
      // 增加目标兼容性
      target: 'es2020',
      // 启用并行构建
      loader: {
        '.jsx': 'jsx',
        '.tsx': 'tsx'
      },
    },
    // 启用依赖缓存
    force: process.env.FORCE_REBUILD === 'true'
  },
  plugins: [
    react(),
  ],
  build: {
    ssrManifest: ".vite/ssr-manifest.json",
    outDir: "dist/static",
    sourcemap: false, // 生产环境禁用sourcemap以减小构建体积
    minify: 'esbuild', // 使用esbuild进行代码压缩，比terser更快
    chunkSizeWarningLimit: 1000, // 增大chunk大小警告阈值
    rollupOptions: {
      input: resolve(__dirname, 'index.html'),
      output: {
        // 优化chunk分割策略
        manualChunks(id) {
          // 将大型依赖项拆分到单独的chunk中
          if (id.includes('node_modules')) {
            if (id.includes('@ffmpeg')) {
              return 'ffmpeg'; // 将ffmpeg相关依赖单独打包
            } else if (id.includes('react') || id.includes('react-dom')) {
              return 'react'; // 将React相关依赖单独打包
            } else if (id.includes('i18next')) {
              return 'i18n'; // 将i18n相关依赖单独打包
            }
            return 'vendors'; // 其他第三方依赖打包到vendors
          }
        }
      }
    },
  },
  base: './',
  // 配置开发服务器优化
  server: {
    port: 5173,
    open: false,
    // 启用服务器缓存
    fs: {
      strict: true,
      allow: ['..']
    },
    // 启用hmr优化开发体验
    hmr: {
      overlay: true,
      timeout: 3000
    }
  },
  // 配置预览服务器
  preview: {
    port: 4173
  },
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