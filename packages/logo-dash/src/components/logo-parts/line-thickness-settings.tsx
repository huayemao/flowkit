import React from 'react';
import { Slider } from '@flowkit/shared-ui';

interface LineThicknessSettingsProps {
  lineThickness: number;
  onLineThicknessChange: (thickness: number) => void;
  t: (key: string) => string;
}

export const LineThicknessSettings: React.FC<LineThicknessSettingsProps> = ({
  lineThickness,
  onLineThicknessChange,
  t
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{t('logoDash.lineThickness')}</h2>
      <div className="flex items-center gap-3">
        <Slider
          min={0.5}
          max={10}
          step={0.5}
          value={[lineThickness]}
          onValueChange={([value]) => onLineThicknessChange(value)}
          className="w-full"
        />
        <span className="w-10 text-center font-medium">{lineThickness}</span>
      </div>
    </div>
  );
};