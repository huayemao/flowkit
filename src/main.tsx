import React from "react";
import ReactDOM from "react-dom/client";
import { initI18n } from './i18n';
import { enTranslations, zhTranslations } from './i18n';
// 导入 auto-trim-image 的翻译文件
import autoTrimImageZhTranslations from '@flowkit/auto-trim-image/dist/i18n/locales/zh/translation.json';
import autoTrimImageEnTranslations from '@flowkit/auto-trim-image/dist/i18n/locales/en/translation.json';
import App from "./App";
import './index.css'

// 合并翻译文件
const mergedZhTranslations = {
  ...zhTranslations,
  ...autoTrimImageZhTranslations
};

const mergedEnTranslations = {
  ...enTranslations,
  ...autoTrimImageEnTranslations
};

// 初始化 i18n，传递合并后的翻译文件
initI18n({
  enTranslations: mergedEnTranslations,
  zhTranslations: mergedZhTranslations
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
