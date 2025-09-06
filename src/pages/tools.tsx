import { defaultTools, useAppStore } from "@/store/app-store";
import { useTranslation } from "react-i18next";
import { TranslatedTool } from "../components/translated-tool";
import { LanguageSwitcher } from "../components/language-switcher";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { AddCustomToolDialog } from "../components/add-custom-tool-dialog"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { WrapText, ScanText, FileText, PenTool, Table, Image as LucideImage, MoveDiagonal, Crop, Link as LucideLink } from 'lucide-react';

// 工具 id 到 lucide-react 组件的映射
const iconMap = {
  WrapText,
  ScanText,
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
  if (tool.type === 'web-app' && tool.url) {
    try {
      const u = new URL(tool.url);
      if (!imgError) {
        return <img src={u.origin + '/favicon.ico'} alt="icon" className="w-7 h-7 rounded" onError={() => setImgError(true)} />;
      }
    } catch {}
  }
  if (tool.icon && iconMap[tool.icon]) {
    const IconComp = iconMap[tool.icon];
    return <IconComp strokeWidth={1.8} className="w-7 h-7 text-indigo-400" />;
  }
  return (
    <div className="w-7 h-7 rounded bg-gray-200 flex items-center justify-center">
      <svg viewBox="0 0 32 32" fill="none" className="w-4 h-4 text-gray-400"><circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M10 16l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </div>
  );
}

function ToolCard({ tool }: { tool: any }) {
  const navigate = useNavigate();
  return (
    <TranslatedTool tool={tool}>
      {(name, description, type) => (
        <div
          className="rounded-md flex flex-row items-center p-4 bg-white/95 dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 shadow-sm group transition-transform hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-indigo-200 focus-visible:border-indigo-200 before:content-[''] before:absolute before:rounded-[inherit] before:-inset-px before:-z-10 before:bg-gradient-to-br before:from-[#cccef8]/60 before:to-[#e0c9fa]/60 before:dark:from-[#2d3367] before:dark:to-[#412e69] relative w-[260px] h-[88px] cursor-pointer mb-3"
          onClick={() => navigate(`/tools/${tool.id}`)}
          title={name}
          style={{ maxWidth: 320 }}
        >
          <div className="flex items-center flex-shrink-0 mr-4 ">
            <ToolIcon tool={tool} />
          </div>
          <div className="flex-1 min-w-0 flex flex-col items-start justify-center">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-base font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">{name}</span>
              <Badge
                variant={ "outline" }
                className="ml-1 text-xs flex-shrink-0"
              >
                {type}
              </Badge>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate max-w-[180px] text-left">{description}</div>
          </div>
        </div>
      )}
    </TranslatedTool>
  );
}

// 工具详情弹窗
function ToolDetailDialog({ tool, open, onOpenChange }: { tool: any, open: boolean, onOpenChange: (v: boolean) => void }) {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{tool.name}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center mb-4">
          <ToolIcon tool={tool} />
          <span className="ml-3 text-gray-700 dark:text-gray-200">
            {tool.type === 'component' ? t('tools.builtin') : t('tools.webApp')}
          </span>
        </div>
        <div className="mb-2 text-gray-500 dark:text-gray-400">{tool.description}</div>
        {tool.type === 'web-app' && tool.url && (
          <div className="mb-2">
            <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline break-all">{tool.url}</a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function ToolsPage() {
  const { customTools, addCustomTool, removeCustomTool, updateCustomTool } = useAppStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const builtinTools = defaultTools;
  const userTools = customTools;
  const allTools = [...builtinTools, ...userTools];

  // 编辑弹窗状态
  const [editTool, setEditTool] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // 工具详情弹窗
  const [detailTool, setDetailTool] = useState(null);

  // 编辑
  const handleEdit = (tool) => {
    setEditTool(tool);
    setEditName(tool.name);
    setEditDescription(tool.description);
    setEditUrl(tool.url || "");
  };

  // 删除
  const handleDelete = (tool) => {
    if (window.confirm(t('tools.confirmDelete', { name: tool.name }))) {
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
        <h1 className="text-3xl font-bold">{t('tools.title')}</h1>
        <div className="flex items-center space-x-2">
          <LanguageSwitcher />
          <AddCustomToolDialog 
            onAdd={addCustomTool} 
            triggerText={t('tools.addCustom')}
            triggerSize="sm"
          />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">{t('tools.builtin')}</h2>
        <div className="flex flex-wrap gap-4">
          {builtinTools.map((tool) => (
            <ContextMenu key={tool.id}>
              <ContextMenuTrigger asChild>
                <div>
                  <ToolCard tool={tool} />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem onClick={() => setDetailTool(tool)}>
                  {t('common.viewDetails')}
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">{t('tools.custom')}</h2>
        {userTools.length === 0 ? (
          <div className="text-muted-foreground text-sm">{t('tools.noCustom')}</div>
        ) : (
          <div className="flex flex-wrap gap-4">
            {userTools.map((tool) => (
              <ContextMenu key={tool.id}>
                <ContextMenuTrigger asChild>
                  <div>
                    <ToolCard tool={tool} />
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleEdit(tool)}>
                    {t('common.edit')}
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(tool)}>
                    {t('common.delete')}
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
        )}
      </div>
      
      {/* 工具详情弹窗 */}
      {detailTool && (
        <ToolDetailDialog tool={detailTool} open={!!detailTool} onOpenChange={(v) => { if (!v) setDetailTool(null); }} />
      )}
      
      {/* 编辑弹窗 */}
      <Dialog open={!!editTool} onOpenChange={(open) => { if (!open) setEditTool(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>编辑自定义工具</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="工具名称"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="工具描述"
              />
            </div>
            <div className="space-y-2">
              <Input
                value={editUrl}
                onChange={e => setEditUrl(e.target.value)}
                placeholder="工具 URL"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setEditTool(null)}>
                取消
              </Button>
              <Button onClick={handleEditSubmit} disabled={!editName}>
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
