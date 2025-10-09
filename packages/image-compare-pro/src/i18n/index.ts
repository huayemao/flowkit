
// 从shared-ui导出i18n相关功能
export { useTranslation, } from "@flowkit/shared-ui";

import { initI18n as sharedInitI18n } from "@flowkit/shared-ui";
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
        return translationsModule.default || {};
    } catch (error) {
        console.error(`Failed to load translations for language: ${language}`, error);
        try {
            // 如果指定语言的翻译文件不存在，加载默认的英文翻译
            const defaultTranslationsModule = await import('./locales/en/translation.json');
            return defaultTranslationsModule.default || {};
        } catch (defaultError) {
            console.error('Failed to load default English translations', defaultError);
            // 作为最后的后备，返回一个空对象
            return {};
        }
    }
};

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
import enTranslations from "./locales/en/translation.json";
import zhTranslations from "./locales/zh/translation.json";

export { enTranslations, zhTranslations };


export const initI18n = async (language?: string) => {
    try {
        // 预加载常用语言翻译
        const translations = await preloadCommonTranslations();
        console.log(translations)
        // 初始化i18n
       return await sharedInitI18n(translations, language);
    } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // 降级处理：仅使用英文
       return await sharedInitI18n({});
    }
};



