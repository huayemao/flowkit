import './index.css'
import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App'
import { init18n } from './i18n'

// 立即执行初始化
init18n().then(() => {
  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

