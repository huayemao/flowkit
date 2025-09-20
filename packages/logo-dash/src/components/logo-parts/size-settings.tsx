import React from 'react';
import { Button } from '@flowkit/shared-ui';

interface SizeSettingsProps {
  sizePreset: 'small' | 'medium' | 'large' | 'custom';
  customSize: { width: number; height: number };
  onSizePresetChange: (preset: 'small' | 'medium' | 'large' | 'custom') => void;
  onCustomSizeChange: (size: { width: number; height: number }) => void;
  t: (key: string) => string;
}

export const SizeSettings: React.FC<SizeSettingsProps> = ({
  sizePreset,
  customSize,
  onSizePresetChange,
  onCustomSizeChange,
  t
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{t('logoDash.size')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
        <Button 
          onClick={() => onSizePresetChange('small')}
          variant={sizePreset === 'small' ? 'default' : 'secondary'}
          size="sm"
          className="aspect-video flex flex-col justify-center"
        >
          <span className="text-sm">{t('logoDash.small')}</span>
          <span className="text-xs text-gray-500">256 × 256</span>
        </Button>
        <Button 
          onClick={() => onSizePresetChange('medium')}
          variant={sizePreset === 'medium' ? 'default' : 'secondary'}
          size="sm"
          className="aspect-video flex flex-col justify-center"
        >
          <span className="text-sm">{t('logoDash.medium')}</span>
          <span className="text-xs text-gray-500">512 × 512</span>
        </Button>
        <Button 
          onClick={() => onSizePresetChange('large')}
          variant={sizePreset === 'large' ? 'default' : 'secondary'}
          size="sm"
          className="aspect-video flex flex-col justify-center"
        >
          <span className="text-sm">{t('logoDash.large')}</span>
          <span className="text-xs text-gray-500">1024 × 1024</span>
        </Button>
        <Button 
          onClick={() => onSizePresetChange('custom')}
          variant={sizePreset === 'custom' ? 'default' : 'secondary'}
          size="sm"
          className="aspect-video flex items-center justify-center"
        >
          {t('logoDash.custom')}
        </Button>
      </div>
      
      {sizePreset === 'custom' && (
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-gray-600">{t('logoDash.width')}</label>
            <input 
              type="number" 
              value={customSize.width} 
              onChange={(e) => onCustomSizeChange({...customSize, width: parseInt(e.target.value) || 512})} 
              min="100" 
              max="2048" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm text-gray-600">{t('logoDash.height')}</label>
            <input 
              type="number" 
              value={customSize.height} 
              onChange={(e) => onCustomSizeChange({...customSize, height: parseInt(e.target.value) || 512})} 
              min="100" 
              max="2048" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
};