import { Tool } from "@/store/app-store";
import { TextRemoveNewlines } from '../features/text-remove-newlines'
import { TextOcr } from '../features/text-ocr'
import { WebAppEmbed } from './web-app-embed'
import { SvgScaler } from '../features/svg-scaler'
import { AutoTrimImage } from '../features/auto-trim-image'

interface ToolRendererProps {
  tool: Tool;
}

const componentMap: Record<string, React.ComponentType<any>> = {
  TextRemoveNewlines,
  TextOcr,
  SvgScaler,
  AutoTrimImage,
  // 后续新组件只需在此注册
};

export function ToolRenderer({ tool }: ToolRendererProps) {
  if (tool.type === 'component') {
    const Comp = componentMap[tool.component!];
    return Comp ? <Comp /> : <div>未知的组件类型: {tool.component}</div>;
  }
  if (tool.type === 'web-app' && tool.url) {
    return <WebAppEmbed title={tool.description} url={tool.url} />;
  }
  return <div>未知的工具类型: {tool.type}</div>;
} 