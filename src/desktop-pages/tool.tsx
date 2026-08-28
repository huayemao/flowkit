import { useParams, Link } from "react-router-dom";
import { defaultTools, useAppStore } from "@/store/app-store";
import { ToolRenderer } from "@/components/tool-renderer";
import { useTranslation } from "@/i18n";
import { Button } from "@/components/ui/button";

export default function ToolPage() {
  const { toolId } = useParams();
  const { customTools } = useAppStore();
  const { t } = useTranslation();

  const allTools = [...defaultTools, ...customTools];
  const tool = allTools.find((t) => t.id === toolId);

  if (!tool) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 py-12 text-center">
        <h2 className="text-xl font-semibold mb-2">{t("messages.toolNotFound", "工具不存在")}</h2>
        <p className="text-muted-foreground text-sm mb-6">{t("messages.toolNotFoundDesc", "无法找到对应的工具，请检查工具链接或从工具列表中重新选择。")}</p>
        <Button asChild variant="outline">
          <Link to="/tools">{t("navigation.backToTools", "返回工具列表")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <ToolRenderer tool={tool} />
    </div>
  );
}