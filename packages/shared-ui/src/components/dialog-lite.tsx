import * as React from "react"
import { X } from "lucide-react"
import { cn } from "../lib/utils"

// 自定义对话框组件，不依赖 Radix UI，且点击外部不会关闭

type DialogLiteProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

// 根组件
const DialogLite: React.FC<DialogLiteProps> = ({ open, onOpenChange, children }) => {
  // 当对话框打开时阻止背景滚动
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // 不渲染任何内容，主要用于状态管理和上下文传递
  return open ? <>{children}</> : null;
};

// 触发器组件
const DialogLiteTrigger: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ children, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
    >
      {children}
    </button>
  );
};

// 关闭按钮组件
const DialogLiteClose: React.FC<{
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        className
      )}
    >
      {children}
    </button>
  );
};

// 遮罩层组件
const DialogLiteOverlay: React.FC<{
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ className, onClick }) => {
  // 点击遮罩层不关闭对话框
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <div
      className={cn(
        "absolute inset-0  bg-black/40 backdrop-blur-sm animate-in fade-in duration-300",
        className
      )}
      onClick={handleClick}
    />
  );
};

// 内容容器组件
const DialogLiteContent: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}> = ({ children, className, onClick }) => {
  // 阻止事件冒泡到遮罩层
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) onClick(e);
  };

  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center p-4 pt-10">
      <DialogLiteOverlay />
      <div
        className={cn(
          "w-full max-w-md mx-auto bg-background rounded-lg border shadow-lg z-10 animate-in zoom-in-95 duration-200",
          "h-fit max-h-[80vh] overflow-y-auto", // 默认高度为 fit-content，最大高度限制
          className
        )}
        onClick={handleClick}
      >
        {children}
      </div>
    </div>
  );
};

// 头部组件
const DialogLiteHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-4 border-b", className)}
    >
      {children}
    </div>
  );
};

// 底部组件
const DialogLiteFooter: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => {
  return (
    <div
      className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 p-4 border-t", className)}
    >
      {children}
    </div>
  );
};

// 标题组件
const DialogLiteTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <h2
      className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    >
      {children}
    </h2>
  );
};

// 描述组件
const DialogLiteDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
    >
      {children}
    </p>
  );
};

// 添加默认的关闭按钮到内容组件（可选）
const DialogLiteContentWithClose: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}> = ({ children, className, onClose }) => {
  return (
    <DialogLiteContent className={className}>
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 rounded-full p-1 hover:bg-accent hover:text-accent-foreground transition-colors"
        aria-label="关闭"
      >
        <X className="h-4 w-4" />
      </button>
      {children}
    </DialogLiteContent>
  );
};

// 导出所有组件
export {
  DialogLite,
  DialogLiteTrigger,
  DialogLiteClose,
  DialogLiteOverlay,
  DialogLiteContent,
  DialogLiteHeader,
  DialogLiteFooter,
  DialogLiteTitle,
  DialogLiteDescription,
  DialogLiteContentWithClose
}