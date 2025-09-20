import { existsSync, mkdirSync, rmSync, readdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 主函数，包装为异步函数
async function main() {
  // 获取当前目录，替代 __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // 支持的语言
  const supportedLangs = ['en', 'zh'];
  const defaultLang = 'en';
  const rootDir = resolve(__dirname, '..');
  const distDir = resolve(rootDir, 'dist-demo');

  // 清理之前的构建目录
  if (existsSync(distDir)) {
    console.log('Cleaning previous build directory...');
    rmSync(distDir, { recursive: true, force: true });
  }

  // 只构建一次应用程序，生成共享的JS和CSS文件
  console.log('Building the app once for all languages...');
  try {
    execSync('pnpm run build:demo', { cwd: rootDir, stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to build the app:', error);
    process.exit(1);
  }

  // 读取翻译文件
  function getTranslations(lang) {
    try {
      const translationPath = resolve(rootDir, `src/i18n/locales/${lang}/translation.json`);
      const content = readFileSync(translationPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Failed to read ${lang} translations:`, error);
      return {};
    }
  }

  // 读取默认构建的HTML文件
  const defaultHtmlPath = resolve(distDir, 'index.html');
  if (!existsSync(defaultHtmlPath)) {
    console.error('Default index.html not found after build');
    process.exit(1);
  }
  const defaultHtmlContent = readFileSync(defaultHtmlPath, 'utf-8');

  // 为每种语言生成HTML文件
  console.log('\nGenerating multilingual HTML files...');
  supportedLangs.forEach((lang, index) => {
    console.log(`Processing ${lang.toUpperCase()} version (${index + 1}/${supportedLangs.length})...`);
    
    const translations = getTranslations(lang);
    const logoDashTranslations = translations.logoDash || {};
    
    // 设置输出目录和文件路径
    let outputDir = distDir;
    let htmlOutputPath = resolve(distDir, 'index.html');
    
    // 非默认语言放入子目录
    if (lang !== defaultLang) {
      outputDir = resolve(distDir, lang);
      if (!existsSync(outputDir)) {
        mkdirSync(outputDir, { recursive: true });
      }
      htmlOutputPath = resolve(outputDir, 'index.html');
    }
    
    // 修改HTML内容
    let modifiedHtml = defaultHtmlContent
      // 设置lang属性
      .replace('<html lang="zh-CN">', `<html lang="${lang === 'zh' ? 'zh-CN' : 'en-US'}">`)
      // 更新title和meta description
      .replace('<title>Auto Trim Image</title>', `<title>${logoDashTranslations.title || 'LogoDash'}</title>`)
      .replace('<meta name="description" content="智能识别并去除图片周围的边框，支持批量处理" />', 
               `<meta name="description" content="${logoDashTranslations.description || 'Logo design tool, create professional logos easily'}" />`);
    
    // 写入修改后的HTML文件
    writeFileSync(htmlOutputPath, modifiedHtml, 'utf-8');
    console.log(`✅ Generated ${htmlOutputPath}`);
  });

  console.log('\n✅ Multilingual build completed successfully!');
  console.log(`\nOutput directory structure:`);
  try {
    // 显示目录结构供验证
    const stdout = execSync(`tree /f ${distDir}`, { encoding: 'utf8' });
    console.log(stdout);
  } catch (e) {
    // 如果tree命令不可用，显示简单信息
    console.log(`- ${distDir}/ (English version)`);
    supportedLangs.filter(lang => lang !== 'en').forEach(lang => {
      console.log(`- ${distDir}/${lang}/ (${lang.toUpperCase()} version)`);
    });
  }
}

// 执行主函数
main().catch(error => {
  console.error('Error during multilingual build:', error);
  process.exit(1);
});