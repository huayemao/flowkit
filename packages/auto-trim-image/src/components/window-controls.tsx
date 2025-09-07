import { useState, useEffect } from "react";

// 检查是否在 Tauri 环境中
const isTauri = true;

export function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

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

  // 更新返回部分
  return (
    <div className="flex items-center">
      <button
        onClick={handleMinimize}
        className="w-12 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
        title="最小化"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20 14H4v-4h16v4z" />
        </svg>
      </button>

      <button
        onClick={handleMaximize}
        className="w-12 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors duration-150"
        title={isMaximized ? "还原" : "最大化"}
      >
        {isMaximized ? (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
          </svg>
        ) : (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4 4h16v16H4V4zm2 2v12h12V6H6z" />
          </svg>
        )}
      </button>

      <button
        onClick={handleClose}
        className="w-12 h-8 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-150"
        title="关闭"
      >
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
      </button>
    </div>
  );
}
