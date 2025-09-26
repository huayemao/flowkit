import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@flowkit/shared-ui';
import { VideoClip } from '../types';
import { formatFileSize, formatTime } from '../utils/videoUtils';

interface PreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  previewClip: VideoClip | null;
  t: (key: string, options?: any) => string;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({
  open,
  onOpenChange,
  previewClip,
  t
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
};

export default PreviewDialog;