import React, { useRef, useState } from 'react';
import { Button, toast } from '@flowkit/shared-ui';
import { VideoInfo } from '../types';
import { testVideoUrls } from '../utils/testVideoUrls';

interface VideoUploaderProps {
  onFileSelect: (file: File) => void;
  onVideoInfoUpdate: (info: VideoInfo) => void;
  onVideoUrlUpdate: (url: string) => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  isLoadingSampleVideo: boolean;
  setIsLoadingSampleVideo: (isLoading: boolean) => void;
  sampleVideoLoadProgress: number;
  setSampleVideoLoadProgress: (progress: number) => void;
  t: (key: string, options?: any) => string;
}

const VideoUploader: React.FC<VideoUploaderProps> = ({
  onFileSelect,
  onVideoInfoUpdate,
  onVideoUrlUpdate,
  isDragging,
  setIsDragging,
  isLoadingSampleVideo,
  setIsLoadingSampleVideo,
  sampleVideoLoadProgress,
  setSampleVideoLoadProgress,
  t
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [localVideoInfo, setLocalVideoInfo] = useState<VideoInfo | null>(null);

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

    onFileSelect(file);

    // 创建视频URL
    const url = URL.createObjectURL(file);
    onVideoUrlUpdate(url);

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


  // 加载示例视频
  const loadSampleVideo = async () => {
    try {
      setIsLoadingSampleVideo(true);
      setSampleVideoLoadProgress(0);

      // 要测试的视频链接列表
      const videoUrls = [
        'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
        'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4',
        'https://media.w3.org/2010/05/sintel/trailer.mp4',
        'https://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
        'https://stream7.iqilu.com/10339/upload_transcode/202002/09/20200209105011F0zPoYzHry.mp4',
        'https://vjs.zencdn.net/v/oceans.mp4' // 保留原有的视频链接作为备选
      ];

      // 测试视频链接，选择最快的一个
      toast.info(t('videoSplitter.testingVideoLinks'));
      const sortedResults = await testVideoUrls(videoUrls);

      if (sortedResults.length === 0) {
        throw new Error('No accessible video links found');
      }
      // 选择最快的视频链接
      const bestVideo = sortedResults[0];
      const sampleVideoUrl = bestVideo.url;
      const sampleVideoFilename = bestVideo.filename;

      // 获取完整的视频信息
      const probeResponse = await fetch(sampleVideoUrl, { method: 'HEAD' });
      const contentLength = probeResponse.headers.get('content-length') || String(bestVideo.size);

      // 直接使用URL进行流式播放，让用户立即开始观看
      onVideoUrlUpdate(sampleVideoUrl);

      // 创建一个虚拟文件对象，用于传递给handleFileSelect
      const virtualFile = new File([new Blob()], sampleVideoFilename, { type: 'video/mp4' });
      onFileSelect(virtualFile);

      // 设置基本的视频信息
      const initialInfo: VideoInfo = {
        duration: 0, // 将在视频元数据加载后更新
        size: parseInt(contentLength),
        format: 'video/mp4',
        resolution: '未知', // 将在视频元数据加载后更新
        width: 0,
        height: 0
      };
      setLocalVideoInfo(initialInfo);
      onVideoInfoUpdate(initialInfo);

      // 在后台异步加载完整的blob，加载完成后更新为blob URL
      // 同时监控真实的加载进度
      const controller = new AbortController();
      const signal = controller.signal;
      const expectedSize = parseInt(contentLength);

      fetch(sampleVideoUrl, { signal })
        .then(response => {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('Response body is not readable');
          }

          let receivedLength = 0;
          const chunks: Uint8Array[] = [];

          const readData = async () => {
            try {
              const { done, value } = await reader.read();
              if (done) {
                // 所有数据已读取完毕
                const blob = new Blob(chunks);
                const blobUrl = URL.createObjectURL(blob);
                const actualFile = new File([blob], sampleVideoFilename, { type: 'video/mp4' });

                // 更新为blob URL和实际文件对象
                onVideoUrlUpdate(blobUrl);
                onFileSelect(actualFile);

                // 更新视频信息
                if (contentLength && localVideoInfo) {
                  const updatedInfo = { ...localVideoInfo, size: parseInt(contentLength) };
                  setLocalVideoInfo(updatedInfo);
                  onVideoInfoUpdate(updatedInfo);
                }

                // 完成加载
                setSampleVideoLoadProgress(100);
                setIsLoadingSampleVideo(false);
                return;
              }

              if (value) {
                chunks.push(value);
                receivedLength += value.length;

                // 计算并更新真实进度
                if (expectedSize > 0) {
                  const progress = Math.round((receivedLength / expectedSize) * 100);
                  setSampleVideoLoadProgress(progress);
                }
              }

              // 继续读取下一块数据
              readData();
            } catch (error) {
              console.warn('Error reading stream:', error);
              setIsLoadingSampleVideo(false);
            }
          };

          // 开始读取数据
          readData();
        })
        .catch(error => {
          // 如果不是因为取消而导致的错误，则继续使用流式URL
          if (error.name !== 'AbortError') {
            console.warn('Failed to load complete blob, continuing with streaming URL:', error);
          }
          setIsLoadingSampleVideo(false);
        });

      // 在组件卸载时取消fetch请求
      return () => {
        controller.abort();
      };

    } catch (error) {
      console.error('Failed to load sample video:', error);
      toast.error(t('videoSplitter.sampleVideoLoadFail'));
      setIsLoadingSampleVideo(false);
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

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 
        ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary hover:bg-primary/5'}`}
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
        >
          {t('videoSplitter.selectFile')}
        </Button>
        <Button
          onClick={loadSampleVideo}
          variant="secondary"
        >
          {t('videoSplitter.loadSampleVideo')}
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
};

export default VideoUploader;