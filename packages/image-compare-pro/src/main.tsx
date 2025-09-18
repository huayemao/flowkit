import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App.tsx";
import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import { enTranslations, zhTranslations, initI18n } from "./i18n";

// 初始化 i18n，使用shared-ui自带的翻译
initI18n({
  enTranslations,
  zhTranslations,
});

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}