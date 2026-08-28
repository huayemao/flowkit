import { getBlogPosts, getBlogTags } from '@/lib/blog/utils'
import { TFunction } from 'i18next'
import BlogFilter from './blog-filter'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import I18NProvider from "@/components/i18n-provider"
import { Locale } from '@/lib/types'
interface BlogListProps {
  t: TFunction
  i18n: any
  locale: Locale
}

// 服务端组件，直接获取数据
const BlogList = async ({ t,i18n,locale }: BlogListProps) => {
  try {
    // 直接在组件中获取博客文章和标签数据
    const posts = await getBlogPosts(locale)
    const tags = await getBlogTags(locale)

    // 如果有数据，渲染博客过滤器组件
    if (posts.length > 0 || tags.length > 0) {
      return (
        <I18NProvider  locale={locale} namespaces={['common']} resources={i18n.services.resourceStore.data}>
          <BlogFilter posts={posts} tags={tags} />
        </I18NProvider>
      )
    }

    // 如果没有任何数据，显示空状态
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">{t('blog.no_posts')}</h3>
        <p className="text-muted-foreground">{t('blog.check_back_later')}</p>
      </div>
    )
  } catch (error) {
    console.error('Error fetching blog data:', error)
    // 错误状态处理
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium mb-2">{t('blog.error_fetching')}</h3>
        <p className="text-muted-foreground">{t('blog.try_again')}</p>
      </div>
    )
  }
}

// 骨架屏组件，用于初始加载状态
BlogList.Skeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array(6).fill(0).map((_, index) => (
      <Card key={index} className="overflow-hidden">
        <div className="h-40 bg-muted animate-pulse"></div>
        <CardHeader>
          <div className="h-6 bg-muted animate-pulse rounded w-2/3 mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-1/2"></div>
        </CardHeader>
        <CardContent>
          <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-full mb-2"></div>
          <div className="h-4 bg-muted animate-pulse rounded w-2/3"></div>
        </CardContent>
        <CardFooter>
          <div className="h-8 bg-muted animate-pulse rounded w-20"></div>
        </CardFooter>
      </Card>
    ))}
  </div>
)

export default BlogList