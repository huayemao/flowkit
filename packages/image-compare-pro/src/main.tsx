import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initI18n } from "@flowkit/shared-ui";

import App from "./App.tsx";
import "./index.css";
import "@flowkit/shared-ui/dist/index.css";

// 初始化 i18n，使用shared-ui自带的翻译
initI18n();

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}