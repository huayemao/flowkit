# Auto Trim Image - Tauri App

这是一个独立的 Tauri 桌面应用，用于自动去除图片边框。

## 开发

### 前置要求

1. 安装 [Rust](https://rustup.rs/)
2. 安装 [Node.js](https://nodejs.org/) (推荐使用 LTS 版本)

### 安装依赖

```bash
# 安装 Node.js 依赖
npm install

# 安装 Rust 依赖 (第一次运行会自动安装)
```

### 开发模式

```bash
# 启动开发服务器
npm run tauri:dev
```

### 构建应用

```bash
# 构建生产版本
npm run tauri:build
```

构建完成后，可执行文件将位于 `src-tauri/target/release/bundle/` 目录下。

## 项目结构

```
auto-trim-image/
├── src/                    # 前端源代码
│   ├── App.tsx            # 主应用组件
│   ├── components/        # 组件目录
│   └── utils/            # 工具函数
├── src-tauri/             # Tauri 后端代码
│   ├── src/              # Rust 源代码
│   ├── Cargo.toml        # Rust 依赖配置
│   └── tauri.conf.json   # Tauri 配置
├── package.json           # Node.js 项目配置
├── vite.config.ts         # Vite 构建配置
└── index.html             # HTML 入口文件
```

## 功能特性

- 智能识别图片边框
- 批量处理图片
- 支持拖拽上传
- 实时预览效果
- 高质量输出

## 系统要求

- Windows 10/11
- macOS 10.15+
- Linux (Ubuntu 18.04+, Fedora 32+, etc.)