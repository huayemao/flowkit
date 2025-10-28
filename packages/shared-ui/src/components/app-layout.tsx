import React, { ReactNode } from "react";
import { WindowControls } from "./window-controls";
import { ScrollArea } from "./scroll-area";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { Analytics } from "@vercel/analytics/react";
import { isTauri } from "../lib/utils";

interface AppLayoutProps {
  children: ReactNode;
}
/**
 * 应用布局组件 - 包含背景效果和顶部控制栏
 */
export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className={`transition-all duration-300`}>
      {/* 磨砂光感渐变背景 */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/95 via-white/95 to-slate-100/95 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-gray-900/95 backdrop-blur-xl" />

        {/* 动态光效 */}
        <div className="absolute top-0 -left-4 w-36 h-36 md:w-96 md:h-96 bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float" />
        <div className="absolute top-0 -right-4 w-36 h-36 md:w-96 md:h-96 bg-yellow-300 dark:bg-yellow-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-updown" />
        <div className="absolute -bottom-8 left-20 w-36 h-36 md:w-96 md:h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-reverse" />
        <div className="absolute -bottom-16 right-20 w-36 h-36 md:w-96 md:h-96 bg-pink-300 dark:bg-pink-800 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 dark:opacity-40 animate-float-updown" />

        {/* 网格背景 */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5 dark:opacity-10" />

        {/* 磨砂玻璃效果 */}
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* 内容层 */}
      <div className="fixed inset-0 h-screen z-10 flex flex-col items-center justify-around ">
        {/* 只在非 Tauri 环境中渲染 Vercel Analytics */}
        {!isTauri && <Analytics />}
        
        {/* 顶部栏 - 标题栏区域 */}
        <div className="h-12 w-full"></div>

        {/* 主内容区域 */}
        <ScrollArea className="w-full flex-1">
          <div className="py-10 xs:pb-16">{children}</div>
        </ScrollArea>

        {/* 顶部控制栏 */}
        <div
          data-tauri-drag-region
          className="w-full fixed top-0 left-0 right-0"
        >
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-12">
              {/* 左侧区域 */}
              <div className="flex items-center gap-2">
                {!isTauri && (
                  <a
                    href="https://www.utities.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    <span className="w-5 h-5 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center">
                      <span className="text-xs text-indigo-600 dark:text-indigo-400">
                        U
                      </span>
                    </span>
                    <span>utities.online</span>
                  </a>
                )}
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
};
