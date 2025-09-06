# flowkit Monorepo

本项目已将原有的单体应用重构为 monorepo 架构，支持将各个工具独立打包发布。

## 📁 项目结构

```
flowkit/
├── packages/
│   ├── shared-ui/           # 共享UI组件库
│   │   ├── src/
│   │   │   ├── components/  # 可复用组件
│   │   │   └── lib/        # 工具函数
│   │   └── package.json
│   └── auto-trim-image/     # 图片边框去除工具独立包
│       ├── src/
│       │   ├── components/  # 独立组件
│       │   └── utils/       # 工具函数
│       ├── index.html       # 独立应用入口
│       └── package.json
├── src/                     # 原工具集应用
└── package.json            # 根工作区配置
```

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

#### 运行整个工具集
```bash
npm run dev
```

#### 单独开发 auto-trim-image 工具
```bash
npm run dev:auto-trim-image
```

#### 单独开发 shared-ui 组件库
```bash
npm run dev:shared-ui
```

### 构建

#### 构建所有包
```bash
npm run build
```

#### 单独构建 auto-trim-image
```bash
npm run build:auto-trim-image
```

#### 单独构建 shared-ui
```bash
npm run build:shared-ui
```

## 📦 发布到微软应用商店

### 1. 构建独立应用

```bash
cd packages/auto-trim-image
npm run build
```

### 2. 创建 Tauri 配置（可选）

如果需要打包为桌面应用，可以在 `auto-trim-image` 目录下添加 Tauri 配置：

```bash
npm create tauri-app@latest .
```

### 3. 打包应用

```bash
npm run tauri build
```

## 🔗 包依赖关系

- `@flowkit/shared-ui`: 共享UI组件库
- `@flowkit/auto-trim-image`: 依赖 shared-ui 的独立工具包
- 原工具集应用：通过 npm workspace 引用独立包

## 🛠 开发新工具

要创建新的独立工具包：

1. 在 `packages/` 下创建新目录
2. 复制 `auto-trim-image` 的结构
3. 更新 `package.json` 中的名称和依赖
4. 在根 `package.json` 中添加新的脚本

## 📝 注意事项

- 所有包使用 TypeScript 和 Vite 构建
- 共享组件通过 `@flowkit/shared-ui` 包管理
- 支持独立开发和构建
- 保持与原工具集的兼容性