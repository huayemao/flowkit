// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// 格式化时间
export const formatTime = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 下载单个视频片段
export const downloadVideoClip = (blob: Blob, fileName: string, t: (key: string, options?: any) => string): void => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
};

// 获取视频元数据
export const getVideoMetadata = async (blob: Blob): Promise<{ duration: number; width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const tempVideo = document.createElement('video');
    const url = URL.createObjectURL(blob);
    tempVideo.src = url;
    tempVideo.preload = 'metadata';

    tempVideo.onloadedmetadata = () => {
      const metadata = {
        duration: tempVideo.duration,
        width: tempVideo.videoWidth,
        height: tempVideo.videoHeight
      };
      URL.revokeObjectURL(url);
      resolve(metadata);
    };

    tempVideo.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load video metadata'));
    };

    tempVideo.load();
  });
};