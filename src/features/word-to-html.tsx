import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Copy, Check, FileText, Download } from 'lucide-react'
import { useState } from 'react'
import mammoth from 'mammoth'

export function WordToHtml() {
  const [copied, setCopied] = useState(false)
  const [state, setState] = useState({
    input: null as File | null,
    output: '',
    loading: false
  })

  const handleFileChange = async (file: File) => {
    // 检查文件类型
    if (!file.name.toLowerCase().endsWith('.docx') && !file.name.toLowerCase().endsWith('.doc')) {
      alert('请选择Word文档文件（.docx 或 .doc）')
      return
    }

    setState({ ...state, input: file, loading: true })

    try {
      // 使用 mammoth.js 进行转换
      const arrayBuffer = await file.arrayBuffer()
      
      // 使用 mammoth.js 配置，保持段落分割和文本格式
      const options = {
        styleMap: [
          // 标题样式
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh", 
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Heading 4'] => h4:fresh",
          "p[style-name='Heading 5'] => h5:fresh",
          "p[style-name='Heading 6'] => h6:fresh",
          // 列表样式
          "p[style-name='List Paragraph'] => li",
          "p[style-name='List Bullet'] => li",
          "p[style-name='List Number'] => li",
          // 引用样式
          "p[style-name='Quote'] => blockquote",
          "p[style-name='Intense Quote'] => blockquote.intense",
          // 文本格式映射 - 这些是必需的，用于保持文本格式
          "b => strong",
          "i => em",
          "u => u",
          "strike => del",
          "sub => sub",
          "sup => sup"
        ],
        ignoreEmptyParagraphs: false
      }

      const result = await mammoth.convertToHtml({ arrayBuffer }, options)
      
      if (result.value) {
        // 直接使用转换结果，保持Word原始样式
        setState({ ...state, input: file, output: result.value, loading: false })
      } else {
        throw new Error('转换结果为空')
      }
    } catch (error) {
      console.error('Word转HTML错误:', error)
      setState({ ...state, input: file, output: '转换失败，请重试', loading: false })
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(state.output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (!state.output) return
    
    // 创建完整的HTML文档用于下载
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.input?.name || 'Word文档'}</title>
    <style>
        body { 
            font-family: 'Times New Roman', serif; 
            margin: 40px; 
            line-height: 1.5;
            color: #000;
            font-size: 12pt;
        }
        /* 保持Word原始样式 */
        p { margin: 0 0 12pt 0; }
        h1, h2, h3, h4, h5, h6 { margin: 12pt 0 6pt 0; }
        table { border-collapse: collapse; margin: 12pt 0; }
        table, th, td { border: 1px solid #000; }
        th, td { padding: 8px; vertical-align: top; }
        /* 保持文本格式 */
        strong, b { font-weight: bold; }
        em, i { font-style: italic; }
        u { text-decoration: underline; }
        del, strike { text-decoration: line-through; }
        sub { vertical-align: sub; font-size: smaller; }
        sup { vertical-align: super; font-size: smaller; }
        /* 列表样式 */
        ul, ol { margin: 12pt 0; padding-left: 24pt; }
        li { margin: 6pt 0; }
        /* 引用样式 */
        blockquote { margin: 12pt 0; padding-left: 12pt; border-left: 3px solid #ccc; }
    </style>
</head>
<body>
    ${state.output}
</body>
</html>`
    
    const blob = new Blob([fullHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = state.input?.name.replace(/\.(docx?)$/i, '.html') || 'converted.html'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileChange(files[0])
    }
  }

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Word转HTML</CardTitle>
          <CardDescription>
            上传Word文档，自动转换为HTML格式
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* 左侧：文件上传区域 */}
            <div className="space-y-2">
              <div
                className={`border-2 border-dashed rounded-lg p-6 h-full flex flex-col items-center justify-center transition-colors ${
                  state.loading 
                    ? 'border-blue-300 bg-blue-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {state.loading ? (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm text-gray-600">正在转换中...</p>
                  </div>
                ) : state.input ? (
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-green-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">{state.input.name}</p>
                    <p className="text-xs text-gray-500 mt-1">点击重新选择文件</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-900">拖拽Word文件到此处</p>
                    <p className="text-xs text-gray-500 mt-1">或点击选择文件</p>
                  </div>
                )}
                
                <input
                  type="file"
                  accept=".doc,.docx"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileChange(file)
                  }}
                  className="hidden"
                  id="word-file-input"
                />
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById('word-file-input')?.click()}
                  disabled={state.loading}
                >
                  选择Word文件
                </Button>
              </div>
            </div>
            
            {/* 右侧：HTML输出区域 */}
            <div className="space-y-2">
              <div className="relative h-full">
                <Textarea
                  placeholder="转换后的HTML代码将显示在这里..."
                  value={state.loading ? '正在转换中...' : state.output}
                  readOnly
                  className="h-full resize-none font-mono text-sm"
                />
                {state.output && !state.loading && (
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      下载
                    </Button>
                    <Button
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 