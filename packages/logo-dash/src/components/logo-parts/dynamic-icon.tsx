import React, { useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';

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
export const DynamicIconComponent: React.FC<DynamicIconProps> = ({ icon, size = 24, color = 'currentColor',strokeWidth = 2,style = {} }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current && window.React && window.ReactDOM) {
      const { React, ReactDOM } = window;
        console.log('Rendering icon:', icon);
      // 判断图标库类型
        if (icon.startsWith('fa-')) {
          // Font Awesome图标
          const iconName = icon.substring(3); // 移除 'fa-' 前缀
          ReactDOM.render(
            React.createElement(FontAwesomeIcon, {
              icon: iconName as IconProp,
              size: size <= 12 ? 'xs' : size <= 16 ? 'sm' : size <= 24 ? 'lg' : size <= 32 ? 'xl' : '2xl',
              style: { color, strokeWidth, ...style }
            }),
            ref.current
          );
        } else {
        // Lucide图标
        const Icon = LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons['Download'];
        ReactDOM.render(React.createElement(Icon as any, { size, color, strokeWidth, ...style }), ref.current);
      }
    }
  }, [icon, size, color]);
  
  return <div ref={ref}></div>;
};