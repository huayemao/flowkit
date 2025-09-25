
// 从shared-ui导出i18n相关功能
export { useTranslation, } from "@flowkit/shared-ui";

import { initI18n as sharedInitI18n } from "@flowkit/shared-ui";
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from "./locales/en/translation.json";
import zhTranslations from "./locales/zh/translation.json";
// 支持的语言列表
export const languages = [
    'en', 'zh', 'ar', 'bn', 'cs', 'da', 'de', 'es', 'fi', 'fr',
    'hi', 'hu', 'id', 'it', 'ja', 'ko', 'nl', 'no', 'pl', 'pt',
    'ru', 'sv', 'th', 'tl', 'tr', 'tw', 'ur', 'vi'
];

// 动态导入语言翻译文件的函数
export const importTranslations = async (language: string) => {
    try {
        // 动态导入指定语言的翻译文件
        const translationsModule = await import(`./locales/${language}/translation.json`);
        return translationsModule.default;
    } catch (error) {
        console.error(`Failed to load translations for language: ${language}`, error);
        // 如果指定语言的翻译文件不存在，加载默认的英文翻译
        const defaultTranslationsModule = await import('./locales/en/translation.json');
        return defaultTranslationsModule.default;
    }
};

// 预加载常用语言的翻译文件
export const preloadCommonTranslations = async () => {
    try {
        // 可以根据实际使用情况调整预加载的语言列表
        const translationPromises = languages.map(async (lang) => {
            const translations = await importTranslations(lang);
            return { [lang + 'Translations']: translations };
        });

        const results = await Promise.all(translationPromises);
        const translationsMap: Record<string, any> = {};

        results.forEach(result => {
            Object.assign(translationsMap, result);
        });

        return translationsMap;
    } catch (error) {
        console.error('Failed to preload common translations', error);
        return {};
    }
};

// 保留原有导出，保持向后兼容

// 初始化i18n
export const initI18n = async () => {
  try {
    // 获取浏览器语言
    const browserLang = navigator.language.split('-')[0];
    
    // 默认语言为英语
    let defaultLang = 'en';
    
    // 如果浏览器语言在支持的语言列表中，则使用浏览器语言
    if (languages.includes(browserLang)) {
      defaultLang = browserLang;
    }
    
    // 初始化i18next
    await i18next
      .use(initReactI18next)
      .init({
        lng: defaultLang,
        fallbackLng: 'en',
        interpolation: {
          escapeValue: false, // react already safes from xss
        },
        resources: {},
        react: {
          useSuspense: false
        }
      });
    
    // 加载默认语言的翻译
    const defaultTranslations = await importTranslations(defaultLang);
    i18next.addResourceBundle(defaultLang, 'translation', defaultTranslations);
    
    console.log('i18n initialized successfully with language:', defaultLang);
    
    return i18next;
  } catch (error) {
    console.error('Failed to initialize i18n:', error);
    
    // 即使初始化失败，也返回一个基本的i18next实例
    return i18next;
  }
};

export { enTranslations, zhTranslations };


export const init18n = async (language?: string) => {
    try {
        // 预加载常用语言翻译
        const translations = await preloadCommonTranslations();
        // 初始化i18n
       return await sharedInitI18n(translations, language);
    } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // 降级处理：仅使用英文
       return await sharedInitI18n({});
    }
};



