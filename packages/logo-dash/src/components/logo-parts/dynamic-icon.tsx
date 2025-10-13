import React from "react";
import * as LucideIcons from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import type { IconProp, SizeProp } from "@fortawesome/fontawesome-svg-core";

// 添加Font Awesome图标到库中
library.add(fas);

export interface DynamicIconProps {
  icon: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: React.CSSProperties;
}

// 动态加载图标组件
export const DynamicIconComponent: React.FC<DynamicIconProps> = ({
  icon,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  style = {},
}) => {
  // 获取Font Awesome图标大小
  const getFaSize = (num: number): string => {
    if (num <= 12) return "xs";
    if (num <= 16) return "sm";
    if (num <= 24) return "lg";
    if (num <= 32) return "xl";
    return "2xl";
  };

  // 渲染Font Awesome图标
  if (icon.startsWith("fa-")) {
    const iconName = icon; // 移除 'fa-' 前缀
    return (
      <FontAwesomeIcon
        icon={iconName as IconProp}
        // icon={iconName as IconProp}
        size={getFaSize(size) as SizeProp}
        style={{ color, strokeWidth, ...style }}
      />
    );
  }

  // 渲染Lucide图标
  const Icon = (LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons["Download"]) ;
  return (
    // @ts-ignore
    <Icon
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      {...style}
    />
  );
}
