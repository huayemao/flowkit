import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { Upload } from 'lucide-react'
import { Button } from './button'

interface ImageUploaderProps {
  value?: File | null
  onChange?: (file: File) => void
  loading?: boolean
  className?: string
  accept?: string
  maxSize?: number // 单位：MB
}

export function ImageUploader({
  value,
  onChange,
  loading = false,
  className,
  accept = 'image/*',
  maxSize = 10
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // 检查文件类型
    if (
      accept &&
      file.type &&
      !file.type.match(accept.replace('*', '.*')) &&
      !(accept === 'image/svg+xml' && file.name.toLowerCase().endsWith('.svg'))
    ) {
      alert('请上传正确的文件类型')
      return
    }

    // 检查文件大小
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`文件大小不能超过 ${maxSize}MB`)
      return
    }

    onChange?.(file)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) {
          await handleFile(file)
          break
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await handleFile(file)
    }
  }

  useEffect(() => {
    const dropZone = dropZoneRef.current
    if (dropZone) {
      dropZone.addEventListener('paste', handlePaste as any)
      return () => {
        dropZone.removeEventListener('paste', handlePaste as any)
      }
    }
  }, [])

  return (
    <div 
      ref={dropZoneRef}
      className={cn(
        "relative transition-all duration-200",
        isDragging && "ring-2 ring-primary ring-offset-2",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {value ? (
        <div className="border rounded-lg p-4 h-full flex items-center justify-center relative group">
          <img
            src={URL.createObjectURL(value)}
            alt="预览"
            className="max-h-full max-w-full object-contain"
          />
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-4 h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            选择图片
          </Button>
          <input
            id="file-upload"
            type="file"
            accept={accept}
            className="hidden"
            onChange={handleFileChange}
          />
          <p>拖拽图片到此处或粘贴图片</p>
        </div>
      )}
    </div>
  )
} 