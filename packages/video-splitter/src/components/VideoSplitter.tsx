import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Button } from '@flowkit/shared-ui';
import { Card, CardContent } from '@flowkit/shared-ui';
import { Progress } from '@flowkit/shared-ui';
import { toast } from '@flowkit/shared-ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@flowkit/shared-ui';
import { VideoClip, VideoInfo, SplitMode } from '../types';
import { loadFFmpeg, splitVideo } from '../services/ffmpegService';
import VideoPlayer from './VideoPlayer';
import SplitSettings from './SplitSettings';
import { formatFileSize, formatTime, downloadVideoClip } from '../utils/videoUtils';

const VideoSplitter: React.FC = () => {
  const { t } = useTranslation();

  // 状态管理
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('fast');
  const [splitDuration, setSplitDuration] = useState<number>(60); // 默认60秒
  const [isSplitting, setIsSplitting] = useState<boolean>(false);
  const [splitProgress, setSplitProgress] = useState<number>(0);
  const [videoClips, setVideoClips] = useState<VideoClip[]>([]);
  const [isLoadingFfmpeg, setIsLoadingFfmpeg] = useState<boolean>(false);
  const [isResultsOpen, setIsResultsOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<string>('mp4');
  const [quality, setQuality] = useState<string>('medium');
  const [isFfmpegLoaded, setIsFfmpegLoaded] = useState<boolean>(false);

  // 预览相关状态
  const [previewClip, setPreviewClip] = useState<VideoClip | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 引用
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 初始化时加载FFmpeg
  useEffect(() => {
    const initializeFFmpeg = async () => {
      try {
        await loadFFmpeg(setIsLoadingFfmpeg);
        setIsFfmpegLoaded(true);
        toast.success(t("videoSplitter.ffmpegLoaded"));
      } catch (error) {
        toast.error(t("videoSplitter.ffmpegLoadFail"));
      }
    };
    initializeFFmpeg();
  }, [t]);

  // 处理文件选择
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error(t('videoSplitter.unsupportedFormat'));
      return;
    }

    if (file.size > 500 * 1024 * 1024) { // 500MB
      toast.error(t('videoSplitter.videoTooLarge'));
      return;
    }

    setVideoFile(file);

    // 创建视频URL
    const url = URL.createObjectURL(file);
    setVideoUrl(url);

    // 当组件卸载时释放URL
    return () => {
      URL.revokeObjectURL(url);
    };
  };

  // 处理文件输入变化
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // 处理拖放事件
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // 预览相关函数
  const handlePreview = (clip: VideoClip) => {
    setPreviewClip(clip);
    setIsPreviewOpen(true);
  };

  const handleDownload = (clip: VideoClip) => {
    downloadVideoClip(clip.blob, clip.name, t);
  };

  const handleDelete = (clipId: string) => {
    setVideoClips(videoClips.filter(clip => clip.id !== clipId));
  };

  const handleDownloadAll = async () => {
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();

      videoClips.forEach(clip => {
        zip.file(clip.name, clip.blob);
      });

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'video-clips.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download all clips:', error);
    }
  };

  // 获取视频信息
  const getVideoInfo = (video: HTMLVideoElement) => {
    if (!video) return;

    const info: VideoInfo = {
      duration: video.duration,
      size: videoFile?.size || 0,
      format: videoFile?.type || '',
      resolution: `${video.videoWidth}x${video.videoHeight}`,
      width: video.videoWidth,
      height: video.videoHeight
    };

    setVideoInfo(info);
  };

  // 当视频元数据加载完成时获取视频信息
  const handleVideoMetadataLoaded = () => {
    const video = document.createElement('video');
    video.src = videoUrl;
    video.onloadedmetadata = () => {
      getVideoInfo(video);
    };
  };

  // 开始分割视频
  const startSplitting = async () => {
    if (!videoFile || splitDuration <= 0 || !isFfmpegLoaded) {
      if (!isFfmpegLoaded) {
        toast.error(t('videoSplitter.waitFfmpegLoad'));
      } else if (splitDuration <= 0) {
        toast.error(t('videoSplitter.enterDuration'));
      }
      return;
    }

    setIsSplitting(true);
    setSplitProgress(0);
    setVideoClips([]);

    try {
      // 调用视频分割服务
      const clips = await splitVideo(
        videoFile,
        splitDuration,
        splitMode,
        outputFormat,
        quality,
        setSplitProgress,
        (clip) => {
          // 可以在这里添加进度通知
        }
      );

      setVideoClips(clips);
      setIsResultsOpen(true);
      toast.success(t('videoSplitter.splitSuccess'));
    } catch (error) {
      console.error('Error splitting video:', error);
      toast.error(t('videoSplitter.splitError'));
    } finally {
      setIsSplitting(false);
    }
  };

  // 返回上传界面
  const handleBackToUpload = () => {
    setVideoFile(null);
    setVideoUrl('');
    setVideoInfo(null);
    setSplitMode('fast'); // 重置为默认的快速分割模式
    setVideoClips([]);
    setIsResultsOpen(false);
  };

  // 渲染上传区域
  const renderUploadArea = () => (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}
        ${videoFile ? 'hidden' : 'block'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-xl font-semibold mb-4">{t('videoSplitter.uploadVideo')}</h3>
      <p className="text-gray-500 mb-6">{t('videoSplitter.dragAndDrop')}</p>
      <p className="text-gray-400 mb-6">{t('videoSplitter.or')}</p>
      <div className="flex justify-center gap-4">
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {t('videoSplitter.selectFile')}
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          accept="video/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
      <p className="text-xs text-gray-400 mt-6">
        {t('videoSplitter.supportedFormats')} | {t('videoSplitter.maxFileSize')}
      </p>
    </div>
  );

  // 渲染视频分割结果对话框
  const renderResultsDialog = () => (
    <Dialog open={isResultsOpen} onOpenChange={setIsResultsOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{t('videoSplitter.splitResults')}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <Button onClick={handleDownloadAll} className="bg-primary hover:bg-primary/90 text-white">
              {t('videoSplitter.downloadAll')}
            </Button>
            <span className="text-gray-500">{t('videoSplitter.totalClips', { count: videoClips.length })}</span>
          </div>

          <div className="space-y-4 max-h-[60vh] overflow-auto">
            {videoClips.map((clip) => (
              <div key={clip.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-md bg-white">
                <div className="flex-1 flex items-center">
                  <h4 className="font-medium mb-1">{clip.name}</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-sm">
                    <div className="text-gray-500">{t('videoSplitter.duration')}</div>
                    <div>{formatTime(clip.duration)}</div>
                    <div className="text-gray-500">{t('videoSplitter.startTime')}</div>
                    <div>{formatTime(clip.startTime)}</div>
                    <div className="text-gray-500">{t('videoSplitter.endTime')}</div>
                    <div>{formatTime(clip.endTime)}</div>
                    <div className="text-gray-500">{t('videoSplitter.size')}</div>
                    <div>{formatFileSize(clip.blob.size)}</div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <Button variant="secondary" onClick={() => handlePreview(clip)}>
                    {t('videoSplitter.preview')}
                  </Button>
                  <Button onClick={() => handleDownload(clip)}>
                    {t('videoSplitter.download')}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="ghost" onClick={handleBackToUpload}>
              {t('videoSplitter.backToUpload')}
            </Button>
            <Button onClick={() => setIsResultsOpen(false)}>
              {t('videoSplitter.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // 渲染预览对话框
  const renderPreviewDialog = () => (
    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{previewClip?.name}</DialogTitle>
        </DialogHeader>
        {previewClip && (
          <div className="space-y-4">
            <video
              src={URL.createObjectURL(previewClip.blob)}
              controls
              className="w-full"
            />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500">{t('videoSplitter.duration')}</div>
              <div>{formatTime(previewClip.duration)}</div>
              <div className="text-gray-500">{t('videoSplitter.startTime')}</div>
              <div>{formatTime(previewClip.startTime)}</div>
              <div className="text-gray-500">{t('videoSplitter.endTime')}</div>
              <div>{formatTime(previewClip.endTime)}</div>
              <div className="text-gray-500">{t('videoSplitter.size')}</div>
              <div>{formatFileSize(previewClip.blob.size)}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl lg:h-[90vh] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-3">{t('videoSplitter.title')}</h1>
        <p className="text-center text-gray-500 max-w-2xl mx-auto">{t('videoSplitter.description')}</p>
      </div>

      <div className="flex-1 flex justify-center items-center">
        {renderUploadArea()}
        
        {videoFile && (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* 左侧：视频播放器 */}
            <div className="lg:col-span-3 ">
              <VideoPlayer
                videoUrl={videoUrl}
                videoFile={videoFile}
                videoInfo={videoInfo}
                onMetadataLoaded={handleVideoMetadataLoaded}
                t={t}
              />
            </div>

            {/* 右侧：功能按钮和设置 */}
            <div className="lg:col-span-2 flex flex-col space-y-4">
              {/* 分割设置 */}
              <SplitSettings
                splitMode={splitMode}
                setSplitMode={setSplitMode}
                splitDuration={splitDuration}
                setSplitDuration={setSplitDuration}
                showAdvancedSettings={showAdvancedSettings}
                setShowAdvancedSettings={setShowAdvancedSettings}
                outputFormat={outputFormat}
                setOutputFormat={setOutputFormat}
                quality={quality}
                setQuality={setQuality}
                t={t}
              />

              {/* FFmpeg加载进度 */}
              {isLoadingFfmpeg && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <span>{t('videoSplitter.loadingFfmpeg')}</span>
                      <span>正在加载...</span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 分割进度 */}
              {isSplitting && (
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span>{t('videoSplitter.progress')}</span>
                        <span>{splitProgress}%</span>
                      </div>
                      <Progress value={splitProgress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* 操作按钮 */}
              <div className="mt-auto">
                <div className="flex gap-4">
                  <Button
                    onClick={startSplitting}
                    disabled={isSplitting || isLoadingFfmpeg || !isFfmpegLoaded}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-2"
                  >
                    {isLoadingFfmpeg ? t('videoSplitter.loadingFfmpeg') :
                      isSplitting ? t('videoSplitter.splittingVideo') :
                        t('videoSplitter.startSplitting')}
                  </Button>
                  <Button
                    onClick={handleBackToUpload}
                    variant="ghost"
                    disabled={isSplitting || isLoadingFfmpeg}
                  >
                    {t('videoSplitter.cancel')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 结果对话框 */}
      {renderResultsDialog()}
      
      {/* 预览对话框 */}
      {renderPreviewDialog()}
    </div>
  );
};

export default VideoSplitter;