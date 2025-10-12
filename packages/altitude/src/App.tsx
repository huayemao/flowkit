import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
} from "@flowkit/shared-ui";
import { Altitude } from './index';




// 立即执行初始化

function App() {

  return (
    <AppLayout>
      <div className="max-w-7xl self-stretch lg:min-w-[960px]  mx-auto w-full">
        <Altitude />
      </div>
    </AppLayout>
  );
}

export default App;
