import { useParams } from "react-router-dom";
import { defaultTools } from "@/store/app-store";
import { ToolRenderer } from "@/components/tool-renderer";

export default function ToolPage() {
  const { toolId } = useParams();
  const tool = defaultTools.find((t) => t.id === toolId);

  if (!tool) {
    return <div>工具不存在</div>;
  }

  return <ToolRenderer tool={tool} />;
} 