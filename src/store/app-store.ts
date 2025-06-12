import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tool = {
  id: string
  name: string
  description: string
  path: string
  type: 'component' | 'web-app'
  component?: string
  url?: string
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
  removeCustomTool: (toolId: string) => void
}

export const defaultTools: Tool[] = [
  {
    id: 'text-remove-newlines',
    name: '文本删除换行',
    description: '删除文本中的所有换行符',
    path: '/text-remove-newlines',
    type: 'component',
    component: 'TextRemoveNewlines'
  },
  {
    id: 'text-ocr',
    name: 'OCR 文字识别',
    description: '识别图片中的文字内容',
    path: '/text-ocr',
    type: 'component',
    component: 'TextOcr'
  },
  {
    id: 'stackedit',
    name: 'StackEdit',
    description: '在线 Markdown 编辑器',
    path: '/stackedit',
    type: 'web-app',
    url: 'https://stackedit.cn/app'
  },
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    description: '手绘风格的在线白板工具',
    path: '/excalidraw',
    type: 'web-app',
    url: 'https://excalidraw.com/'
  },
  {
    id: 'tableconvert',
    name: 'TableConvert',
    description: '表格转换工具',
    path: '/tableconvert',
    type: 'web-app',
    url: 'https://tableconvert.com/'
  },
  {
    id: 'baimiao',
    name: '白描',
    description: '在线图片文字识别工具',
    path: '/baimiao',
    type: 'web-app',
    url: 'https://web.baimiaoapp.com/'
  }
]

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
      removeCustomTool: (toolId) => set((state) => ({
        customTools: state.customTools.filter((t) => t.id !== toolId)
      }))
    }),
    {
      name: 'app-storage',
    }
  )
) 