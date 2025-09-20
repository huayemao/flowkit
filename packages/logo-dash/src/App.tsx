import { ThemeToggle, LanguageSwitcher, useTranslation } from "@flowkit/shared-ui";
import { WindowControls } from "./components/window-controls";
import { LogoDash } from "./components/logo-dash";


function App() {
  const { t } = useTranslation();
  return (
    <div className={`transition-all duration-300 min-h-screen`}>
      <header className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="rounded-lg flex items-center justify-center p-2 shadow-md transition-all duration-300 ease-in-out bg-gradient-to-br from-purple-600 to-pink-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pickaxe text-white" aria-hidden="true">
              <path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912"></path>
              <path d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"></path>
              <path d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"></path>
              <path d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-br from-purple-600 to-pink-500 bg-clip-text text-transparent">{t('logoDash.title')}</h1>
        </div>
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
