"use client";

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';

// 导入shared-ui及各个子应用的默认翻译
import enShared from './locales/en/translation.json';
import zhShared from './locales/zh/translation.json';

import enAutoTrim from '../../../auto-trim-image/src/i18n/locales/en/translation.json';
import zhAutoTrim from '../../../auto-trim-image/src/i18n/locales/zh/translation.json';

import enAltitude from '../../../altitude/src/i18n/locales/en/translation.json';
import zhAltitude from '../../../altitude/src/i18n/locales/zh/translation.json';

import enBilibili from '../../../bilibili-subtitle-extractor/src/i18n/locales/en/translation.json';
import zhBilibili from '../../../bilibili-subtitle-extractor/src/i18n/locales/zh/translation.json';

import enLogoDash from '../../../logo-dash/src/i18n/locales/en/translation.json';
import zhLogoDash from '../../../logo-dash/src/i18n/locales/zh/translation.json';

import enVideoSplitter from '../../../video-splitter/src/i18n/locales/en/translation.json';
import zhVideoSplitter from '../../../video-splitter/src/i18n/locales/zh/translation.json';

const unwrap = (mod: any) => (mod && mod.default ? mod.default : mod);

function deepMerge(target: any, source: any) {
  const output = { ...target };
  const src = unwrap(source);
  if (src && typeof src === 'object') {
    Object.keys(src).forEach(key => {
      if (src[key] && typeof src[key] === 'object' && !Array.isArray(src[key])) {
        output[key] = deepMerge(target[key] || {}, src[key]);
      } else {
        output[key] = src[key];
      }
    });
  }
  return output;
}

export const enTranslations = [enShared, enAutoTrim, enAltitude, enBilibili, enLogoDash, enVideoSplitter].reduce(
  (acc, curr) => deepMerge(acc, curr),
  {}
);

export const zhTranslations = [zhShared, zhAutoTrim, zhAltitude, zhBilibili, zhLogoDash, zhVideoSplitter].reduce(
  (acc, curr) => deepMerge(acc, curr),
  {}
);

// 导出所有支持的语言列表
export const supportedLanguages = [
  'en', 'zh', 'ar', 'bn', 'cs', 'da', 'de', 'es', 'fi', 'fr',
  'hi', 'hu', 'id', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt',
  'ru', 'sv', 'th', 'tl', 'tr', 'tw', 'ur', 'vi'
];

// 语言显示名称映射
export const languageDisplayNames = {
  en: 'English',
  zh: '中文',
  ar: 'العربية',
  bn: 'বাংলা',
  cs: 'Čeština',
  da: 'Dansk',
  de: 'Deutsch',
  es: 'Español',
  fi: 'Suomi',
  fr: 'Français',
  hi: 'हिन्दी',
  hu: 'Magyar',
  id: 'Bahasa Indonesia',
  it: 'Italiano',
  ja: '日本語',
  ko: '한국어',
  nl: 'Nederlands',
  no: 'Norsk',
  pl: 'Polski',
  pt: 'Português',
  ru: 'Русский',
  sv: 'Svenska',
  th: 'ไทย',
  tl: 'Tagalog',
  tr: 'Türkçe',
  tw: '繁體中文',
  ur: 'اردو',
  vi: 'Tiếng Việt'
};

// 国旗 Unicode 字符映射
export const languageFlags = {
  en: '🇺🇸',
  zh: '🇨🇳',
  ar: '🇸🇦',
  bn: '🇧🇩',
  cs: '🇨🇿',
  da: '🇩🇰',
  de: '🇩🇪',
  es: '🇪🇸',
  fi: '🇫🇮',
  fr: '🇫🇷',
  hi: '🇮🇳',
  hu: '🇭🇺',
  id: '🇮🇩',
  it: '🇮🇹',
  ja: '🇯🇵',
  ko: '🇰🇷',
  nl: '🇳🇱',
  no: '🇳🇴',
  pl: '🇵🇱',
  pt: '🇵🇹',
  ru: '🇷🇺',
  sv: '🇸🇪',
  th: '🇹🇭',
  tl: '🇵🇭',
  tr: '🇹🇷',
  tw: '🇹🇼',
  ur: '🇵🇰',
  vi: '🇻🇳'
};

// 获取系统语言
const getSystemLanguage = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'zh';
  }
  const language = navigator.language || 'zh';
  return language;
};

// 获取保存的语言或系统语言
const getSavedLanguage = () => {
  if (typeof window === 'undefined') {
    return 'zh';
  }
  const savedLanguage = localStorage.getItem('flowkit-language');
  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }
  
  return 'zh';
};

// 初始化 i18n
export const initI18n = (translations?: any, defaultLanguage?: string) => {
  const lang = (typeof translations === 'string' ? translations : defaultLanguage) || getSavedLanguage() || 'zh';
  const customZh = typeof translations === 'object' && translations ? (translations.zhTranslations || translations.zh) : undefined;
  const customEn = typeof translations === 'object' && translations ? (translations.enTranslations || translations.en) : undefined;

  const mergedZh = customZh ? { ...zhTranslations, ...customZh } : zhTranslations;
  const mergedEn = customEn ? { ...enTranslations, ...customEn } : enTranslations;

  if (!i18n.isInitialized) {
    i18n
      .use(initReactI18next)
      .init({
        resources: {
          zh: { translation: mergedZh },
          en: { translation: mergedEn },
        },
        lng: lang,
        fallbackLng: 'zh',
        debug: false,
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      });
  }

  i18n.addResourceBundle('zh', 'translation', mergedZh, true, true);
  i18n.addResourceBundle('en', 'translation', mergedEn, true, true);
  
  if (lang && i18n.language !== lang) {
    i18n.changeLanguage(lang);
  }

  return i18n;
};

// 自动初始化，保证在 SSR/CSR 环境下始终准备就绪
if (!i18n.isInitialized) {
  initI18n();
}

// 动态切换语言的函数
export const changeLanguage = (lng: string) => {
  if (supportedLanguages.includes(lng)) {
    i18n.changeLanguage(lng);
    if (typeof window !== 'undefined') {
      localStorage.setItem('flowkit-language', lng);
    }
  }
};

// 重新导出 useTranslation hook
export { useTranslation } from 'react-i18next';

export default i18n;