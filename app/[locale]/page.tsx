import { HeroSection } from "@/components/hero-section"
import { ProjectsShowcase } from "@/components/projects-showcase"
import { Testimonials } from "@/components/testimonials"
import { serverSideTranslation } from "@/lib/i18n"
import { Locale } from "@/lib/types"
import RecentBlogPosts from '@/components/blog/recent-blog-posts'
import { getBlogPosts } from '@/lib/blog/utils'
import { Separator } from '@/components/ui/separator'
import { getAllProjectsMetadata } from "@/lib/projects/mdx"

type Props = {
  params: Promise<{ locale: Locale }>
}

export const generateStaticParams = async () => {
  const locales: Locale[] = ["en", "zh"] as Locale[];
  return locales.map((locale) => ({ locale }))
}


export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const { t } = await serverSideTranslation(locale, ["common"]);

  // 获取最近的博客文章
  const recentPosts = await getBlogPosts(locale);

  // 获取所有项目元数据
  const projects = await getAllProjectsMetadata(locale);

  return (
    <main>
      <HeroSection t={t} />
      <Separator className="bg-border/60" />
      <ProjectsShowcase t={t} projects={projects} locale={locale} />
      <Separator className="bg-border/60" />
      {/* 最近的博客文章部分 */}
      {recentPosts.length > 0 && (
        <>
          <RecentBlogPosts locale={locale} posts={recentPosts} t={t} />
          <Separator className="bg-border/60" />
        </>
      )}
      <Testimonials />
    </main>
  )
}