import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Copy, Check, Download, RotateCcw } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { ImageUploader } from '../components/ui/image-uploader';
import { useTranslation } from '@/i18n';

function processSvg(svgText: string, scale: number): { svgString: string, width: string, height: string, naturalWidth: number } {
  if (!svgText) return { svgString: '', width: '100%', height: 'auto', naturalWidth: 0 };
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, 'image/svg+xml');
    const svg = doc.querySelector('svg');
    if (!svg) return { svgString: svgText, width: '100%', height: 'auto', naturalWidth: 0 };
    const viewBox = svg.getAttribute('viewBox');
    let naturalWidth = 0;
    if (viewBox) {
      const [, , w, h] = viewBox.split(/\s+/).map(Number);
      naturalWidth = w;
      const width = (w * scale).toString();
      const height = (h * scale).toString();
      svg.setAttribute('width', width);
      svg.setAttribute('height', height);
    }
    const serializer = new XMLSerializer();
    return {
      svgString: serializer.serializeToString(svg),
      width: svg.getAttribute('width') || '100%',
      height: svg.getAttribute('height') || 'auto',
      naturalWidth,
    };
  } catch {
    return { svgString: svgText, width: '100%', height: 'auto', naturalWidth: 0 };
  }
}

export function SvgScaler() {
  const { t } = useTranslation();
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');
  const [scale, setScale] = useState(1.0);
  const [copied, setCopied] = useState(false);
  const [targetWidth, setTargetWidth] = useState(960);

  const handleFileChange = async (file: File) => {
    if (!file || !file.type.includes('image/svg+xml')) {
      alert(t('tools.svgScaler.selectFile'));
      return;
    }
    setSvgFile(file);
    const text = await file.text();
    setSvgContent(text);
  };

  const handleCopy = async () => {
    const { svgString } = processSvg(svgContent, scale);
    await navigator.clipboard.writeText(svgString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const { svgString } = processSvg(svgContent, scale);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = svgFile?.name || 'scaled.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSetWidth = () => {
    const { naturalWidth } = processSvg(svgContent, 1);
    if (naturalWidth > 0) {
      setScale(targetWidth / naturalWidth);
    }
  };

  const handleReset = () => {
    setSvgFile(null);
    setSvgContent('');
    setScale(1.0);
    setCopied(false);
    setTargetWidth(960);
  };

  const { svgString, width } = processSvg(svgContent, scale);

  return (
    <div className="h-full">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{t('tools.svgScaler.title')}</CardTitle>
          <CardDescription>{t('tools.svgScaler.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 h-[calc(100%-8rem)]">
          <ScrollArea className="flex-1 border rounded p-2 bg-muted">
            {!svgContent && (
              <div className="flex flex-1 min-h-[600px] h-full items-center justify-center">
                <ImageUploader
                  value={svgFile}
                  onChange={handleFileChange}
                  accept="image/svg+xml"
                  maxSize={5}
                  className="w-4/5 h-96"
                />
              </div>
            )}
            {svgContent && (
              <div className="overflow-x-auto" style={{ minWidth: width }} dangerouslySetInnerHTML={{ __html: svgString }} />
            )}
          </ScrollArea>
          {svgContent && (
            <div className="flex flex-wrap gap-4 items-center mt-4">
              <Input
                type="number"
                step="0.1"
                min="0.1"
                value={scale}
                onChange={e => setScale(Number(e.target.value) || 1)}
                className="w-24"
                placeholder={t('tools.svgScaler.scale')}
              />
              <Input
                type="number"
                min="1"
                value={targetWidth}
                onChange={e => setTargetWidth(Number(e.target.value) || 1)}
                className="w-28"
                placeholder={t('tools.svgScaler.targetWidth')}
              />
              <Button onClick={handleSetWidth} variant="secondary">
                {t('tools.svgScaler.setWidth')} {targetWidth}px
              </Button>
              <Button onClick={handleCopy}>
                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                {copied ? t('tools.svgScaler.copied') : t('tools.svgScaler.copy')}
              </Button>
              <Button onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />{t('tools.svgScaler.download')}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />{t('tools.svgScaler.reset')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}