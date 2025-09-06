
// 从shared-ui重新导出所有i18n功能
export { initI18n, changeLanguage, useTranslation } from '@flowkit/shared-ui';

// 本地翻译文件导入（供shared-ui使用）
import enTranslations from './locales/en/translation.json';
import zhTranslations from './locales/zh/translation.json';

// 导出本地翻译文件，供shared-ui的i18n配置使用
export { enTranslations, zhTranslations };







