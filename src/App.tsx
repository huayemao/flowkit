import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './components/layout/main-layout'
import { TextRemoveNewlines } from './features/text-remove-newlines'
import { Excalidraw } from './features/excalidraw'
import { TableConvert } from './features/tableconvert'
import { useAppStore } from './store/app-store'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './components/ui/navigation-menu'
import { Separator } from './components/ui/separator'
import { cn } from './lib/utils'
import { useState } from 'react'

function App() {
  const { tools, currentTool, setCurrentTool } = useAppStore()
  const [textRemoveNewlinesState, setTextRemoveNewlinesState] = useState({ input: '', output: '' })

  return (
    <Router>
      <MainLayout>
        <div className="flex flex-col h-screen">
          {/* 导航区域 */}
          <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container py-4">
              <NavigationMenu>
                <NavigationMenuList className="gap-2">
                  {tools.map((tool) => (
                    <NavigationMenuLink
                      key={tool.id}
                      className={cn(
                        'px-4 py-2 rounded-md transition-colors',
                        currentTool?.id === tool.id 
                          ? 'bg-accent text-accent-foreground' 
                          : 'hover:bg-accent/50'
                      )}
                      href={`/${tool.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        setCurrentTool(tool)
                      }}
                    >
                      {tool.name}
                    </NavigationMenuLink>
                  ))}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>

          <Separator />

          {/* 内容区域 */}
          <div className="flex-1 overflow-hidden">
            <div className="container h-full py-6">
              <div className="h-full">
                {/* 文本换行符移除工具 */}
                <div 
                  className={cn(
                    'h-full',
                    currentTool?.id !== 'text-remove-newlines' && 'hidden'
                  )}
                >
                  <TextRemoveNewlines 
                    state={textRemoveNewlinesState}
                    setState={setTextRemoveNewlinesState}
                  />
                </div>

                {/* Excalidraw 工具 */}
                <div 
                  className={cn(
                    'h-full',
                    currentTool?.id !== 'excalidraw' && 'hidden'
                  )}
                >
                  <Excalidraw />
                </div>

                {/* TableConvert 工具 */}
                <div 
                  className={cn(
                    'h-full',
                    currentTool?.id !== 'tableconvert' && 'hidden'
                  )}
                >
                  <TableConvert />
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </Router>
  )
}

export default App
