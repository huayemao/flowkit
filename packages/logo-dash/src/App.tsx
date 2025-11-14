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
      <div className="max-w-7xl self-stretch lg:min-w-[960px]  mx-auto w-full space-y-6">
        <LogoDash />
        <div className="flex justify-center gap-4">
          <a
            href="https://www.producthunt.com/products/logodash?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-logodash"
            target="_blank"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1025998&theme=light&t=1760406787922"
              alt="LogoDash - Fast free logo maker | create beautiful logos in a dash | Product Hunt"
              style={{ width: 250, height: 54 }}
              width={250}
              height={54}
            />
          </a>
          <a href="https://toolfame.com/item/logodash" target="_blank" rel="noopener noreferrer">
            <img src="https://toolfame.com/badge-light.svg" alt="Featured on toolfame.com" style={{ width: 250, height: 54 }} />
          </a>
        </div>

      </div>
    </AppLayout>
  );
}

export default App;
