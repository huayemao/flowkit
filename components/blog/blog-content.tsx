import React, { useState, useEffect } from 'react'
import { BlogPost as BlogPostModel } from '@/lib/types/blog'
import { Calendar, Clock, Tag } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { getBlogPostBySlug } from '@/lib/blog/utils'
import { Locale } from '@/lib/types'

interface BlogContentProps {
  post: BlogPostModel
  slug: string
  t: (key: string, options?: Record<string, string>) => string
  content: React.ReactNode
}

const BlogContent: React.FC<BlogContentProps> = async ({ post, slug, t, content }) => {


  const blog = await getBlogPostBySlug(slug, post.locale as Locale || 'en' )


  // 格式化日期，根据语言环境选择合适的格式
  const formatDate = (dateString: string) => {
    try {
      // 获取当前组件的语言环境（从父组件传递的post对象中获取locale属性）
      const currentLocale = post.locale || 'en';
      
      return new Date(dateString).toLocaleDateString(currentLocale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
      })
    } catch (error) {
      // 如果日期格式化失败，返回原始日期字符串
      return dateString
    }
  }


  return (
    <div className="space-y-8">
      {/* 文章封面图 */}
      {post.coverImage && (
        <div className="w-full rounded-lg overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}

      {/* 文章内容 */}
      <div className="prose prose-lg max-w-none dark:prose-invert">
        {content ? (
          content
        ) : (
          <p>{t('blog::content_not_available')}</p>
        )}
      </div>

      {/* 文章底部 */}
      <div className="border-t border-border pt-6 mt-8">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">
            {t('blog::published_on')} {formatDate(post.date)}
          </p>
        </div>
      </div>
    </div>
  )
}

export default BlogContent