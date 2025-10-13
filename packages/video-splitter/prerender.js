import fs from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { minify } from 'html-minifier-terser'

// Constants
const isProduction = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 5173
const base = process.env.BASE || '/'
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const toAbsolute = (p) => path.resolve(__dirname, p)

// 并发限制器函数
const limitConcurrency = async (routes, concurrencyLimit, processor) => {
  const results = [];
  let activeTasks = 0;
  let currentIndex = 0;
  let isProcessing = true;

  return new Promise((resolve) => {
    const processNext = async () => {
      if (currentIndex >= routes.length && activeTasks === 0) {
        isProcessing = false;
        resolve(results);
        return;
      }

      while (currentIndex < routes.length && activeTasks < concurrencyLimit) {
        const route = routes[currentIndex++];
        activeTasks++;
        
        try {
          const result = await processor(route);
          results.push({ route, success: true, result });
        } catch (e) {
          console.error(`Failed to prerender ${route}:`, e);
          results.push({ route, success: false, error: e.message });
          
          // 将失败的路由写入单独的日志文件
          fs.appendFileSync(
            'prerender-failures.log', 
            `${new Date()}: Failed to render ${route}: ${e.message}\n`
          );
        } finally {
          activeTasks--;
          // 当前任务完成后，处理下一个任务
          if (isProcessing) {
            processNext();
          }
        }
      }
    };
    
    // 启动初始任务
    for (let i = 0; i < concurrencyLimit && i < routes.length; i++) {
      processNext();
    }
  });
};

// HTML压缩函数
const compressHtml = async (html) => {
  try {
    const minifiedHtml = await minify(html, {
      collapseWhitespace: true,       // 移除多余空白字符和换行
      removeComments: true,           // 移除HTML注释
      minifyCSS: true,                // 压缩内联CSS
      minifyJS: true,                 // 压缩内联JavaScript
      removeAttributeQuotes: true,    // 移除不必要的属性引号
      removeRedundantAttributes: true, // 移除冗余属性
      collapseBooleanAttributes: true, // 折叠布尔属性
      removeEmptyAttributes: true     // 移除空属性
    });
    
    // 统计压缩效果
    const originalSize = Buffer.byteLength(html, 'utf8')
    const compressedSize = Buffer.byteLength(minifiedHtml, 'utf8')
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2)
    
    return { minifiedHtml, originalSize, compressedSize, compressionRatio };
  } catch (e) {
    console.error('HTML compression failed, using original HTML:', e);
    // 压缩失败时返回原始HTML
    return {
      minifiedHtml: html,
      originalSize: Buffer.byteLength(html, 'utf8'),
      compressedSize: Buffer.byteLength(html, 'utf8'),
      compressionRatio: '0.00'
    };
  }
};

// 获取要预渲染的语言列表
const getLanguagesToPrerender = (allLanguages) => {
  // 方式1：通过环境变量配置
  // 例如：PRERENDER_LANGUAGES=en,zh,fr,de npm run generate
  if (process.env.PRERENDER_LANGUAGES) {
    const languages = process.env.PRERENDER_LANGUAGES
      .split(',')
      .map(lang => lang.trim())
      .filter(lang => allLanguages.includes(lang));
    
    if (languages.length > 0) {
      return languages;
    }
  }
  
  // 方式2：通过配置文件配置 (这里预留接口，实际项目中可以读取配置文件)
  // const config = require('./prerender.config.json');
  // if (config.languages && config.languages.length > 0) {
  //   return config.languages.filter(lang => allLanguages.includes(lang));
  // }
  
  // 方式3：支持排除特定语言 (这里预留接口)
  // const excludedLanguages = []; // 可以从配置中读取
  // return allLanguages.filter(lang => !excludedLanguages.includes(lang));
  
  // 方式4：基于环境的条件配置
  // if (isProduction) {
  //   return allLanguages.filter(lang => isSupportedInProduction(lang));
  // }
  
  // 默认返回所有语言
  return allLanguages;
};

