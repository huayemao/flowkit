# 新增一个 feature 的完整步骤

以"图片去黑白边"为例，新增 feature 需经历如下流程：

1. **新建 feature 组件**

   - 在 `src/features/` 目录下新建你的功能组件文件，如 `my-feature.tsx`。
   - 按需实现 UI 和功能逻辑，建议默认导出或具名导出组件。
2. **注册到组件映射表**

   - 打开 `src/components/tool-renderer.tsx`。
   - 在 `componentMap` 中添加你的组件映射：
     ```ts
     import { MyFeature } from '../features/my-feature'
     // ...
     const componentMap = {
       // ...
       MyFeature,
     }
     ```
3. **在工具配置中注册**

   - 打开 `src/store/app-store.ts`。
   - 在 `defaultTools` 数组中添加新工具配置：
     ```ts
     {
       id: 'my-feature',
       name: '我的新功能',
       description: '功能描述',
       path: '/my-feature',
       type: 'component',
       component: 'MyFeature', // 注意与映射表 key 保持一致
     }
     ```
4. **（可选）完善类型声明**

   - 如有新类型需求，可在 `src/types.ts` 等处补充。
5. **（可选）UI/菜单集成**

   - 如需在主界面、菜单、侧边栏等处出现，确保相关页面/导航已引用 `defaultTools` 或相关配置。
6. **测试与调试**

   - 启动项目，确认新 feature 能在工具列表中被选中、正常渲染和使用。

---

> 后续如有自动注册、批量导入等优化，可进一步简化第2步。
