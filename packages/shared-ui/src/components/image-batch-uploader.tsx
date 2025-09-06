import '../index.css'
import { useState, useEffect, useRef } from 'react'
import { Upload, XIcon } from 'lucide-react'
import { Button } from './button'
import { cn } from '../lib/utils'

interface ImageBatchUploaderProps {
  value?: File[]
  onChange?: (files: File[]) => void
  loading?: boolean
  className?: string
  accept?: string
  maxSize?: number // 单位：MB
}

export function ImageBatchUploader({
  value = [],
  onChange,
  loading = false,
  className,
  accept = 'image/*',
  maxSize = 10
}: ImageBatchUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = []
    Array.from(files).forEach(file => {
      if (
        accept &&
        file.type &&
        !file.type.match(accept.replace('*', '.*')) &&
        !(accept === 'image/svg+xml' && file.name.toLowerCase().endsWith('.svg'))
      ) {
        return
      }
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return
      }
      validFiles.push(file)
    })
    if (validFiles.length > 0) {
      onChange?.(validFiles)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFiles(files)
    }
  }

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return
    const files: File[] = []
    for (const item of items) {
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        if (file) files.push(file)
      }
    }
    if (files.length > 0) {
      await handleFiles(files)
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
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await handleFiles(files)
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
        'relative transition-all duration-200',
        isDragging && 'ring-2 ring-primary ring-offset-2',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {(!value || value.length === 0) && (
        <div className="border-2 border-dashed rounded-lg p-4 h-96 flex flex-col items-center justify-center text-muted-foreground gap-4">
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={() => document.getElementById('batch-file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            选择图片/文件夹
          </Button>
          <input
            id="batch-file-upload"
            type="file"
            accept={accept}
            className="hidden"
            multiple
            // @ts-ignore
            webkitdirectory="true"
            onChange={handleFileChange}
          />
          <p>支持批量拖拽、粘贴、文件夹选择</p>
        </div>
      )}
      {value && value.length > 0 && (
        <div className="mt-4 bg-muted-100 rounded-lg p-4 border">
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center gap-1 text-sm font-medium text-gray-700">
              {/* <Images className="w-4 h-4" /> */}
              {value.length}
            </span>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onChange?.([])}
              aria-label="清空"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))] gap-4">
            {value.map((file, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`预览${idx}`}
                  className="max-h-32 max-w-full object-contain transition-transform duration-200 hover:scale-105 hover:ring-4 hover:ring-blue-400/60 hover:z-10"
                  style={{ boxShadow: '0 0 0 0 transparent', background: 'rgba(255,255,255,0.2)' }}
                />
                <span className="text-xs text-gray-700 font-medium truncate w-full text-center mt-1" title={file.name}>{file.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}