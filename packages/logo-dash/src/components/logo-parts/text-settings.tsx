import React from 'react';

interface TextSettingsProps {
  customText: string;
  textColor: string;
  onTextChange: (text: string) => void;
  onTextColorChange: (color: string) => void;
  t: (key: string) => string;
}

export const TextSettings: React.FC<TextSettingsProps> = ({
  customText,
  textColor,
  onTextChange,
  onTextColorChange,
  t
}) => {
  return (
    <div className="space-y-3">
      <input 
        type="text" 
        value={customText} 
        onChange={(e) => onTextChange(e.target.value)} 
        placeholder={t('logoDash.textPlaceholder')} 
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      />
      {customText && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{t('logoDash.textColor')}</span>
          <input 
            type="color" 
            value={textColor} 
            onChange={(e) => onTextColorChange(e.target.value)} 
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
};