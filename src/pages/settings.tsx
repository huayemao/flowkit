import { useAppStore, defaultTools, Tool } from "../store/app-store"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { ToolSelector } from "../components/workflow/tool-selector"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { GripVertical, X, Plus } from "lucide-react"
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog"
import { AddCustomToolDialog } from "../components/add-custom-tool-dialog"

export function SettingsPage() {
  const { 
    workflows, 
    addWorkflow, 
    updateWorkflow, 
    deleteWorkflow,
    customTools,
    addCustomTool,
    removeCustomTool
  } = useAppStore()
  const [editingWorkflow, setEditingWorkflow] = useState<typeof workflows[0] | null>(null)
  const availableTools = [...defaultTools, ...customTools]

  const handleAddWorkflow = () => {
    const newWorkflow = {
      id: uuidv4(),
      name: "新工作流",
      description: "",
      tools: []
    }
    addWorkflow(newWorkflow)
    setEditingWorkflow(newWorkflow)
  }

  const handleSaveWorkflow = () => {
    if (editingWorkflow) {
      updateWorkflow(editingWorkflow)
      setEditingWorkflow(null)
    }
  }

  const handleToolSelect = (toolId: string) => {
    if (!editingWorkflow) return
    const tool = availableTools.find((t: Tool) => t.id === toolId)
    if (tool) {
      setEditingWorkflow({
        ...editingWorkflow,
        tools: [...editingWorkflow.tools, tool]
      })
    }
  }

  const handleToolDeselect = (toolId: string) => {
    if (!editingWorkflow) return
    setEditingWorkflow({
      ...editingWorkflow,
      tools: editingWorkflow.tools.filter((t) => t.id !== toolId)
    })
  }

  const handleDragEnd = (result: any) => {
    if (!editingWorkflow || !result.destination) return

    const items = Array.from(editingWorkflow.tools)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setEditingWorkflow({
      ...editingWorkflow,
      tools: items
    })
  }

  const handleAddCustomTool = (tool: Tool) => {
    addCustomTool(tool)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">工作流设置</h2>
        <div className="space-x-2">
          <AddCustomToolDialog 
            onAdd={handleAddCustomTool} 
          />
          <Button onClick={handleAddWorkflow}>添加工作流</Button>
        </div>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div key={workflow.id} className="rounded-lg border p-4">
            {editingWorkflow?.id === workflow.id ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">名称</Label>
                  <Input
                    id="name"
                    value={editingWorkflow.name}
                    onChange={(e) =>
                      setEditingWorkflow({ ...editingWorkflow, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">描述</Label>
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
                    <Label>工具</Label>
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
                  <Button variant="outline" onClick={() => setEditingWorkflow(null)}>
                    取消
                  </Button>
                  <Button onClick={handleSaveWorkflow}>保存</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{workflow.name}</h3>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingWorkflow(workflow)}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteWorkflow(workflow.id)}
                    >
                      删除
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{workflow.description}</p>
                <div className="mt-2">
                  <h4 className="text-sm font-medium">包含工具：</h4>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {workflow.tools.map((tool) => (
                      <span
                        key={tool.id}
                        className="rounded-full bg-secondary px-2 py-1 text-xs"
                      >
                        {tool.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
} 