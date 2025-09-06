import { useState } from "react"
import { useTranslation } from "@/i18n"
import { useNavigate } from "react-router-dom"
import { useAppStore, defaultTools, Tool } from "../../store/app-store"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Textarea } from "../ui/textarea"
import { ToolSelector } from "./tool-selector"
import { GripVertical, X } from "lucide-react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"

interface WorkflowEditDialogProps {
  workflowId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkflowEditDialog({ workflowId, open, onOpenChange }: WorkflowEditDialogProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { 
    workflows, 
    updateWorkflow,
  } = useAppStore()
  const workflow = workflows.find(w => w.id === workflowId)
  const [editingWorkflow, setEditingWorkflow] = useState(workflow)
  const availableTools = [...defaultTools]

  if (!workflow || !editingWorkflow) return null

  const handleSaveWorkflow = () => {
    updateWorkflow(editingWorkflow)
    onOpenChange(false)
    navigate(`/workflow/${workflowId}`)
  }

  const handleToolSelect = (toolId: string) => {
    const tool = availableTools.find((t: Tool) => t.id === toolId)
    if (tool) {
      setEditingWorkflow({
        ...editingWorkflow,
        tools: [...editingWorkflow.tools, tool]
      })
    }
  }

  const handleToolDeselect = (toolId: string) => {
    setEditingWorkflow({
      ...editingWorkflow,
      tools: editingWorkflow.tools.filter((t) => t.id !== toolId)
    })
  }

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(editingWorkflow.tools)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setEditingWorkflow({
      ...editingWorkflow,
      tools: items
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{t('workflows.edit')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('workflows.name')}</Label>
            <Input
              id="name"
              value={editingWorkflow.name}
              onChange={(e) =>
                setEditingWorkflow({ ...editingWorkflow, name: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">{t('workflows.description')}</Label>
            <Textarea
              id="description"
              value={editingWorkflow.description}
              onChange={(e) =>
                setEditingWorkflow({ ...editingWorkflow, description: e.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{t('workflows.tools')}</Label>
              <ToolSelector
                availableTools={availableTools}
                selectedToolIds={editingWorkflow.tools.map((t) => t.id)}
                onToolSelect={handleToolSelect}
                onToolDeselect={handleToolDeselect}
              />
            </div>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="tools">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2"
                  >
                    {editingWorkflow.tools.map((tool, index) => (
                      <Draggable
                        key={tool.id}
                        draggableId={tool.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center justify-between rounded-lg border p-2"
                          >
                            <div className="flex items-center space-x-2">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">
                                  {tool.name}
                                </h4>
                                <p className="text-xs text-muted-foreground">
                                  {tool.description}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToolDeselect(tool.id)}
                            >
                              <X className="h-4 w-4" />
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
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSaveWorkflow}>
              {t('common.save')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}