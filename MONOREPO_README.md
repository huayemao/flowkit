# FlowKit Monorepo (Next.js Edition)

本项目已升级为 **Next.js App Router** Monorepo 架构，实现了统一站点的单项目部署，同时支持桌面端 Tauri 打包。

## 📁 项目结构

```
flowkit/
├── app/                      # Next.js App Router 路由
│   └── [locale]/
│       ├── page.tsx          # 统一首页 (移植自 utities)
│       ├── apps/             # 子应用路径
│       │   ├── auto-trim-image/
│       │   ├── altitude/
│       │   ├── bilibili-subtitle-extractor/
│       │   ├── image-compare-pro/
│       │   ├── logo-dash/
│       │   └── video-splitter/
│       ├── tools/            # 工具库页面及独立工具
│       ├── workflows/        # 工作流管理
│       ├── workflow/         # 交互式工作流执行器
│       ├── blog/             # 博客文章
│       ├── projects/         # 项目列表
│       └── settings/         # 应用设置
├── packages/                 # 子应用组件库
│   ├── shared-ui/            # 共享 UI 组件
│   ├── auto-trim-image/
│   ├── altitude/
│   ├── bilibili-subtitle-extractor/
│   ├── image-compare-pro/
│   ├── logo-dash/
│   └── video-splitter/
├── content/                  # MDX 文章与项目数据
├── components/               # Next.js 页面与 UI 组件
├── src-tauri/                # Tauri 桌面端配置
└── package.json              # 根工作区配置
```

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

浏览器访问 `http://localhost:3000`

### 生产构建

```bash
pnpm build
```

### 运行 Tauri 桌面端

```bash
pnpm tauri dev
```

## 🌐 路由与子应用分布

- `/` : FlowKit 统一首页 portal
- `/apps/auto-trim-image` : 图片自动裁剪与去边框
- `/apps/altitude` : 高程海拔查询工具
- `/apps/bilibili-subtitle-extractor` : B站字幕提取器
- `/apps/image-compare-pro` : 图片对比 Pro
- `/apps/logo-dash` : Logo 设计生成工具
- `/apps/video-splitter` : 视频分割工具
- `/tools` : 工具列表与嵌入工具
- `/workflows` : 自动化工作流中心