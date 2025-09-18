import { useState, useEffect, useRef } from 'react';
import { X, Maximize, Minimize, MoveLeft, MoveRight, Eye, Check, Info } from 'lucide-react';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Tabs, TabsList, TabsTrigger } from './tabs';
import { cn } from '../lib/utils';
import { useTranslation } from '../i18n';

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
type CompareMode = 'side-by-side' | 'overlay' | 'switch';

export function ImageDiffViewer({
  originalImageUrl,
  processedImageUrl,
  onClose,
  title = 'Image Comparison',
  className,
  isMaximized = false,
  onMaximizeChange
}: ImageDiffViewerProps) {
  const { t } = useTranslation();
  const [compareMode, setCompareMode] = useState<CompareMode>('overlay');
  const [isDragging, setIsDragging] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50); // 用于叠加模式
  const [showOriginal, setShowOriginal] = useState(true); // 用于切换模式
  const [originalImageWidth, setOriginalImageWidth] = useState(0);
  const [originalImageHeight, setOriginalImageHeight] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);
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
    const aspectRatio = originalImageWidth > 0 && originalImageHeight > 0
      ? originalImageWidth / originalImageHeight
      : 1; // 默认宽高比为1


    const isWideImage = aspectRatio > 1.5;
    console.log(aspectRatio, isWideImage)

    return isWideImage;
  };

  // 处理叠加模式的滑块拖动
  const handleMouseDown = () => {
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      if (!contentRef.current) return;
      const containerRect = contentRef.current.getBoundingClientRect();
      const relativeX = e.clientX - containerRect.left;
      const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
      setSliderPosition(percentage);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // 切换模式的定时器
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (compareMode === 'switch') {
      interval = setInterval(() => {
        setShowOriginal(prev => !prev);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [compareMode]);

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // 处理滑块位置调整
  const adjustSlider = (direction: 'left' | 'right') => {
    setSliderPosition(prev => {
      const newPosition = direction === 'left' ? Math.max(0, prev - 5) : Math.min(100, prev + 5);
      return newPosition;
    });
  };

  // 处理最大化切换
  const handleMaximizeToggle = () => {
    if (onMaximizeChange) {
      onMaximizeChange(!isMaximized);
    }
  };

  return (
    <div className={cn(`w-full h-full flex flex-col`, className)}>
      {/* 顶部控制栏 */}
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 pt-3 px-10  rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">{title}</h3>
          {/* 退出提示 */}
          <div className="mr-auto text-xs flex items-center text-gray-500 dark:text-gray-400 h-full px-3 py-1.5 rounded-md">
            <Info className="w-3.5 h-3.5 inline mr-1" />
            {t('imageDiff.exitTip')}
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
                  {t('imageDiff.sideBySide')}
                </TabsTrigger>
                <TabsTrigger value="overlay" className="h-8 px-3">
                  {t('imageDiff.overlay')}
                </TabsTrigger>
                <TabsTrigger value="switch" className="h-8 px-3">
                  {t('imageDiff.switch')}
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
          {compareMode === 'side-by-side' && (
            <div className={cn('flex flex-col items-center w-full', {
              'md:flex-row': !shouldUseVerticalLayout(),
            })}>
              <div className="w-full md:w-1/2 flex flex-col items-center transition-all duration-300 hover:shadow-md px-2">
                <div className="mb-3 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {t('imageDiff.original')}
                </div>
                <div
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 w-full"
                  style={shouldUseVerticalLayout() ? { height: '40vh' } : {}}
                >
                  <img
                    ref={originalImgRef}
                    src={originalImageUrl}
                    alt={t('imageDiff.originalImage')}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col items-center transition-all duration-300 hover:shadow-md px-2">
                <div className="mb-3 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  {t('imageDiff.processed')}
                </div>
                <div
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:border-green-300 dark:hover:border-green-600 w-full"
                  style={shouldUseVerticalLayout() ? { height: '40vh' } : {}}
                >
                  <img
                    src={processedImageUrl}
                    alt={t('imageDiff.processedImage')}
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>

              {/* 布局提示 */}
              {shouldUseVerticalLayout() && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-3 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-md">
                  <Info className="w-3.5 h-3.5 inline mr-1" />
                  {t('imageDiff.verticalLayoutTip')}
                </div>
              )}
            </div>
          )}

          {/* 叠加对比模式 */}
          {compareMode === 'overlay' && (
            <div className="w-full flex flex-col items-center">

              <div
                className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                style={{
                  maxWidth: '100%',
                  width: `90%`,
                  // 使用CSS属性确保纵向不滚动且图片撑满高度
                  height: '80vh', // 最大高度为视口高度的70%
                }}
              >
                {/* 原始图片 - 只显示在分隔线左侧 */}
                <div
                  className="absolute top-0 left-0 w-full h-full overflow-hidden"
                  style={{
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                >
                  <img
                    src={originalImageUrl}
                    alt={t('imageDiff.originalImage')}
                    className="w-full h-full object-contain select-none"
                  />
                </div>

                {/* 处理后图片 - 固定大小裁剪显示 */}
                <div
                  className="absolute top-0 left-0 w-full h-full overflow-hidden"
                  style={{
                    clipPath: `inset(0 0 0 ${sliderPosition}%)`,
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                >
                  <img
                    src={processedImageUrl}
                    alt={t('imageDiff.processedImage')}
                    className="w-full h-full object-contain select-none"
                  />
                </div>

                {/* 分隔线容器 - 增加可点击区域 */}
                <div
                  className="absolute top-0 bottom-0 left-0 right-0"
                  onMouseDown={(e) => {
                    // 计算点击位置相对于容器的百分比
                    const containerRect = e.currentTarget.getBoundingClientRect();
                    const relativeX = e.clientX - containerRect.left;
                    const percentage = Math.max(0, Math.min(100, (relativeX / containerRect.width) * 100));
                    setSliderPosition(percentage);
                    setIsDragging(true);
                  }}
                />

                {/* 分隔线指示器 */}
                <div
                  ref={sliderRef}
                  className="absolute top-0 bottom-0 w-1 bg-white/70 backdrop-blur-sm shadow-md cursor-col-resize"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)', pointerEvents: 'auto' }}
                  onMouseDown={handleMouseDown}
                >
                  <div className="absolute top-1/2 left-1/2 w-6 h-6 rounded-full bg-white/90 backdrop-blur-sm border border-gray-300 shadow-md transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 切换对比模式 */}
          {compareMode === 'switch' && (
            <div className="w-full flex flex-col items-center">
              <div
                className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                style={{ maxWidth: '100%', width: `90%` }}
              >
                <img
                  src={showOriginal ? originalImageUrl : processedImageUrl}
                  alt={showOriginal ? t('imageDiff.originalImage') : t('imageDiff.processedImage')}
                  className="w-full object-contain transition-opacity duration-500"
                  style={{ minHeight: '200px' }}
                />

                {/* 模式指示器 */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" />
                  {showOriginal ? t('imageDiff.original') : t('imageDiff.processed')}
                </div>
              </div>
            </div>
          )}


        </div>
      </ScrollArea>
    </div>
  );
}