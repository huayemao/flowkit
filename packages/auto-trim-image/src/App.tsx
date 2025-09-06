import { AutoTrimImage } from "./components/auto-trim-image";
import { useTranslation } from "./i18n";

function App() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t("autoTrimImage.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t("autoTrimImage.description")}
            </p>
          </div>
          <AutoTrimImage />
        </div>
      </div>
    </div>
  );
}

export default App;
