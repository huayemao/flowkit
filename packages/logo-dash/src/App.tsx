import "./index.css";
import "@flowkit/shared-ui/dist/index.css";
import {
  useTranslation,
  AppLayout,
} from "@flowkit/shared-ui";
import { LogoDash } from "./components/logo-dash";
import {
  init18n
} from "./i18n";



// 立即执行初始化
await init18n();


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
