import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import { AppLayout, useTranslation } from "@flowkit/shared-ui";
import UniversityMap from './components/UniversityMap/index';

function App() {
  const { t } = useTranslation();

  return (
    <AppLayout
      toolName={t('university.title')}
      toolDescription={t('university.description')}
      title={t('university.title')}
      subtitle={t('university.description')}
      keywords={t('university.keywords')}
      ogTitle={t('university.title')}
      ogDescription={t('university.description')}
      twitterTitle={t('university.title')}
      twitterDescription={t('university.description')}
      showTitle={true}
      titleCentered={true}
    >
      <UniversityMap />
    </AppLayout>
  );
}

export default App;
