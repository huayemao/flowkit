import type { MetadataRoute } from 'next'
import { allowedLocales, defaultLocale } from '@/lib/i18n/config'
import { getBlogPosts } from '@/lib/blog/utils'
import { getAllProjectSlugs } from '@/lib/projects/mdx'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 基础URL
  const baseUrl = 'https://www.utities.online'
  
  // 获取所有博客文章（使用默认语言）
  const blogPosts = await getBlogPosts(defaultLocale)
  
  // 创建静态页面的站点地图条目
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]
  
  // 为每个静态页面添加多语言版本
  const localizedStaticPages = staticPages.flatMap(page => {
    // 为每个语言创建对应的URL
    return allowedLocales.map(locale => {
      // 构建URL路径
      const path = page.url.replace(baseUrl, '')
      const localizedUrl = locale === defaultLocale
        ? `${baseUrl}${path}`
        : `${baseUrl}/${locale}${path}`
      
      // 构建alternates链接
      const alternates = {
        languages: allowedLocales.reduce((acc, lang) => {
          const langPath = lang === defaultLocale
            ? `${baseUrl}${path}`
            : `${baseUrl}/${lang}${path}`
          acc[lang] = langPath
          return acc
        }, {} as Record<string, string>)
      }
      
      return {
          url: localizedUrl,
          lastModified: page.lastModified,
          changeFrequency: page.changeFrequency,
          priority: page.priority,
          alternates
        } as const
    })
  })
  
  // 创建博客文章的站点地图条目
  const blogPostPages = blogPosts.flatMap(post => {
    // 为每个博客文章的每个语言版本创建对应的URL
    return allowedLocales.map(locale => {
      const blogUrl = locale === defaultLocale
        ? `${baseUrl}/blog/${post.slug}`
        : `${baseUrl}/${locale}/blog/${post.slug}`
      
      // 构建alternates链接
      const alternates = {
        languages: allowedLocales.reduce((acc, lang) => {
          const langUrl = lang === defaultLocale
            ? `${baseUrl}/blog/${post.slug}`
            : `${baseUrl}/${lang}/blog/${post.slug}`
          acc[lang] = langUrl
          return acc
        }, {} as Record<string, string>)
      }
      
      return {
        url: blogUrl,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates,
        // 如果博客文章有封面图片，添加到images属性
        ...(post.coverImage ? { images: [post.coverImage] } : {})
      } as const
    })
  })
  
  // 获取所有项目 Slug
  const projectSlugs = await getAllProjectSlugs()
  
  // 创建项目的站点地图条目
  const projectPages = projectSlugs.flatMap(slug => {
    // 为每个项目的每个语言版本创建对应的URL
    return allowedLocales.map(locale => {
      const projectUrl = locale === defaultLocale
        ? `${baseUrl}/projects/${slug}`
        : `${baseUrl}/${locale}/projects/${slug}`
      
      // 构建alternates链接
      const alternates = {
        languages: allowedLocales.reduce((acc, lang) => {
          const langUrl = lang === defaultLocale
            ? `${baseUrl}/projects/${slug}`
            : `${baseUrl}/${lang}/projects/${slug}`
          acc[lang] = langUrl
          return acc
        }, {} as Record<string, string>)
      }
      
      return {
        url: projectUrl,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
        alternates
      } as const
    })
  })
  
  // 合并所有站点地图条目
  return [...localizedStaticPages, ...blogPostPages, ...projectPages]
}