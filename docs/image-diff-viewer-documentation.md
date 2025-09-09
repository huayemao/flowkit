# ImageDiffViewer 组件文档

## 1. 组件概述

ImageDiffViewer 是一个用户体验优异的图片差异对比组件，专为图片处理场景设计，特别是用于 `auto-trim-image` 组件中，让用户在图片自动裁剪后可以直观地对比原图与处理后的图片差异。

### 主要功能
- 支持并排、叠加和切换三种对比模式
- 以原始图片宽度展示前后对比，解决比例变化问题
- 支持鼠标拖拽调整叠加模式下的分隔线位置
- 提供放大功能查看细节差异
- 支持键盘快捷键操作
- 响应式设计，适配不同屏幕尺寸

## 2. 设计思路

### 用户体验考虑
- **直观对比**：提供多种对比模式，满足不同场景需求
- **保持原始比例**：始终以原始图片宽度展示，避免对比时因比例变化导致的视觉误差
- **细节查看**：提供最大化功能，让用户可以查看处理前后的细节差异
- **无障碍操作**：支持键盘快捷键和鼠标操作，方便不同用户使用

### 技术架构
- 采用 React + TypeScript 开发
- 遵循 shadcn/ui 的设计规范和组件风格
- 使用 Tailwind CSS 实现响应式布局和动画效果
- 独立封装，便于在其他场景中复用

## 3. 技术实现细节

### 组件结构

```tsx
// ImageDiffViewer 组件的核心结构
const ImageDiffViewer: React.FC<ImageDiffViewerProps> = ({
  originalImageUrl,
  processedImageUrl,
  onClose,
  title,
}) => {
  // 状态管理
  // 事件处理
  // 渲染逻辑
};
```

### 核心技术点

1. **图片尺寸适配**：
   - 使用 `Image` 对象预加载图片获取原始尺寸
   - 根据原始图片宽度调整展示容器大小，确保比例一致
   - 响应式调整图片大小，适应不同屏幕尺寸

2. **多种对比模式实现**：
   - 并排模式：使用 flex 布局水平排列两张图片
   - 叠加模式：使用绝对定位和宽度百分比实现分隔线效果
   - 切换模式：使用条件渲染在两张图片之间快速切换

3. **交互式控制**：
   - 鼠标拖拽事件处理，实现叠加模式下的分隔线调整
   - 键盘事件监听，支持快捷键切换模式和关闭查看器
   - 触摸事件支持，适配移动设备

4. **动画效果**：
   - 添加平滑过渡动画，提升用户体验
   - 模式切换时使用淡入淡出效果
   - 悬停状态添加微妙的动效反馈

## 4. 集成与使用方式

### 在 auto-trim-image 组件中的集成

1. **导入组件**：
```tsx
import { ImageDiffViewer } from "@flowkit/shared-ui";
```

2. **状态管理**：
```tsx
// 添加状态变量
const [selectedImage, setSelectedImage] = useState<ProcessedImage | null>(null);
const [showDiffViewer, setShowDiffViewer] = useState(false);

// 处理图片点击事件
const handleImageClick = (image: ProcessedImage) => {
  setSelectedImage(image);
  setShowDiffViewer(true);
};

// 关闭差异对比查看器
const handleCloseDiffViewer = () => {
  setShowDiffViewer(false);
  setSelectedImage(null);
};
```

3. **组件渲染**：
```tsx
{showDiffViewer && selectedImage && (
  <ImageDiffViewer
    originalImageUrl={URL.createObjectURL(selectedImage.originalFile)}
    processedImageUrl={selectedImage.url}
    onClose={handleCloseDiffViewer}
    title={selectedImage.name}
  />
)}
```

4. **存储原始文件**：
扩展 `ProcessedImage` 接口，添加 `originalFile` 字段存储原始文件引用：
```tsx
interface ProcessedImage {
  name: string;
  url: string;
  downloaded: boolean;
  originalFile: File; // 存储原始文件
}
```

### 为其他场景使用

```tsx
import { ImageDiffViewer } from "@flowkit/shared-ui";

// 在需要的组件中使用
<ImageDiffViewer
  originalImageUrl="path/to/original.jpg"
  processedImageUrl="path/to/processed.jpg"
  onClose={() => setShowDiffViewer(false)}
  title="图片对比"
  initialMode="split"
  maxZoom={4}
/>
```

## 5. 解决的关键问题

### 比例变化问题处理

图片裁剪后比例会发生变化，为确保对比准确性：
1. 始终以原始图片宽度作为基准展示对比
2. 计算并显示处理后的图片相对于原图的缩放比例
3. 在叠加模式下，确保两张图片中心点对齐

### 性能优化

1. 使用图片预加载，避免切换时的闪烁
2. 合理使用 React.memo 避免不必要的重渲染
3. 在组件卸载时清理 URL.createObjectURL 创建的对象 URL，防止内存泄漏

### 响应式设计

1. 在小屏幕设备上自动调整布局，确保可用性
2. 调整控件大小和间距，适应不同屏幕尺寸
3. 在移动设备上优化触摸交互体验

## 6. 未来优化方向

1. 添加更多对比模式，如差异高亮显示
2. 支持多图对比功能
3. 添加标注功能，方便用户标记和分享差异点
4. 优化大图片的加载和渲染性能
5. 添加国际化支持

---

通过这个 ImageDiffViewer 组件，用户可以直观地对比图片处理前后的差异，特别是在 `auto-trim-image` 场景中，用户能够清晰地看到自动裁剪的效果，提升了整体产品的用户体验和专业性。