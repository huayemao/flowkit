import { BlogPost, BlogPostData } from '../types/blog'
import { Locale } from '../types'
import fs from 'fs'
import path from 'path'
import { cache } from 'react'

const getBlogPostsDir = () => {
  return path.join(process.cwd(), 'content', 'blog')
}

export const getBlogPosts = cache(async (locale: Locale, projectSlug?: string): Promise<BlogPost[]> => {
  const blogDir = getBlogPostsDir()

  try {
    if (!fs.existsSync(blogDir)) {
      console.warn('Blog directory does not exist')
      return []
    }

    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    const postDirs = entries.filter(entry => entry.isDirectory())
    const posts: BlogPost[] = []

    for (const dir of postDirs) {
      const slug = dir.name

      try {
        const { default: ContentComponent, metadata } = await import(`@/content/blog/${slug}/${locale}.mdx`)

        if (metadata) {
          const post: BlogPost = {
            slug,
            title: metadata.title || 'Untitled',
            description: metadata.description || '',
            date: metadata.date || new Date().toISOString().split('T')[0],
            readTime: metadata.readTime || 5,
            coverImage: metadata.coverImage || undefined,
            tags: metadata.tags || []
          }
          if (metadata.projectSlug) {
            post.projectSlug = metadata.projectSlug
          }
          if (projectSlug) {
            if (post.projectSlug === projectSlug) {
              posts.push(post)
            }
          } else {
            posts.push(post)
          }
        }
      } catch (importError) {
        // Fallback to English if locale-specific file doesn't exist
        if (locale !== 'en') {
          try {
            const { default: ContentComponent, metadata } = await import(`@/content/blog/${slug}/en.mdx`)
            if (metadata) {
              const post: BlogPost = {
                slug,
                title: metadata.title || 'Untitled',
                description: metadata.description || '',
                date: metadata.date || new Date().toISOString().split('T')[0],
                readTime: metadata.readTime || 5,
                coverImage: metadata.coverImage || undefined,
                tags: metadata.tags || []
              }
              if (metadata.projectSlug) {
                post.projectSlug = metadata.projectSlug
              }
              if (projectSlug) {
                if (post.projectSlug === projectSlug) {
                  posts.push(post)
                }
              } else {
                posts.push(post)
              }
            }
          } catch (fallbackError) {
            console.warn(`Error importing fallback blog post ${slug}:`, fallbackError)
          }
        } else {
          console.warn(`Error importing blog post ${slug}:`, importError)
        }
        continue
      }
    }

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
})

export const getBlogPostsByProject = cache(async (locale: Locale, projectSlug: string): Promise<BlogPost[]> => {
  return getBlogPosts(locale, projectSlug)
})



// 估算阅读时间（按字数）
const estimateReadTime = (content: string): number => {
  // 平均阅读速度：每分钟约200-250字
  const wordsPerMinute = 225
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

// 获取所有博客标签
export const getBlogTags = cache(async (locale: Locale): Promise<{ name: string; count: number }[]> => {
  const posts = await getBlogPosts(locale)
  const tagMap = new Map<string, number>()

  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
    })
  })

  return Array.from(tagMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
})

// 获取单个博客文章，包括完整内容
export const getBlogPostBySlug = cache(async (slug: string, locale: Locale): Promise<BlogPostData | null> => {
  try {
    // 使用动态导入获取博客文章内容和元数据
    const { default: content, metadata } = await import(`@/content/blog/${slug}/${locale}.mdx`)

    if (metadata) {
      return {
        slug,
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        date: metadata.date || new Date().toISOString().split('T')[0],
        readTime: metadata.readTime || 5, // 默认5分钟
        coverImage: metadata.coverImage || undefined,
        tags: metadata.tags || [],
        content
      } as BlogPostData
    }

    return null
  } catch (error) {
    // Fallback to English if locale-specific file doesn't exist
    if (locale !== 'en') {
      try {
        const { default: content, metadata } = await import(`@/content/blog/${slug}/en.mdx`)
        if (metadata) {
          return {
            slug,
            title: metadata.title || 'Untitled',
            description: metadata.description || '',
            date: metadata.date || new Date().toISOString().split('T')[0],
            readTime: metadata.readTime || 5,
            coverImage: metadata.coverImage || undefined,
            tags: metadata.tags || [],
            content
          } as BlogPostData
        }
        return null
      } catch (fallbackError) {
        console.error(`Error loading fallback blog post content for ${slug}:`, fallbackError)
        return null
      }
    }
    console.error(`Error loading blog post content for ${slug}:`, error)
    return null
  }
})