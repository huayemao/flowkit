import React, { useRef, useEffect } from 'react';
import { Card, CardContent } from '@flowkit/shared-ui';
import { VideoInfo } from '../types';
import { formatFileSize, formatTime } from '../utils/videoUtils';

interface VideoPlayerProps {
  videoUrl: string;
  videoFile: File | null;
  videoInfo: VideoInfo | null;
  onMetadataLoaded: () => void;
  t: (key: string, options?: any) => string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  videoFile,
  videoInfo,
  onMetadataLoaded,
  t
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <Card>
      <CardContent className="p-0 ">
        <video
          ref={videoRef}
          src={videoUrl}
          controls
          className="w-full rounded-t-lg max-h-[62vh] object-contain"
          onLoadedMetadata={onMetadataLoaded}
        />
        {videoInfo && (
          <div className="p-4 bg-gray-50 border-t">
            <h4 className="font-medium mb-2">{t('videoSplitter.videoInfo')}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div className="text-gray-500">{t('videoSplitter.duration')}</div>
              <div>{formatTime(videoInfo.duration)}</div>
              <div className="text-gray-500">{t('videoSplitter.size')}</div>
              <div>{formatFileSize(videoInfo.size)}</div>
              <div className="text-gray-500">{t('videoSplitter.format')}</div>
              <div>{videoInfo.format}</div>
              <div className="text-gray-500">{t('videoSplitter.resolution')}</div>
              <div>{videoInfo.resolution}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoPlayer;