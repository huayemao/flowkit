import { serverSideTranslation } from "@/lib/i18n"
import { Locale } from "@/lib/types"
import { getLegalContent } from "@/lib/legal/mdx"
import { notFound } from "next/navigation"
import { Separator } from "@/components/ui/separator"

export const dynamic = 'force-static'

export async function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'zh' }]
}

interface LegalPageProps {
  params: Promise<{
    locale: Locale
  }>
}

export async function generateMetadata({ params }: LegalPageProps) {
  const { locale } = await params
  const mdxContent = await getLegalContent('terms', locale)
  
  if (!mdxContent) {
    return {
      title: "Terms of Service - utities.online",
    }
  }

  const { metadata } = mdxContent
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.description,
    }
  }
}

export default async function TermsPage({ params }: LegalPageProps) {
  const { locale } = await params
  const { t } = await serverSideTranslation(locale as Locale, ["common"])
  const mdxContent = await getLegalContent('terms', locale)
  
  if (!mdxContent) {
    notFound()
  }

  const { content: MdxComponent } = mdxContent

  return (
    <main className="pt-32 pb-24">
      <div className="container mx-auto px-6 max-w-4xl">
        <header className="mb-16">
          <div className="inline-block border-2 border-foreground px-4 py-1 mb-8">
            <span className="text-xs font-mono font-bold uppercase tracking-[0.3em]">
              Legal / {t('footer.termsOfService')}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-8 leading-[0.9]">
            {t('footer.termsOfService')}
          </h1>
        </header>

        <Separator weight="thin" className="mb-16" />

        <article className="prose dark:prose-invert prose-serif max-w-none 
          prose-h1:text-4xl prose-h1:font-serif prose-h1:tracking-tighter prose-h1:mb-8 prose-h1:border-b-4 prose-h1:border-foreground prose-h1:pb-4
          prose-h2:text-3xl prose-h2:font-serif prose-h2:tracking-tighter prose-h2:mt-16 prose-h2:mb-6
          prose-h3:text-xl prose-h3:font-mono prose-h3:uppercase prose-h3:tracking-widest prose-h3:mt-12
          prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
          prose-ul:list-square prose-ul:pl-6 prose-ul:mb-8
          prose-li:mb-2
          prose-blockquote:border-l-8 prose-blockquote:border-foreground prose-blockquote:bg-muted/30 prose-blockquote:px-8 prose-blockquote:py-4 prose-blockquote:italic
          prose-table:border-4 prose-table:border-foreground
          prose-th:bg-foreground prose-th:text-background prose-th:px-4 prose-th:py-2 prose-th:font-mono prose-th:uppercase prose-th:text-xs
          prose-td:border-2 prose-td:border-foreground prose-td:px-4 prose-td:py-3 prose-td:text-sm
          prose-hr:border-t-4 prose-hr:border-foreground prose-hr:my-16
        ">
          <MdxComponent />
        </article>
      </div>
    </main>
  )
}
