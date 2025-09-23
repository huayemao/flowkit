import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import App from './App'
import enTranslations from './i18n/locales/en/translation.json'
import zhTranslations from './i18n/locales/zh/translation.json'

// 在服务器端获取合适的翻译内容
const getSeoContent = (url: string) => {
  // 在服务器端，我们默认使用英语作为后备语言
  let language = 'en'

  try {
    // 尝试获取保存的语言
    language = url.split('/')[1]
  } catch (e) {
    // 如果出错，继续使用默认语言
  }

  const translations = language === 'zh' ? zhTranslations : enTranslations
  const seo = translations.logoDash

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
    canonicalUrl: seo.canonicalUrl || url
  }
}

export function render(url: string) {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  )

  const seoContent = getSeoContent(url)
  
  // 计算base URL - 对于所有路由，使用根路径作为base URL
  // 这样所有资源路径都从根目录开始解析，解决二级目录下资源加载问题
  const baseUrl = '/'

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
    </>
  )

  return { html, head }
}