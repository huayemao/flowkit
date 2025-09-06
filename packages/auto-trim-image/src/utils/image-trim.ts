// 检测并裁剪图片黑/白边
export function autoTrimImage(
  img: HTMLImageElement, 
  bgColors = [[0,0,0],[255,255,255]], 
  tolerance = 10
): Promise<Blob> {
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
export function getBorderColors(
  img: HTMLImageElement, 
  tolerance = 10, 
  maxColors = 3
): number[][] {
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