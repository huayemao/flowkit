import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入shared-ui自己的翻译文件
import enTranslations from './locales/en/translation.json';
import zhTranslations from './locales/zh/translation.json';

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
  const language = navigator.language || 'en';
  return language;
};

// 获取保存的语言或系统语言
const getSavedLanguage = () => {
  if (typeof window === 'undefined') {
    return getSystemLanguage();
  }
  const savedLanguage = localStorage.getItem('flowkit-language');
  if (savedLanguage && supportedLanguages.includes(savedLanguage)) {
    return savedLanguage;
  }
  
  // 首次运行或没有保存设置时，使用系统语言
  return getSystemLanguage();
};

// 合并翻译文件的工具函数
const mergeTranslations = (defaultTrans: any, customTrans: any) => {
  if (!customTrans) return defaultTrans;
  
  return {
    ...defaultTrans,
    ...customTrans,
    // 深度合并嵌套对象
    common: { ...defaultTrans.common, ...customTrans.common },
    imageUploader: { ...defaultTrans.imageUploader, ...customTrans.imageUploader },
    validation: { ...defaultTrans.validation, ...customTrans.validation },
  };
};

// 初始化 i18n - 使用单例模式，避免重复初始化
export const initI18n = (translations?: {
  enTranslations?: any;
  zhTranslations?: any;
  [key: string]: any;
}) => {
  // 如果已经初始化，直接返回
  if (i18n.isInitialized) {
    return i18n;
  }

  // 合并翻译文件：shared-ui的默认翻译 + 外部提供的翻译
  const resources: Record<string, any> = {};
  
  // 遍历所有支持的语言
  supportedLanguages.forEach(language => {
    try {
      // 检查是否有对应的默认翻译文件
      if (language === 'en' && enTranslations) {
        resources[language] = {
          translation: mergeTranslations(enTranslations, translations?.enTranslations),
        };
      } else if (language === 'zh' && zhTranslations) {
        resources[language] = {
          translation: mergeTranslations(zhTranslations, translations?.zhTranslations),
        };
      } else {
        // 对于没有默认翻译的语言，检查外部是否提供了翻译
        const externalTranslationKey = `${language}Translations`;
        if (translations && translations[externalTranslationKey]) {
          resources[language] = {
            translation: translations[externalTranslationKey],
          };
        }
      }
    } catch (error) {
      console.warn(`Failed to load translations for language: ${language}`, error);
    }
  });

  // 设置i18n配置，使用简单资源对象和动态加载机制
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: getSavedLanguage(),
      fallbackLng: 'en',
      debug: true,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      // partialBundledLanguages: true,
    });

  return i18n;
};

// 动态切换语言的函数
export const changeLanguage = (lng: string) => {
  if (supportedLanguages.includes(lng)) {
    i18n.changeLanguage(lng);
    localStorage.setItem('flowkit-language', lng);
  }
};

// 重新导出 useTranslation hook
export { useTranslation } from 'react-i18next';

export default i18n;