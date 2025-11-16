import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import { AppLayout, useTranslation } from "@flowkit/shared-ui";
import { LogoDash } from "./components/logo-dash";

// 立即执行初始化

function App() {
  const { t } = useTranslation();
  const faqData = [
    {
      question: t('logoDash.faq.q1'),
      answer: t('logoDash.faq.a1'),
    },
    {
      question: t('logoDash.faq.q2'),
      answer: t('logoDash.faq.a2'),
    },
    {
      question: t('logoDash.faq.q3'),
      answer: t('logoDash.faq.a3'),
    },
    {
      question: t('logoDash.faq.q4'),
      answer: t('logoDash.faq.a4'),
    },
    {
      question: t('logoDash.faq.q5'),
      answer: t('logoDash.faq.a5'),
    },
  ];

  return (
    <AppLayout
      toolName={t("logoDash.title")}
      toolDescription={t("logoDash.description")}
      faqData={faqData}
      title={t("logoDash.title")}
      subtitle={t("logoDash.description")}
      keywords={t("logoDash.keywords")}
      ogTitle={t("logoDash.title")}
      ogDescription={t("logoDash.description")}
      twitterTitle={t("logoDash.title")}
      twitterDescription={t("logoDash.description")}
      showTitle={true}
      titleCentered={true}
    >
      <LogoDash />
    </AppLayout>
  );
}

export default App;
