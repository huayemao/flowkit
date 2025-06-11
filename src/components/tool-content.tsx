import { useState } from 'react'
import { TextRemoveNewlines } from '../features/text-remove-newlines'
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
  const [textRemoveNewlinesState, setTextRemoveNewlinesState] = useState({ input: '', output: '' })
  const { currentWorkflow } = useAppStore()

  const renderContent = () => {
    if (tool.type === 'component') {
      switch (tool.component) {
        case 'TextRemoveNewlines':
          return <TextRemoveNewlines state={textRemoveNewlinesState} setState={setTextRemoveNewlinesState} />
        default:
          return <div>未知组件: {tool.component}</div>
      }
    } else if (tool.type === 'web-app') {
      return (
        <div className="relative w-full h-full">
          {/* 同时渲染所有 iframe，通过 CSS 控制显示/隐藏，不要轻易删除这个部分的代码，否则会导致 iframe 状态维持问题 */}
          {currentWorkflow?.tools.map(t => (
            t.type === 'web-app' && t.url && (
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
                <WebAppEmbed url={t.url} title={t.name} />
              </div>
            )
          ))}
        </div>
      )
    }
    return <div>未知工具类型</div>
  }

  return (
    <div className="w-full h-full">
      {renderContent()}
    </div>
  )
} 