import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
} from "@flowkit/shared-ui";
import { LogoDash } from "./components/logo-dash";
import { useTranslation } from "react-i18next";



// 立即执行初始化

function App() {
  const { t } = useTranslation();

  return (
    <AppLayout
      toolName={t('logoDash.title')}
      toolDescription={t('logoDash.description')}
      title={t('logoDash.title')}
      subtitle={t('logoDash.description')}
      keywords={t('logoDash.keywords')}
      ogTitle={t('logoDash.title')}
      ogDescription={t('logoDash.description')}
      twitterTitle={t('logoDash.title')}
      twitterDescription={t('logoDash.description')}
      showTitle={true}
      titleCentered={true}
    >
      <LogoDash />
    </AppLayout>
  );
}

export default App;
