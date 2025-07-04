import { useState } from 'react'
import { ImageBatchUploader } from '../components/ui/image-batch-uploader'
import { Button } from '../components/ui/button'
import { ScrollArea } from '../components/ui/scroll-area'

// 检测并裁剪图片黑/白边
function autoTrimImage(img: HTMLImageElement, bgColors = [[0,0,0],[255,255,255]], tolerance = 10): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)
    const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height)
    // 边界检测
    let top = 0, bottom = height - 1, left = 0, right = width - 1
    function isBg(x: number, y: number) {
      const idx = (y * width + x) * 4
      const r = data[idx], g = data[idx+1], b = data[idx+2]
      return bgColors.some(([br,bg,bb]) =>
        Math.abs(r-br)<=tolerance && Math.abs(g-bg)<=tolerance && Math.abs(b-bb)<=tolerance
      )
    }
    // top
    scanTop: for (; top < height; top++) {
      for (let x = 0; x < width; x++) if (!isBg(x, top)) break scanTop
    }
    // bottom
    scanBottom: for (; bottom > top; bottom--) {
      for (let x = 0; x < width; x++) if (!isBg(x, bottom)) break scanBottom
    }
    // left
    scanLeft: for (; left < width; left++) {
      for (let y = top; y <= bottom; y++) if (!isBg(left, y)) break scanLeft
    }
    // right
    scanRight: for (; right > left; right--) {
      for (let y = top; y <= bottom; y++) if (!isBg(right, y)) break scanRight
    }
    const w = right-left+1, h = bottom-top+1
    // 裁剪
    const outCanvas = document.createElement('canvas')
    outCanvas.width = w
    outCanvas.height = h
    outCanvas.getContext('2d')!.drawImage(canvas, left, top, w, h, 0, 0, w, h)
    outCanvas.toBlob(blob => resolve(blob!), 'image/png')
  })
}

// 辅助函数：采样图片四周像素，统计主色块
function getBorderColors(img: HTMLImageElement, tolerance = 10, maxColors = 3): number[][] {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(img, 0, 0)
  const { data, width, height } = ctx.getImageData(0, 0, img.width, img.height)
  const colorMap: Record<string, { color: number[], count: number }> = {}
  // 采样四周像素
  const samplePoints: [number, number][] = []
  for (let x = 0; x < width; x++) {
    samplePoints.push([x, 0]) // top
    samplePoints.push([x, height - 1]) // bottom
  }
  for (let y = 1; y < height - 1; y++) {
    samplePoints.push([0, y]) // left
    samplePoints.push([width - 1, y]) // right
  }
  // 统计颜色
  for (const [x, y] of samplePoints) {
    const idx = (y * width + x) * 4
    const r = data[idx], g = data[idx+1], b = data[idx+2]
    // 归一化到tolerance分组，减少色彩抖动
    const key = `${Math.round(r/tolerance)*tolerance},${Math.round(g/tolerance)*tolerance},${Math.round(b/tolerance)*tolerance}`
    if (!colorMap[key]) colorMap[key] = { color: [r, g, b], count: 0 }
    colorMap[key].count++
  }
  // 排序，取出现最多的maxColors种
  const sorted = Object.values(colorMap).sort((a, b) => b.count - a.count)
  return sorted.slice(0, maxColors).map(item => item.color)
}

export function AutoTrimImage() {
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
      <div className="space-y-4">
        <h2 className="text-lg font-bold">批量去除图片边框</h2>
        <ImageBatchUploader value={files} onChange={setFiles} loading={loading} />
        <Button onClick={handleProcess} disabled={loading || files.length===0}>开始处理</Button>
        {results.length > 0 && (
          <div>
            <Button onClick={handleDownloadAll} variant="outline">批量下载全部</Button>
            <div
              className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4"
              style={{ backdropFilter: 'blur(2px)' }}
            >
              {results.map(r => (
                <div
                  key={r.url}
                  className="flex flex-col items-center"
                  style={{ minHeight: 120 }}
                >
                  <img
                    src={r.url}
                    alt={r.name}
                    className="max-h-28 max-w-full object-contain transition-transform duration-200 hover:scale-105 hover:ring-4 hover:ring-blue-400/60 hover:z-10"
                    style={{ transition: 'box-shadow 0.2s' }}
                  />
                  <div className="w-full flex flex-col items-center mt-1">
                    <span className="text-xs text-gray-700 font-medium truncate w-full text-center" title={r.name}>{r.name}</span>
                    <a
                      href={r.url}
                      download={r.name}
                      className="text-xs mt-1 underline text-blue-600 hover:text-blue-800 transition-colors"
                    >下载</a>
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