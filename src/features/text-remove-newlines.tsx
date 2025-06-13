import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const TEXT_MODES = {
  'remove-newlines-keep-empty': '删除换行，但保留空行',
  'remove-all': '移除所有换行',
  'remove-empty': '移除空行',
  'merge-empty': '合并连续空行',
  'trim': '去除前后空格',
} as const

export function TextRemoveNewlines() {
  const [state, setState] = useState({
    input: '',
    output: '',
    mode: 'remove-newlines-keep-empty'
  })
  const [copied, setCopied] = useState(false)

  const processText = (text: string, mode: string) => {
    switch (mode) {
      case 'remove-newlines-keep-empty':
        const lines = text.split(/\r?\n/)
        return lines.map((line, index) => {
          const nextLine = lines[index + 1]
          const isNextLineEmpty = nextLine === undefined || nextLine.trim() === ''
          if (line.trim() === '') return '\n'
          return line.trim() + (isNextLineEmpty ? '\n' : '')
        }).join('')
      case 'remove-all':
        return text.replace(/\r?\n/g, '')
      case 'remove-empty':
        return text.split(/\r?\n/).filter(line => line.trim() !== '').join('\n')
      case 'merge-empty':
        return text.replace(/\n\s*\n+/g, '\n\n')
      case 'trim':
        return text.trim()
      default:
        return text
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value
    const output = processText(input, state.mode)
    setState({ ...state, input, output })
  }

  const handleModeChange = (mode: string) => {
    const output = processText(state.input, mode)
    setState({ ...state, mode, output })
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
          <CardTitle>文本处理工具</CardTitle>
          <CardDescription>
            提供多种文本处理模式，包括换行符处理、空行处理等
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
          <div className="mb-4">
            <Select value={state.mode} onValueChange={handleModeChange}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="选择处理模式" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(TEXT_MODES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="space-y-2">
              <Textarea
                placeholder="请输入要处理的文本..."
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