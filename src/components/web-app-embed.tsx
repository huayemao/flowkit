import { useEffect, useRef } from 'react'
import { useToolsStore } from '../store/tools-store'

interface WebAppEmbedProps {
  url: string
  title: string
}

export function WebAppEmbed({ url, title }: WebAppEmbedProps) {
  return (
    <div className="h-full w-full rounded-lg border bg-card">
      <iframe
        src={url}
        title={title}
        className="h-full w-full rounded-lg border-0"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  )
} 