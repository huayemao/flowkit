import React from 'react';
import { Slider } from '@flowkit/shared-ui';

interface IconMarginRatioSettingsProps {
  iconMarginRatio: number;
  onIconMarginRatioChange: (ratio: number) => void;
  t: (key: string) => string;
}

export const IconMarginRatioSettings: React.FC<IconMarginRatioSettingsProps> = ({
  iconMarginRatio,
  onIconMarginRatioChange,
  t
}) => {
  // 将小数比例转换为百分比显示
  const percentageValue = Math.round(iconMarginRatio * 100);
  
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{t('logoDash.iconMarginRatio')}</h2>
      <div className="flex items-center gap-3">
        <Slider
          min={0}
          max={0.4}
          step={0.05}
          value={[iconMarginRatio]}
          onValueChange={([value]) => onIconMarginRatioChange(value)}
          className="w-full"
        />
        <span className="w-16 text-center font-medium">{percentageValue}%</span>
      </div>
    </div>
  );
};