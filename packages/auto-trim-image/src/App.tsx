import { AutoTrimImage } from "./components/auto-trim-image";
import { AppLayout, useTranslation } from "@flowkit/shared-ui";
import "./index.css"

function App() {
  const { t } = useTranslation();

  return (
    <AppLayout
      toolName={t('autoTrimImage.title')}
      toolDescription={t('autoTrimImage.description')}
      title={t('autoTrimImage.title')}
      subtitle={t('autoTrimImage.description')}
      keywords={t('autoTrimImage.keywords')}
      ogTitle={t('autoTrimImage.title')}
      ogDescription={t('autoTrimImage.description')}
      twitterTitle={t('autoTrimImage.title')}
      twitterDescription={t('autoTrimImage.description')}
      showTitle={true}
      titleCentered={true}
    >
      <AutoTrimImage />
    </AppLayout>
  );
}

export default App;
