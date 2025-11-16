import React, { ReactNode } from "react";
import { useTranslation } from 'react-i18next';
import { ScrollArea } from "./scroll-area";
import { LanguageSwitcher } from "./language-switcher";
import { ThemeToggle } from "./theme-toggle";
import { Analytics } from "@vercel/analytics/react";
import { WebFooter } from "./web-footer";
import { WebFAQ } from "./web-faq";
import { StructuredData } from "./structured-data";

interface WebLayoutProps {
  children: ReactNode;
  toolName?: string;
  toolDescription?: string;
  faqData?: Array<{
    question: string;
    answer: string;
  }>;
}

/**
 * Web布局组件 - 用于非Tauri环境，包含SEO优化元素
 */
export const WebLayout: React.FC<WebLayoutProps> = ({ 
  children, 
  toolName = "utities.online",
  toolDescription = "powerful online tools to use",
  faqData = []
}) => {
  const { t } = useTranslation();
  return (
    <div className={`transition-all duration-300 min-h-screen`}>
      {/* 结构化数据 */}
      <StructuredData 
        toolName={toolName}
        toolDescription={toolDescription}
        faqData={faqData}
      />

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
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Analytics */}
        <Analytics />
        
        {/* 顶部导航栏 */}
        <header className="w-full border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* 左侧区域 */}
              <div className="flex items-center gap-6">
                {/* Logo和主页链接 */}
                <a
                  href="https://www.utities.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  <span className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                    <span className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                      U
                    </span>
                  </span>
                  <span className="hidden sm:inline">{t('webLayout.brandName')}</span>
                </a>
                
                {/* 导航链接 */}
                <nav className="hidden md:flex items-center gap-6">
                  <a
                    href="https://www.utities.online"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {t('webLayout.home')}
                  </a>
                  <a
                    href="https://www.utities.online/tools"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {t('webLayout.moreTools')}
                  </a>
                </nav>
              </div>

              {/* 右侧控制区域 */}
              <div className="flex items-center gap-2">
                <LanguageSwitcher showText={true} />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* 主内容区域 */}
        <main className="flex-1">
          <ScrollArea className="w-full h-full">
            <div className="py-8 xs:pb-16">
              {children}
            </div>
          </ScrollArea>
        </main>

        {/* FAQ部分 */}
        {faqData.length > 0 && (
          <section className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
            <div className="mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <WebFAQ faqData={faqData} />
            </div>
          </section>
        )}

        {/* Footer */}
        <WebFooter />
      </div>
    </div>
  );
};