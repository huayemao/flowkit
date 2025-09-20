import { GradientStyle, LogoSize } from './types';

// 定义渐变样式映射
export const gradientStyles = {
  indigoToPurple: 'from-indigo-500 to-purple-600',
  blueToTeal: 'from-blue-500 to-teal-400',
  pinkToOrange: 'from-pink-500 to-orange-500',
  greenToBlue: 'from-green-500 to-blue-500',
  yellowToRed: 'from-yellow-400 to-red-500',
  purpleToPink: 'from-purple-600 to-pink-500',
};

// 生成随机颜色
export const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// 根据预设获取尺寸
export const getSizeByPreset = (preset: 'small' | 'medium' | 'large' | 'custom', customSize: { width: number; height: number }): LogoSize => {
  switch (preset) {
    case 'small':
      return { width: 256, height: 256 };
    case 'medium':
      return { width: 512, height: 512 };
    case 'large':
      return { width: 1024, height: 1024 };
    case 'custom':
      return customSize;
    default:
      return { width: 512, height: 512 };
  }
};

// 根据渐变样式获取颜色值
export const getGradientColors = (style: GradientStyle): { startColor: string; endColor: string } => {
  const colorMap = {
    indigoToPurple: { startColor: '#4F46E5', endColor: '#8B5CF6' },
    blueToTeal: { startColor: '#3B82F6', endColor: '#2DD4BF' },
    pinkToOrange: { startColor: '#EC4899', endColor: '#F97316' },
    greenToBlue: { startColor: '#22C55E', endColor: '#3B82F6' },
    yellowToRed: { startColor: '#FBBF24', endColor: '#EF4444' },
    purpleToPink: { startColor: '#8B5CF6', endColor: '#EC4899' },
  };
  return colorMap[style];
};