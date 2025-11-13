import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { initI18n } from './i18n'
import { DOMAIN_NAME } from './constants'
import { SITE_ID } from './constants'
import path from 'path'
import { parseUrlPath } from './utils/parseUrlPath'

// 动态导入翻译文件
const getTranslations = async (language: string) => {
  try {
    const translationsModule = await import(`./i18n/locales/${language}/translation.json`)
    return translationsModule.default
  } catch (e) {
    console.log(`Failed to load translations for ${language}:`)
    // 加载默认的英文翻译
    const defaultTranslationsModule = await import('./i18n/locales/en/translation.json')
    return defaultTranslationsModule.default
  }
}


// 在服务器端获取合适的翻译内容
const getSeoContent = async (url: string) => {
  const { language } = parseUrlPath(url)

  try {
    const translations = await getTranslations(language)

    // 根据URL路径确定要使用的SEO内容
    const { pagePath } = parseUrlPath(url)

    // 默认使用主页面SEO
    let seo = translations[SITE_ID]

    // 如果是特定页面，尝试获取该页面的SEO内容
    if (pagePath === 'elevation-by-latlon' && translations['latlon']) {
      seo = translations['latlon']
    }

    return {
      language,
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
      author: seo.author || translations[SITE_ID]?.author || 'FlowKit Team',
      copyright: seo.copyright || translations[SITE_ID]?.copyright,
      ogTitle: seo.ogTitle || seo.title,
      ogDescription: seo.ogDescription || seo.description,
      twitterTitle: seo.twitterTitle || seo.title,
      twitterDescription: seo.twitterDescription || seo.description,
      canonicalUrl: url,
    }
  } catch (e) {
    console.error('Error getting SEO content:', e)
    // 回退到默认的英文SEO内容
    const defaultTranslations = await getTranslations('en')
    const defaultSeo = defaultTranslations[SITE_ID]
    return {
      language: 'en',
      title: defaultSeo.title,
      description: defaultSeo.description,
      keywords: defaultSeo.keywords,
      author: defaultSeo.author,
      copyright: defaultSeo.copyright,
      ogTitle: defaultSeo.ogTitle,
      ogDescription: defaultSeo.ogDescription,
      twitterTitle: defaultSeo.twitterTitle,
      twitterDescription: defaultSeo.twitterDescription,
      canonicalUrl: url,
    }
  }
}


// 动态导入页面组件
export const getPageComponent = async (url: string) => {
  try {
    // 解析URL获取页面路径
    const { pagePath } = parseUrlPath(url)
    console.log(pagePath)
    
    if (!pagePath) {
      // 如果是主页面或空路径，返回App组件
      return App;
    }
    
    // 尝试导入pages目录下的对应页面组件
    try {
      // 使用动态导入来加载页面组件
      const pageModule = await import(`./pages/${pagePath}.tsx`)
      // 返回页面组件，支持默认导出或命名导出
      return pageModule.default || pageModule[pagePath.charAt(0).toUpperCase() + pagePath.slice(1)]
    } catch (e) {
      console.warn(`Page component not found for path: ${pagePath}`, e)
      // 如果页面组件不存在，返回默认的App组件
      return App
    }
  } catch (error) {
    console.error('Error loading page component:', error)
    // 返回默认App组件
    return App
  }
}

export async function render(url: string, languages: string[]) {
  const seoContent = await getSeoContent(url)
  const i18nInstance = await initI18n(seoContent.language)
  i18nInstance.changeLanguage(seoContent.language)

  // 获取要渲染的页面组件
  const PageComponent = await getPageComponent(url)

  // 渲染组件
  const html = renderToString(
    <StrictMode>
      {PageComponent ? <PageComponent /> : <App />}
    </StrictMode>,
  )


  // 计算base URL - 对于所有路由，使用根路径作为base URL
  // 这样所有资源路径都从根目录开始解析，解决二级目录下资源加载问题
  const baseUrl = '/'

  // 生成hreflang标签
  const hreflangTags = languages.map(lang => {
    const href = lang === 'en' ? '/' : `/${lang}/`
    return (
      <link
        key={lang}
        rel="alternate"
        href={href}
        {...{ hreflang: lang }}
      />
    )
  })

  const head = renderToString(
    <>
      <base href={baseUrl} />
      <title>{seoContent.title}</title>
      <meta name="description" content={seoContent.description} />
      <meta name="keywords" content={seoContent.keywords} />
      <meta name="author" content={seoContent.author} />
      <meta name="copyright" content={seoContent.copyright} />
      <meta property="og:title" content={seoContent.ogTitle} />
      <meta property="og:description" content={seoContent.ogDescription} />
      <meta property="og:type" content="website" />
      <meta name="twitter:title" content={seoContent.twitterTitle} />
      <meta name="twitter:description" content={seoContent.twitterDescription} />
      <link rel="canonical" href={`https://${DOMAIN_NAME}${url}`} />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="icon" href="/favicon.ico" sizes="48x48" />
      <link rel="icon" href="/favicon.svg" sizes="any" type="image/svg+xml" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#FFFFFF" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#000000" media="(prefers-color-scheme: dark)" />
      {hreflangTags}
    </>
  )

  return { html, head }
}