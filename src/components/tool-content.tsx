import { useState } from 'react'
import { useTranslation } from '@/i18n'
import { TextRemoveNewlines } from '../features/text-remove-newlines'
import { TextOcr } from '../features/text-ocr'
import { WebAppEmbed } from './web-app-embed'
import { Tool } from '../types.ts'
import { useAppStore } from '../store/app-store'
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from './ui/stepper'
import { SvgScaler } from '../features/svg-scaler.tsx'
import { AutoTrimImage } from '../features/auto-trim-image'
import { ToolRenderer } from './tool-renderer'

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
  const { currentWorkflow, setCurrentTool } = useAppStore()
  const [activeStep, setActiveStep] = useState(0)

  const renderContent = () => {
    return (
      <div className="relative w-full h-full">
        {currentWorkflow?.tools.map((t, index) => (
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
            <ToolRenderer tool={t} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="p-4 pt-0  min-w-[600px] max-w-full">
        <Stepper
          value={currentWorkflow?.tools.findIndex(t => t.id === tool.id)! + 1}
          onValueChange={setActiveStep}
          className="w-full"
        >
          {currentWorkflow?.tools.map((t, index) => (
            <StepperItem
              key={t.id}
              step={index + 1}
              className="max-md:items-start [&:not(:last-child)]:flex-1"
            >
              <StepperTrigger className="max-md:flex-col" onClick={(e) => {
                e.preventDefault();
                setCurrentTool(t);
              }}>
                <StepperIndicator />
                <div className="text-center md:text-left">
                  <StepperTitle>{t.name}</StepperTitle>
                </div>
              </StepperTrigger>
              {index < (currentWorkflow?.tools.length ?? 0) - 1 && (
                <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
              )}
            </StepperItem>
          ))}
        </Stepper>
      </div>
      <div className="flex-grow w-full">
        {renderContent()}
      </div>
    </div>
  )
}