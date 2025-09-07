import { useState } from "react";
import { Download, Play, Image } from "lucide-react";
import { useTranslation } from "../i18n";
import { autoTrimImage, getBorderColors } from "../utils/image-trim";

// 使用workspace包导入
import { ImageBatchUploader } from "@flowkit/shared-ui";
import { Button } from "@flowkit/shared-ui";

export function AutoTrimImage() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showPreview, setShowPreview] = useState(false);

  const handleProcess = async () => {
    setLoading(true);
    setProgress(0);
    const outs: { name: string; url: string }[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
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
      });

      setProgress(((i + 1) / files.length) * 100);
    }

    setResults(outs);
    setLoading(false);
    setProgress(0);
    setShowPreview(true);
  };

  const handleDownloadAll = () => {
    results.forEach((r) => {
      const a = document.createElement("a");
      a.href = r.url;
      a.download = r.name;
      a.click();
    });
  };

  const clearResults = () => {
    setResults([]);
    setFiles([]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* 上传区域 */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg flex-1 flex flex-col">
          <div className="p-8 text-center border-b border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {t("autoTrimImage.title")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t("autoTrimImage.description")}
            </p>
          </div>
          <div className="flex-1 p-8 flex flex-col">
            <div className="flex-1 min-h-[300px]">
              <ImageBatchUploader
                value={files}
                onChange={setFiles}
                loading={loading}
                className="h-full"
              />
            </div>

            {files.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      {t("autoTrimImage.imagesSelected", { count: files.length })}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setFiles([])}
                      variant="outline"
                      className="border-gray-300 dark:border-gray-600"
                    >
                      {t("autoTrimImage.clear")}
                    </Button>
                    <Button
                      onClick={handleProcess}
                      disabled={loading || files.length === 0}
                      className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {loading
                        ? `${t("autoTrimImage.processing")} ${Math.round(progress)}%`
                        : t("autoTrimImage.startProcessing")}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 处理中状态 */}
      {loading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
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

      {/* 预览 Dialog */}
      {showPreview && results.length > 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] flex flex-col border border-gray-200/50 dark:border-gray-700/50">
            <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {t("autoTrimImage.complete")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <Image className="w-4 h-4 inline-block mr-1"/> {t("autoTrimImage.imagesProcessed", { count: results.length })}
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
                          className="w-full h-8 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 border border-gray-200 dark:border-gray-600"
                          onClick={() => {
                            const a = document.createElement("a");
                            a.href = r.url;
                            a.download = r.name;
                            a.click();
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          {t("autoTrimImage.download")}
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
