import { defaultTools, useAppStore } from "@/store/app-store";
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
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

export default function ToolsPage() {
  const { customTools, addCustomTool, removeCustomTool, updateCustomTool } = useAppStore();
  const navigate = useNavigate();

  const allTools = [...defaultTools, ...customTools];
  const builtinTools = defaultTools;
  const userTools = customTools;

  // 编辑弹窗状态
  const [editTool, setEditTool] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editUrl, setEditUrl] = useState("");

  // 编辑
  const handleEdit = (tool) => {
    setEditTool(tool);
    setEditName(tool.name);
    setEditDescription(tool.description);
    setEditUrl(tool.url || "");
  };

  // 删除
  const handleDelete = (tool) => {
    if (window.confirm(`确定要删除「${tool.name}」吗？`)) {
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
        <h1 className="text-3xl font-bold">工具</h1>
        <AddCustomToolDialog 
          onAdd={addCustomTool} 
          triggerText="添加自定义工具"
          triggerSize="sm"
        />
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">内置工具</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {builtinTools.map((tool) => (
            <Card
              key={tool.id}
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate("/tools/" + tool.id)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{tool.name}</CardTitle>
                  <Badge
                    variant={tool.type === "component" ? "default" : "secondary"}
                  >
                    {tool.type === "component" ? "组件" : "Web 应用"}
                  </Badge>
                </div>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  {tool.type === "web-app" && tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {tool.url}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">自定义工具</h2>
        {userTools.length === 0 ? (
          <div className="text-muted-foreground text-sm">暂无自定义工具</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userTools.map((tool) => (
              <ContextMenu key={tool.id}>
                <ContextMenuTrigger asChild>
                  <Card
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate("/tools/" + tool.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle>{tool.name}</CardTitle>
                        <Badge
                          variant={tool.type === "component" ? "default" : "secondary"}
                        >
                          {tool.type === "component" ? "组件" : "Web 应用"}
                        </Badge>
                      </div>
                      <CardDescription>{tool.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        {tool.type === "web-app" && tool.url && (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            {tool.url}
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleEdit(tool)}>
                    编辑
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleDelete(tool)}>
                    删除
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
          </div>
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
    </div>
  );
}
