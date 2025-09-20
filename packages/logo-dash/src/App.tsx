import { ThemeToggle, LanguageSwitcher, useTranslation } from "@flowkit/shared-ui";
import { WindowControls } from "./components/window-controls";
import { LogoDash } from "./components/logo-dash";


function App() {
  const { t } = useTranslation();
  return (
    <div className={`transition-all duration-300 min-h-screen`}>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-xl font-bold text-indigo-600">{t('logoDash.title')}</h1>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          <WindowControls />
        </div>
      </header>
      
      <main className="p-4">
        <LogoDash />
      </main>
    </div>
  );
}

export default App;
