"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { i18nConfig } from "@/lib/i18n/config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

// 语言配置映射
const languages = [
  { code: "en", name: "English" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" }
];

export default function LocaleSwitch() {
  const { i18n } = useTranslation();
  const activeLocale = i18n.language;
  
  const router = useRouter();
  const currentPathname = usePathname();

  const onLanguageChange = (newLocale: string) => {
    if (newLocale === activeLocale) return;

    // Set a cookie for next-i18n-router to read the new locale
    const days = 30;
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = date.toUTCString();
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

    // Compute new path with updated locale
    if (activeLocale === i18nConfig.defaultLocale && !i18nConfig.prefixDefault) {
      router.push("/" + newLocale + currentPathname);
    } else {
      router.push(currentPathname.replace(`/${activeLocale}`, `/${newLocale}`));
    }

    router.refresh();
  };

  // 获取当前语言的显示名称
  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === activeLocale);
    return currentLang?.name || activeLocale;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center space-x-1.5 h-9 py-1.5 px-3 rounded-xl border border-border/80 bg-card hover:bg-muted/80 text-foreground transition-all text-xs font-medium shadow-sm">
          <Globe size={14} className="text-primary" />
          <span>{getCurrentLanguageName()}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[130px] rounded-xl border border-border/80 p-1 shadow-lg">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={activeLocale === language.code ? "bg-accent" : ""}
          >
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}