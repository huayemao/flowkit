import { useState } from 'react';
import { useTranslation } from '@/i18n';
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
  const { t } = useTranslation();
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
          <CardTitle>{t('tools.convertImageLinksToWpProxy.title')}</CardTitle>
          <CardDescription>{t('tools.convertImageLinksToWpProxy.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col h-[calc(100%-8rem)]">
          <div className="grid grid-cols-2 gap-6 flex-1">
            <div className="space-y-2">
              <Textarea
                placeholder={t('tools.convertImageLinksToWpProxy.placeholder.input')}
                value={state.input}
                onChange={handleInputChange}
                className="h-full resize-none"
              />
            </div>
            <div className="space-y-2">
              <div className="relative h-full">
                <Textarea
                  placeholder={t('tools.convertImageLinksToWpProxy.placeholder.output')}
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
                        {t('tools.convertImageLinksToWpProxy.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        {t('tools.convertImageLinksToWpProxy.copy')}
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