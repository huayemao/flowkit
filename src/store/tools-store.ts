import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TextRemoveNewlinesState {
  input: string
  output: string
}

interface ToolsState {
  textRemoveNewlines: TextRemoveNewlinesState
  setTextRemoveNewlinesState: (state: Partial<TextRemoveNewlinesState>) => void
}

export const useToolsStore = create<ToolsState>()(
  persist(
    (set) => ({
      textRemoveNewlines: {
        input: '',
        output: '',
      },
      setTextRemoveNewlinesState: (state) =>
        set((prev) => ({
          textRemoveNewlines: { ...prev.textRemoveNewlines, ...state },
        })),
    }),
    {
      name: 'tools-storage',
    }
  )
) 