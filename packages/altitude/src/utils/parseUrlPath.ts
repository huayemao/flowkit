import { languages } from "../i18n"

// 解析URL路径，提取语言和页面路径
export const parseUrlPath = (url: string) => {
  let language = 'en'
  let pagePath = ''
  const pathParts = url.split('/').filter(Boolean)
  
  const supportedLanguages = languages
  // 检查第一个部分是否为有效语言代码
  if (pathParts.length > 0 && supportedLanguages.includes(pathParts[0])) {
    language = pathParts[0]
  }
  if (pathParts.length > 1) {
    pagePath = pathParts.slice(1).join('/')
  }
  else {
    pagePath = pathParts.join('/')
  }
  return { language, pagePath }
}