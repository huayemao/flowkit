import { useEffect, useRef } from 'react'
import { Card } from './ui/card'

interface WebAppEmbedProps {
  url: string
  title: string
}

/**
 * WebAppEmbed 组件用于嵌入外部网页
 * 特点：
 * 1. 使用 useRef 保持 iframe 的引用
 * 2. 只在首次加载时设置 src，避免重新加载
 * 3. 保持 iframe 的状态（如滚动位置、表单输入等）
 */
export function WebAppEmbed({ url, title }: WebAppEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isFirstLoad = useRef(true)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !isFirstLoad.current) return

    // 只在首次加载时设置 src
    iframe.src = url
    isFirstLoad.current = false

    const handleLoad = () => {
      // 可以在这里添加加载完成后的处理逻辑
    }

    iframe.addEventListener('load', handleLoad)
    return () => iframe.removeEventListener('load', handleLoad)
  }, [url])

  return (
    <Card className="h-full w-full">
      <iframe
        ref={iframeRef}
        title={title}
        className="h-full w-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </Card>
  )
} 