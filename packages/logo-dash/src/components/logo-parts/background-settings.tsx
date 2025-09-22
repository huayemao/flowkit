import React from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle } from '@flowkit/shared-ui';
import { Palette, Check } from 'lucide-react';
import { GradientStyle } from './types';
import { gradientStyles, generateRandomColor } from './utils';

interface BackgroundSettingsProps {
  isGradient: boolean;
  gradientStyle: GradientStyle;
  isCustomColor: boolean;
  customBackgroundColor: string;
  onIsGradientChange: (isGradient: boolean) => void;
  onGradientStyleChange: (style: GradientStyle, isCustom: boolean) => void;
  onCustomBackgroundColorChange: (color: string) => void;
  t: (key: string) => string;
}

export const BackgroundSettings: React.FC<BackgroundSettingsProps> = ({
  isGradient,
  gradientStyle,
  isCustomColor,
  customBackgroundColor,
  onIsGradientChange,
  onGradientStyleChange,
  onCustomBackgroundColorChange,
  t
}) => {
  return (
    <Card className="space-y-3">
      <CardHeader>
        <CardTitle>
          {t('logoDash.background')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-3 mb-3">
          <Button
            onClick={() => onIsGradientChange(true)}
            variant={isGradient ? 'default' : 'secondary'}
            size="sm"
            className="flex-1"
          >
            {t('logoDash.gradient')}
          </Button>
          <Button
            onClick={() => onIsGradientChange(false)}
            variant={!isGradient ? 'default' : 'secondary'}
            size="sm"
            className="flex-1"
          >
            {t('logoDash.solidColor')}
          </Button>
        </div>

        {isGradient ? (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(gradientStyles).map(([key, style]) => (
              <button
                key={key}
                onClick={() => onGradientStyleChange(key as GradientStyle, false)}
                className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out
                ${gradientStyle === key && !isCustomColor
                    ? 'ring-4 ring-indigo-500 shadow-lg scale-105'
                    : 'hover:shadow-md hover:scale-105'}
                bg-gradient-to-br ${style}`}
                title={key}
              >
                {gradientStyle === key && !isCustomColor && (
                  <Check size={24} color="white" />
                )}
              </button>
            ))}
            <button
              onClick={() => onGradientStyleChange(gradientStyle, true)}
              className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-200 ease-in-out
              ${isCustomColor
                  ? 'ring-4 ring-indigo-500 shadow-lg scale-105'
                  : 'hover:shadow-md hover:scale-105'}
            border-2 border-dashed border-gray-300`}
              title={t('logoDash.customColor')}
            >
              <Palette size={24} color="gray-500" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={customBackgroundColor}
              onChange={(e) => onCustomBackgroundColorChange(e.target.value)}
              className="w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-200 cursor-pointer"
            />
            <div className="flex-1 space-y-2">
              <input
                type="text"
                value={customBackgroundColor}
                onChange={(e) => onCustomBackgroundColorChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onCustomBackgroundColorChange('#4F46E5')}
                  className="px-3 py-1 rounded bg-indigo-500 text-white text-sm hover:bg-indigo-600 transition-colors"
                >
                  {t('logoDash.default')}
                </button>
                <button
                  onClick={() => onCustomBackgroundColorChange(generateRandomColor())}
                  className="px-3 py-1 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
                >
                  {t('logoDash.random')}
                </button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};