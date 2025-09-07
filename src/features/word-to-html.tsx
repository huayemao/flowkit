import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { FileUploader } from '../components/ui/file-uploader'
import { Copy, Check, Download, Eye, Code, FileText } from 'lucide-react'
import { useState } from 'react'
import mammoth from 'mammoth'
import { useTranslation } from '@/i18n'

export function WordToHtml() {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')
  const [state, setState] = useState({
    input: null as File | null,
    output: '',
    loading: false
  })

  const handleFileChange = async (file: File) => {
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
      setState({ ...state, input: file, output: t('common.error'), loading: false })
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

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t('tools.wordToHtml.title')}</CardTitle>
          <CardDescription>
            {t('tools.wordToHtml.subtitle')}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
          <div className="grid grid-cols-2 gap-6 flex-1">
            {/* 左侧：文件上传区域 */}
            <div className="space-y-2">
              <FileUploader
                value={state.input}
                onChange={handleFileChange}
                loading={state.loading}
                accept={t('tools.wordToHtml.fileTypes')}
                maxSize={50}
                title={t('tools.wordToHtml.selectFile')}
                description={t('tools.wordToHtml.dragDescription')}
                icon={<FileText className="h-12 w-12" />}
                className="h-full"
              />
            </div>
            
            {/* 右侧：预览/代码区域 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-2">
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === 'preview' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('preview')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {t('tools.wordToHtml.preview')}
                  </Button>
                  <Button
                    variant={viewMode === 'code' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('code')}
                  >
                    <Code className="h-4 w-4 mr-2" />
                    {t('tools.wordToHtml.code')}
                  </Button>
                </div>
                {state.output && !state.loading && (
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      {t('tools.wordToHtml.download')}
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleCopy}
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          {t('tools.wordToHtml.copied')}
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          {t('tools.wordToHtml.copy')}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="relative h-full border rounded-lg overflow-hidden">
                {state.loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-sm text-gray-600">{t('tools.wordToHtml.loading')}</p>
                    </div>
                  </div>
                                 ) : viewMode === 'preview' ? (
                   <div className="h-full w-full">
                     <iframe
                       srcDoc={`
                         <!DOCTYPE html>
                         <html>
                         <head>
                           <meta charset="UTF-8">
                           <meta name="viewport" content="width=device-width, initial-scale=1.0">
                           <title>Word转HTML预览</title>
                           <style>
                             body {
                               font-family: 'Times New Roman', serif;
                               font-size: 12pt;
                               line-height: 1.5;
                               color: #000;
                               margin: 40px;
                               padding: 0;
                               background: white;
                             }
                             
                             /* 段落样式 */
                             p {
                               margin: 0 0 12pt 0;
                               padding: 0;
                             }
                             
                             /* 标题样式 */
                             h1, h2, h3, h4, h5, h6 {
                               margin: 12pt 0 6pt 0;
                               padding: 0;
                               font-weight: bold;
                             }
                             
                             /* 表格样式 */
                             table {
                               border-collapse: collapse;
                               margin: 12pt 0;
                               width: 100%;
                             }
                             
                             table, th, td {
                               border: 1px solid #000;
                               padding: 8px;
                               vertical-align: top;
                             }
                             
                             /* 文本格式 */
                             strong, b {
                               font-weight: bold;
                             }
                             
                             em, i {
                               font-style: italic;
                             }
                             
                             u {
                               text-decoration: underline;
                             }
                             
                             del, strike {
                               text-decoration: line-through;
                             }
                             
                             sub {
                               vertical-align: sub;
                               font-size: smaller;
                             }
                             
                             sup {
                               vertical-align: super;
                               font-size: smaller;
                             }
                             
                             /* 列表样式 */
                             ul, ol {
                               margin: 12pt 0;
                               padding-left: 24pt;
                             }
                             
                             li {
                               margin: 6pt 0;
                             }
                             
                             /* 引用样式 */
                             blockquote {
                               margin: 12pt 0;
                               padding-left: 12pt;
                               border-left: 3px solid #ccc;
                             }
                             
                             /* 图片样式 */
                             img {
                               max-width: 100%;
                               height: auto;
                               margin: 12pt 0;
                             }
                             
                             /* 链接样式 */
                             a {
                               color: #0066cc;
                               text-decoration: underline;
                             }
                             
                             a:hover {
                               color: #003366;
                             }
                           </style>
                         </head>
                         <body>
                           ${state.output}
                         </body>
                         </html>
                       `}
                       className="w-full h-full border-0"
                       title="Word转HTML预览"
                       sandbox="allow-same-origin"
                     />
                   </div>
                 ) : (
                  <textarea
                    value={state.output}
                    readOnly
                    className="w-full h-full p-4 font-mono text-sm border-0 resize-none focus:outline-none"
                    placeholder="转换后的HTML代码将显示在这里..."
                  />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}