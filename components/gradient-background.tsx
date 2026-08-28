'use client'
import { memo, useEffect, useRef } from 'react'

/**
 * 优化后的渐变背景组件 - 包含动态光效和磨砂玻璃效果
 * 使用性能优化技术: memo, Intersection Observer, requestAnimationFrame
 */
const GradientBackground = memo(() => {
  const containerRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const isVisibleRef = useRef(false)

  // 使用Intersection Observer减少不必要的渲染
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (!entry.isIntersecting && animationRef.current) {
          cancelAnimationFrame(animationRef.current)
          animationRef.current = null
        }
      },
      {
        threshold: 0.1, // 当10%的元素可见时触发
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // 使用requestAnimationFrame优化动画性能
  useEffect(() => {
    if (!isVisibleRef.current) return

    const animate = () => {
      if (containerRef.current && isVisibleRef.current) {
        // 这里可以添加更精细的动画控制
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    }
  }, [isVisibleRef.current])

  return (
    <div ref={containerRef} className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-100/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl" />

      {/* 动态光效 */}
      <div className="absolute top-0 -left-4 w-36 h-36 md:w-96 md:h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float" />
      <div className="absolute top-0 -right-4 w-36 h-36 md:w-96 md:h-96 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-updown" />
      <div className="absolute -bottom-8 left-20 w-36 h-36 md:w-96 md:h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-reverse" />
      <div className="absolute -bottom-16 right-20 w-36 h-36 md:w-96 md:h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-updown" />

      {/* 网格背景 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />

      {/* 磨砂玻璃效果 */}
      <div className="absolute inset-0 backdrop-blur-3xl" />
    </div>
  )
})

GradientBackground.displayName = 'GradientBackground'

export { GradientBackground }
