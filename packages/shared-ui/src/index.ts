import './index.css'

// UI 组件
export { Button } from './components/button'
export { ScrollArea } from './components/scroll-area'
export { ImageBatchUploader } from './components/image-batch-uploader'
export { ThemeToggle } from './components/theme-toggle'
export { Toaster } from './components/sonner'
export { ImageDiffViewer } from './components/image-diff-viewer'

// 通知和工具
export { toast } from 'sonner'

// i18n 相关
export { initI18n, changeLanguage, useTranslation } from './i18n'
export { LanguageSwitcher } from './components/language-switcher'

// 工具函数
export { cn } from './lib/utils'
export * from './components/dialog'
export * from './components/dialog-lite'