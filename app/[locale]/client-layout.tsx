import type React from "react"
import { memo, Suspense } from 'react'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { GradientBackground } from '@/components/gradient-background'
import type { Locale } from '@/lib/types'
import { Skeleton } from '@/components/ui/skeleton'

// 使用React.memo减少不必要的渲染
const ClientLayout = memo(({
  children,
  locale,
}: Readonly<{
  children: React.ReactNode
  locale: Locale
}>) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {/* 骨架屏占位符 - 改善初始加载体验 */}
      <Suspense fallback={<Skeleton className="fixed inset-0" />}>
        <GradientBackground />
        {children}
        <Analytics />
      </Suspense>
    </ThemeProvider>
  )
})

// 添加适当的displayName便于调试
ClientLayout.displayName = 'ClientLayout'

export default ClientLayout
