import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom'
import { MainLayout } from './components/layout/main-layout'
import { TextRemoveNewlines } from './features/text-remove-newlines'
import { WebAppEmbed } from './components/web-app-embed'
import { SettingsPage } from './pages/settings'
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
import { useState, useEffect } from 'react'

function WorkflowPage() {
  const { workflowId } = useParams()
  const { workflows, currentWorkflow, currentTool, setCurrentTool, setCurrentWorkflow } = useAppStore()
  const [textRemoveNewlinesState, setTextRemoveNewlinesState] = useState({ input: '', output: '' })

  // 当路由参数变化时更新当前工作流
  useEffect(() => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (workflow) {
      setCurrentWorkflow(workflow)
    }
  }, [workflowId, workflows, setCurrentWorkflow])

  const renderTool = (tool: typeof currentTool) => {
    if (!tool) return null

    if (tool.type === 'web-app' && tool.url) {
      return <WebAppEmbed url={tool.url} title={tool.name} />
    }

    if (tool.type === 'component') {
      switch (tool.component) {
        case 'TextRemoveNewlines':
          return (
            <TextRemoveNewlines
              state={textRemoveNewlinesState}
              setState={setTextRemoveNewlinesState}
            />
          )
        default:
          return null
      }
    }

    return null
  }

  if (!currentWorkflow) {
    return <Navigate to="/settings" replace />
  }

  return (
    <div className="flex flex-col h-screen">
      {/* 导航区域 */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {currentWorkflow.tools.map((tool) => (
                <NavigationMenuLink
                  key={tool.id}
                  className={cn(
                    'px-4 py-2 rounded-md transition-colors',
                    currentTool?.id === tool.id 
                      ? 'bg-accent text-accent-foreground' 
                      : 'hover:bg-accent/50'
                  )}
                  href={`/workflow/${currentWorkflow.id}/${tool.id}`}
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
            {renderTool(currentTool)}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/workflow/:workflowId" element={<WorkflowPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/workflow/pdf-content-extraction" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
