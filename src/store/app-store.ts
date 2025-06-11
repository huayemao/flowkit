import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Tool = {
  id: string
  name: string
  description: string
  path: string
}

export type AppState = {
  tools: Tool[]
  currentTool: Tool | null
  setCurrentTool: (tool: Tool) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tools: [
        {
          id: 'text-remove-newlines',
          name: '文本删除换行',
          description: '删除文本中的所有换行符',
          path: '/text-remove-newlines',
        },
        {
          id: 'excalidraw',
          name: 'Excalidraw',
          description: '手绘风格的在线白板工具',
          path: '/excalidraw',
        },
        {
          id: 'tableconvert',
          name: 'TableConvert',
          description: '表格转换工具',
          path: '/tableconvert',
        },
      ],
      currentTool: null,
      setCurrentTool: (tool) => set({ currentTool: tool }),
    }),
    {
      name: 'app-storage',
    }
  )
) 