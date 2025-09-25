import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
  Toaster,
} from "@flowkit/shared-ui";
import VideoSplitter from './components/VideoSplitter'




// 立即执行初始化

function App() {

  return (
    <AppLayout>
      <Toaster />
      <VideoSplitter />
    </AppLayout>
  );
}

export default App;
