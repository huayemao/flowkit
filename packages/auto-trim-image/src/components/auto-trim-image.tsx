import { useState } from "react";
import { Download, Image, FolderOpen, CheckCircle } from "lucide-react";
import { useTranslation } from "../i18n";
import { autoTrimImage, getBorderColors } from "../utils/image-trim";
import { Toaster, toast } from "@flowkit/shared-ui";
import { downloadDir } from "@tauri-apps/api/path";
import { openPath } from "@tauri-apps/plugin-opener";

// 使用workspace包导入
import { ImageBatchUploader } from "@flowkit/shared-ui";
import { Button } from "@flowkit/shared-ui";

interface ProcessedImage {
  name: string;
  url: string;
  downloaded: boolean;
}

export function AutoTrimImage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ProcessedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleProcess = async (filesToProcess: File[]) => {
    setLoading(true);
    setProgress(0);
    const outs: ProcessedImage[] = [];

    for (let i = 0; i < filesToProcess.length; i++) {
      const file = filesToProcess[i];
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      await new Promise((res) => {
        img.onload = res;
      });

      // 自动识别边框主色
      const borderColors = getBorderColors(img, 10, 3);
      borderColors.push([0, 0, 0], [255, 255, 255]);

      const blob = await autoTrimImage(img, borderColors);
      outs.push({
        name: file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "") + "-trim.png",
        url: URL.createObjectURL(blob),
        downloaded: false,
      });

      setProgress(((i + 1) / filesToProcess.length) * 100);
    }

    setResults(outs);
    setLoading(false);
    setProgress(0);
    setShowPreview(true);
  };

  const handleDownloadAll = () => {
    results.forEach((result, index) => {
      downloadImage(result, index);
    });

    // 显示下载成功提示
    toast.success(
      t("autoTrimImage.multipleFilesSaved", { count: results.length }),
      {
        duration: 3000,
        action: {
          label: t("autoTrimImage.openFolder"),
          onClick: () => handleOpenDownloadFolder(), // 打开目录
        },
      }
    );
  };

  const downloadImage = async (image: ProcessedImage, index: number) => {
    const a = document.createElement("a");
    a.href = image.url;
    a.download = image.name;
    a.click();

    // 更新下载状态
    setResults((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, downloaded: true } : item
      )
    );

    // 显示单个文件下载成功提示
    toast.success(t("autoTrimImage.fileSaved", { filename: image.name }), {
      duration: 3000,
      action: {
        label: t("autoTrimImage.open"),
        onClick: () => handleOpenDownloadFolder(image.name), // 打开具体文件
      },
    });
  };

  const handleImageAction = async (image: ProcessedImage, index: number) => {
    if (image.downloaded) {
      handleOpenDownloadFolder(image.name);
    } else {
      downloadImage(image, index);
    }
  };

  const clearResults = () => {
    setResults([]);
    setFiles([]);
  };

  const handleOpenDownloadFolder = async (filename?: string) => {
    try {
      const downloadPath = await downloadDir();
      if (filename) {
        // 使用path.join确保跨平台路径正确
        const filePath = `${downloadPath}\\${filename}`;
        await openPath(filePath);
      } else {
        // 打开下载目录
        await openPath(downloadPath);
      }
    } catch (error) {
      console.error("Failed to open download folder:", error);
      toast.error(
        t("autoTrimImage.openFolderError") || "Failed to open download folder"
      );
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-center">
      <Toaster />
      {/* 上传区域 */}
      <div className="h-4/5 w-4/5 flex flex-col max-w-4xl mx-auto">
        <div className="backdrop-blur-xl rounded-2xl  flex-1 flex flex-col gap-12">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {t("autoTrimImage.title")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t("autoTrimImage.description")}
              </p>
            </div>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 p-6 overflow-hidden">
              <ImageBatchUploader
                value={files}
                onChange={(newFiles) => {
                  setFiles(newFiles);
                  if (newFiles.length > 0) {
                    // 文件上传后立即开始处理
                    handleProcess(newFiles);
                  }
                }}
                loading={loading}
                className="h-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 处理中状态 */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-16 h-16 border-4 border-indigo-200 dark:border-indigo-800 rounded-full animate-spin border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("autoTrimImage.processingImages")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {Math.round(progress)}% {t("common.processing")}
            </p>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* 处理结果 Dialog */}
      {showPreview && results.length > 0 && (
        <div className="absolute inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-40 p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90%] flex flex-col border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t("autoTrimImage.complete")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Image className="w-4 h-4 inline-block mr-1" />{" "}
                  {t("autoTrimImage.imagesProcessed", {
                    count: results.length,
                  })}
                </p>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleDownloadAll}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {t("autoTrimImage.downloadAll")}
                </Button>
                <Button
                  onClick={() => handleOpenDownloadFolder()} // 打开目录
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FolderOpen className="w-4 h-4 mr-2" />
                  {t("autoTrimImage.openFolder")}
                </Button>
                <Button
                  onClick={() => {
                    setShowPreview(false);
                    clearResults();
                  }}
                  variant="outline"
                  className="border-gray-300 dark:border-gray-600"
                >
                  {t("autoTrimImage.close")}
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {results.map((r, i) => (
                  <div key={i} className="group">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="aspect-square mb-3">
                        <img
                          src={r.url}
                          alt={r.name}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <p
                          className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate"
                          title={r.name}
                        >
                          {r.name}
                        </p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`w-full h-8 text-sm border transition-all duration-300 ${r.downloaded
                            ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-700"
                            : "text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 border-gray-200 dark:border-gray-600"
                            }`}
                          onClick={() => handleImageAction(r, i)}
                        >
                          {r.downloaded ? (
                            <>
                              <CheckCircle className="w-3 h-3 mr-1" />
                              {t("autoTrimImage.open")}
                            </>
                          ) : (
                            <>
                              <Download className="w-3 h-3 mr-1" />
                              {t("autoTrimImage.download")}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
