import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import enTranslations from "./i18n/locales/en/translation.json";
import zhTranslations from "./i18n/locales/zh/translation.json";

import {
  initI18n,
  useTranslation,
  AppLayout,
} from "@flowkit/shared-ui";
import { LogoDash } from "./components/logo-dash";

initI18n({ zhTranslations, enTranslations });


function App() {

  const { t } = useTranslation();
  return (
    <AppLayout>
      <div className="max-w-7xl self-stretch lg:min-w-[960px]  mx-auto w-full">
        <LogoDash />
      </div>
    </AppLayout>
  );
}

export default App;
