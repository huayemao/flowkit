import { ProjectLandingTemplate } from "@/components/project-landing-template"
import { ProjectGallery } from "@/components/project-gallery"
import { notFound } from "next/navigation"
import { serverSideTranslation } from "@/lib/i18n"
import { Locale } from "@/lib/types"
import { getProjectContent, getAllProjectSlugs } from "@/lib/projects/mdx"
import { getBlogPostsByProject } from "@/lib/blog/utils"

export const dynamic = 'force-static'

interface ProjectPageProps {
  params: Promise<{
    slug: string,
    locale: Locale
  }>
}

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug, locale } = await params
  
  const mdxContent = await getProjectContent(slug, locale)
  if (!mdxContent) {
    return {
      title: "项目未找到 - utities.online",
    }
  }

  const { metadata } = mdxContent
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: `${metadata.name},在线项目,${slug}`,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      images: metadata.socialImage ? [metadata.socialImage] : [],
    }
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug, locale } = await params
  
  const { t } = await serverSideTranslation(locale as Locale, ["common"])

  const mdxContent = await getProjectContent(slug, locale)
  
  if (!mdxContent) {
    notFound()
  }

  const blogPosts = await getBlogPostsByProject(locale, slug)

  const { metadata, content: MdxComponent } = mdxContent
  const project = {
    ...metadata,
    longDescription: metadata.longDescription,
  }

  return (
    <main>
      <ProjectLandingTemplate project={project} t={t} locale={locale} blogPosts={blogPosts}>
        <div className="mt-12 space-y-12">
          <ProjectGallery screenshots={metadata.screenshots || []} locale={locale} />
          <div className="prose dark:prose-invert max-w-none">
            <MdxComponent />
          </div>
        </div>
      </ProjectLandingTemplate>
    </main>
  )
}
