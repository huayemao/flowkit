import React, { useState, useRef } from 'react';
import { ThemeToggle, LanguageSwitcher, ImageDiffViewer, ImageBatchUploader, Input } from '@flowkit/shared-ui';
import { WindowControls } from './components/window-controls';
import { useTranslation } from './i18n';

function App() {
  const { t } = useTranslation();
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [processedImageUrl, setProcessedImageUrl] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [uploadStep, setUploadStep] = useState<'original' | 'processed'>('original');
  const [tempFiles, setTempFiles] = useState<File[]>([]);

  // 处理文件上传
    const handleFiles = (files: File[]) => {
      if (files.length === 0) return;

      // 如果一次性上传了两张图片，直接设置图片1和图片2
      if (files.length >= 2 && uploadStep === 'original') {
        setOriginalImageUrl(URL.createObjectURL(files[0]));
        setProcessedImageUrl(URL.createObjectURL(files[1]));
        setTempFiles(files);
      }
      // 上传第一张图片（图片1）
      else if (uploadStep === 'original') {
        const url = URL.createObjectURL(files[0]);
        setOriginalImageUrl(url);
        setTempFiles(files);
        setUploadStep('processed');
      }
      // 上传第二张图片（图片2）
      else if (uploadStep === 'processed') {
        const url = URL.createObjectURL(files[0]);
        setProcessedImageUrl(url);
      }
    };

  // 处理第二张图片的选择
  const handleSecondImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFiles(Array.from(files));
    }
  };

  // 重置文件输入框的值
  const resetFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // 用于第二张图片上传的input引用
  const secondImageInputRef = useRef<HTMLInputElement>(null);

  // 重置上传状态
  const resetUpload = () => {
    setOriginalImageUrl(null);
    setProcessedImageUrl(null);
    setUploadStep('original');
    setTempFiles([]);

    // 释放URL对象
    if (originalImageUrl) URL.revokeObjectURL(originalImageUrl);
    if (processedImageUrl) URL.revokeObjectURL(processedImageUrl);
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
              onClose={resetUpload}
              title={t('imageDiff.title')}
              isMaximized={isMaximized}
              onMaximizeChange={setIsMaximized}
              className="flex-1"
            />
          ) : (
            <div className="flex-1 w-full max-w-4xl mx-auto p-6">
              {/* 上传进度提示 */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{t('imageDiff.title')}</h2>
                <div className="flex items-center justify-center gap-4 mb-2 mt-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep === 'original' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                    1
                  </div>
                  <div className={`w-24 h-1 ${uploadStep === 'processed' ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${uploadStep === 'processed' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}`}>
                    2
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    {uploadStep === 'original' ? t('imageDiff.uploadFirstImage') : t('imageDiff.uploadSecondImage')}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('imageDiff.quickCompareTip')}
                  </p>
              </div>

              {/* 如果正在上传第二张图，显示已上传的原图预览 */}
              {uploadStep === 'processed' && originalImageUrl && (
                <div className="mt-6 p-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-200/60 dark:border-gray-700/60">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('imageDiff.uploadedFirstImage')}</h3>
                  <div className="flex items-center gap-4">
                    <img
                      src={originalImageUrl}
                      alt="已上传的原图"
                      className="w-20 h-20 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate max-w-xs">
                        {tempFiles[0]?.name || '图片1'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tempFiles[0]?.size > 1024 * 1024
                          ? `${(tempFiles[0]?.size / (1024 * 1024)).toFixed(1)} MB`
                          : `${(tempFiles[0]?.size / 1024).toFixed(0)} KB`
                        }
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 根据上传步骤显示不同的上传组件 */}
              {uploadStep === 'original' ? (
                <ImageBatchUploader
                  value={tempFiles}
                  onChange={handleFiles}
                  accept="image/*"
                  maxSize={20}
                />
              ) : (
                <div className="mt-8">
                  <div className="flex flex-col gap-2 mb-4">
                    <label
                      htmlFor="processed-image-upload"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {t('imageDiff.stepTwo')}
                    </label>
                    <Input
                      id="processed-image-upload"
                      type="file"
                      accept="image/*"
                      className="cursor-pointer"
                      onChange={(e) => {
                        handleSecondImageChange(e);
                        resetFileInput(secondImageInputRef);
                      }}
                      ref={secondImageInputRef}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('imageDiff.supportedFormats')}
                  </p>
                  </div>
                </div>
              )}


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