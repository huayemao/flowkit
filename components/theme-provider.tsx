'use client'
import { memo } from 'react'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes'

/**
 * 优化的主题提供器组件
 * 使用React.memo减少不必要的重渲染
 */
const ThemeProvider = memo(({
  children,
  ...props
}: ThemeProviderProps) => {
  // 可以在这里添加主题相关的性能优化逻辑
  // 例如预加载主题CSS、优化主题切换性能等
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
})

ThemeProvider.displayName = 'ThemeProvider'

export { ThemeProvider }
