import { existsSync, mkdirSync, rmSync, readdirSync, writeFileSync, readFileSync, copyFileSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

// 主函数，包装为异步函数
async function main() {
  // 获取当前目录，替代 __dirname
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);

  // 支持的语言和语言代码映射
  const supportedLangs = ['en', 'zh'];
  const defaultLang = 'en';
  // 语言代码映射配置
  const langCodeMap = {
    'en': 'en-US',
    'zh': 'zh-CN'
  };
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

    // 从翻译文件中获取SEO内容，如果不存在则使用默认值
    const currentSeo = {
      title: logoDashTranslations.title || (lang === 'zh' ? 'LogoDash - Logo设计工具 | 轻松创建专业标志' : 'LogoDash - Logo Design Tool'),
      description: logoDashTranslations.description || (lang === 'zh' ? 'LogoDash 是一款专业的 Logo 设计工具，帮助您快速创建精美、专业的标志，支持自定义背景、图标、文字等元素。' : 'Logo design tool, create professional logos easily'),
      keywords: logoDashTranslations.keywords || (lang === 'zh' ? 'Logo设计,标志制作,Logo工具,专业Logo,Logo生成器,免费Logo设计' : 'logo design, logo maker, design tool, professional logo, logo generator, free logo design'),
      author: logoDashTranslations.author || 'FlowKit Team',
      copyright: logoDashTranslations.copyright || '© 2024 FlowKit',
      ogTitle: logoDashTranslations.ogTitle || logoDashTranslations.title || (lang === 'zh' ? 'LogoDash - Logo设计工具' : 'LogoDash - Logo Design Tool'),
      ogDescription: logoDashTranslations.ogDescription || logoDashTranslations.description || (lang === 'zh' ? 'LogoDash 是一款专业的 Logo 设计工具，帮助您快速创建精美、专业的标志。' : 'Logo design tool, create professional logos easily'),
      twitterTitle: logoDashTranslations.twitterTitle || logoDashTranslations.title || (lang === 'zh' ? 'LogoDash - Logo设计工具' : 'LogoDash - Logo Design Tool'),
      twitterDescription: logoDashTranslations.twitterDescription || logoDashTranslations.description || (lang === 'zh' ? 'LogoDash 是一款专业的 Logo 设计工具，帮助您快速创建精美、专业的标志。' : 'Logo design tool, create professional logos easily'),
      canonicalUrl: logoDashTranslations.canonicalUrl || './'
    };

    // 修改HTML内容 - 保留Vite生成的head内容，只替换需要国际化的部分
    let modifiedHtml = defaultHtmlContent
      // 设置lang属性 - 使用语言代码映射表
      .replace(/<html lang="[^"]+">/, `<html lang="${langCodeMap[lang] || lang}">`)
      // 替换特定的SEO元标签
      .replace(/<title>[^<]+<\/title>/, `<title>${currentSeo.title}</title>`)
      .replace(/<meta name="description" content="[^"]+">/, `<meta name="description" content="${currentSeo.description}">`)
      .replace(/<meta name="keywords" content="[^"]+">/, `<meta name="keywords" content="${currentSeo.keywords}">`)
      .replace(/<meta name="author" content="[^"]+">/, `<meta name="author" content="${currentSeo.author}">`)
      .replace(/<meta name="copyright" content="[^"]+">/, `<meta name="copyright" content="${currentSeo.copyright}">`)
      // 替换Open Graph元标签
      .replace(/<meta property="og:title" content="[^"]+">/, `<meta property="og:title" content="${currentSeo.ogTitle}">`)
      .replace(/<meta property="og:description" content="[^"]+">/, `<meta property="og:description" content="${currentSeo.ogDescription}">`)
      // 替换Twitter卡片元标签
      .replace(/<meta name="twitter:title" content="[^"]+">/, `<meta name="twitter:title" content="${currentSeo.twitterTitle}">`)
      .replace(/<meta name="twitter:description" content="[^"]+">/, `<meta name="twitter:description" content="${currentSeo.twitterDescription}">`)
      // 替换favicon路径
      .replace(/<link rel="icon" type="image\/svg\+xml" href="[^>]+>/, `<link rel="icon" type="image/svg+xml" href="/favicon.png">`)
      // 替换og:image路径
      .replace(/<meta property="og:image" content="[^>]+>/, `<meta property="og:image" content="/favicon.png">`)
      // 替换twitter:image路径
      .replace(/<meta name="twitter:image" content="[^>]+>/, `<meta name="twitter:image" content="/favicon.png">`);

    // 对于非默认语言，修复静态资源路径，返回一级目录
    if (lang !== defaultLang) {
      modifiedHtml = modifiedHtml
        .replace(/src=".\/assets\//g, 'src="../assets/')
        .replace(/href=".\/assets\//g, 'href="../assets/')
        .replace(/href="\/favicon.png/g, 'href="../favicon.png')
        .replace(/property="og:image" content="\//g, 'property="og:image" content="../')
        .replace(/name="twitter:image" content="\//g, 'name="twitter:image" content="../');
    }
    // 写入修改后的HTML文件
    writeFileSync(htmlOutputPath, modifiedHtml, 'utf-8');
    console.log(`✅ Generated ${htmlOutputPath}`);
  });

  console.log('\n✅ Multilingual build completed successfully!');
  console.log(`\nOutput directory structure:`);

  // 如果tree命令不可用，显示简单信息
  console.log(`- ${distDir}/ (English version)`);
  supportedLangs.filter(lang => lang !== 'en').forEach(lang => {
    console.log(`- ${distDir}/${lang}/ (${lang.toUpperCase()} version)`);
  })
}

// 执行主函数
main().catch(error => {
  console.error('Error during multilingual build:', error);
  process.exit(1);
});