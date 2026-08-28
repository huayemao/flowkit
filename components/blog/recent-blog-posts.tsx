// "use client"
import React from 'react'
import BlogCard from './blog-card'
import Link from 'next/link'
import { Locale } from '@/lib/types'
import { BlogPost } from '@/lib/types/blog'
import { useTranslation } from 'react-i18next'

interface RecentBlogPostsProps {
  locale: Locale
  posts: BlogPost[]
  limit?: number
  t: (key: string) => string
}

const RecentBlogPosts: React.FC<RecentBlogPostsProps> = ({ locale, posts, limit = 3, t }) => {

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-20 lg:py-28 px-4 sm:px-6 bg-background">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-border/80 pb-6">
          <div className="max-w-2xl space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              {t('common::recent_posts') || '最新动态与技术文章'}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground">
              探索数字工具应用、自动化工作流技巧与最新更新
            </p>
          </div>
          <Link 
            href={`/${locale}/blog`} 
            className="hidden md:flex items-center text-sm font-semibold text-primary hover:underline underline-offset-4 transition-all"
          >
            {t('common::view_all') || '查看全部文章'} →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, limit).map((post) => (
            <BlogCard key={post.slug} post={post}  />
          ))}
        </div>

        <Link 
          href={`/${locale}/blog`} 
          className="md:hidden block mt-8 text-center text-sm font-semibold text-primary hover:underline underline-offset-4"
        >
          {t('common::view_all') || '查看全部文章'} →
        </Link>
      </div>
    </section>
  )
}

export default RecentBlogPosts