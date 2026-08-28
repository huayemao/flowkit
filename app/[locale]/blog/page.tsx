import React from 'react'
import { serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import BlogLayout from '@/components/blog/blog-layout'
import BlogList from '@/components/blog/blog-list'

export const dynamic = 'force-static'

export const generateMetadata = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const { t } = await serverSideTranslation((await params).locale as Locale, ['blog'])
  return {
    title: t('blog::title'),
    description: t('blog::description'),
    openGraph: {
      title: t('blog::title'),
      description: t('blog::description'),
      type: 'website',
    },
  }
}

const BlogPage = async ({ params }: { params: Promise<{ locale: Locale }> }) => {
  const locale = (await params).locale as Locale
  const { t,i18n } = await serverSideTranslation(locale, ['blog'])
  
  return (
    <BlogLayout t={t}>
      <BlogList t={t} i18n={i18n} locale={locale} />
    </BlogLayout>
  )
}

export default BlogPage