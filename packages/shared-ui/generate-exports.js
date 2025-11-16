#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义路径
const componentsDir = path.join(__dirname, 'src', 'components');
const utilsDir = path.join(__dirname, 'src', 'lib');
const indexFilePath = path.join(__dirname, 'src', 'index.ts');

// 主函数
async function generateExports() {
  try {
    // 读取当前 index.ts 文件内容
    let indexContent = fs.readFileSync(indexFilePath, 'utf8');
    
    // 分离出头部注释和非组件导出部分
    const headerMatch = indexContent.match(/^(.*?)\/\/ UI 组件\s*/s);
    const utilsMatch = indexContent.match(/\s*\/\/ 通知和工具[\s\S]*$/);
    
    const header = headerMatch ? headerMatch[1] : '';
    const utilsSection = utilsMatch ? utilsMatch[0] : '\n// 通知和工具\n';
    
    // 扫描 components 目录下的所有 .tsx 文件
    const componentFiles = fs.readdirSync(componentsDir)
      .filter(file => file.endsWith('.tsx'))
      .sort(); // 按字母顺序排序
    
    // 扫描 utils 目录下的所有 .ts/.js 文件
    let utilsExports = '';
    if (fs.existsSync(utilsDir)) {
      const utilsFiles = fs.readdirSync(utilsDir)
        .filter(file => file.endsWith('.ts') || file.endsWith('.js'))
        .filter(file => !file.endsWith('.d.ts')) // 排除声明文件
        .sort(); // 按字母顺序排序
      
      // 生成工具导出内容
      for (const file of utilsFiles) {
        const fileName = path.basename(file, path.extname(file));
        utilsExports += `export * from './lib/${fileName}'\n`;
      }
    }
    
    // 生成新的组件导出内容
    let componentExports = '// UI 组件\n';
    
    for (const file of componentFiles) {
      const fileName = path.basename(file, '.tsx');
      // 对所有组件都使用 export * 方式
      componentExports += `export * from './components/${fileName}'\n`;
    }
    
    // 组合新的 index.ts 内容
    const newIndexContent = `${header}\n${componentExports}\n${utilsExports}${utilsSection}`;
    
    // 写入文件
    fs.writeFileSync(indexFilePath, newIndexContent, 'utf8');
    
    console.log('✅ 导出语句已成功生成并更新到 src/index.ts');
    console.log(`📦 共处理了 ${componentFiles.length} 个组件文件`);
    
    // 计算处理的工具文件数量
    const utilsFileCount = utilsExports ? (utilsExports.match(/export \* from/g) || []).length : 0;
    if (utilsFileCount > 0) {
      console.log(`🛠️ 共处理了 ${utilsFileCount} 个工具文件`);
    }
    
  } catch (error) {
    console.error('❌ 生成导出语句时出错:', error);
    process.exit(1);
  }
}

// 执行主函数
generateExports();