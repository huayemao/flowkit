import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
  Toaster,
  useTranslation,
} from "@flowkit/shared-ui";
import VideoSplitter from './components/VideoSplitter'




// 立即执行初始化

function App() {
  const { t } = useTranslation();

  const faqData = [
    {
      question: t('videoSplitter.faq.q1'),
      answer: t('videoSplitter.faq.a1')
    },
    {
      question: t('videoSplitter.faq.q2'),
      answer: t('videoSplitter.faq.a2')
    },
    {
      question: t('videoSplitter.faq.q3'),
      answer: t('videoSplitter.faq.a3')
    },
    {
      question: t('videoSplitter.faq.q4'),
      answer: t('videoSplitter.faq.a4')
    },
    {
      question: t('videoSplitter.faq.q5'),
      answer: t('videoSplitter.faq.a5')
    }
  ];

  return (
    <AppLayout
      toolName={t('videoSplitter.title')}
      toolDescription={t('videoSplitter.description')}
      title={t('videoSplitter.title')}
      subtitle={t('videoSplitter.description')}
      keywords={t('videoSplitter.keywords')}
      ogTitle={t('videoSplitter.title')}
      ogDescription={t('videoSplitter.description')}
      twitterTitle={t('videoSplitter.title')}
      twitterDescription={t('videoSplitter.description')}
      showTitle={true}
      titleCentered={true}
      faqData={faqData}
    >
      <Toaster />
      <VideoSplitter />
    </AppLayout>
  );
}

export default App;
