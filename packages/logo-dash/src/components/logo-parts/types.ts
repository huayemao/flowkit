// 定义渐变样式类型
export type GradientStyle = 'indigoToPurple' | 'blueToTeal' | 'pinkToOrange' | 'greenToBlue' | 'yellowToRed' | 'purpleToPink';

// 定义图标类型
export type IconKey = string;

// 定义图标分类接口
export interface IconCategories {
  [key: string]: string[];
}

// 定义Logo配置接口
export interface LogoConfig {
  gradientStyle: GradientStyle;
  icon: string;
  customText: string;
  textColor: string;
  iconColor: string;
  isCustomColor: boolean;
  customBackgroundColor: string;
  isGradient: boolean;
  sizePreset: 'small' | 'medium' | 'large' | 'custom';
  customSize: { width: number; height: number };
  lineThickness: number; // 线条粗细，默认值为1
}

// 定义Logo尺寸接口
export interface LogoSize {
  width: number;
  height: number;
}