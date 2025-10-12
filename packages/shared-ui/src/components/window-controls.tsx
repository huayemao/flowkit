import { useState, useEffect } from "react";
import { Minimize, Maximize, X, Minus } from "lucide-react";
import { useTranslation } from "../i18n";
import { isTauri } from "../lib/utils";

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!isTauri) return;

    // 动态导入 Tauri API
    import("@tauri-apps/api/window")
      .then(({ getCurrentWindow }) => {
        const appWindow = getCurrentWindow();

        // 检查当前窗口是否最大化
        const checkMaximized = async () => {
          const maximized = await appWindow.isMaximized();
          setIsMaximized(maximized);
        };

        checkMaximized();

        // 监听窗口状态变化
        const unlisten = appWindow.onResized(() => {
          checkMaximized();
        });

        return () => {
          unlisten.then((f) => f());
        };
      })
      .catch(console.error);
  }, []);

  const handleMinimize = async () => {
    if (!isTauri) return;
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();
    await appWindow.minimize();
  };

  const handleMaximize = async () => {
    if (!isTauri) return;
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();
    if (isMaximized) {
      await appWindow.unmaximize();
    } else {
      await appWindow.maximize();
    }
    setIsMaximized(!isMaximized);
  };

  const handleClose = async () => {
    if (!isTauri) return;
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    const appWindow = getCurrentWindow();
    await appWindow.close();
  };

  // 只有在 Tauri 环境中才渲染窗口控制按钮
  if (!isTauri) {
    return null;
  }

  return (
    <div className="flex items-center">
      <button
        onClick={handleMinimize}
        className="w-12 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
        title={t("windowControls.minimize")}
      >
        <Minus className="w-3 h-3" />
      </button>

      <button
        onClick={handleMaximize}
        className="w-12 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
        title={isMaximized ? t("windowControls.restore") : t("windowControls.maximize")}
      >
        <Maximize className="w-3 h-3" />
      </button>

      <button
        onClick={handleClose}
        className="w-12 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
        title={t("windowControls.close")}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
