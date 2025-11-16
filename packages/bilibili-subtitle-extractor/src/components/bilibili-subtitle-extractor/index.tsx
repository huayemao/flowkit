import React, { useState } from 'react';
import { Button } from '@flowkit/shared-ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@flowkit/shared-ui';
import { Input } from '@flowkit/shared-ui';
import { Alert, AlertDescription } from '@flowkit/shared-ui';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@flowkit/shared-ui';
import { Badge } from '@flowkit/shared-ui';
import { Separator } from '@flowkit/shared-ui';
import { 
  extractBVID, 
  getVideoInfo, 
  getSubtitleList, 
  getSubtitleContent, 
  getSubtitleViaThirdParty,
  convertToSRT, 
  convertToPlainText, 
  downloadFile,
  type VideoInfo,
  type SubtitleItem
} from '../../utils/bilibili';

export function BilibiliSubtitleExtractor() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [subtitles, setSubtitles] = useState<SubtitleItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('extract');
  const [useThirdPartyAPI, setUseThirdPartyAPI] = useState(true);

  const handleExtract = async () => {
    if (!url.trim()) {
      setError('请输入 B 站视频链接');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 优先使用第三方API
      if (useThirdPartyAPI) {
        try {
          console.log('使用第三方API提取字幕...');
          const thirdPartyResult = await getSubtitleViaThirdParty(url);
          
          if (thirdPartyResult.success && thirdPartyResult.data && thirdPartyResult.data.subtitles.length > 0) {
            setSubtitles(thirdPartyResult.data.subtitles);
            
            // 尝试获取基本信息（标题等）
            try {
              const bvid = extractBVID(url);
              if (bvid) {
                const info = await getVideoInfo(bvid);
                if (info) {
                  setVideoInfo(info);
                }
              }
            } catch (infoError) {
              console.warn('获取视频信息失败，但字幕提取成功:', infoError);
              // 设置基本信息
              setVideoInfo({
                title: 'B站视频',
                duration: 0,
                cid: 0,
                pic: '',
                desc: ''
              });
            }
            
            setActiveTab('preview');
            return;
          }
        } catch (thirdPartyError) {
          console.warn('第三方API提取失败，尝试使用备用方案:', thirdPartyError);
          // 继续使用原来的API作为备用方案
        }
      }

      // 备用方案：使用原来的API
      console.log('使用备用API方案...');
      const bvid = extractBVID(url);
      if (!bvid) {
        throw new Error('无效的 B 站视频链接');
      }

      // 获取视频信息
      const info = await getVideoInfo(bvid);
      if (!info) {
        throw new Error('无法获取视频信息');
      }

      setVideoInfo(info);

      // 获取字幕列表
      const subtitleList = await getSubtitleList(bvid, info.cid);
      if (subtitleList.length === 0) {
        throw new Error('该视频没有可用的字幕');
      }

      // 获取第一个字幕的内容
      const subtitleContent = await getSubtitleContent(subtitleList[0].subtitle_url);
      setSubtitles(subtitleContent);
      setActiveTab('preview');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '提取字幕时发生未知错误';
      setError(errorMessage);
      console.error('字幕提取失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSRT = () => {
    if (subtitles.length === 0) return;
    
    const srtContent = convertToSRT(subtitles);
    const filename = videoInfo ? `${videoInfo.title}.srt` : 'subtitle.srt';
    downloadFile(srtContent, filename);
  };

  const handleDownloadTXT = () => {
    if (subtitles.length === 0) return;
    
    const textContent = convertToPlainText(subtitles);
    const filename = videoInfo ? `${videoInfo.title}.txt` : 'subtitle.txt';
    downloadFile(textContent, filename);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">B站字幕提取器</h1>
        <p className="text-muted-foreground">
          输入B站视频链接，一键提取视频字幕并支持多种格式下载
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>提取字幕</CardTitle>
          <CardDescription>
            支持提取B站视频的字幕，包括用户上传的CC字幕和AI生成的字幕
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <input
              type="checkbox"
              id="useThirdParty"
              checked={useThirdPartyAPI}
              onChange={(e) => setUseThirdPartyAPI(e.target.checked)}
              className="rounded"
            />
            <label htmlFor="useThirdParty" className="text-sm font-medium cursor-pointer">
              优先使用第三方API（推荐，成功率更高）
            </label>
            <Badge variant={useThirdPartyAPI ? "default" : "secondary"} className="ml-auto">
              {useThirdPartyAPI ? "已启用" : "已禁用"}
            </Badge>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="请输入B站视频链接 (例如: https://www.bilibili.com/video/BV1xx411c7mD)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleExtract} 
              disabled={loading}
              className="min-w-[100px]"
            >
              {loading ? '提取中...' : '提取字幕'}
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {videoInfo && (
            <div className="space-y-2">
              <h3 className="font-semibold">视频信息</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">标题:</span>
                  <p className="font-medium">{videoInfo.title}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">时长:</span>
                  <p className="font-medium">{Math.floor(videoInfo.duration / 60)}分{videoInfo.duration % 60}秒</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">字幕数量:</span>
                  <p className="font-medium">{subtitles.length} 条</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {subtitles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>字幕内容</CardTitle>
            <CardDescription>
              预览字幕内容并选择下载格式
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="preview">预览</TabsTrigger>
                  <TabsTrigger value="srt">SRT格式</TabsTrigger>
                  <TabsTrigger value="text">纯文本</TabsTrigger>
                </TabsList>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleDownloadSRT}>
                    下载SRT
                  </Button>
                  <Button variant="outline" onClick={handleDownloadTXT}>
                    下载TXT
                  </Button>
                </div>
              </div>

              <TabsContent value="preview" className="space-y-3">
                <div className="max-h-96 overflow-y-auto space-y-2 border rounded-lg p-4">
                  {subtitles.map((subtitle, index) => (
                    <div key={index} className="flex gap-3 p-2 hover:bg-muted rounded">
                      <Badge variant="secondary" className="text-xs">
                        {formatTime(subtitle.start)}
                      </Badge>
                      <p className="flex-1 text-sm">{subtitle.text}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="srt">
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-xs bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {convertToSRT(subtitles)}
                  </pre>
                </div>
              </TabsContent>

              <TabsContent value="text">
                <div className="max-h-96 overflow-y-auto">
                  <pre className="text-sm bg-muted p-4 rounded-lg whitespace-pre-wrap">
                    {convertToPlainText(subtitles)}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>使用说明</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>• 支持所有B站视频链接格式</p>
          <p>• 自动识别并提取可用的字幕</p>
          <p>• 支持下载SRT和纯文本两种格式</p>
          <p>• SRT格式包含时间轴信息，可用于视频编辑</p>
          <p>• 纯文本格式适合阅读和翻译</p>
          <p>• 第三方API成功率更高，推荐优先使用</p>
          <p>• 如第三方API失败，会自动切换到备用方案</p>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}