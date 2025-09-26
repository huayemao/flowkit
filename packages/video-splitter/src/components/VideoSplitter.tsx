import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../i18n';
import { Button, Card, CardContent, Progress, toast } from '@flowkit/shared-ui';
import { VideoClip, VideoInfo, SplitMode } from '../types';
import { loadFFmpeg, splitVideo } from '../services/ffmpegService';
import VideoPlayer from './VideoPlayer';
import SplitSettings from './SplitSettings';
import VideoUploader from './VideoUploader';
import ResultsDialog from './ResultsDialog';
import PreviewDialog from './PreviewDialog';

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

  // 示例视频加载状态
  const [isLoadingSampleVideo, setIsLoadingSampleVideo] = useState<boolean>(false);
  const [sampleVideoLoadProgress, setSampleVideoLoadProgress] = useState<number>(0);

  // 添加视频引用
  const videoRef = useRef<HTMLVideoElement>(null);

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
    setVideoFile(file);
  };

  // 更新视频URL
  const handleVideoUrlUpdate = (url: string) => {
    setVideoUrl(url);
  };

  // 更新视频信息
  const handleVideoInfoUpdate = (info: VideoInfo) => {
    setVideoInfo(info);
  };

  // 预览相关函数
  const handlePreview = (clip: VideoClip) => {
    setPreviewClip(clip);
    setIsPreviewOpen(true);
  };

  // 删除视频片段
  const handleDelete = (clipId: string) => {
    setVideoClips(videoClips.filter(clip => clip.id !== clipId));
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
    const video = videoRef.current;
    if (video) {
      getVideoInfo(video);
    }
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

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl lg:h-[90vh] flex flex-col">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-center mb-3">{t('videoSplitter.title')}</h1>
        <p className="text-center text-gray-500 max-w-2xl mx-auto">{t('videoSplitter.description')}</p>
        
        {/* 全局显示FFmpeg加载进度 */}
        {isLoadingFfmpeg && (
          <div className="mt-4 mx-auto max-w-lg">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{t('videoSplitter.loadingFfmpeg')}</span>
                    <span>{t('videoSplitter.progress')}:</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        {/* 示例视频加载进度 */}
        {isLoadingSampleVideo && (
          <div className="mt-4 mx-auto max-w-lg">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>{t('videoSplitter.loadingVideo')}</span>
                    <span>{sampleVideoLoadProgress}%</span>
                  </div>
                  <Progress value={sampleVideoLoadProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <div className="flex-1 flex justify-center items-center">
        {!videoFile ? (
          <VideoUploader
            onFileSelect={handleFileSelect}
            onVideoInfoUpdate={handleVideoInfoUpdate}
            onVideoUrlUpdate={handleVideoUrlUpdate}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            isLoadingSampleVideo={isLoadingSampleVideo}
            setIsLoadingSampleVideo={setIsLoadingSampleVideo}
            sampleVideoLoadProgress={sampleVideoLoadProgress}
            setSampleVideoLoadProgress={setSampleVideoLoadProgress}
            t={t}
          />
        ) : (
          <div className="grid lg:grid-cols-5 gap-6">
            {/* 左侧：视频播放器 */}
            <div className="lg:col-span-3">
              <VideoPlayer
                videoUrl={videoUrl}
                videoFile={videoFile}
                videoInfo={videoInfo}
                onMetadataLoaded={handleVideoMetadataLoaded}
                t={t}
                videoRef={videoRef}
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
      <ResultsDialog
        open={isResultsOpen}
        onOpenChange={setIsResultsOpen}
        videoClips={videoClips}
        onPreview={handlePreview}
        onDelete={handleDelete}
        onBackToUpload={handleBackToUpload}
        t={t}
      />
      
      {/* 预览对话框 */}
      <PreviewDialog
        open={isPreviewOpen}
        onOpenChange={setIsPreviewOpen}
        previewClip={previewClip}
        t={t}
      />
    </div>
  );
};

export default VideoSplitter;