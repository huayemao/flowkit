import { defaultTools, useAppStore, Tool } from "@/store/app-store";
import { useTranslation } from "@/i18n";
import { TranslatedTool } from "../components/translated-tool";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AddCustomToolDialog } from "../components/add-custom-tool-dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  WrapText,
  ScanLine,
  FileText,
  PenTool,
  Table,
  Image as LucideImage,
  MoveDiagonal,
  Crop,
  Link as LucideLink,
} from "lucide-react";

// 工具 id 到 lucide-react 组件的映射
const iconMap = {
  WrapText,
  ScanLine,
  FileText,
  PenTool,
  Table,
  Image: LucideImage,
  MoveDiagonal,
  Crop,
  Link: LucideLink,
};

function ToolIcon({ tool }: { tool: any }) {
  const [imgError, setImgError] = useState(false);
  if (tool.type === "web-app" && tool.url) {
    try {
      const u = new URL(tool.url);
      if (!imgError) {
        return (
          <img
            src={u.origin + "/favicon.ico"}
            alt="icon"
            className="w-7 h-7 rounded"
            onError={() => setImgError(true)}
          />
        );
      }
    } catch {}
  }
  if (tool.icon && iconMap[tool.icon]) {
    const IconComp = iconMap[tool.icon];
    return <IconComp strokeWidth={1.8} className="w-7 h-7 text-indigo-400" />;
  }
  return (
    <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center">
      <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4 text-gray-400">
        <circle
          cx="16"
          cy="16"
          r="14"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
        />
        <path
          d="M10 16l4 4 8-8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ToolCard({ tool }: { tool: any }) {
  const navigate = useNavigate();
  return (
    <TranslatedTool tool={tool}>
      {(name, description, type) => (
        <div
          className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-primary/50 cursor-pointer h-full"
          onClick={() => navigate(`/tools/${tool.id}`)}
          title={name}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                <ToolIcon tool={tool} />
              </div>
              <h3 className="font-semibold text-sm leading-snug text-foreground truncate group-hover:text-primary transition-colors">
                {name}
              </h3>
            </div>
            <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5 shrink-0 bg-muted/50 border-muted-foreground/20">
              {type}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      )}
    </TranslatedTool>
  );
}

// 工具详情弹窗
function ToolDetailDialog({
  tool,
  open,
  onOpenChange,
}: {
  tool: any;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(tool.name)}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center mb-4">
          <ToolIcon tool={tool} />
          <span className="ml-3 text-gray-700 dark:text-gray-200">
            {tool.type === "component" ? t("tools.builtin") : t("tools.webApp")}
          </span>
        </div>
        <div className="mb-2 text-gray-500 dark:text-gray-400">
          {t(tool.description)}
        </div>
        {tool.type === "web-app" && tool.url && (
          <div className="mb-2">
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline break-all"
            >
              {tool.url}
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ToolsPage() {
  const { customTools, addCustomTool, removeCustomTool, updateCustomTool } =
    useAppStore();
  const { t } = useTranslation();
  const builtinTools = defaultTools;
  const userTools = customTools;
  const allTools = [...builtinTools, ...userTools];

  // 编辑弹窗状态
  const [editTool, setEditTool] = useState<Tool | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // 工具详情弹窗
  const [detailTool, setDetailTool] = useState<Tool | null>(null);

  // 编辑
  const handleEdit = (tool: Tool) => {
    setEditTool(tool);
    setEditName(tool.name);
    setEditDescription(tool.description);
    setEditUrl(tool.url || "");
  };

  // 删除
  const handleDelete = (tool: Tool) => {
    if (window.confirm(t("tools.confirmDelete", { name: tool.name }))) {
      removeCustomTool(tool.id);
    }
  };

  const handleEditSubmit = () => {
    if (!editTool) return;
    updateCustomTool({
      ...editTool,
      name: editName,
      description: editDescription,
      url: editUrl,
    });
    setEditTool(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("tools.title")}</h1>
        <div className="flex items-center space-x-2">
          <AddCustomToolDialog
            onAdd={addCustomTool}
            triggerText={t("tools.addCustom")}
            triggerSize="sm"
          />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 tracking-tight">{t("tools.builtin")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {builtinTools.map((tool) => (
            <ContextMenu key={tool.id}>
              <ContextMenuTrigger asChild>
                <div className="h-full">
                  <ToolCard tool={tool} />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => setDetailTool(tool)}>
                  {t("common.viewDetails")}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3 tracking-tight">{t("tools.custom")}</h2>
        {userTools.length === 0 ? (
          <div className="text-muted-foreground text-sm py-4 border border-dashed rounded-xl text-center">
            {t("tools.noCustom")}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userTools.map((tool) => (
              <ContextMenu key={tool.id}>
                <ContextMenuTrigger asChild>
                  <div className="h-full">
                    <ToolCard tool={tool} />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleEdit(tool)}>
                    {t("common.edit")}
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(tool)}>
                    {t("common.delete")}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
      </div>

      {/* 工具详情弹窗 */}
      {detailTool && (
        <ToolDetailDialog
          tool={detailTool}
          open={!!detailTool}
          onOpenChange={(v) => {
            if (!v) setDetailTool(null);
          }}
        />
      )}

      {/* 编辑弹窗 */}
      <Dialog
        open={!!editTool}
        onOpenChange={(open) => {
          if (!open) setEditTool(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('tools.editCustomTool')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder={t('tools.toolName')}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder={t('tools.toolDescription')}
              />
            </div>
            <div className="space-y-2">
              <Input
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                placeholder={t('tools.toolUrl')}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditTool(null)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleEditSubmit} disabled={!editName}>
                {t('common.save')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
