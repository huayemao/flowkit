import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 导入翻译文件
import enTranslations from './locales/en/translation.json';
import zhTranslations from './locales/zh/translation.json';

// 获取系统语言
const getSystemLanguage = () => {
  // 在 Tauri 环境中，使用 navigator.language
  const language = navigator.language || 'en';
  return language.startsWith('zh') ? 'zh' : 'en';
};

const resources = {
  en: {
    translation: enTranslations,
  },
  zh: {
    translation: zhTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getSystemLanguage(),
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false,
    },
  });

// 动态切换语言的函数
export const changeLanguage = (lng: 'en' | 'zh') => {
  i18n.changeLanguage(lng);
};

export default i18n;