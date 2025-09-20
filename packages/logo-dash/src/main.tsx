import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initI18n } from "@flowkit/shared-ui";

import App from "./App.tsx";
import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import enTranslations from "./i18n/locales/en/translation.json";
import zhTranslations from "./i18n/locales/zh/translation.json";
// 初始化 i18n
initI18n({ zhTranslations, enTranslations });

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}
