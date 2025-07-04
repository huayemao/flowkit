import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tool = {
  id: string
  name: string
  description: string
  path?: string
  type: 'component' | 'web-app'
  component?: string
  url?: string
  icon?: string // 新增 icon 字段，支持 svg 字符串或图标名
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

export const defaultTools: Tool[] = [
  {
    id: 'text-remove-newlines',
    name: '文本删除换行',
    description: '删除文本中的所有换行符',
    path: '/text-remove-newlines',
    type: 'component',
    component: 'TextRemoveNewlines',
    icon: 'WrapText' // lucide-react 图标名
  },
  {
    id: 'text-ocr',
    name: 'OCR 文字识别',
    description: '识别图片中的文字内容',
    path: '/text-ocr',
    type: 'component',
    component: 'TextOcr',
    icon: 'ScanText' // lucide-react 图标名
  },
  {
    id: 'svg-scaler',
    name: 'SVG 矢量图缩放',
    description: 'SVG 文件缩放与导出',
    path: '/svg-scaler',
    type: 'component',
    component: 'SvgScaler',
    icon: 'MoveDiagonal' // lucide-react 图标名
  },
  {
    id: 'auto-trim-image',
    name: '图片去边框',
    description: '自动批量去除图片黑边或白边',
    path: '/auto-trim-image',
    type: 'component',
    component: 'AutoTrimImage',
    icon: 'Crop' // lucide-react 图标名
  },
  {
    id: 'convert-image-links-to-wp-proxy',
    name: 'md 图片加转 WP 代理',
    description: '批量将 Markdown 图片链接转为 WordPress 代理链接',
    path: '/convert-image-links-to-wp-proxy',
    type: 'component',
    component: 'ConvertImageLinksToWpProxy',
    icon: 'Link' // lucide-react 图标名
  },
  {
    id: 'stackedit',
    name: 'StackEdit',
    description: '在线 Markdown 编辑器',
    path: '/stackedit',
    type: 'web-app',
    url: 'https://stackedit.cn/app',
    icon: 'FileText' // lucide-react 图标名
  },
  {
    id: 'excalidraw',
    name: 'Excalidraw',
    description: '手绘风格的在线白板工具',
    path: '/excalidraw',
    type: 'web-app',
    url: 'https://excalidraw.com/',
    icon: 'PenTool' // lucide-react 图标名
  },
  {
    id: 'tableconvert',
    name: 'TableConvert',
    description: '表格转换工具',
    path: '/tableconvert',
    type: 'web-app',
    url: 'https://tableconvert.com/',
    icon: 'Table' // lucide-react 图标名
  },
  {
    id: 'baimiao',
    name: '白描',
    description: '在线图片文字识别工具',
    path: '/baimiao',
    type: 'web-app',
    url: 'https://web.baimiaoapp.com/',
    icon: 'Image' // lucide-react 图标名
  },

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