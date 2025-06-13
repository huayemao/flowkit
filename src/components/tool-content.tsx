import { useState } from 'react'
import { TextRemoveNewlines } from '../features/text-remove-newlines'
import { TextOcr } from '../features/text-ocr'
import { WebAppEmbed } from './web-app-embed'
import { Tool } from '../types.ts'
import { useAppStore } from '../store/app-store'

interface ToolContentProps {
  tool: Tool
}

/**
 * ToolContent 组件负责渲染不同类型的工具内容
 * 特点：
 * 1. 使用纯 CSS 实现平滑的切换动画
 * 2. 所有 iframe 同时渲染，通过 CSS 控制显示/隐藏
 * 3. 保持所有 iframe 的状态
 */
export function ToolContent({ tool }: ToolContentProps) {
  const [textRemoveNewlinesState, setTextRemoveNewlinesState] = useState({ 
    input: '', 
    output: '',
    mode: 'remove-newlines-keep-empty'
  })
  const [textOcrState, setTextOcrState] = useState({
    input: null as File | null,
    output: '',
    loading: false
  })
  const { currentWorkflow } = useAppStore()

  const renderContent = () => {
    return (
      <div className="relative w-full h-full">
        {currentWorkflow?.tools.map(t => (
          <div
            key={t.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: t.id === tool.id ? 1 : 0,
              pointerEvents: t.id === tool.id ? 'auto' : 'none',
              transition: 'opacity 0.3s ease-in-out',
              zIndex: t.id === tool.id ? 1 : 0,
              visibility: t.id === tool.id ? 'visible' : 'hidden'
            }}
          >
            {t.type === 'component' ? (
              t.component === 'TextRemoveNewlines' ? (
                <TextRemoveNewlines />
              ) : t.component === 'TextOcr' ? (
                <TextOcr state={textOcrState} setState={setTextOcrState} />
              ) : (
                <div>未知组件: {t.component}</div>
              )
            ) : t.type === 'web-app' && t.url ? (
              <WebAppEmbed url={t.url} title={t.name} />
            ) : (
              <div>未知工具类型</div>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full h-full">
      {renderContent()}
    </div>
  )
} 