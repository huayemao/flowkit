"use client";

import React, { useState, useEffect } from "react";
import { createHighlighter, Highlighter } from "shiki";
import { Code, Copy, CheckCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

// 用于代码块的自定义组件
interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
}
export const CodeBlock: React.FC<CodeBlockProps> = ({
  children,
  className,
}) => {
  const [highlighter, setHighlighter] = useState<Highlighter | null>(null);
  const [copied, setCopied] = useState(false);
  const language = className?.match(/language-(\w+)/)?.[1] || "javascript";
  const code = String(children);
  const { theme: currentTheme } = useTheme();
  const isDarkMode = currentTheme === "dark";
  const theme = isDarkMode ? "github-dark" : "github-light";

  useEffect(() => {
    const initHighlighter = async () => {
      try {
        const shikiHighlighter = await createHighlighter({
          themes: ["github-light", "github-dark"],
          langs: [
            "javascript",
            "typescript",
            "tsx",
            "jsx",
            "html",
            "css",
            "json",
            "bash",
            "markdown",
          ],
        });
        setHighlighter(shikiHighlighter);
      } catch (error) {
        console.error("Failed to initialize highlighter:", error);
      }
    };

    initHighlighter();
  }, []);

  // 主题变化时更新高亮
  useEffect(() => {
    if (highlighter) {
      // 更新highlighter状态以触发重新渲染
      setHighlighter((prev) => prev);
    }
  }, [isDarkMode, highlighter]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = highlighter
    ? highlighter.codeToHtml(code, { lang: language, theme })
    : code;

  return (
    <div className="relative w-full my-8 rounded-xl shadow-lg overflow-hidden border border-border transition-all duration-300 hover:shadow-xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-muted border-b border-border">
        <div className="flex items-center gap-2">
          <Code size={16} className="text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground capitalize">
            {language}
          </span>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className="p-1.5 rounded-md hover:bg-muted-foreground/20 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={copied ? "Copied!" : "Copy code"}
              >
                {copied ? (
                  <CheckCheck
                    size={16}
                    className="text-green-500 animate-in fade-in scale-in-95 duration-200"
                  />
                ) : (
                  <Copy
                    size={16}
                    className="text-muted-foreground transition-transform hover:scale-105"
                  />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="top" className="font-medium">
              <p>{copied ? "Copied!" : "Copy code"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div
        className="overflow-x-auto font-mono p-5"
        dangerouslySetInnerHTML={{ __html: highlightedCode }}
      ></div>
    </div>
  );
};
