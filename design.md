# FlowKit 界面设计规范 (design.md) - 桌面应用级极简美学

本文档定义 FlowKit 产品的全栈界面设计规范，要求全站与 `src/desktop-pages`（FlowKit 桌面客户端）保持 **100% 视觉一致性**。

---

## 1. 核心设计原则 (Core Design Principles)

1. **绝对禁止纯死黑 (No Jet-Black Solid Fills or Fonts)**：
   - 严禁使用 `#000000` / `#0f172a` 纯死黑大长条按钮或硬黑边框。
   - 主色为 Indigo 靛蓝 (`hsl(226, 80%, 60%)` / `#4f46e5`)，文字为柔和深蓝黑 (`hsl(226, 40%, 25%)` / `#263359`)，背景为微蓝白 (`hsl(226, 100%, 99%)` / `#f8f9ff`)。
2. **桌面端卡片美学 (Desktop ToolCard Aesthetic)**：
   - 背景：纯白卡片底 `bg-card` (`#ffffff`)，配合柔和靛蓝微细边框 `border border-border/80` (`#dbe2fe`)。
   - 图标容器：`p-2.5 rounded-lg bg-primary/10 text-primary`（浅 Indigo 底 + 鲜艳 Indigo 图标）。
   - 徽章 Badge：`Badge variant="outline"` 搭配浅蓝灰底 (`bg-muted/60 text-muted-foreground border-muted-foreground/20`)。
3. **柔和交互按钮 (Soft Action Buttons)**：
   - 主按钮：`Button variant="default"` 采用 Indigo 靛蓝填充 (`bg-primary text-white hover:bg-primary/90`)。
   - 次按钮 / 卡片按钮：`Button variant="soft"` (`bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20`) 或 `Button variant="outline"` (`bg-card text-foreground border border-border hover:bg-muted/80`)。

---

## 2. 颜色变量体系 (Color Tokens)

```css
:root {
  --background: 226 100% 99%; /* 柔和微蓝白 #f8f9ff */
  --foreground: 226 40% 25%;  /* 柔和深蓝黑文字 #263359（替代死黑） */

  --card: 0 0% 100%;           /* 纯白卡片 */
  --card-foreground: 226 40% 25%;

  --primary: 226 80% 60%;      /* 核心 Indigo 靛蓝 (#4f46e5) */
  --primary-foreground: 0 0% 100%;

  --muted: 226 100% 97%;
  --muted-foreground: 226 20% 50%;

  --border: 226 60% 90%;       /* 柔和 Indigo 细边框 #dbe2fe */
  --radius: 0.75rem;          /* 12px 圆角 */
}

.dark {
  --background: 226 40% 16%;   /* 深靛蓝夜间底色 #181d33 */
  --foreground: 0 0% 98%;

  --card: 226 40% 18%;
  --card-foreground: 226 20% 85%;

  --primary: 226 80% 70%;      /* 暗模式亮靛蓝 */
  --primary-foreground: 0 0% 100%;

  --border: 226 40% 18%;
}
```

---

## 3. 标准 ToolCard 代码规范 (Standard Desktop Card Component)

```tsx
<div className="group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 text-card-foreground shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-primary/50 transition-all duration-200">
  <div>
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
        <LucideIcon name={project.icon} className="h-5 w-5" />
      </div>
      <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-muted/60 border-muted-foreground/20 text-muted-foreground">
        {project.category}
      </Badge>
    </div>
    <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-1.5">
      {project.name}
    </h3>
    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">
      {project.description}
    </p>
  </div>
  <div className="pt-3 border-t border-border/50 mt-auto">
    <Button variant="soft" className="w-full text-xs font-semibold">
      立即体验 →
    </Button>
  </div>
</div>
```

---

## 4. 禁用风格 (Prohibited Styles)

❌ **禁止纯死黑填充按钮**（如 `bg-slate-900` / `bg-black`）。  
❌ **禁止刺眼的纯黑硬黑框**（如 `border-2 border-black`）。  
❌ **禁止彩虹文字渐变与夜店风发光大圆球**。  
