import React, { useEffect, useRef } from 'react';
import * as LucideIcons from 'lucide-react';

export interface DynamicIconProps {
  icon: string;
  size?: number;
  color?: string;
}

// 动态加载图标组件
export const DynamicIconComponent: React.FC<DynamicIconProps> = ({ icon, size = 24, color = 'currentColor' }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current && window.React && window.ReactDOM) {
      const { React, ReactDOM } = window;
      const Icon = LucideIcons[icon as keyof typeof LucideIcons] || LucideIcons['Download'];
      ReactDOM.render(React.createElement(Icon as any, { size, color }), ref.current);
    }
  }, [icon, size, color]);
  
  return <div ref={ref}></div>;
};