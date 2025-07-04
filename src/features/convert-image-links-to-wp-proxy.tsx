import { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Copy, Check } from 'lucide-react'

function convertImageLinksToWpProxy(markdownText: string): string {
  const imageLinkRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  const convertedText = markdownText.replace(imageLinkRegex, function(match, altText, imageUrl) {
    if (!imageUrl.startsWith('https://i0.wp.com/')) {
      if (imageUrl.startsWith('https://')) {
        imageUrl = imageUrl.substring(8);
      }
      imageUrl = `https://i0.wp.com/${imageUrl}`;
    }
    return `![${altText}](${imageUrl})`;
  });
  return convertedText;
}

export default function ConvertImageLinksToWpProxy() {
  const [state, setState] = useState({
    input: '',
    output: ''
  })
  const [copied, setCopied] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    const output = convertImageLinksToWpProxy(input)
    setState({ input, output })
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
          <CardTitle>Markdown 图片链接转 WP 代理</CardTitle>
          <CardDescription>
            批量将 Markdown 图片链接转换为 WordPress 代理链接（i0.wp.com），适合图床加速。
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="space-y-2">
              <Textarea
                placeholder="请输入 Markdown 文本..."
                value={state.input}
                onChange={handleInputChange}
                className="h-full resize-none"
              />
            </div>
            <div className="space-y-2">
              <div className="relative h-full">
                <Textarea
                  placeholder="转换后的文本将显示在这里..."
                  value={state.output}
                  readOnly
                  className="h-full resize-none"
                />
                {state.output && (
                  <Button
                    className="absolute top-2 right-2"
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />已复制
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />复制
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