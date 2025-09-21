import {
  ThemeToggle,
  LanguageSwitcher,
  useTranslation,
  AppLayout,
} from "@flowkit/shared-ui";
import { LogoDash } from "./components/logo-dash";

function App() {
  const { t } = useTranslation();
  return (
    <AppLayout>
      <div className="max-w-7xl self-stretch lg:min-w-[960px]  mx-auto">
        <LogoDash />
      </div>
    </AppLayout>
  );
}

export default App;
