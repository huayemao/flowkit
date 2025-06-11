import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Outlet } from 'react-router-dom'
import { MainLayout } from './components/layout/main-layout'
import { SettingsPage } from './pages/settings'
import { useAppStore } from './store/app-store'
import { ToolContent } from './components/tool-content'
import { useEffect } from 'react'

function WorkflowLayout() {
  const { workflowId } = useParams()
  const { workflows, setCurrentWorkflow } = useAppStore()

  useEffect(() => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (workflow) {
      setCurrentWorkflow(workflow)
    }
  }, [workflowId, workflows, setCurrentWorkflow])

  return <Outlet />
}

function WorkflowPage() {
  const { workflowId, toolId } = useParams()
  const { workflows, currentWorkflow, currentTool, setCurrentTool } = useAppStore()

  useEffect(() => {
    const workflow = workflows.find(w => w.id === workflowId)
    if (workflow) {
      const tool = workflow.tools.find(t => t.id === toolId)
      if (tool) {
        setCurrentTool(tool)
      }
    }
  }, [workflowId, toolId, workflows, setCurrentTool])

  if (!currentWorkflow || !currentTool) {
    return <Navigate to="/settings" replace />
  }

  return <ToolContent tool={currentTool} />
}

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/workflow" element={<WorkflowLayout />}>
            <Route path=":workflowId" element={<Navigate to="text-remove-newlines" replace />} />
            <Route path=":workflowId/:toolId" element={<WorkflowPage />} />
          </Route>
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/" element={<Navigate to="/workflow/pdf-content-extraction" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
