import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { toolConfigs } from '@/config/tools'

export type Tool = {
  id: string
  name: string
  description: string
  path?: string
  type: 'component' | 'web-app'
  component?: string
  url?: string
  icon?: string
}

export type Workflow = {
  id: string
  name: string
  description: string
  tools: Tool[]
}

export type AppState = {
  workflows: Workflow[]
  currentWorkflow: Workflow | null
  currentTool: Tool | null
  customTools: Tool[]
  setCurrentWorkflow: (workflow: Workflow) => void
  setCurrentTool: (tool: Tool) => void
  addWorkflow: (workflow: Workflow) => void
  updateWorkflow: (workflow: Workflow) => void
  deleteWorkflow: (workflowId: string) => void
  addCustomTool: (tool: Tool) => void
  updateCustomTool: (tool: Tool) => void
  removeCustomTool: (toolId: string) => void
}

// 使用工具配置生成默认工具
const createDefaultTools = (): Tool[] => {
  return toolConfigs.map(config => ({
    id: config.id,
    name: config.nameKey, // 将使用翻译键
    description: config.descriptionKey, // 将使用翻译键
    path: config.path,
    type: config.type,
    component: config.component,
    url: config.url,
    icon: config.icon
  }));
};

export const defaultTools: Tool[] = createDefaultTools();

const defaultWorkflow: Workflow = {
  id: 'pdf-content-extraction',
  name: 'PDF 内容提取',
  description: '从 PDF 中提取文本内容的工作流',
  tools: defaultTools
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      workflows: [defaultWorkflow],
      currentWorkflow: defaultWorkflow,
      currentTool: null,
      customTools: [],
      defaultTools,
      setCurrentWorkflow: (workflow) => set({ currentWorkflow: workflow }),
      setCurrentTool: (tool) => set({ currentTool: tool }),
      addWorkflow: (workflow) => set((state) => ({
        workflows: [...state.workflows, workflow]
      })),
      updateWorkflow: (workflow) => set((state) => ({
        workflows: state.workflows.map((w) =>
          w.id === workflow.id ? workflow : w
        )
      })),
      deleteWorkflow: (workflowId) => set((state) => ({
        workflows: state.workflows.filter((w) => w.id !== workflowId)
      })),
      addCustomTool: (tool) => set((state) => ({
        customTools: [...state.customTools, tool]
      })),
      updateCustomTool: (tool) => set((state) => ({
        customTools: state.customTools.map((t) => t.id === tool.id ? tool : t)
      })),
      removeCustomTool: (toolId) => set((state) => ({
        customTools: state.customTools.filter((t) => t.id !== toolId)
      }))
    }),
    {
      name: 'app-storage',
    }
  )
)