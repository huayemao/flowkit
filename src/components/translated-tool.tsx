import { useTranslation } from '@/i18n';
import { Tool } from '@/store/app-store';

interface TranslatedToolProps {
  tool: Tool;
  children: (name: string, description: string, type: string) => React.ReactNode;
}

export function TranslatedTool({ tool, children }: TranslatedToolProps) {
  const { t } = useTranslation();
  
  // 使用翻译键获取翻译文本
  const translatedName = t(tool.name);
  const translatedDescription = t(tool.description);
  const translatedType = t(tool.type === 'component' ? 'tools.builtin' : 'tools.webApp');
  
  return children(translatedName, translatedDescription, translatedType);
}