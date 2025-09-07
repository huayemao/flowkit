export interface ToolConfig {
  id: string;
  nameKey: string; // 翻译键
  descriptionKey: string; // 翻译键
  path?: string;
  type: 'component' | 'web-app';
  component?: string;
  url?: string;
  icon?: string;
}

export const toolConfigs: ToolConfig[] = [
  {
    id: 'text-remove-newlines',
    nameKey: 'tools.textRemoveNewlines.name',
    descriptionKey: 'tools.textRemoveNewlines.description',
    path: '/text-remove-newlines',
    type: 'component',
    component: 'TextRemoveNewlines',
    icon: 'WrapText'
  },
  {
    id: 'text-ocr',
    nameKey: 'tools.textOcr.name',
    descriptionKey: 'tools.textOcr.description',
    path: '/text-ocr',
    type: 'component',
    component: 'TextOcr',
    icon: 'ScanText'
  },
  {
    id: 'svg-scaler',
    nameKey: 'tools.svgScaler.name',
    descriptionKey: 'tools.svgScaler.description',
    path: '/svg-scaler',
    type: 'component',
    component: 'SvgScaler',
    icon: 'MoveDiagonal'
  },
  {
    id: 'auto-trim-image',
    nameKey: 'tools.autoTrimImage.name',
    descriptionKey: 'tools.autoTrimImage.description',
    path: '/auto-trim-image',
    type: 'component',
    component: 'AutoTrimImage',
    icon: 'Crop'
  },
  {
    id: 'convert-image-links-to-wp-proxy',
    nameKey: 'tools.convertImageLinksToWpProxy.name',
    descriptionKey: 'tools.convertImageLinksToWpProxy.description',
    path: '/convert-image-links-to-wp-proxy',
    type: 'component',
    component: 'ConvertImageLinksToWpProxy',
    icon: 'Link'
  },
  {
    id: 'word-to-html',
    nameKey: 'tools.wordToHtml.name',
    descriptionKey: 'tools.wordToHtml.description',
    path: '/word-to-html',
    type: 'component',
    component: 'WordToHtml',
    icon: 'FileText'
  },
  {
    id: 'stackedit',
    nameKey: 'tools.stackedit.name',
    descriptionKey: 'tools.stackedit.description',
    path: '/stackedit',
    type: 'web-app',
    url: 'https://stackedit.cn/app',
    icon: 'FileText'
  },
  {
    id: 'excalidraw',
    nameKey: 'tools.excalidraw.name',
    descriptionKey: 'tools.excalidraw.description',
    path: '/excalidraw',
    type: 'web-app',
    url: 'https://excalidraw.com/',
    icon: 'PenTool'
  },
  {
    id: 'tableconvert',
    nameKey: 'tools.tableconvert.name',
    descriptionKey: 'tools.tableconvert.description',
    path: '/tableconvert',
    type: 'web-app',
    url: 'https://tableconvert.com/',
    icon: 'Table'
  },
  {
    id: 'baimiao',
    nameKey: 'tools.baimiao.name',
    descriptionKey: 'tools.baimiao.description',
    path: '/baimiao',
    type: 'web-app',
    url: 'https://web.baimiaoapp.com/',
    icon: 'Image'
  }
];