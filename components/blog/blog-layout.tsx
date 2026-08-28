import React, { ReactNode } from 'react'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { TFunction } from 'i18next'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface BlogLayoutProps {
  children: ReactNode
  t: TFunction
  title?: string
  showBackButton?: boolean
}

const BlogLayout: React.FC<BlogLayoutProps> = ({
  children,
  t,
  title,
  showBackButton = false
}) => {
  return (
    <main className="flex-1">
      {/* 博客页面头部 */}
      <section className="backdrop-blur-2xl bg-background/50  py-16 px-4">
        <div className="container mx-auto max-w-5xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {title || t('blog::title')}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            {title ? t('blog::subtitle') : t('blog::description')}
          </p>

          {showBackButton && (
            <div className="mt-6">
              <Button variant="default" size="sm" asChild>
                <Link href="/blog">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  {t('blog::back_to_list')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* 博客内容 */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {children}
        </div>
      </section>
    </main>
  )
}

export default BlogLayout