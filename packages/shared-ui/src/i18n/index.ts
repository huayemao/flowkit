import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入shared-ui自己的翻译文件
import enTranslations from './locales/en/translation.json';
import zhTranslations from './locales/zh/translation.json';

// 获取系统语言
const getSystemLanguage = () => {
  const language = navigator.language || 'en';
  return language.startsWith('zh') ? 'zh' : 'en';
};

// 获取保存的语言或系统语言
const getSavedLanguage = () => {
  const savedLanguage = localStorage.getItem('flowkit-language');
  if (savedLanguage && ['en', 'zh'].includes(savedLanguage)) {
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
}) => {
  // 如果已经初始化，直接返回
  if (i18n.isInitialized) {
    return i18n;
  }

  // 合并翻译文件：shared-ui的默认翻译 + 外部提供的翻译
  const resources = {
    en: {
      translation: mergeTranslations(enTranslations, translations?.enTranslations),
    },
    zh: {
      translation: mergeTranslations(zhTranslations, translations?.zhTranslations),
    },
  };

  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: getSavedLanguage(),
      fallbackLng: 'en',
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
    });

  return i18n;
};

// 动态切换语言的函数
export const changeLanguage = (lng: 'en' | 'zh') => {
  i18n.changeLanguage(lng);
  localStorage.setItem('flowkit-language', lng);
};

// 重新导出 useTranslation hook
export { useTranslation } from 'react-i18next';

export default i18n;