// 单个路由的渲染处理器
const renderRouteProcessor = async (route, template, render, languages) => {
  // 确定当前路由的语言
  const lang = route === '/' ? 'en' : route.split('/')[1];
  
  const startTime = Date.now();
  const rendered = await render(route, languages);
  
  const html = template
    .replace(`<!--app-head-->`, rendered.head ?? '')
    .replace(`<!--app-html-->`, rendered.html ?? '')
    .replace(/<html([^>]*)>/, (match, attrs) => {
      // 检查 attrs 中是否已经存在 lang 属性
      if (attrs && /\blang\s*=/.test(attrs)) {
        // 如果存在 lang 属性，替换其值
        return `<html${attrs.replace(/\blang\s*=\s*(['"])[^'"]*\1/, `lang="${lang}"`)}>`;
      } else {
        // 如果不存在 lang 属性，添加 lang 属性
        return `<html${attrs ? ` ${attrs}` : ''} lang="${lang}">`;
      }
    });
  
  // 压缩HTML
  const { minifiedHtml, originalSize, compressedSize, compressionRatio } = await compressHtml(html);
  
  const filePath = `dist/static${route}/index.html`;
  const dir = path.dirname(toAbsolute(filePath));
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  fs.writeFileSync(toAbsolute(filePath), minifiedHtml);
  
  const endTime = Date.now();
  console.log(`Prerendered ${filePath} with lang="${lang}" in ${endTime - startTime}ms [压缩率: ${compressionRatio}%]`);
  
  return {
    route,
    lang,
    filePath,
    originalSize,
    compressedSize,
    compressionRatio,
    renderTime: endTime - startTime
  };
};

// 主函数
async function main() {
  try {
    // Cached production assets
    const templateHtml = fs.readFileSync('./dist/static/index.html', 'utf-8');
    
    // 动态获取所有支持的语言
    const localesDir = path.resolve(__dirname, 'src/i18n/locales')
    const allLanguages = fs.readdirSync(localesDir).filter(name => {
      const fullPath = path.join(localesDir, name)
      return fs.statSync(fullPath).isDirectory()
    })
    
    // 获取要预渲染的语言列表
    const languagesToPrerender = getLanguagesToPrerender(allLanguages);
    
    console.log(`预渲染配置: ${languagesToPrerender.length} 种语言`);
    console.log(`语言列表: ${languagesToPrerender.join(', ')}`);
    
    // 为配置的语言生成路由
    const routes = ['/'].concat(
      languagesToPrerender.filter(lang => lang !== 'en').map(lang => `/${lang}`)
    );
    
    console.log(`准备预渲染 ${routes.length} 个路由...`);
    
    const startTime = Date.now();
    
    // 加载模板和渲染函数
    let template = templateHtml
    let render = (await import('./dist/server/entry-server.js')).render
    
    // 使用并发限制器处理所有路由
    const concurrencyLimit = Math.min(8, routes.length); // 根据系统资源调整
    const results = await limitConcurrency(
      routes, 
      concurrencyLimit, 
      (route) => renderRouteProcessor(route, template, render, languagesToPrerender)
    );
    
    const endTime = Date.now();
    
    // 统计结果
    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;
    
    // 计算总体压缩效果
    const totalOriginalSize = results
      .filter(r => r.success && r.result?.originalSize)
      .reduce((sum, r) => sum + r.result.originalSize, 0);
    
    const totalCompressedSize = results
      .filter(r => r.success && r.result?.compressedSize)
      .reduce((sum, r) => sum + r.result.compressedSize, 0);
    
    const overallCompressionRatio = totalOriginalSize > 0 
      ? ((totalOriginalSize - totalCompressedSize) / totalOriginalSize * 100).toFixed(2)
      : '0.00';
    
    console.log(`\n=== 预渲染完成 ===`);
    console.log(`总耗时: ${endTime - startTime}ms`);
    console.log(`成功: ${successCount} 个路由`);
    console.log(`失败: ${failureCount} 个路由`);
    console.log(`总体压缩率: ${overallCompressionRatio}%`);
    console.log(`原始总大小: ${totalOriginalSize.toLocaleString()} 字节`);
    console.log(`压缩后总大小: ${totalCompressedSize.toLocaleString()} 字节`);
    
    if (failureCount > 0) {
      console.log(`\n失败的路由已记录到 prerender-failures.log`);
    }
    
  } catch (e) {
    // 详细的错误日志，包含完整的错误上下文
    console.error('Error during prerendering:', {
      error: e.message,        // 错误消息
      stack: e.stack,          // 错误堆栈，便于定位问题
      timestamp: new Date(),   // 错误发生时间
      // 可以根据需要添加更多上下文信息
    });
    
    // 将错误写入日志文件
    fs.appendFileSync(
      'prerender-error.log', 
      `${new Date()}: ${e.message}\n${e.stack}\n\n`
    );
    
    process.exit(1); // 非零退出码表示构建失败
  }
}

// 执行主函数
main();

