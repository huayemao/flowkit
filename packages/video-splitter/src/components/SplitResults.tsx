import React, { useState } from 'react';
import { Card, CardContent } from '@flowkit/shared-ui';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@flowkit/shared-ui';
import { Button } from '@flowkit/shared-ui';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@flowkit/shared-ui';
import { VideoClip } from '../types';
import { formatFileSize, formatTime, downloadVideoClip } from '../utils/videoUtils';

interface SplitResultsProps {
  videoClips: VideoClip[];
  setVideoClips: (clips: VideoClip[]) => void;
  onBackToUpload: () => void;
  t: (key: string, options?: any) => string;
}

const SplitResults: React.FC<SplitResultsProps> = ({
  videoClips,
  setVideoClips,
  onBackToUpload,
  t
}) => {
  const [previewClip, setPreviewClip] = useState<VideoClip | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

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

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">{t('videoSplitter.splitResults')}</h3>
          
          <div className="mb-4">
            <Button onClick={handleDownloadAll} className="mb-4">
              {t('videoSplitter.downloadAll')}
            </Button>
          </div>

          <div className="space-y-4">
            {videoClips.map((clip) => (
              <div key={clip.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-md bg-card">
                <div className="flex-1">
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">{t('videoSplitter.delete')}</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('videoSplitter.confirmDelete')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('videoSplitter.deleteWarning')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('videoSplitter.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(clip.id)}>
                          {t('videoSplitter.delete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button onClick={onBackToUpload}>
          {t('videoSplitter.backToUpload')}
        </Button>
      </div>

      {/* 预览对话框 */}
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
    </div>
  );
};

export default SplitResults;