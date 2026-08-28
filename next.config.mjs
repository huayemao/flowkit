/** @type {import('next').NextConfig} */
import createMDX from '@next/mdx'
// import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  // 配置 MDX
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [],
  },
})

const nextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // 配置页面扩展
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
  // 构建优化
  // output: 'export',
  // 优化字体加载
  experimental: {
    // optimizeCss: true,
    // nextScriptWorkers: true,
  }
}

// 将 MDX 配置应用到 Next.js 配置
export default withMDX(nextConfig)
