import { useState, useEffect, useRef } from 'react';
import { X, Maximize, Minimize, MoveLeft, MoveRight, Eye } from 'lucide-react';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
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
  const [compareMode, setCompareMode] = useState<CompareMode>('side-by-side');
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

  // 计算显示宽度，确保不超过容器
  const getDisplayWidth = () => {
    if (!contentRef.current) return originalImageWidth;

    const containerWidth = contentRef.current.clientWidth - 48; // 减去padding
    // 最大宽度为容器宽度的90%，或者原始图片宽度，取较小值
    return Math.min(originalImageWidth, containerWidth * 0.9);
  };

  // 检测并排模式是否需要切换为纵向
  const shouldUseVerticalLayout = () => {
    if (!contentRef.current) return false;
    const containerWidth = contentRef.current.clientWidth - 48; // 减去padding
    // 如果两张图片并排的总宽度超过容器宽度的95%，则切换为纵向
    return (getDisplayWidth() * 2) > (containerWidth * 0.95);
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
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4 pt-3 px-10 bg-gray-50 dark:bg-gray-950 rounded-t-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white m-0">{title}</h3>
          <div className="flex items-center gap-2">
            {/* 对比模式选择器 */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-md p-1">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 px-3 rounded ${compareMode === 'side-by-side' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                onClick={() => setCompareMode('side-by-side')}
              >
                {t('imageDiff.sideBySide')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 px-3 rounded ${compareMode === 'overlay' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                onClick={() => setCompareMode('overlay')}
              >
                {t('imageDiff.overlay')}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 px-3 rounded ${compareMode === 'switch' ? 'bg-white dark:bg-gray-700 shadow-sm' : ''}`}
                onClick={() => setCompareMode('switch')}
              >
                {t('imageDiff.switch')}
              </Button>
            </div>

            {onMaximizeChange && (
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 rounded-full"
                onClick={handleMaximizeToggle}
                title={isMaximized ? t('imageDiff.minimize') : t('imageDiff.maximize')}
              >
                {isMaximized ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* 图片展示区域 */}
      <ScrollArea className="flex-1 overflow-auto">
        <div ref={contentRef} className="flex flex-col items-center p-6">
          {/* 并排对比模式 */}
          {compareMode === 'side-by-side' && (
            <div className={`${shouldUseVerticalLayout() ? 'flex-col' : 'flex-col md:flex-row'} gap-4 items-center w-full`}>
              <div className="flex-1 flex flex-col items-center">
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('imageDiff.original')}
                </div>
                <div
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                  style={{ maxWidth: '100%', width: `${getDisplayWidth()}px` }}
                >
                  <img
                    ref={originalImgRef}
                    src={originalImageUrl}
                    alt={t('imageDiff.originalImage')}
                    className="w-full object-contain"
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('imageDiff.processed')}
                </div>
                <div
                  className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                  style={{ maxWidth: '100%', width: `${getDisplayWidth()}px` }}
                >
                  <img
                    src={processedImageUrl}
                    alt={t('imageDiff.processedImage')}
                    className="w-full object-contain"
                    style={{ minHeight: '200px' }}
                  />
                </div>
              </div>

              {/* 布局提示 */}
              {shouldUseVerticalLayout() && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {t('imageDiff.verticalLayoutTip')}
                </div>
              )}
            </div>
          )}

          {/* 叠加对比模式 */}
          {compareMode === 'overlay' && (
            <div className="w-full flex flex-col items-center">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => adjustSlider('left')}
                  title={t('imageDiff.moveLeft')}
                >
                  <MoveLeft className="w-4 h-4" />
                </Button>

                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(sliderPosition)}%
                </div>

                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 rounded-full"
                  onClick={() => adjustSlider('right')}
                  title={t('imageDiff.moveRight')}
                >
                  <MoveRight className="w-4 h-4" />
                </Button>
              </div>

              <div
                className="relative border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm"
                style={{
                  maxWidth: '100%',
                  width: `${getDisplayWidth()}px`,
                  height: originalImageHeight > 0 ? `${(getDisplayWidth() / originalImageWidth) * originalImageHeight}px` : 'auto',
                  minHeight: '300px'
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
                style={{ maxWidth: '100%', width: `${getDisplayWidth()}px` }}
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

      {/* 底部说明 */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-b-xl">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {t('imageDiff.description')}
        </p>
      </div>
    </div>
  );
}