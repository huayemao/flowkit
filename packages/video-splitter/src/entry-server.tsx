import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import { init18n } from './i18n'


// 动态导入翻译文件
const getTranslations = async (language: string) => {
  try {
    const translationsModule = await import(`./i18n/locales/${language}/translation.json`)
    return translationsModule.default
  } catch (e) {
    console.error(`Failed to load translations for ${language}:`, e)
    // 加载默认的英文翻译
    const defaultTranslationsModule = await import('./i18n/locales/en/translation.json')
    return defaultTranslationsModule.default
  }
}

// 在服务器端获取合适的翻译内容
const getSeoContent = async (url: string) => {
  // 在服务器端，我们默认使用英语作为后备语言
  let language = 'en'

  try {
    // 尝试获取保存的语言
    const pathParts = url.split('/')
    if (pathParts.length >= 2 && pathParts[1]) {
      language = pathParts[1]
    }
  } catch (e) {
    // 如果出错，继续使用默认语言
  }


  const translations = await getTranslations(language)
  const seo = translations.videoSplitter

  return {
    language,
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    author: seo.author,
    copyright: seo.copyright,
    ogTitle: seo.ogTitle,
    ogDescription: seo.ogDescription,
    twitterTitle: seo.twitterTitle,
    twitterDescription: seo.twitterDescription,
    canonicalUrl: seo.canonicalUrl || url,
  }
}

export async function render(url: string, languages: string[]) {
  const seoContent = await getSeoContent(url)
  const i18nInstance = await init18n(seoContent.language)
  i18nInstance.changeLanguage(seoContent.language)
  const html = renderToString(
    <StrictMode>
      <App />
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
      <link rel="canonical" href={seoContent.canonicalUrl} />
      {hreflangTags}
    </>
  )

  return { html, head }
}