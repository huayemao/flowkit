import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Plus } from "lucide-react"
import type { Tool } from "../store/app-store"

interface AddCustomToolDialogProps {
  onAdd: (tool: Tool) => void
  triggerText?: string
  triggerSize?: "sm" | "lg" | "default" | "icon"
}

export function AddCustomToolDialog({ onAdd, triggerText = "添加自定义工具", triggerSize = "sm" }: AddCustomToolDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")

  const handleSubmit = () => {
    if (!name) return
    const newTool: Tool = {
      id: uuidv4(),
      name,
      description,
      type: 'web-app',
      url
    }
    onAdd(newTool)
    setOpen(false)
    setName("")
    setDescription("")
    setUrl("")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size={triggerSize}>
          <Plus className="h-4 w-4 mr-2" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>添加自定义 Web App 工具</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tool-name">工具名称</Label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入工具名称"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-description">工具描述</Label>
            <Textarea
              id="tool-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="输入工具描述"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-url">工具 URL</Label>
            <Input
              id="tool-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="输入工具 URL"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit} disabled={!name}>
              添加
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 