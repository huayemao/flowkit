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
    >
      <Toaster />
      <VideoSplitter />
    </AppLayout>
  );
}

export default App;
