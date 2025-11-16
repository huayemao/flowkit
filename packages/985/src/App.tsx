import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import { AppLayout, useTranslation } from "@flowkit/shared-ui";
import UniversityMap from './components/UniversityMap/index';

function App() {
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('university.faq.q1'),
      answer: t('university.faq.a1')
    },
    {
      question: t('university.faq.q2'),
      answer: t('university.faq.a2')
    },
    {
      question: t('university.faq.q3'),
      answer: t('university.faq.a3')
    },
    {
      question: t('university.faq.q4'),
      answer: t('university.faq.a4')
    },
    {
      question: t('university.faq.q5'),
      answer: t('university.faq.a5')
    }
  ];

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
      faqData={faqData}
    >
      <UniversityMap />
    </AppLayout>
  );
}

export default App;
