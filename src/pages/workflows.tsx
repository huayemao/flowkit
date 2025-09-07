import { useAppStore, defaultTools, Tool } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Edit, Trash2, GripVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "@/i18n";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolSelector } from "@/components/workflow/tool-selector";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { AddCustomToolDialog } from "@/components/add-custom-tool-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function WorkflowsPage() {
  const { 
    workflows, 
    addWorkflow, 
    updateWorkflow, 
    deleteWorkflow,
    customTools,
    addCustomTool,
    removeCustomTool
  } = useAppStore();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  const [editingWorkflow, setEditingWorkflow] = useState<typeof workflows[0] | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWorkflow, setNewWorkflow] = useState({ name: "", description: "", tools: [] as Tool[] });
  
  const availableTools = [...defaultTools, ...customTools];

  const handleCreateWorkflow = () => {
    const workflow = {
      id: uuidv4(),
      name: newWorkflow.name || t('workflows.title'),
      description: newWorkflow.description,
      tools: newWorkflow.tools
    };
    addWorkflow(workflow);
    setIsCreateOpen(false);
    setNewWorkflow({ name: "", description: "", tools: [] });
  };

  const handleEditWorkflow = (workflow: typeof workflows[0]) => {
    setEditingWorkflow(workflow);
  };

  const handleSaveWorkflow = () => {
    if (editingWorkflow) {
      updateWorkflow(editingWorkflow);
      setEditingWorkflow(null);
    }
  };

  const handleDeleteWorkflow = (id: string) => {
    deleteWorkflow(id);
  };

  const handleToolSelect = (toolId: string) => {
    if (!editingWorkflow) return;
    const tool = availableTools.find((t: Tool) => t.id === toolId);
    if (tool) {
      setEditingWorkflow({
        ...editingWorkflow,
        tools: [...editingWorkflow.tools, tool]
      });
    }
  };

  const handleToolDeselect = (toolId: string) => {
    if (!editingWorkflow) return;
    setEditingWorkflow({
      ...editingWorkflow,
      tools: editingWorkflow.tools.filter((t) => t.id !== toolId)
    });
  };

  const handleDragEnd = (result: any) => {
    if (!editingWorkflow || !result.destination) return;

    const items = Array.from(editingWorkflow.tools);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setEditingWorkflow({
      ...editingWorkflow,
      tools: items
    });
  };

  const handleAddCustomTool = (tool: Tool) => {
    addCustomTool(tool);
  };

  const WorkflowEditor = ({ workflow, onClose }: { workflow: typeof workflows[0], onClose: () => void }) => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-background border rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {t('workflows.edit')}: {workflow.name}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('workflows.name')}</Label>
              <Input
                id="name"
                value={workflow.name}
                onChange={(e) => setEditingWorkflow({ ...workflow, name: e.target.value })}
                placeholder={t('workflows.namePlaceholder')}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">{t('workflows.description')}</Label>
              <Textarea
                id="description"
                value={workflow.description}
                onChange={(e) => setEditingWorkflow({ ...workflow, description: e.target.value })}
                placeholder={t('workflows.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>{t('workflows.tools')}</Label>
                <div className="flex items-center gap-2">
                  <AddCustomToolDialog onAdd={handleAddCustomTool} />
                  <ToolSelector
                    availableTools={availableTools}
                    selectedToolIds={workflow.tools.map((t) => t.id)}
                    onToolSelect={handleToolSelect}
                    onToolDeselect={handleToolDeselect}
                  />
                </div>
              </div>
              
              {workflow.tools.length > 0 ? (
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="tools">
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="space-y-2"
                      >
                        {workflow.tools.map((tool, index) => (
                          <Draggable
                            key={tool.id}
                            draggableId={tool.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center justify-between rounded-lg border p-3 bg-card hover:bg-accent/50 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div {...provided.dragHandleProps}>
                                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                                  </div>
                                  <div>
                                    <h4 className="font-medium">{tool.name}</h4>
                                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToolDeselect(tool.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground">{t('workflows.noTools')}</p>
                  <Button variant="ghost" size="sm" className="mt-2">
                    {t('workflows.addTools')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSaveWorkflow}>
            {t('common.save')}
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{t('workflows.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('workflows.description')}</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('workflows.create')}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{t('workflows.createNew')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-name">{t('workflows.name')}</Label>
                <Input
                  id="new-name"
                  value={newWorkflow.name}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, name: e.target.value })}
                  placeholder={t('workflows.namePlaceholder')}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-description">{t('workflows.description')}</Label>
                <Textarea
                  id="new-description"
                  value={newWorkflow.description}
                  onChange={(e) => setNewWorkflow({ ...newWorkflow, description: e.target.value })}
                  placeholder={t('workflows.descriptionPlaceholder')}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button onClick={handleCreateWorkflow} disabled={!newWorkflow.name.trim()}>
                {t('workflows.create')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {workflows.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            <p className="text-lg mb-2">{t('workflows.emptyTitle')}</p>
            <p className="text-sm">{t('workflows.emptyDescription')}</p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            {t('workflows.createFirst')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflows.map((workflow) => (
            <Card
              key={workflow.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-lg">{workflow.name}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {workflow.description || t('workflows.noDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {t('tools.title')}: {workflow.tools.length}
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditWorkflow(workflow);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteWorkflow(workflow.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full mt-4"
                  onClick={() => navigate(`/workflow/${workflow.id}`)}
                >
                  {t('workflows.open')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {editingWorkflow && (
        <WorkflowEditor 
          workflow={editingWorkflow} 
          onClose={() => setEditingWorkflow(null)} 
        />
      )}
    </div>
  );
}
