import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Textarea } from '../components/ui/textarea'
import { Copy, ArrowRight } from 'lucide-react'

interface TextRemoveNewlinesProps {
  state: {
    input: string
    output: string
  }
  setState: (state: { input: string; output: string }) => void
}

export function TextRemoveNewlines({ state, setState }: TextRemoveNewlinesProps) {
  const handleConvert = () => {
    const result = state.input.replace(/\r?\n/g, '')
    setState({ ...state, output: result })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(state.output)
  }

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>文本换行符移除</CardTitle>
          <CardDescription>
            移除文本中的所有换行符，使其成为单行文本
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)] space-y-6">
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="请输入要处理的文本..."
              value={state.input}
              onChange={(e) => setState({ ...state, input: e.target.value })}
              className="h-full resize-none"
            />
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleConvert}
              className="gap-2"
              disabled={!state.input}
            >
              转换 <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1 space-y-2">
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
                  variant="ghost"
                  size="sm"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 