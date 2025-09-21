import { GradientStyle, IconCategories, LogoConfig } from './types';
import { gradientStyles } from './utils';

/**
 * 生成随机文字
 */
export const generateRandomText = (): string => {
  const adjectives = [
    'Awesome',
    'Super',
    'Mega',
    'Power',
    'Next',
    'Future',
    'Global',
    'Digital',
  ];
  const nouns = [
    'Tech',
    'Brand',
    'Logo',
    'App',
    'Design',
    'Studio',
    'Lab',
    'Creative',
  ];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]
    }`;
};

/**
 * 随机生成 logo 配置
 */
export const generateRandomLogoConfig = (
  currentConfig: LogoConfig,
  iconCategories: IconCategories
): LogoConfig => {
  const randomGradient = Object.keys(gradientStyles)[
    Math.floor(Math.random() * Object.keys(gradientStyles).length)
  ] as GradientStyle;
  const randomIcons = [...Object.values(iconCategories)].flat();
  const randomIcon = randomIcons[Math.floor(Math.random() * randomIcons.length)];

  return {
    ...currentConfig,
    gradientStyle: randomGradient,
    icon: randomIcon,
    isGradient: Math.random() > 0.3,
    isCustomColor: false,
    iconColor: '#FFFFFF',
    // 30% 的概率添加随机文字
    customText: Math.random() > 0.7 ? generateRandomText() : '',
    textColor: '#FFFFFF',
    // 保持当前的图标边距比例不变
    iconMarginRatio: currentConfig.iconMarginRatio,
  };
};