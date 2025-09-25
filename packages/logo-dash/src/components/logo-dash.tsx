import React, { useState } from "react";
import { useTranslation } from "../i18n";
import { Card, CardContent, CardHeader, CardTitle, Toaster } from "@flowkit/shared-ui";
import * as LucideIcons from "lucide-react";

// 导入所有子组件
import { BackgroundSettings } from "./logo-parts/background-settings";
import { IconSelector } from "./logo-parts/icon-selector";
import { IconPicker } from "./logo-parts/icon-picker";
import { TextSettings } from "./logo-parts/text-settings";
import { SizeSettings } from "./logo-parts/size-settings";
import { LogoPreview } from "./logo-parts/logo-preview";
import { LogoActions } from "./logo-parts/logo-actions";
import { LineThicknessSettings } from "./logo-parts/line-thickness-settings";
import { IconMarginRatioSettings } from "./logo-parts/icon-margin-ratio-settings";
import ReactDOM from "react-dom";

// 导入类型和工具函数
import { GradientStyle, LogoConfig, IconCategories } from "./logo-parts/types";
import {
  exportAsPNG,
  exportAsSVG,
  copyToClipboard,
  importTemplate,
  saveAsTemplate,
} from "./logo-parts/logo-export-utils";
import { generateRandomLogoConfig } from "./logo-parts/logo-generator-utils";

export interface LogoMakerProps {
  className?: string;
  onLogoCreated?: (logoUrl: string) => void;
}

// 从 LucideIcons 中获取所有图标组件
type IconKey = keyof typeof LucideIcons;
const lucideIconKeys = Object.keys(LucideIcons) as IconKey[];
const validIcons = lucideIconKeys.filter(
  (key) => !!LucideIcons[key] && !key.endsWith("Icon")
);

// 将图标分组以提高可用性
export const iconCategories: IconCategories = {
  technology: [
    "Code",
    "Cpu",
    "Monitor",
    "Laptop",
    "Smartphone",
    "Tablet",
    "Wifi",
    "Cloud",
    "Database",
  ],
  business: [
    "Briefcase",
    "TrendingUp",
    "DollarSign",
    "LineChart",
    "BarChart",
    "PieChart",
    "Target",
    "Award",
  ],
  nature: [
    "Leaf",
    "Tree",
    "Sun",
    "CloudRain",
    "Snowflake",
    "Flower",
    "Mountain",
    "Droplets",
    "Wind",
  ],
  animals: ["Cat", "Dog", "Bird", "Fish", "Rabbit", "PawPrint", "Zap"],
  symbols: [
    "Circle",
    "Square",
    "Triangle",
    "Star",
    "Heart",
    "Diamond",
    "Shield",
    "Key",
    "Lock",
  ],
  food: [
    "Coffee",
    "Apple",
    "Cheese",
    "Bread",
    "Pizza",
    "IceCream",
    "Wine",
    "Beer",
  ],
  fitness: ["Activity", "Dumbbell", "Yoga", "Running", "Swimmer", "Bicycle"],
  music: ["Music", "Headphones", "Guitar", "Drum", "Microphone"],
  travel: ["Car", "Plane", "Train", "Ship", "Compass", "Map", "Umbrella"],
};

iconCategories.other = validIcons.filter(
  (icon) => !icon.startsWith('Lucide') && !Object.values(iconCategories).flat().includes(icon)
);

