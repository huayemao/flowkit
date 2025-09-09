import { useEffect } from 'react';
import { window as tauriWindow } from '@tauri-apps/api';

interface WindowControlsProps {
  isTauri?: boolean;
}

/**
 * 窗口控制组件 - 提供最小化、最大化/还原和关闭功能
 * 在Tauri环境中工作，在Web环境中显示为占位符
 */
export const WindowControls: React.FC<WindowControlsProps> = ({ isTauri = true }) => {
  // 仅在Tauri环境中执行窗口控制操作
  const handleMinimize = async () => {
    if (isTauri) {
      try {
        await tauriWindow.minimize();
      } catch (error) {
        console.error('Failed to minimize window:', error);
      }
    }
  };

  const handleMaximize = async () => {
    if (isTauri) {
      try {
        const isMax = await tauriWindow.isMaximized();
        if (isMax) {
          await tauriWindow.unmaximize();
        } else {
          await tauriWindow.maximize();
        }
      } catch (error) {
        console.error('Failed to toggle maximize window:', error);
      }
    }
  };

  const handleClose = async () => {
    if (isTauri) {
      try {
        await tauriWindow.close();
      } catch (error) {
        console.error('Failed to close window:', error);
      }
    }
  };

  // 如果不是Tauri环境，不渲染任何内容
  if (!isTauri) {
    return null;
  }

  return (
    <div className="flex items-center space-x-1">
      {/* 最小化按钮 */}
      <button
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={handleMinimize}
        title="Minimize"
        aria-label="Minimize window"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="12" x2="20" y2="12" />
        </svg>
      </button>

      {/* 最大化/还原按钮 */}
      <button
        className="p-1.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        onClick={handleMaximize}
        title="Maximize/Restore"
        aria-label="Maximize or restore window"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <line x1="8" y1="3" x2="8" y2="3.01" />
          <line x1="16" y1="3" x2="16" y2="3.01" />
          <line x1="3" y1="8" x2="3.01" y2="8" />
          <line x1="3" y1="16" x2="3.01" y2="16" />
          <line x1="16" y1="21" x2="16" y2="21.01" />
          <line x1="8" y1="21" x2="8" y2="21.01" />
          <line x1="21" y1="16" x2="21.01" y2="16" />
          <line x1="21" y1="8" x2="21.01" y2="8" />
        </svg>
      </button>

      {/* 关闭按钮 */}
      <button
        className="p-1.5 rounded-full hover:bg-red-100 dark:hover:bg-red-900 text-red-500 transition-colors"
        onClick={handleClose}
        title="Close"
        aria-label="Close window"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default WindowControls;