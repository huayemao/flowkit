import React from "react";
import ReactDOM from "react-dom/client";
import * as LucideIcons from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { LogoConfig, LogoSize } from "./types";
import { getSizeByPreset } from "./utils";
import { flushSync } from "react-dom";

/**
 * 检查图标是否为 Font Awesome 图标
 * @param icon 图标名称
 * @returns 是否为 Font Awesome 图标
 */
export const isFontAwesomeIcon = (icon: string): boolean => {
  return typeof icon === "string" && icon.startsWith("fa-");
};

/**
 * 计算图标大小
 * @param config Logo 配置
 * @returns 图标大小
 */
export const calculateIconSize = (config: LogoConfig): number => {
  const size = getSizeByPreset(config.sizePreset, config.customSize);
  // 使用 iconMarginRatio 来计算图标大小，实现边距效果
  return Math.min(size.width, size.height) * (1 - 2 * config.iconMarginRatio);
};

/**
 * 渲染图标组件
 * @param config Logo 配置
 * @param size 图标大小
 * @returns React 图标组件
 */
export const renderIconComponent = (
  config: LogoConfig,
  context: "export" | "preview" = "preview"
): React.ReactElement => {
  const size = calculateIconSize(config);

  const containerWidth = getSizeByPreset(
    config.sizePreset,
    config.customSize
  ).width;

  const iconX = (containerWidth - size) / 2;
  const iconY = iconX;

  // 检查是否为 Font Awesome 图标（以 fa- 开头）
  if (config.icon && config.icon.startsWith("fa-")) {
    // 提取图标名称（去掉 fa- 前缀）
    const faIconName = config.icon as IconProp;
    const faIconElement = React.createElement(FontAwesomeIcon, {
      icon: faIconName,
      size: "lg",
      style: {
        color: config.iconColor,
        fontSize: `${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        transform:
          context == "export"
            ? `translate(${iconX}px, ${iconY}px) scale(${
                size / containerWidth
              })`
            : undefined,
      },
    });
    return faIconElement;
  } else {
    // 渲染 Lucide 图标
    const IconComponent =
      LucideIcons[config.icon as keyof typeof LucideIcons] ||
      LucideIcons["Download"];
    const iconElement = React.createElement(IconComponent as any, {
      className: "text-white",
      size: size,
      color: config.iconColor,
      strokeWidth: config.lineThickness,
      style:
        context === "export"
          ? {
              transform: `translate(${iconX}px, ${iconY}px)`,
            }
          : {},
    });
    return iconElement;
  }
};

/**
 * 渲染图标到 DOM 元素
 * @param config Logo 配置
 * @param container DOM 容器
 * @param size 图标大小
 */
export const renderIconToDOM = (
  config: LogoConfig,
  container: HTMLElement
): void => {
  // 创建图标包装器
  const iconWrapper = document.createElement("div");

  // 渲染图标组件
  const iconElement = renderIconComponent(config);
  const root = ReactDOM.createRoot(iconWrapper);
  flushSync(() => {
    root.render(iconElement);
  });
  // 将图标添加到容器
  container.appendChild(iconWrapper);
};

/**
 * 获取图标渲染的 SVG 字符串（用于 PNG 导出和剪贴板复制）
 * @param config Logo 配置
 * @param size 图标大小
 * @returns 图标渲染的 SVG 字符串
 */
export const getIconAsSVGString = (
  config: LogoConfig,
  size: number
): string => {
  try {
    if (config.icon && config.icon.startsWith("fa-")) {
      // 对于 Font Awesome 图标，使用 FontAwesomeIcon 组件渲染
      const faIconName = config.icon as IconProp;
      // 创建临时容器
      const tempContainer = document.createElement("div");
      // 渲染 Font Awesome 图标到临时容器
      const root = ReactDOM.createRoot(tempContainer);
      flushSync(() => {
        root.render(
          React.createElement(FontAwesomeIcon, {
            icon: faIconName,
            color: config.iconColor,
            size: "lg",
            style: {
              width: `${size}px`,
              height: `${size}px`,
              fontSize: `${size}px`,
            },
          })
        );
      });

      // 获取渲染后的 SVG 内容
      const svgElement = tempContainer.querySelector("svg");
      if (svgElement) {
        // 设置 SVG 尺寸
        svgElement.setAttribute("width", size.toString());
        svgElement.setAttribute("height", size.toString());
        // 获取 SVG 字符串
        const svgString = new XMLSerializer().serializeToString(svgElement);
        return svgString;
      }
      // 清理临时容器
      root.unmount();
      return "";
    } else {
      // 对于 Lucide 图标，创建临时容器
      const tempContainer = document.createElement("div");
      // 渲染 Lucide 图标到临时容器
      const IconComponent =
        LucideIcons[config.icon as keyof typeof LucideIcons] ||
        LucideIcons["Download"];
      const root = ReactDOM.createRoot(tempContainer);
      flushSync(() => {
        root.render(
          React.createElement(IconComponent as any, {
            size: size,
            color: config.iconColor,
            strokeWidth: config.lineThickness,
          })
        );
      });
      // 获取渲染后的 SVG 内容
      const svgElement = tempContainer.querySelector("svg");
      if (svgElement) {
        // 设置 SVG 尺寸
        svgElement.setAttribute("width", size.toString());
        svgElement.setAttribute("height", size.toString());
        // 获取 SVG 字符串
        const svgString = new XMLSerializer().serializeToString(svgElement);
        // 清理临时容器
        return svgString;
      }
      // 清理临时容器
      root.unmount();
      return "";
    }
  } catch (error) {
    console.error("获取图标 SVG 字符串失败:", error);
    return "";
  }
};
