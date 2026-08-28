"use client"
import React, { useState } from 'react'
import { BlogPost } from '@/lib/types/blog'
import { Button } from '@/components/ui/button'
import { TFunction } from 'i18next'
import { useTranslation } from 'react-i18next'
import BlogCard from './blog-card'

interface BlogFilterProps {
  posts: BlogPost[]
  tags: { name: string; count: number }[]
}

const BlogFilter: React.FC<BlogFilterProps> = ({ posts, tags,  }) => {
  const { t } = useTranslation('blog')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [showAllTags, setShowAllTags] = useState(false)

  // 根据选中的标签过滤文章
  const filteredPosts = selectedTag 
    ? posts.filter(post => post.tags.includes(selectedTag)) 
    : posts

  // 限制显示的标签数量
  const displayTags = showAllTags ? tags : tags.slice(0, 8)

  return (
    <div className="space-y-8">
      {/* 标签过滤器 */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={selectedTag === null ? "default" : "ghost"}
            size="sm"
            onClick={() => setSelectedTag(null)}
          >
            {t('blog::all')}
          </Button>
          {displayTags.map(tag => (
            <Button 
              key={tag.name}
              variant={selectedTag === tag.name ? "default" : "ghost"}
              size="sm"
              onClick={() => setSelectedTag(tag.name)}
              className="text-sm"
            >
              {tag.name} ({tag.count})
            </Button>
          ))}
          {/* 展开/收起按钮 */}
          {tags.length > 3 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-sm"
            >
              {showAllTags ? t('blog::show_less') : `${t('blog::show_more')} (${tags.length - 8})`}
            </Button>
          )}
        </div>
      )}

      {/* 博客文章列表 */}
      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">
            {selectedTag ? 
              t('blog.no_posts_with_tag', { tag: selectedTag }) : 
              t('blog.no_posts')
            }
          </h3>
          <p className="text-muted-foreground">
            {t('blog.check_back_later')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPosts.map(post => (
            <BlogCard key={post.slug} post={post}/>
          ))}
        </div>
      )}
    </div>
  )
}

export default BlogFilter