import { BrowserRouter as Router, Routes, Route, Navigate, useParams, Outlet, useNavigate } from 'react-router-dom'
import { MainLayout } from './components/layout/main-layout'
import { SettingsPage } from './pages/settings'
import { useAppStore } from './store/app-store'
import { ToolContent } from './components/tool-content'
import { useEffect } from 'react'
import { WorkflowEditDialog } from './components/workflow/workflow-edit-dialog'
import WorkflowsPage from "@/pages/workflows"
import ToolsPage from "@/pages/tools"
import ToolPage from "@/pages/tool"

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

function WorkflowDefaultPage() {
  const { workflowId } = useParams()
  const { workflows } = useAppStore()
  const workflow = workflows.find(w => w.id === workflowId)
  
  if (!workflow || workflow.tools.length === 0) {
    return <Navigate to="/settings" replace />
  }

  return <Navigate to={`${workflow.tools[0].id}`} replace />
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

function WorkflowEditPage() {
  const { workflowId } = useParams()
  const { workflows } = useAppStore()
  const navigate = useNavigate()
  const workflow = workflows.find(w => w.id === workflowId)
  
  if (!workflow) {
    return <Navigate to="/settings" replace />
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      navigate(`/workflow/${workflowId}`)
    }
  }

  return <WorkflowEditDialog workflowId={workflowId!} open={true} onOpenChange={handleOpenChange} />
}

function App() {
  return (
    <Router>
      <MainLayout>
          <Routes>
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/:toolId" element={<ToolPage />} />
            <Route path="/workflow" element={<WorkflowLayout />}>
              <Route path=":workflowId" element={<WorkflowDefaultPage />} />
              <Route path=":workflowId/:toolId" element={<WorkflowPage />} />
              <Route path=":workflowId/edit" element={<WorkflowEditPage />} />
            </Route>
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/" element={<Navigate to="/tools" replace />} />
          </Routes>
      </MainLayout>
    </Router>
  )
}

export default App
