import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  AppLayout,
} from "@flowkit/shared-ui";
import { LogoDash } from "./components/logo-dash";




// 立即执行初始化

function App() {

  return (
    <AppLayout>
      <div className="max-w-7xl self-stretch lg:min-w-[960px]  mx-auto w-full">
        <LogoDash />
      </div>
    </AppLayout>
  );
}

export default App;
