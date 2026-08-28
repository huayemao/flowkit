import React from 'react'
import { serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import BlogPost from '@/components/blog/blog-post'
import { getBlogPostBySlug } from '@/lib/blog/utils'
import { notFound } from 'next/navigation'

export const dynamic = "force-static";

export const generateMetadata = async ({ params }: { params: Promise<{ locale: Locale; slug: string }> }) => {
  const { locale, slug } = await params
  const { t } = await serverSideTranslation(locale as Locale, ['blog'])

  try {
    // 尝试获取博客文章数据以生成元数据
    const { metadata } = await import(`@/content/blog/${slug}/${locale}.mdx`);

    if (metadata) {
      return {
        title: metadata.title,
        description: metadata.description,
        keywords: metadata.tags?.join(', ') || '',
        authors: [
          {
            name: metadata.author || 'huayemao',
            url: 'https://huayemao.run'
          }
        ],
        openGraph: {
          title: metadata.title,
          description: metadata.description,
          type: 'article',
          publishedTime: metadata.date,
          ...(metadata.coverImage && {
            images: [metadata.coverImage]
          }),
          url: `https://utities.online/${locale}/blog/${slug}`,
          siteName: 'Utities',
          locale: locale
        },
        twitter: {
          card: 'summary_large_image',
          title: metadata.title,
          description: metadata.description,
          ...(metadata.coverImage && {
            images: [metadata.coverImage]
          })
        },
        robots: {
          index: true,
          follow: true,
          'max-snippet': -1,
          'max-image-preview': 'large',
          'max-video-preview': -1
        },
        alternates: {
          canonical: `https://utities.online/blog/${slug}`,
          languages: {
            'en': `https://utities.online/en/blog/${slug}`,
            'zh': `https://utities.online/zh/blog/${slug}`
          }
        }
      }
    }
  } catch (error) {
    // Fallback to English
    try {
      const { metadata } = await import(`@/content/blog/${slug}/en.mdx`);
      if (metadata) {
        return {
          title: metadata.title,
          description: metadata.description,
          keywords: metadata.tags?.join(', ') || '',
          authors: [
            {
              name: metadata.author || 'huayemao',
              url: 'https://huayemao.run'
            }
          ],
          openGraph: {
            title: metadata.title,
            description: metadata.description,
            type: 'article',
            publishedTime: metadata.date,
            ...(metadata.coverImage && {
              images: [metadata.coverImage]
            }),
            url: `https://utities.online/${locale}/blog/${slug}`,
            siteName: 'Utities',
            locale: locale
          },
          twitter: {
            card: 'summary_large_image',
            title: metadata.title,
            description: metadata.description,
            ...(metadata.coverImage && {
              images: [metadata.coverImage]
            })
          },
          robots: {
            index: true,
            follow: true,
            'max-snippet': -1,
            'max-image-preview': 'large',
            'max-video-preview': -1
          },
          alternates: {
            canonical: `https://utities.online/blog/${slug}`,
            languages: {
              'en': `https://utities.online/en/blog/${slug}`,
              'zh': `https://utities.online/zh/blog/${slug}`
            }
          }
        }
      }
    } catch (fallbackError) {
      console.error('Error generating metadata for blog post:', fallbackError)
    }
  }

  // 回退元数据
  return {
    title: t('blog::title'),
    description: t('blog::description'),
    keywords: t('blog::keywords') || '',
    openGraph: {
      title: t('blog::title'),
      description: t('blog::description'),
      type: 'website'
    }
  }
}

const BlogPostPage = async ({ params }: { params: Promise<{ locale: Locale; slug: string }> }) => {
  const { locale, slug } = await params
  const { t } = await serverSideTranslation(locale, ['blog'])

  let post, metadata
  try {
    ({ default: post, metadata } = await import(`@/content/blog/${slug}/${locale}.mdx`))
  } catch (error) {
    // Fallback to English
    try {
      ({ default: post, metadata } = await import(`@/content/blog/${slug}/en.mdx`))
    } catch (fallbackError) {
      notFound()
    }
  }

  // 如果文章不存在，返回404
  if (!post) {
    notFound()
  }

  // 将locale添加到metadata中，以便在子组件中使用
  const postWithLocale = {
    ...metadata,
    locale
  }

  return (
    <div className="min-h-screen">
      <BlogPost slug={slug} t={t} post={postWithLocale} content={post} />
    </div>
  )
}

export default BlogPostPage