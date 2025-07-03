import { Tool } from "@/store/app-store";
import { TextRemoveNewlines } from '../features/text-remove-newlines'
import { TextOcr } from '../features/text-ocr'
import { WebAppEmbed } from './web-app-embed'
import { SvgScaler } from '../features/svg-scaler'
import { AutoTrimImage } from '../features/auto-trim-image'

interface ToolRendererProps {
  tool: Tool;
}

export function ToolRenderer({ tool }: ToolRendererProps) {
  switch (tool.type) {
    case "component":
      switch (tool.component) {
        case "TextRemoveNewlines":
          return <TextRemoveNewlines />;
        case "TextOcr":
          return <TextOcr />;
        case "SvgScaler":
          return <SvgScaler />;
        case "AutoTrimImage":
          return <AutoTrimImage />;
        default:
          return <div>未知的组件类型: {tool.component}</div>;
      }
    case "web-app":
      if (tool.url) {
        return <WebAppEmbed title={tool.description} url={tool.url} />;
      }
      return <div>无效的 Web 应用 URL</div>;
    default:
      return <div>未知的工具类型: {tool.type}</div>;
  }
} 