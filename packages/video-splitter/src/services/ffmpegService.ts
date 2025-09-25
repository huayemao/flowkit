import { FFmpeg } from '@ffmpeg/ffmpeg';
import { VideoClip, SplitMode } from '../types';
import { getVideoMetadata } from '../utils/videoUtils';

// 使用单例模式管理FFmpeg实例
const ffmpegRef = typeof window !== 'undefined' ? new FFmpeg() : null;

// 加载FFmpeg
export const loadFFmpeg = async (setLoading: (loading: boolean) => void): Promise<void> => {
  const baseURL = "https://unpkg.zhihu.com/@ffmpeg/core@0.12.6/dist/esm";
  if (!ffmpegRef) {
    throw new Error('FFmpeg instance is not available in this environment');
  }
  
  try {
    setLoading(true);
    
    console.log('loading ffmpeg');

    ffmpegRef.on('progress', ({ progress }) => {
      console.log('Loading progress:', progress);
    });

    await ffmpegRef.load({
      coreURL: `${baseURL}/ffmpeg-core.js`,
      wasmURL: `${baseURL}/ffmpeg-core.wasm`,
    });

    console.log('FFmpeg loaded successfully');
  } catch (error) {
    console.error('Failed to load FFmpeg:', error);
    throw error;
  } finally {
    setLoading(false);
  }
};

// 获取FFmpeg实例的辅助函数
export const getFFmpegInstance = (): FFmpeg | null => {
  return ffmpegRef;
};

// 分割视频
export const splitVideo = async (
  videoFile: File,
  splitDuration: number,
  splitMode: SplitMode,
  outputFormat: string,
  quality: string,
  setProgress: (progress: number) => void,
  onClipProcessed: (clip: VideoClip) => void
): Promise<VideoClip[]> => {
  const ffmpeg = getFFmpegInstance();
  if (!ffmpeg) {
    throw new Error('FFmpeg instance is not available');
  }

  const videoClips: VideoClip[] = [];
  const videoUrl = URL.createObjectURL(videoFile);
  const videoInfo = await getVideoMetadata(videoFile);
  const totalSegments = Math.ceil(videoInfo.duration / splitDuration);
  
  try {
    // 读取视频文件
    const videoArrayBuffer = await videoFile.arrayBuffer();
    const videoData = new Uint8Array(videoArrayBuffer);
    const inputFileName = 'input-video.' + videoFile.name.split('.').pop() || 'mp4';
    const baseFileName = videoFile.name.split('.')[0];

    // 写入视频文件到FFmpeg文件系统
    ffmpeg.writeFile(inputFileName, videoData);

    console.log('开始分割视频');

    // 根据分割模式选择不同的FFmpeg命令
    if (splitMode === 'fast') {
      // 快速模式：使用复制编解码器以提高速度（不太精确）
      await ffmpeg.exec([
        '-i', inputFileName,
        '-c', 'copy',
        '-map', '0',
        '-segment_time', splitDuration.toString(),
        '-reset_timestamps', '1',
        '-f', 'segment',
        `${baseFileName}_%03d.${outputFormat}`
      ]);
    } else {
      // 精确模式：重新编码以获得精确的切割（较慢）
      // 根据质量设置视频参数
      let qualityParam = '';
      switch (quality) {
        case 'high':
          qualityParam = '23';
          break;
        case 'medium':
          qualityParam = '28';
          break;
        case 'low':
          qualityParam = '32';
          break;
      }

      await ffmpeg.exec([
        '-i', inputFileName,
        '-c:v', outputFormat === 'mp4' ? 'libx264' : 'libvpx-vp9',
        '-c:a', 'aac',
        '-preset', 'medium',
        '-crf', qualityParam,
        '-segment_time', splitDuration.toString(),
        '-segment_time_delta', '0.1',
        '-f', 'segment',
        '-reset_timestamps', '1',
        '-map', '0:v:0',
        '-map', '0:a:0',
        `${baseFileName}_%03d.${outputFormat}`
      ]);
    }

    setProgress(80);

    // 获取输出文件列表
    const files = await ffmpeg.listDir('.');
    const outputFiles = files.filter((file: any) => 
      file.name !== inputFileName && file.name.endsWith(`.${outputFormat}`)
    );

    // 处理每个输出文件
    for (let i = 0; i < outputFiles.length; i++) {
      const outputFile = outputFiles[i];
      const startTime = i * splitDuration;
      const endTime = Math.min((i + 1) * splitDuration, videoInfo.duration || 0);
      
      // 读取分割后的视频文件
      const outputData = await ffmpeg.readFile(outputFile.name);
      const blob = new Blob([outputData], { type: `video/${outputFormat}` });

      // 创建临时视频元素获取实际持续时间
      const tempVideo = document.createElement('video');
      const url = URL.createObjectURL(blob);
      tempVideo.src = url;
      tempVideo.preload = 'metadata';

      // 等待元数据加载以获取实际持续时间
      await new Promise<void>((resolve) => {
        tempVideo.onloadedmetadata = () => {
          resolve();
        };
        tempVideo.load();
      });

      // 释放URL资源
      URL.revokeObjectURL(url);

      const clip: VideoClip = {
        id: `clip-${Date.now()}-${i}`,
        blob,
        duration: tempVideo.duration || splitDuration, // 如果元数据失败，回退到用户设置的持续时间
        startTime,
        endTime,
        name: outputFile.name
      };

      videoClips.push(clip);
      onClipProcessed(clip);

      // 更新进度
      setProgress(80 + Math.floor((i + 1) / outputFiles.length) * 20);
    }

    return videoClips;
  } catch (error) {
    console.error('Error splitting video:', error);
    throw error;
  } finally {
    URL.revokeObjectURL(videoUrl);
  }
};