import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ImageUploader } from '../components/ui/image-uploader'

interface TextOcrProps {
  state: {
    input: File | null
    output: string
    loading: boolean
  }
  setState: (state: { input: File | null; output: string; loading: boolean }) => void
}

export function TextOcr({ state, setState }: TextOcrProps) {
  const [copied, setCopied] = useState(false)

  const handleFileChange = async (file: File) => {
    setState({ ...state, input: file, loading: true })

    try {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async () => {
        const base64 = reader.result as string
        const base64Data = base64.split(',')[1]

        const response = await invoke('ocr_request', {
          url: 'https://www.olmocr.com/api/extract-text',
          base64Data
        })

        if (!response) {
          throw new Error('OCR 识别失败')
        }

        const data = response as { content: string }
        setState({ ...state, input: file, output: data.content || '', loading: false })
      }
    } catch (error) {
      console.error('OCR 识别错误:', error)
      setState({ ...state, input: file, output: '识别失败，请重试', loading: false })
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(state.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>OCR 文字识别</CardTitle>
          <CardDescription>
            上传图片，自动识别图片中的文字内容
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
          <div className="grid grid-cols-2 gap-6 flex-1">
            <ImageUploader
              value={state.input}
              onChange={handleFileChange}
              loading={state.loading}
              className="h-full"
            />
            
            <div className="space-y-2">
              <div className="relative h-full">
                <Textarea
                  placeholder="识别结果将显示在这里..."
                  value={state.loading ? '正在识别中...' : state.output}
                  readOnly
                  className="h-full resize-none"
                />
                {state.output && !state.loading && (
                  <Button
                    className="absolute top-2 right-2"
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        复制
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 