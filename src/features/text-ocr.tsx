import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/core'
import { ImageUploader } from '../components/ui/image-uploader'
import { useTranslation } from '@/i18n'



export function TextOcr() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [textOcrState, setTextOcrState] = useState({
    input: null as File | null,
    output: '',
    loading: false
  })
  const handleFileChange = async (file: File) => {
    setTextOcrState({ ...textOcrState, input: file, loading: true })

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
        setTextOcrState({ ...textOcrState, input: file, output: data.content || '', loading: false })
      }
    } catch (error) {
      console.error('OCR 识别错误:', error)
      setTextOcrState({ ...textOcrState, input: file, output: t('tools.textOcr.error'), loading: false })
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textOcrState.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t('tools.textOcr.title')}</CardTitle>
          <CardDescription>
            {t('tools.textOcr.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
          <div className="grid grid-cols-2 gap-6 flex-1">
            <ImageUploader
              value={textOcrState.input}
              onChange={handleFileChange}
              loading={textOcrState.loading}
              className="h-full"
            />
            
            <div className="space-y-2">
              <div className="relative h-full">
                <Textarea
                  placeholder={t('tools.textOcr.placeholder.output')}
                  value={textOcrState.loading ? t('tools.textOcr.loading') : textOcrState.output}
                  readOnly
                  className="h-full resize-none"
                />
                {textOcrState.output && !textOcrState.loading && (
                  <Button
                    className="absolute top-2 right-2"
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        {t('tools.textOcr.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('tools.textOcr.copy')}
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