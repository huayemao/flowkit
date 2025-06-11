import { useEffect, useRef } from 'react'

interface WebAppEmbedProps {
  url: string
  title: string
}

export function WebAppEmbed({ url, title }: WebAppEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe) return

    const handleLoad = () => {
      // 可以在这里添加加载完成后的处理逻辑
    }

    iframe.addEventListener('load', handleLoad)
    return () => iframe.removeEventListener('load', handleLoad)
  }, [])

  return (
    <div className="h-full w-full">
      <iframe
        ref={iframeRef}
        src={url}
        title={title}
        className="h-full w-full border-0"
        allow="clipboard-read; clipboard-write"
      />
    </div>
  )
} 