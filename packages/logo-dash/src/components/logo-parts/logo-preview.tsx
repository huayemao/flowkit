import React, { useEffect, useRef } from 'react';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import * as LucideIcons from 'lucide-react';
import { LogoConfig } from './types';
import { getSizeByPreset, gradientStyles } from './utils';

interface LogoPreviewProps {
  config: LogoConfig;
  isGridVisible: boolean;
}

export const LogoPreview: React.FC<LogoPreviewProps> = ({ config, isGridVisible }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    generateLogoPreview();
  }, [config, isGridVisible]);

  // 生成 logo 预览
  const generateLogoPreview = () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    // 应用不同的尺寸
    const size = getSizeByPreset(config.sizePreset, config.customSize);
    previewElement.style.width = `${size.width}px`;
    previewElement.style.height = `${size.height}px`;

    // 应用背景样式
    if (config.isGradient && !config.isCustomColor) {
      previewElement.className = `rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out bg-gradient-to-br ${gradientStyles[config.gradientStyle]}`;
    } else {
      previewElement.className = `rounded-xl flex items-center justify-center shadow-lg transition-all duration-300 ease-in-out`;
      previewElement.style.backgroundColor = config.isCustomColor ? config.customBackgroundColor : '#4F46E5';
    }

    // 清除预览内容
    previewElement.innerHTML = '';

    // 创建图标
    const IconComponent = LucideIcons[config.icon as keyof typeof LucideIcons] || LucideIcons['Download'];
    const iconSize = Math.min(size.width, size.height) * 0.4;
    const iconElement = React.createElement(IconComponent as any, {
      className: 'text-white',
      size: iconSize,
      color: config.iconColor,
      strokeWidth: config.lineThickness,
    });
    
    // 将 React 元素渲染到预览中
    const iconWrapper = document.createElement('div');
    ReactDOM.render(iconElement, iconWrapper);
    previewElement.appendChild(iconWrapper);

    // 添加文字（如果有）
    if (config.customText) {
      const textElement = document.createElement('div');
      textElement.className = 'absolute bottom-4 text-center w-full';
      const textSpan = document.createElement('span');
      textSpan.textContent = config.customText;
      textSpan.style.color = config.textColor;
      textSpan.style.fontSize = `${Math.min(size.width, size.height) * 0.12}px`;
      textSpan.style.fontWeight = 'bold';
      textSpan.style.textShadow = '0 2px 4px rgba(0,0,0,0.1)';
      textElement.appendChild(textSpan);
      previewElement.appendChild(textElement);
    }
  };

  return (
    <div className="relative mb-6">
      <div 
        ref={previewRef} 
        className="rounded-xl flex items-center justify-center shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600"
        style={{ width: '300px', height: '300px' }}
      >
        {/* 预览内容将由 JavaScript 动态生成 */}
      </div>
      
      {/* 网格背景切换按钮 */}
      {isGridVisible && (
        <div className="absolute inset-0 rounded-xl pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '-1px -1px'
        }}></div>
      )}
    </div>
  );
};