export interface Tool {
  id: string
  name: string
  type: 'component' | 'web-app'
  component?: string
  url?: string
} 