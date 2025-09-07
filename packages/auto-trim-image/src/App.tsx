import { useState } from "react";
import { AutoTrimImage } from "./components/auto-trim-image";
import { useTranslation } from "./i18n";
import { ThemeToggle, LanguageSwitcher } from "@flowkit/shared-ui";
import { WindowControls } from "./components/window-controls";

function App() {
  const { t } = useTranslation();
  const [darkMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) return saved === "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  return (
    <div className={`transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      {/* 磨砂光感渐变背景 */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-100/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl" />

        {/* 动态光效 */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-30 animate-float" />
        <div className="absolute top-0 -right-4 w-96 h-96 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-30 animate-float animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-30 animate-float animation-delay-4000" />

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />

        {/* 磨砂玻璃效果 */}
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* 内容层 */}
      <div className="fixed inset-0 h-screen z-10 flex flex-col items-center justify-around">
        {/* 顶部栏 - 标题栏区域 */}
        <div data-tauri-drag-region className="w-full">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* 左侧区域 */}
              <div className="flex items-center flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg
                    className="w-6 h-6 text-white"
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

              {/* 右侧控制区域 - 不响应拖拽 */}
              <div
                className="flex items-center gap-2"
                data-tauri-drag-region="false"
              >
                <div className="flex items-center gap-2">
                  <LanguageSwitcher />
                  <ThemeToggle />
                  <WindowControls />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="w-full flex-1 flex flex-col items-center overflow-hidden">
          <AutoTrimImage />
        </div>
      </div>
    </div>
  );
}

export default App;
