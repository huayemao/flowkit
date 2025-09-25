// 视频片段类型定义
export interface VideoClip {
  id: string;
  blob: Blob;
  duration: number;
  startTime: number;
  endTime: number;
  name: string;
}

// 视频信息类型定义
export interface VideoInfo {
  duration: number;
  size: number;
  format: string;
  resolution: string;
  width: number;
  height: number;
}

// 分割模式类型定义
export type SplitMode = 'fast' | 'precise';