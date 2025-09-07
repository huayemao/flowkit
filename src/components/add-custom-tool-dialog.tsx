import { useState } from "react"
import { useTranslation } from "@/i18n"
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

export function AddCustomToolDialog({ onAdd, triggerText, triggerSize = "sm" }: AddCustomToolDialogProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [url, setUrl] = useState("")

  const triggerTextValue = triggerText || t('tools.addCustom')

  const handleSubmit = async () => {
    if (!name) return
    let favicon = ''
    if (url) {
      try {
        const u = new URL(url)
        favicon = u.origin + '/favicon.ico'
      } catch {}
    }
    const newTool: Tool = {
      id: uuidv4(),
      name,
      description,
      type: 'web-app',
      url,
      icon: favicon || undefined
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
          {triggerTextValue}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('tools.addCustomWebApp')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tool-name">{t('tools.toolName')}</Label>
            <Input
              id="tool-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('tools.enterToolName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-description">{t('tools.toolDescription')}</Label>
            <Textarea
              id="tool-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('tools.enterToolDescription')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tool-url">{t('tools.toolUrl')}</Label>
            <Input
              id="tool-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder={t('tools.enterToolUrl')}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button onClick={handleSubmit} disabled={!name}>
              {t('common.add')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}