export function LogoDash({ className, onLogoCreated }: LogoMakerProps) {
  const { t } = useTranslation();

  // 状态管理
  const [config, setConfig] = useState<LogoConfig>({
    gradientStyle: "indigoToPurple",
    icon: "Pickaxe",
    customText: "",
    textColor: "#FFFFFF",
    iconColor: "#FFFFFF",
    isCustomColor: false,
    customBackgroundColor: "#4F46E5",
    isGradient: true,
    sizePreset: "small",
    customSize: { width: 512, height: 512 },
    lineThickness: 1,
    iconMarginRatio: 0.2, // 默认边距比例为20%
  });

  const [showIconPicker, setShowIconPicker] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("symbols");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGridVisible, setIsGridVisible] = useState<boolean>(false);

  // 处理渐变样式变化
  const handleGradientStyleChange = (
    style: GradientStyle,
    isCustom: boolean
  ) => {
    setConfig((prev) => ({
      ...prev,
      gradientStyle: style,
      isCustomColor: isCustom,
    }));
  };

  // 处理自定义背景颜色变化
  const handleCustomBackgroundColorChange = (color: string) => {
    setConfig((prev) => ({ ...prev, customBackgroundColor: color }));
  };

  // 处理图标选择
  const handleSelectIcon = (icon: string) => {
    setConfig((prev) => ({ ...prev, icon }));
  };

  // 处理图标颜色变化
  const handleIconColorChange = (color: string) => {
    setConfig((prev) => ({ ...prev, iconColor: color }));
  };

  // 处理文字变化
  const handleTextChange = (text: string) => {
    setConfig((prev) => ({ ...prev, customText: text }));
  };

  // 处理文字颜色变化
  const handleTextColorChange = (color: string) => {
    setConfig((prev) => ({ ...prev, textColor: color }));
  };

  // 处理尺寸预设变化
  const handleSizePresetChange = (
    preset: "small" | "medium" | "large" | "custom"
  ) => {
    setConfig((prev) => ({ ...prev, sizePreset: preset }));
  };

  // 处理自定义尺寸变化
  const handleCustomSizeChange = (size: { width: number; height: number }) => {
    setConfig((prev) => ({ ...prev, customSize: size }));
  };

  // 处理渐变开关变化
  const handleIsGradientChange = (isGradient: boolean) => {
    setConfig((prev) => ({ ...prev, isGradient }));
  };

  // 处理线条粗细变化
  const handleLineThicknessChange = (thickness: number) => {
    setConfig((prev) => ({ ...prev, lineThickness: thickness }));
  };

  // 处理图标边距比例变化
  const handleIconMarginRatioChange = (ratio: number) => {
    setConfig((prev) => ({ ...prev, iconMarginRatio: ratio }));
  };

  // 导出为 PNG
  const handleExportAsPNG = async () => {
    setIsLoading(true);
    try {
      await exportAsPNG(config, t, onLogoCreated);
    } finally {
      setIsLoading(false);
    }
  };

  // 导出为 SVG
  const handleExportAsSVG = async () => {
    setIsLoading(true);
    try {
      await exportAsSVG(config, t, onLogoCreated);
    } finally {
      setIsLoading(false);
    }
  };

  // 随机生成 logo
  const generateRandomLogo = () => {
    const newConfig = generateRandomLogoConfig(config, iconCategories);
    setConfig(newConfig);
  };

  // 复制到剪贴板
  const handleCopyToClipboard = async () => {
    await copyToClipboard(config, t);
  };

  // 导入模板
  const handleImportTemplate = async () => {
    await importTemplate(setConfig, validIcons, t);
  };

  // 保存为模板
  const handleSaveAsTemplate = () => {
    saveAsTemplate(config, t);
  };

  // 切换网格显示
  const toggleGrid = () => {
    setIsGridVisible((prev) => !prev);
  };

  return (
    <div className={`flex flex-col min-h-full p-4 sm:p-6 ${className || ""}`}>
      <Toaster />

      {/* 主内容区域 - 两列布局 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* 左侧：预览区域 */}
        <div className="flex flex-col items-center justify-center">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {t('logoDash.title').split('-')[0].trim()}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-md">
              {t('logoDash.title').split('-').pop()?.trim()}
            </p>
          </div>
          <LogoPreview config={config} isGridVisible={isGridVisible} />
          <LogoActions
            config={config}
            isLoading={isLoading}
            isGridVisible={isGridVisible}
            onCopyToClipboard={handleCopyToClipboard}
            onGenerateRandomLogo={generateRandomLogo}
            onToggleGrid={toggleGrid}
            onExportAsPNG={handleExportAsPNG}
            onExportAsSVG={handleExportAsSVG}
            onImportTemplate={handleImportTemplate}
            onSaveAsTemplate={handleSaveAsTemplate}
            onLogoCreated={onLogoCreated}
            t={t}
          />
        </div>

        {/* 右侧：设置区域 */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('logoDash.icon')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <IconSelector
                icon={config.icon}
                iconColor={config.iconColor}
                gradientStyle={config.gradientStyle}
                isCustomColor={config.isCustomColor}
                onOpenIconPicker={() => setShowIconPicker(true)}
                onIconColorChange={handleIconColorChange}
                t={t}
              />
              <LineThicknessSettings
                lineThickness={config.lineThickness}
                onLineThicknessChange={handleLineThicknessChange}
                t={t}
              />

              <IconMarginRatioSettings
                iconMarginRatio={config.iconMarginRatio}
                onIconMarginRatioChange={handleIconMarginRatioChange}
                t={t}
              />

            </CardContent>
            {/* <SizeSettings
                  sizePreset={config.sizePreset}
                  customSize={config.customSize}
                  onSizePresetChange={handleSizePresetChange}
                  onCustomSizeChange={handleCustomSizeChange}
                  t={t}
                /> */}
          </Card>
          <BackgroundSettings
            isGradient={config.isGradient}
            gradientStyle={config.gradientStyle}
            isCustomColor={config.isCustomColor}
            customBackgroundColor={config.customBackgroundColor}
            onIsGradientChange={handleIsGradientChange}
            onGradientStyleChange={handleGradientStyleChange}
            onCustomBackgroundColorChange={
              handleCustomBackgroundColorChange
            }
            t={t}
          />


          <Card>
            <CardHeader>
              <CardTitle>{t('logoDash.text')}</CardTitle>
            </CardHeader>
            <CardContent>
              <TextSettings
                customText={config.customText}
                textColor={config.textColor}
                onTextChange={handleTextChange}
                onTextColorChange={handleTextColorChange}
                t={t}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 图标选择器对话框 */}
      <IconPicker
        open={showIconPicker}
        onOpenChange={setShowIconPicker}
        selectedIcon={config.icon}
        onSelectIcon={handleSelectIcon}
        iconCategories={iconCategories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        t={t}
      />
    </div>
  );
}

// 确保在浏览器环境中使用
if (typeof window !== "undefined") {
  // 为了兼容 DynamicIconComponent 中使用的全局 React 和 ReactDOM
  if (!window.React) {
    (window as any).React = React;
  }
  if (!window.ReactDOM) {
    (window as any).ReactDOM = ReactDOM;
  }
}
