import React from 'react';

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
        <input
          type="range"
          min="0.5"
          max="10"
          step="0.5"
          value={lineThickness}
          onChange={(e) => onLineThicknessChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="w-10 text-center font-medium">{lineThickness}</span>
      </div>
    </div>
  );
};