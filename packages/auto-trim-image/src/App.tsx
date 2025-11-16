import { AppLayout } from "@flowkit/shared-ui";
import { AutoTrimImage } from "./components/auto-trim-image";
import {  useTranslation } from "./i18n";

import "./index.css"

function App() {
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('autoTrimImage.faq.q1'),
      answer: t('autoTrimImage.faq.a1')
    },
    {
      question: t('autoTrimImage.faq.q2'),
      answer: t('autoTrimImage.faq.a2')
    },
    {
      question: t('autoTrimImage.faq.q3'),
      answer: t('autoTrimImage.faq.a3')
    },
    {
      question: t('autoTrimImage.faq.q4'),
      answer: t('autoTrimImage.faq.a4')
    },
    {
      question: t('autoTrimImage.faq.q5'),
      answer: t('autoTrimImage.faq.a5')
    }
  ];

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
      faqData={faqData}
    >
      <AutoTrimImage />
    </AppLayout>
  );
}

export default App;
