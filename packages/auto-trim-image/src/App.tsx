import { AutoTrimImage } from './components/auto-trim-image'


function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              图片边框去除工具
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              智能识别并去除图片周围的边框，支持批量处理
            </p>
          </div>
          <AutoTrimImage />
        </div>
      </div>
    </div>
  )
}

export default App