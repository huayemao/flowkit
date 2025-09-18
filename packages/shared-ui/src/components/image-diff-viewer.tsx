import { useState, useEffect, useRef } from "react";
import {
  X,
  Maximize,
  Minimize,
  MoveLeft,
  MoveRight,
  Eye,
  Check,
  Info,
} from "lucide-react";
import { Button } from "./button";
import { ScrollArea } from "./scroll-area";
import { Tabs, TabsList, TabsTrigger } from "./tabs";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "./resizable";
import { cn } from "../lib/utils";
import { useTranslation } from "../i18n";

interface ImageDiffViewerProps {
  originalImageUrl: string;
  processedImageUrl: string;
  onClose: () => void;
  title?: string;
  className?: string;
  isMaximized?: boolean;
  onMaximizeChange?: (isMaximized: boolean) => void;
}

// 对比模式类型
type CompareMode = "side-by-side" | "overlay" | "switch";

export function ImageDiffViewer({
  originalImageUrl,
  processedImageUrl,
  onClose,
  title = "Image Comparison",
  className,
  isMaximized = false,
  onMaximizeChange,
}: ImageDiffViewerProps) {
  const { t } = useTranslation();
  const [compareMode, setCompareMode] = useState<CompareMode>("overlay");
  const [showOriginal, setShowOriginal] = useState(true); // 用于切换模式
  const [originalImageWidth, setOriginalImageWidth] = useState(0);
  const [originalImageHeight, setOriginalImageHeight] = useState(0);
  const originalImgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // 加载原始图片以获取其尺寸
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setOriginalImageWidth(img.width);
      setOriginalImageHeight(img.height);
    };
    img.src = originalImageUrl;
  }, [originalImageUrl]);

  // 检测并排模式是否需要切换为纵向
  const shouldUseVerticalLayout = () => {
    if (!contentRef.current) return false;

    // 计算图片宽高比
    const aspectRatio =
      originalImageWidth > 0 && originalImageHeight > 0
        ? originalImageWidth / originalImageHeight
        : 1; // 默认宽高比为1

    const isWideImage = aspectRatio > 1.5;
    console.log(aspectRatio, isWideImage);

    return isWideImage;
  };

  // 根据 ResizablePanelGroup 的 size 控制处理后图片的显示范围
  const [left, setLeft] = useState<number>(50);

  const handleResize = (size: number[]) => {
    // size 格式为 [左侧面板百分比, 右侧面板百分比]
    // 计算处理后图片的transform位置，使其只显示在右侧面板范围内
    const [leftSize] = size;
    setLeft(leftSize);
  };

  // 切换模式的定时器
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (compareMode === "switch") {
      interval = setInterval(() => {
        setShowOriginal((prev) => !prev);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [compareMode]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className={cn(`w-full h-full flex flex-col`, className)}>
      {/* 顶部控制栏 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 pt-3 px-10  rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">
            {title}
          </h3>
          {/* 退出提示 */}
          <div className="mr-auto text-xs flex items-center text-gray-500 dark:text-gray-400 h-full px-3 py-1.5 rounded-md">
            <Info className="w-3.5 h-3.5 inline mr-1" />
            {t("imageDiff.exitTip")}
          </div>
          <div className="flex items-center gap-2">
            {/* 对比模式选择器 */}
            <Tabs
              value={compareMode}
              onValueChange={(value) => setCompareMode(value as CompareMode)}
              className="w-auto"
            >
              <TabsList>
                <TabsTrigger value="side-by-side" className="h-8 px-3">
                  {t("imageDiff.sideBySide")}
                </TabsTrigger>
                <TabsTrigger value="overlay" className="h-8 px-3">
                  {t("imageDiff.overlay")}
                </TabsTrigger>
                <TabsTrigger value="switch" className="h-8 px-3">
                  {t("imageDiff.switch")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {/* 图片展示区域 */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <div ref={contentRef} className="flex flex-col items-center p-6 w-full">
          {/* 并排对比模式 */}
          {compareMode === "side-by-side" && (
            <div
              className={cn("flex flex-col items-center w-full", {
                "md:flex-row": !shouldUseVerticalLayout(),
              })}
            >
              <div className="w-full md:w-1/2 flex flex-col items-center transition-all duration-300 hover:shadow-md px-2">
                <div className="mb-3 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {t("imageDiff.original")}
                </div>
                <div
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 w-full"
                  style={shouldUseVerticalLayout() ? { height: "40vh" } : {}}
                >
                  <img
                    ref={originalImgRef}
                    src={originalImageUrl}
                    alt={t("imageDiff.originalImage")}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col items-center transition-all duration-300 hover:shadow-md px-2">
                <div className="mb-3 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {t("imageDiff.processed")}
                </div>
                <div
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:border-green-300 dark:hover:border-green-600 w-full"
                  style={shouldUseVerticalLayout() ? { height: "40vh" } : {}}
                >
                  <img
                    src={processedImageUrl}
                    alt={t("imageDiff.processedImage")}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 布局提示 */}
              {shouldUseVerticalLayout() && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md">
                  <Info className="w-3.5 h-3.5 inline mr-1" />
                  {t("imageDiff.verticalLayoutTip")}
                </div>
              )}
            </div>
          )}

          {/* 叠加对比模式 - 使用 Resizable 组件实现 */}
          {compareMode === "overlay" && (
            <div className="w-full flex flex-col items-center">
              <div
                className="relative w-fit mx-0 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                style={{
                  maxWidth: "100%",
                  height: "80vh", // 最大高度为视口高度的80%
                }}
              >
                {/* 原始图片 - 固定在底部 */}
                <img
                  src={originalImageUrl}
                  alt={t("imageDiff.originalImage")}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    userSelect: "none",
                    pointerEvents: "none",
                    clipPath: `inset(0 ${100-left}% 0 0 )`,
                  }}
                />

                <div className="absolute inset-0 flex justify-center items-center w-full h-full">
                  <img
                    src={processedImageUrl}
                    alt={t("imageDiff.processedImage")}
                    className="object-contain"
                    style={{
                      userSelect: "none",
                      pointerEvents: "none",
                      clipPath: `inset(0 0 0 ${left}%)`,
                    }}
                  />
                </div>
                {/* 使用 ResizablePanelGroup 控制处理后图片的显示范围 */}
                <div className="absolute inset-0">
                  <ResizablePanelGroup
                    direction="horizontal"
                    className="h-full w-full"
                    onLayout={(sizes) => handleResize(sizes)}
                  >
                    {/* 左侧面板 - 透明，显示下方的原始图片 */}
                    <ResizablePanel
                      defaultSize={50}
                      minSize={0}
                      maxSize={100}
                      className="h-full bg-transparent"
                    >
                      {/* 透明面板，显示下方的原始图片 */}
                    </ResizablePanel>

                    {/* 中间分隔条 - 显示抓手，使用户可以拖动 */}
                    <ResizableHandle
                      withHandle
                      className="z-20 bg-gray-300 dark:bg-gray-600"
                    />

                    {/* 右侧面板 - 只显示处理后图片，使用相对定位确保正确裁剪 */}
                    <ResizablePanel
                      defaultSize={50}
                      minSize={0}
                      maxSize={100}
                      className="h-full overflow-hidden relative"
                    ></ResizablePanel>
                  </ResizablePanelGroup>
                </div>

                {/* 图片标签 - 显示在最上层 */}
                <div className="absolute top-2 left-2 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded-md z-10">
                  {t("imageDiff.original")}
                </div>
                <div className="absolute top-2 right-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs font-medium px-2 py-1 rounded-md z-10">
                  {t("imageDiff.processed")}
                </div>
              </div>

              {/* 操作提示 */}
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md">
                <Info className="w-3.5 h-3.5 inline mr-1" />
                {t("imageDiff.resizeTip", {
                  defaultValue: "拖动中间的分隔条可以调整处理后图片的覆盖范围",
                })}
              </div>
            </div>
          )}

          {/* 切换对比模式 */}
          {compareMode === "switch" && (
            <div className="w-full flex flex-col items-center">
              <div
                className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                style={{ maxWidth: "100%", width: `90%` }}
              >
                <img
                  src={showOriginal ? originalImageUrl : processedImageUrl}
                  alt={
                    showOriginal
                      ? t("imageDiff.originalImage")
                      : t("imageDiff.processedImage")
                  }
                  className="w-full object-contain transition-opacity duration-500"
                  style={{ minHeight: "200px" }}
                />

                {/* 模式指示器 */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {showOriginal
                    ? t("imageDiff.original")
                    : t("imageDiff.processed")}
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
