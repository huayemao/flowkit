import { useState } from 'react'
import { Download, Play } from 'lucide-react'
import { useTranslation } from '@flowkit/shared-ui'
import { autoTrimImage, getBorderColors } from '../utils/image-trim'

// 使用workspace包导入
import { ImageBatchUploader } from '@flowkit/shared-ui'
import { Button } from '@flowkit/shared-ui'
import { ScrollArea } from '@flowkit/shared-ui'



export function AutoTrimImage() {
  const { t } = useTranslation()
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<{name: string, url: string}[]>([])
  const [loading, setLoading] = useState(false)

  const handleProcess = async () => {
    setLoading(true)
    const outs: {name: string, url: string}[] = []
    for (const file of files) {
      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      await new Promise(res => { img.onload = res })
      // 自动识别边框主色
      const borderColors = getBorderColors(img, 10, 3)
      // 默认加上黑白
      borderColors.push([0,0,0], [255,255,255])
      const blob = await autoTrimImage(img, borderColors)
      outs.push({ name: file.name.replace(/\.(jpg|jpeg|png|webp)$/i, '') + '-trim.png', url: URL.createObjectURL(blob) })
    }
    setResults(outs)
    setLoading(false)
  }

  const handleDownloadAll = () => {
    results.forEach(r => {
      const a = document.createElement('a')
      a.href = r.url
      a.download = r.name
      a.click()
    })
  }

  return (
    <ScrollArea className="rounded-lg bg-muted-50 dark:bg-muted-900 shadow-inner p-4">
      <div className="space-y-6">
        <h2 className="text-lg font-bold">{t('autoTrimImage.batchUpload')}</h2>
        <ImageBatchUploader value={files} onChange={setFiles} loading={loading} />
        
        <div className="flex gap-3">
          <Button 
            onClick={handleProcess} 
            disabled={loading || files.length===0}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Play className="w-4 h-4" />
            {loading ? t('common.processing') : t('autoTrimImage.startProcessing')}
          </Button>
          
          {results.length > 0 && (
            <Button 
              onClick={handleDownloadAll} 
              variant="outline"
            >
              <Download className="w-4 h-4" />
              {t('autoTrimImage.exportAll')}
            </Button>
          )}
        </div>

        {results.length > 0 && (
          <div className="space-y-4">
            <div
              className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4"
              style={{ backdropFilter: 'blur(2px)' }}
            >
              {results.map(r => (
                <div
                  key={r.url}
                  className="flex flex-col items-center group"
                  style={{ minHeight: 120 }}
                >
                  <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                    <img
                      src={r.url}
                      alt={r.name}
                      className="max-h-28 max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  </div>
                  <div className="w-full flex flex-col items-center mt-3 space-y-1">
                    <span className="text-xs text-gray-700 dark:text-gray-300 font-medium truncate w-full text-center" title={r.name}>
                      {r.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 px-2 text-xs text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 transition-all duration-200"
                      onClick={() => {
                        const a = document.createElement('a')
                        a.href = r.url
                        a.download = r.name
                        a.click()
                      }}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  )
}