import { useTranslation } from "@/i18n"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog"
import { ScrollArea } from "../ui/scroll-area"
import { Tool } from "../../store/app-store"
import { Check, Plus } from "lucide-react"
import { cn } from "../../lib/utils"

interface ToolSelectorProps {
  availableTools: Tool[]
  selectedToolIds: string[]
  onToolSelect: (toolId: string) => void
  onToolDeselect: (toolId: string) => void
}

export function ToolSelector({
  availableTools,
  selectedToolIds,
  onToolSelect,
  onToolDeselect,
}: ToolSelectorProps) {
  const { t } = useTranslation()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          {t('workflows.addTool')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('workflows.selectTool')}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {availableTools.map((tool) => {
              const isSelected = selectedToolIds.includes(tool.id)
              return (
                <div
                  key={tool.id}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-4",
                    isSelected && "border-primary"
                  )}
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{tool.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </div>
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    size="sm"
                    onClick={() =>
                      isSelected ? onToolDeselect(tool.id) : onToolSelect(tool.id)
                    }
                  >
                    {isSelected ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}