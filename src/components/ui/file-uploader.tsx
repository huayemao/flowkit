import { useState, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'
import { Upload, FileText, Trash2, X } from 'lucide-react'
import { Button } from './button'

interface FileUploaderProps {
  value?: File | null
  onChange?: (file: File | null) => void
  loading?: boolean
  className?: string
  accept?: string
  maxSize?: number // 单位：MB
  title?: string
  description?: string
  icon?: React.ReactNode
}

export function FileUploader({
  value,
  onChange,
  loading = false,
  className,
  accept = '*/*',
  maxSize = 10,
  title = '选择文件',
  description = '拖拽文件到此处或粘贴文件',
  icon = <FileText className="h-12 w-12" />
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const dropZoneRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // 检查文件类型
    if (accept && accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
      const fileType = file.type

      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.toLowerCase()
        } else if (type.includes('*')) {
          const pattern = type.replace('*', '.*')
          return fileType.match(pattern) || file.name.toLowerCase().match(pattern)
        } else {
          return fileType === type
        }
      })

      if (!isAccepted) {
        alert('请上传正确的文件类型')
        return
      }
    }

    // 检查文件大小
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`文件大小不能超过 ${maxSize}MB`)
      return
    }

    onChange?.(file)
  }

  const handleFileSelect = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleFile(file)
    }
    // 重置 input 值，允许选择相同文件
    e.target.value = ''
  }

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (!items) return

    for (const item of items) {
      if (item.type.startsWith('image/') || item.type.startsWith('text/')) {
        const file = item.getAsFile()
        if (file) {
          await handleFile(file)
          break
        }
      }
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    console.log('handleDragOver')
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // 只有当鼠标真正离开拖拽区域时才设置 isDragging 为 false
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragging(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    console.log('sdfsddf')
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      await handleFile(files[0])
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
         <div className="border rounded-lg p-3 h-full relative group">
           <div className="flex items-center gap-3">
             <div className="text-muted-foreground">
               {icon}
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium text-foreground truncate">{value.name}</p>
               <p className="text-xs text-muted-foreground">{(value.size / 1024 / 1024).toFixed(2)} MB</p>
             </div>
           </div>
           
           {/* 删除按钮 - 右上角图标 */}
           <button
             onClick={() => onChange?.(null)}
             disabled={loading}
             className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
             title="删除文件"
           >
             <X className="h-4 w-4 text-gray-500 hover:text-red-500" />
           </button>
           
           {loading && (
             <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
             </div>
           )}
         </div>
      ) : (
        <div className="border-2 border-dashed rounded-lg p-6 h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
          <div className="text-gray-400">
            {icon}
          </div>
          <Button
            variant="outline"
            className="w-[200px]"
            onClick={handleFileSelect}
            disabled={loading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {title}
          </Button>
          <p>{description}</p>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
