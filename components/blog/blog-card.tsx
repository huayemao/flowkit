"use client"
import React from 'react'
import { BlogPost } from '@/lib/types/blog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'

interface BlogCardProps {
  post: BlogPost
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
   const { t } = useTranslation('blog')
  // 格式化日期
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return dateString
    }
  }

  return (
    <Card className="rounded-2xl border border-border/70 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-primary/40 group flex flex-col h-full overflow-hidden">
      {post.coverImage && (
        <div className="w-full overflow-hidden aspect-[16/9] bg-muted relative border-b border-border/50">
          <img 
            src={post.coverImage} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col w-full p-5">
        <div className="flex items-center text-xs text-muted-foreground mb-3 space-x-4">
          <div className="flex items-center space-x-1.5">
            <Calendar size={13} className="text-primary/70" />
            <span>{formatDate(post.date)}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Clock size={13} className="text-primary/70" />
            <span>{post.readTime} {t('blog::min_read')}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold tracking-tight text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          <Link href={`/blog/${post.slug}`}>
            {post.title}
          </Link>
        </h3>
        
        <p className="line-clamp-2 text-xs sm:text-sm text-muted-foreground leading-relaxed mb-6">
          {post.description}
        </p>

        <div className="mt-auto pt-3 border-t border-border/40 flex flex-wrap gap-2">
          {post.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-muted/60 border-muted-foreground/20">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  )
}

export default BlogCard