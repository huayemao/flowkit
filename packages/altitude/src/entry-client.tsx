import './index.css'
import { StrictMode, lazy, Suspense, useEffect, useState, Component } from 'react'
import { hydrateRoot } from 'react-dom/client'
import App from './App'
import { initI18n, languages } from './i18n'
import { getPageComponent } from './entry-server'
import { parseUrlPath } from './utils/parseUrlPath'

// 定义一个加载组件
const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="text-gray-600 font-medium">Loading...</div>
  </div>
)
let PageComponent: React.FC = App





// 客户端路由处理组件
const ClientRouter = () => {
  const [loading, setLoading] = useState(true)

  // 处理URL变化，加载对应的页面组件
  const loadPageComponent = async () => {
    try {
      setLoading(true)
      // 获取当前URL路径
      const url = window.location.pathname
      // 使用与服务端相同的getPageComponent函数
      const component = await getPageComponent(url)
      PageComponent = component
    } catch (error) {
      console.error('Error loading page component:', error)
      PageComponent = App
    } finally {
      setLoading(false)
    }
  }

  // 初始化时加载组件
  useEffect(() => {
    loadPageComponent()

    // 监听URL变化（前进/后退按钮）
    const handlePopState = () => {
      loadPageComponent()
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  if (loading) {
    return <LoadingFallback />;
  }

  return <PageComponent />;
}

// 立即执行初始化
const currentUrl = window.location.pathname
const { language } = parseUrlPath(currentUrl)

initI18n(language).then(() => {
  hydrateRoot(
    document.getElementById('root')!,
    <StrictMode>
      <Suspense fallback={<LoadingFallback />}>
        <ClientRouter />
      </Suspense>
    </StrictMode>,
  )
})


