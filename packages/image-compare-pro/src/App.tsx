import React, { useState, useRef } from 'react';
import { ThemeToggle, LanguageSwitcher, ImageDiffViewer } from '@flowkit/shared-ui';
import { WindowControls } from './components/window-controls';

function App() {
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // 处理文件上传
  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // 如果上传了两张图片，分别设为原图和处理后的图片
    if (files.length >= 2) {
      setOriginalImageUrl(URL.createObjectURL(files[0]));
      setProcessedImageUrl(URL.createObjectURL(files[1]));
    } else {
      // 如果只上传了一张图片，设为原图，处理后的图片也使用同一张（演示用）
      const url = URL.createObjectURL(files[0]);
      setOriginalImageUrl(url);
      setProcessedImageUrl(url);
    }
  };

  // 处理拖拽事件
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.add('border-blue-400', 'bg-blue-50/50', 'dark:bg-blue-900/20');
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-400', 'bg-blue-50/50', 'dark:bg-blue-900/20');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dropZoneRef.current) {
      dropZoneRef.current.classList.remove('border-blue-400', 'bg-blue-50/50', 'dark:bg-blue-900/20');
    }
    handleFileUpload(e.dataTransfer.files);
  };

  // 选择文件
  const handleSelectFiles = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileUpload(target.files);
    };
    input.click();
  };

  return (
    <div className={`transition-all duration-300`}>
      {/* 磨砂光感渐变背景 */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-100/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl" />

        {/* 动态光效 - 使用内联样式确保动画效果明显 */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-updown" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-reverse" />
        <div className="absolute -bottom-16 right-20 w-96 h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-updown" />

        {/* 磨砂玻璃效果 */}
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* 内容层 */}
      <div className="fixed inset-0 h-screen z-10 flex flex-col items-center justify-around">
        {/* 顶部栏 - 标题栏区域 */}
        <div className="h-12 w-full"></div>

        {/* 主内容区域 */}
        <div className="w-full flex-1 flex flex-col items-center overflow-hidden">
          {originalImageUrl && processedImageUrl ? (
            <ImageDiffViewer
              originalImageUrl={originalImageUrl}
              processedImageUrl={processedImageUrl}
              onClose={() => {
                setOriginalImageUrl(null);
                setProcessedImageUrl(null);
                if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
                if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
              }}
              title="Image Compare Pro"
              isMaximized={isMaximized}
              onMaximizeChange={setIsMaximized}
              className="flex-1"
            />
          ) : (
            <div
              ref={dropZoneRef}
              className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl transition-colors"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleSelectFiles}
            >
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Image Compare Pro</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  拖拽两张图片到此处，或点击选择文件
                </p>
                <div className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer">
                  选择图片
                </div>
              </div>
            </div>
          )}
        </div>

        <div data-tauri-drag-region className="w-full fixed top-0 left-0 right-0">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              {/* 左侧区域 */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>

              {/* 右侧控制区域 - 不响应拖拽 */}
              <div
                className="flex items-center gap-2"
                data-tauri-drag-region="false"
              >
                <WindowControls />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;