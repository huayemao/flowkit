import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { toast } from '@flowkit/shared-ui';
import * as LucideIcons from 'lucide-react';
import { GradientStyle, LogoConfig, IconKey } from './types';
import { getSizeByPreset, getGradientColors, gradientStyles } from './utils';

/**
 * 导出为 PNG 格式
 */
export const exportAsPNG = async (
  config: LogoConfig,
  t: (key: string) => string,
  onLogoCreated?: (logoUrl: string) => void,
): Promise<void> => {
  try {
    // 创建一个临时 canvas
    const canvas = document.createElement('canvas');
    const size = getSizeByPreset(config.sizePreset, config.customSize);
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 Canvas 上下文');

    // 绘制背景
    if (config.isGradient && !config.isCustomColor) {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const colors = getGradientColors(config.gradientStyle);
      gradient.addColorStop(0, colors.startColor);
      gradient.addColorStop(1, colors.endColor);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = config.isCustomColor
        ? config.customBackgroundColor
        : '#4F46E5';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制图标
    // @ts-ignore
    const IconComponent = LucideIcons[config.icon as IconKey] || LucideIcons['Download'];
    const iconSize = Math.min(size.width, size.height) * 0.4;
    const iconCanvas = document.createElement('canvas');
    iconCanvas.width = iconSize;
    iconCanvas.height = iconSize;
    const iconCtx = iconCanvas.getContext('2d');
    if (iconCtx) {
      // 使用 SVG 渲染图标
      const iconSvg = React.createElement(IconComponent as any, {
        size: iconSize,
        color: config.iconColor,
        strokeWidth: config.lineThickness,
      });
      const iconString = ReactDOMServer.renderToString(iconSvg);
      const img = new Image();
      const dataUrl = 'data:image/svg+xml,' + encodeURIComponent(iconString);
      await new Promise<void>((resolve, reject) => {
        img.onload = () => {
          ctx.drawImage(
            img,
            (canvas.width - iconSize) / 2,
            (canvas.height - iconSize) / 2,
            iconSize,
            iconSize
          );
          resolve();
        };
        img.onerror = reject;
        img.src = dataUrl;
      });
    }

    // 绘制文字
    if (config.customText) {
      ctx.fillStyle = config.textColor;
      ctx.font = `bold ${Math.min(size.width, size.height) * 0.12}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        config.customText,
        canvas.width / 2,
        canvas.height - Math.min(size.width, size.height) * 0.1
      );
    }

    // 使用 Web API 下载文件
    return new Promise<void>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          try {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'logo.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            toast.success(t('logoDash.pngExported'));
            if (onLogoCreated) {
              onLogoCreated(URL.createObjectURL(blob));
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('无法创建 Blob'));
        }
      });
    });
  } catch (error) {
    console.error('导出 PNG 失败:', error);
    toast.error(t('logoDash.exportErrorMessage'));
    throw error;
  }
};

/**
 * 导出为 SVG 格式
 */
export const exportAsSVG = async (
  config: LogoConfig,
  t: (key: string) => string,
  onLogoCreated?: (logoUrl: string) => void,
): Promise<void> => {
  try {
    const size = getSizeByPreset(config.sizePreset, config.customSize);
    const iconSize = Math.min(size.width, size.height) * 0.4;
    const textSize = Math.min(size.width, size.height) * 0.12;

    // 创建 SVG 内容
    let svgContent = `<svg width="${size.width}" height="${size.height}" xmlns="http://www.w3.org/2000/svg">`;

    // 添加背景
    if (config.isGradient && !config.isCustomColor) {
      svgContent += '<defs>';
      svgContent += `<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">`;
      const colors = getGradientColors(config.gradientStyle);
      svgContent += `<stop offset="0%" stop-color="${colors.startColor}"/>`;
      svgContent += `<stop offset="100%" stop-color="${colors.endColor}"/>`;
      svgContent += '</linearGradient>';
      svgContent += '</defs>';
      svgContent += `<rect width="100%" height="100%" rx="12" fill="url(#gradient)"/>`;
    } else {
      svgContent += `<rect width="100%" height="100%" rx="12" fill="${config.isCustomColor ? config.customBackgroundColor : '#4F46E5'
        }"/>`;
    }

    // 添加图标
    // @ts-ignore
    const IconComponent = LucideIcons[config.icon as IconKey] || LucideIcons['Download'];
    const iconSvg = React.createElement(IconComponent as any, {
      size: iconSize,
      color: config.iconColor,
      strokeWidth: config.lineThickness,
    });
    const iconString = ReactDOMServer.renderToString(iconSvg);
    const parser = new DOMParser();
    const iconDoc = parser.parseFromString(iconString, 'image/svg+xml');
    const iconPath = iconDoc.querySelector('path, g, circle, rect')?.outerHTML || '';

    if (iconPath) {
      svgContent += `<g transform="translate(${(size.width - iconSize) / 2}, ${(size.height - iconSize) / 2})"><g fill="${config.iconColor}">`;
      svgContent += iconPath
        .replace('stroke="currentColor"', `stroke="${config.iconColor}"`).replace('fill="none"', '');
      svgContent += '</g></g>';
    }

    // 添加文字
    if (config.customText) {
      svgContent += `<text x="${size.width / 2}" y="${size.height - textSize / 2
        }" font-family="Arial" font-weight="bold" font-size="${textSize}" fill="${config.textColor
        }" text-anchor="middle">${config.customText}</text>`;
    }

    svgContent += '</svg>';

    // 使用 Web API 下载文件
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'logo.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(t('logoDash.svgExported'));
    if (onLogoCreated) {
      onLogoCreated(URL.createObjectURL(blob));
    }
  } catch (error) {
    console.error('导出 SVG 失败:', error);
    toast.error(t('logoDash.exportErrorMessage'));
    throw error;
  }
};

/**
 * 复制到剪贴板
 */
export const copyToClipboard = async (
  config: LogoConfig,
  t: (key: string) => string
): Promise<void> => {
  try {
    // 创建一个临时 canvas
    const canvas = document.createElement('canvas');
    const size = getSizeByPreset(config.sizePreset, config.customSize);
    canvas.width = size.width;
    canvas.height = size.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('无法获取 Canvas 上下文');

    // 绘制背景
    if (config.isGradient && !config.isCustomColor) {
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      const colors = getGradientColors(config.gradientStyle);
      gradient.addColorStop(0, colors.startColor);
      gradient.addColorStop(1, colors.endColor);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = config.isCustomColor
        ? config.customBackgroundColor
        : '#4F46E5';
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制图标
    // @ts-ignore
    const IconComponent = LucideIcons[config.icon as IconKey] || LucideIcons['Download'];
    const iconSize = Math.min(size.width, size.height) * 0.4;
    const iconSvg = React.createElement(IconComponent as any, {
      size: iconSize,
      color: config.iconColor,
    });
    const iconString = ReactDOMServer.renderToString(iconSvg);
    const img = new Image();
    const dataUrl = 'data:image/svg+xml,' + encodeURIComponent(iconString);
    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(
          img,
          (canvas.width - iconSize) / 2,
          (canvas.height - iconSize) / 2,
          iconSize,
          iconSize
        );
        resolve();
      };
      img.onerror = reject;
      img.src = dataUrl;
    });

    // 绘制文字
    if (config.customText) {
      ctx.fillStyle = config.textColor;
      ctx.font = `bold ${Math.min(size.width, size.height) * 0.12}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        config.customText,
        canvas.width / 2,
        canvas.height - Math.min(size.width, size.height) * 0.1
      );
    }

    // 复制到剪贴板
    canvas.toBlob(async (blob) => {
      if (blob) {
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          toast.success(t('common.success'));
        } catch (clipboardError) {
          console.error('复制到剪贴板失败:', clipboardError);
          toast.error(t('common.error'));
        }
      }
    });
  } catch (error) {
    console.error('复制失败:', error);
    toast.error(t('common.error'));
  }
};

/**
 * 导入模板
 */
export const importTemplate = async (
  setConfig: React.Dispatch<React.SetStateAction<LogoConfig>>,
  validIcons: string[],
  t: (key: string) => string
): Promise<void> => {
  try {
    // 创建文件选择器
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.style.display = 'none';
    document.body.appendChild(input);

    input.onchange = async (event) => {
      try {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            try {
              const jsonContent = e.target?.result as string;
              const template = JSON.parse(jsonContent);

              // 应用模板设置
              setConfig((prev) => ({
                ...prev,
                gradientStyle: template.gradientStyle && typeof template.gradientStyle === 'string' && gradientStyles[template.gradientStyle as GradientStyle]
                  ? (template.gradientStyle as GradientStyle)
                  : prev.gradientStyle,
                icon: template.icon && validIcons.includes(template.icon)
                  ? template.icon
                  : prev.icon,
                customText: template.customText || prev.customText,
                textColor: template.textColor || prev.textColor,
                iconColor: template.iconColor || prev.iconColor,
                isCustomColor: typeof template.isCustomColor === 'boolean'
                  ? template.isCustomColor
                  : prev.isCustomColor,
                customBackgroundColor: template.customBackgroundColor || prev.customBackgroundColor,
                isGradient: typeof template.isGradient === 'boolean'
                  ? template.isGradient
                  : prev.isGradient,
              }));

              toast.success(t('logoDash.importSuccess'));
            } catch (error) {
              console.error('解析模板文件失败:', error);
              toast.error(t('logoDash.importError'));
            }
          };
          reader.readAsText(file);
        }
      } catch (error) {
        console.error('导入模板失败:', error);
        toast.error(t('logoDash.importError'));
      }
      document.body.removeChild(input);
    };

    input.click();
  } catch (error) {
    console.error('导入模板失败:', error);
    toast.error(t('logoDash.importError'));
  }
};

/**
 * 保存为模板
 */
export const saveAsTemplate = (
  config: LogoConfig,
  t: (key: string) => string
): void => {
  try {
    const template = {
      gradientStyle: config.gradientStyle,
      icon: config.icon,
      customText: config.customText,
      textColor: config.textColor,
      iconColor: config.iconColor,
      isCustomColor: config.isCustomColor,
      customBackgroundColor: config.customBackgroundColor,
      isGradient: config.isGradient,
    };

    const jsonContent = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `logo-template-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success(t('logoDash.saveSuccess'));
  } catch (error) {
    console.error('保存模板失败:', error);
    toast.error(t('logoDash.saveError'));
  }
};