#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义路径
const componentsDir = path.join(__dirname, 'src', 'components');
const indexFilePath = path.join(__dirname, 'src', 'index.ts');

// 主函数
async function generateExports() {
  try {
    // 读取当前 index.ts 文件内容
    let indexContent = fs.readFileSync(indexFilePath, 'utf8');
    
    // 分离出头部注释和非组件导出部分
    const headerMatch = indexContent.match(/^(.*?)\/\/ UI 组件\s*/s);
    const footerMatch = indexContent.match(/\s*\/\/ 通知和工具[\s\S]*$/);
    
    const header = headerMatch ? headerMatch[1] : '';
    const footer = footerMatch ? footerMatch[0] : '';
    
    // 扫描 components 目录下的所有 .tsx 文件
    const componentFiles = fs.readdirSync(componentsDir)
      .filter(file => file.endsWith('.tsx'))
      .sort(); // 按字母顺序排序
    
    // 生成新的组件导出内容
    let componentExports = '// UI 组件\n';
    
    for (const file of componentFiles) {
      const fileName = path.basename(file, '.tsx');
      // 对所有组件都使用 export * 方式
      componentExports += `export * from './components/${fileName}'\n`;
    }
    
    // 组合新的 index.ts 内容
    const newIndexContent = `${header}\n${componentExports}\n${footer}`;
    
    // 写入文件
    fs.writeFileSync(indexFilePath, newIndexContent, 'utf8');
    
    console.log('✅ 导出语句已成功生成并更新到 src/index.ts');
    console.log(`📦 共处理了 ${componentFiles.length} 个组件文件`);
    
  } catch (error) {
    console.error('❌ 生成导出语句时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
generateExports();