import React from 'react';
import { Button } from '@flowkit/shared-ui';
import { Palette, ArrowRight } from 'lucide-react';
import { DynamicIconComponent } from './dynamic-icon';
import { gradientStyles } from './utils';

interface IconSelectorProps {
  icon: string;
  iconColor: string;
  gradientStyle: string;
  isCustomColor: boolean;
  onOpenIconPicker: () => void;
  onIconColorChange: (color: string) => void;
  t: (key: string) => string;
}

export const IconSelector: React.FC<IconSelectorProps> = ({
  icon,
  iconColor,
  gradientStyle,
  isCustomColor,
  onOpenIconPicker,
  onIconColorChange,
  t
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">{t('logoDash.icon')}</h2>
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md
          ${!isCustomColor ? `bg-gradient-to-br ${gradientStyles[gradientStyle as keyof typeof gradientStyles]}` : 'bg-indigo-500'}`}
        >
          <DynamicIconComponent icon={icon} size={24} color={iconColor} />
        </div>
        <Button 
          onClick={onOpenIconPicker}
          variant="secondary"
          className="flex-1 justify-between"
        >
          {icon}
          <ArrowRight size={16} />
        </Button>
        <input 
          type="color" 
          value={iconColor} 
          onChange={(e) => onIconColorChange(e.target.value)} 
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 cursor-pointer"
        />
      </div>
    </div>
  );
};