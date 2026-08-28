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
  return (
    <div className="w-full min-h-screen relative">
      <StructuredData 
        toolName={toolName}
        toolDescription={toolDescription}
        faqData={faqData}
      />

      {/* 磨砂光感渐变背景 */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
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

      <div className="w-full py-6 px-4 md:px-8 max-w-7xl mx-auto">
        <main className="w-full flex-1">
          {children}
        </main>

        {faqData.length > 0 && (
          <section className="mt-16 pt-12 border-t border-border/40">
            <WebFAQ faqData={faqData} />
          </section>
        )}
      </div>
    </div>
  );
};