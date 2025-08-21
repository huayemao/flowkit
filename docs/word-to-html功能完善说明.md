# Word转HTML功能完善说明

## 功能概述

Word转HTML功能已经完成全面升级，现在支持预览模式、代码查看、一键复制等功能，并使用了通用的文件上传组件。

## 主要改进

### 1. **预览功能**
- ✅ **实时预览**：转换后可以直接预览HTML渲染效果
- ✅ **样式隔离**：使用 iframe 实现真正的样式隔离，完全避免全局样式污染
- ✅ **滚动支持**：iframe 内支持完整的滚动浏览
- ✅ **代码查看**：可以切换到代码模式查看原始HTML
- ✅ **模式切换**：预览/代码模式一键切换

### 2. **文件上传组件**
- ✅ **通用组件**：抽取了 `FileUploader` 通用组件
- ✅ **拖拽支持**：完整的拖拽上传功能
- ✅ **重新选择**：已选择文件后可重新选择
- ✅ **文件验证**：自动验证文件类型和大小
- ✅ **粘贴上传**：支持粘贴文件上传
- ✅ **加载状态**：显示转换进度

### 3. **复制功能**
- ✅ **一键复制**：右上角复制按钮，一键复制HTML代码
- ✅ **复制反馈**：复制成功显示确认状态
- ✅ **智能复制**：根据当前模式复制相应内容

### 4. **用户体验**
- ✅ **响应式布局**：左右分栏，适配不同屏幕
- ✅ **加载动画**：转换过程中显示加载动画
- ✅ **错误处理**：完善的错误提示和处理

## 技术实现

### 文件上传组件 (`src/components/ui/file-uploader.tsx`)

```typescript
interface FileUploaderProps {
  value?: File | null
  onChange?: (file: File) => void
  loading?: boolean
  className?: string
  accept?: string
  maxSize?: number
  title?: string
  description?: string
  icon?: React.ReactNode
}
```

**特性：**
- 支持拖拽、点击、粘贴三种上传方式
- 已选择文件后可重新选择
- 自动文件类型和大小验证
- 可自定义图标、标题、描述
- 支持加载状态显示

### 预览功能实现

```typescript
const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview')

// 预览模式 - 使用 iframe 实现真正的样式隔离
<div className="h-full w-full">
  <iframe
    srcDoc={`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Word转HTML预览</title>
        <style>
          body {
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
            margin: 40px;
            padding: 0;
            background: white;
          }
          
          /* Word文档样式... */
        </style>
      </head>
      <body>
        ${state.output}
      </body>
      </html>
    `}
    className="w-full h-full border-0"
    title="Word转HTML预览"
    sandbox="allow-same-origin"
  />
</div>

// 代码模式
<textarea
  value={state.output}
  readOnly
  className="w-full h-full p-4 font-mono text-sm"
/>
```

### 复制功能实现

```typescript
const handleCopy = async () => {
  await navigator.clipboard.writeText(state.output)
  setCopied(true)
  setTimeout(() => setCopied(false), 2000)
}
```

## 使用流程

1. **上传文件**
   - 拖拽Word文件到上传区域
   - 或点击"选择Word文件"按钮
   - 或粘贴Word文件

2. **自动转换**
   - 文件上传后自动开始转换
   - 显示加载动画和进度

3. **查看结果**
   - 默认显示预览模式，查看渲染效果
   - 点击"代码"按钮查看HTML源码
   - 点击"复制"按钮复制HTML代码
   - 点击"下载"按钮下载完整HTML文件

## 支持的格式

### 输入格式
- ✅ `.docx` - Office Open XML格式（推荐）
- ✅ `.doc` - 传统Word格式（部分支持）

### 输出格式
- ✅ **预览模式**：实时渲染的HTML效果
- ✅ **代码模式**：原始HTML源码
- ✅ **下载文件**：完整的HTML文档

## 样式保持

### 文本格式
- ✅ 粗体、斜体、下划线
- ✅ 删除线、上标、下标
- ✅ 文本颜色、字体大小
- ✅ 段落缩进、文本对齐

### 文档结构
- ✅ 标题层级（H1-H6）
- ✅ 段落分割
- ✅ 列表项识别
- ✅ 表格转换
- ✅ 引用块

## 组件复用

`FileUploader` 组件已抽取为通用组件，可在其他功能中复用：

```typescript
import { FileUploader } from '../components/ui/file-uploader'

// 使用示例
<FileUploader
  value={file}
  onChange={handleFileChange}
  loading={loading}
  accept=".pdf,.doc,.docx"
  maxSize={100}
  title="选择文档"
  description="拖拽文档到此处"
  icon={<DocumentIcon className="h-12 w-12" />}
/>
```

## 优势特点

1. **用户体验优秀**
   - 直观的预览功能
   - 便捷的复制操作
   - 流畅的拖拽上传

2. **功能完整**
   - 支持多种上传方式
   - 实时预览和代码查看（iframe 样式隔离）
   - 一键复制和下载

3. **组件化设计**
   - 通用文件上传组件
   - 易于维护和扩展
   - 可在其他功能中复用

4. **技术先进**
   - 使用 mammoth.js 保持原始样式
   - iframe 实现真正的样式隔离
   - 前端本地处理，保护隐私
   - 响应式设计，适配各种设备

## 后续优化建议

1. **样式增强**
   - 添加更多Word样式支持
   - 优化预览样式
   - 支持自定义CSS

2. **功能扩展**
   - 批量文件处理
   - 转换历史记录
   - 更多输出格式

3. **性能优化**
   - 大文件处理优化
   - 转换速度提升
   - 内存使用优化
