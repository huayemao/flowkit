import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button } from '@flowkit/shared-ui';
import { VideoClip } from '../types';
import { formatFileSize, formatTime, downloadVideoClip } from '../utils/videoUtils';

interface ResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoClips: VideoClip[];
  onPreview: (clip: VideoClip) => void;
  onDelete: (clipId: string) => void;
  onBackToUpload: () => void;
  t: (key: string, options?: any) => string;
}

const ResultsDialog: React.FC<ResultsDialogProps> = ({
  open,
  onOpenChange,
  videoClips,
  onPreview,
  onDelete,
  onBackToUpload,
  t
}) => {
  const handleDownload = (clip: VideoClip) => {
    downloadVideoClip(clip.blob, clip.name, t);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              <div key={clip.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-md bg-card">
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
                  <Button variant="secondary" onClick={() => onPreview(clip)}>
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
            <Button variant="ghost" onClick={onBackToUpload}>
              {t('videoSplitter.backToUpload')}
            </Button>
            <Button onClick={() => onOpenChange(false)}>
              {t('videoSplitter.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultsDialog;