import "../index.css";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "../i18n";
import { Upload, XIcon } from "lucide-react";
import { Button } from "./button";
import { cn } from "../lib/utils";

interface ImageBatchUploaderProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  loading?: boolean;
  className?: string;
  accept?: string;
  maxSize?: number; // 单位：MB
}

export function ImageBatchUploader({
  value = [],
  onChange,
  loading = false,
  className,
  accept = "image/*",
  maxSize = 10,
}: ImageBatchUploaderProps) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFiles = async (files: FileList | File[]) => {
    const validFiles: File[] = [];
    Array.from(files).forEach((file) => {
      if (
        accept &&
        file.type &&
        !file.type.match(accept.replace("*", ".*")) &&
        !(
          accept === "image/svg+xml" && file.name.toLowerCase().endsWith(".svg")
        )
      ) {
        return;
      }
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        return;
      }
      validFiles.push(file);
    });
    if (validFiles.length > 0) {
      onChange?.(validFiles);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  const handlePaste = async (e: ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;
    const files: File[] = [];
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
    if (files.length > 0) {
      await handleFiles(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      await handleFiles(files);
    }
  };

  useEffect(() => {
    const dropZone = dropZoneRef.current;
    if (dropZone) {
      dropZone.addEventListener("paste", handlePaste as any);
      return () => {
        dropZone.removeEventListener("paste", handlePaste as any);
      };
    }
  }, []);

  return (
    <div
      ref={dropZoneRef}
      className={cn(
        "relative transition-all duration-200",
        isDragging && "ring-2 ring-primary ring-offset-2",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {(!value || value.length === 0) && (
        <div
          className="relative border border-dashed rounded-2xl p-12 h-96 flex flex-col items-center justify-center text-muted-foreground gap-8 
                       bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm 
                       border-gray-200/80 dark:border-gray-700/60 
                       hover:border-gray-300/90 dark:hover:border-gray-600/80 
                       transition-all duration-500 ease-out
                       shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]
                       hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_12px_48px_rgba(0,0,0,0.3)]"
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-50/50 via-transparent to-gray-100/30 dark:from-gray-800/20 dark:via-transparent dark:to-gray-700/10 opacity-50"></div>

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* 文本区域 - 更优雅的排版 */}
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-light text-gray-800 dark:text-gray-100 tracking-wide">
                {t("imageUploader.selectImages")}
              </h3>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed">
                {t("imageUploader.dragDropSupport")}
              </p>
            </div>

            {/* 按钮 - 更高级的哑光按钮 */}
            <Button
              variant="ghost"
              className="relative px-10 py-4 text-sm font-medium rounded-full 
                         bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm 
                         border border-gray-200/60 dark:border-gray-700/60
                         text-gray-700 dark:text-gray-200
                         hover:bg-white/90 dark:hover:bg-gray-700/90
                         hover:border-gray-300/80 dark:hover:border-gray-600/80
                         hover:text-gray-900 dark:hover:text-gray-100
                         hover:shadow-md hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20
                         transform hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 ease-out"
              onClick={() =>
                document.getElementById("batch-file-upload")?.click()
              }
            >
              <Upload className="h-4 w-4 mr-2 opacity-70" />
              {t("imageUploader.selectImages")}
            </Button>

            <input
              id="batch-file-upload"
              type="file"
              accept={accept}
              className="hidden"
              multiple
              // @ts-ignore
              webkitdirectory="true"
              onChange={handleFileChange}
            />

            {/* 功能提示 - 更精致的标签 */}
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                拖拽上传
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-400 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                粘贴图片
              </span>
            </div>
          </div>
        </div>
      )}
      {value && value.length > 0 && (
        <div className="mt-6 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 dark:border-gray-700/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {value.length} {t("common.files")}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                {value.reduce((acc, file) => acc + file.size, 0) > 1024 * 1024
                  ? `${(
                      value.reduce((acc, file) => acc + file.size, 0) /
                      (1024 * 1024)
                    ).toFixed(1)} MB`
                  : `${(
                      value.reduce((acc, file) => acc + file.size, 0) / 1024
                    ).toFixed(1)} KB`}
              </span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-800/80 transition-colors duration-200"
              onClick={() => onChange?.([])}
              aria-label={t("common.clear")}
            >
              <XIcon className="w-3.5 h-3.5" />
            </Button>
          </div>

          <div className="grid [grid-template-columns:repeat(auto-fill,minmax(140px,1fr))] gap-3">
            {value.map((file, idx) => (
              <div key={idx} className="group relative">
                <div className="relative rounded-xl overflow-hidden bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md hover:shadow-gray-200/20 dark:hover:shadow-gray-900/20">
                  <div className="aspect-square flex items-center justify-center p-2">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`${t("common.preview")}${idx}`}
                      className="max-h-24 max-w-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                </div>
                <div className="mt-2 px-1">
                  <span
                    className="text-xs font-medium text-gray-700 dark:text-gray-300 block truncate"
                    title={file.name}
                  >
                    {file.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-light">
                    {file.size > 1024 * 1024
                      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                      : `${(file.size / 1024).toFixed(0)} KB`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {loading && (
        <div className="absolute inset-0 bg-white/30 dark:bg-gray-900/30 backdrop-blur-sm rounded-2xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-gray-300/50 dark:border-gray-600/50 border-t-gray-600 dark:border-t-gray-300 rounded-full animate-spin"></div>
            <span className="text-sm text-gray-500 dark:text-gray-400 font-light">
              {t("common.loading")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
