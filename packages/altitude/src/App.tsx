import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
  useTranslation,
} from "@flowkit/shared-ui";
import { Altitude } from './index';

function App() {
  const { t } = useTranslation();
  const faqData = [
    {
      question: t('altitude.faq.q1'),
      answer: t('altitude.faq.a1'),
    },
    {
      question: t('altitude.faq.q2'),
      answer: t('altitude.faq.a2'),
    },
    {
      question: t('altitude.faq.q3'),
      answer: t('altitude.faq.a3'),
    },
    {
      question: t('altitude.faq.q4'),
      answer: t('altitude.faq.a4'),
    },
    {
      question: t('altitude.faq.q5'),
      answer: t('altitude.faq.a5'),
    },
  ];

  return (
    <AppLayout
      toolName={t('altitude.title')}
      toolDescription={t('altitude.description')}
      faqData={faqData}
      title={t('altitude.title')}
      subtitle={t('altitude.description')}
      keywords={t('altitude.keywords')}
      ogTitle={t('altitude.title')}
      ogDescription={t('altitude.description')}
      twitterTitle={t('altitude.title')}
      twitterDescription={t('altitude.description')}
      showTitle={true}
      titleCentered={true}
    >
      <Altitude />
    </AppLayout>
  );
}

export default App;
