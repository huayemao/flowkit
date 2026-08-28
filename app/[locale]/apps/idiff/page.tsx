import type { Metadata } from 'next'
import { serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import ImageCompareApp from '@/packages/image-compare-pro/src/App'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const { t } = await serverSideTranslation(locale, ['shared', 'common'])
  const title = t('imageDiff.title') || '图片对比 Pro - 沉浸式多视角视觉对比'
  const description = t('imageDiff.description') || '支持并排对比、滑块对比、差异叠加模式的高性能图片对比工具。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function ImageComparePage({ params }: Props) {
  const { locale } = await params
  await serverSideTranslation(locale, ['shared', 'common'])

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8">
      <ImageCompareApp />
    </div>
  )
}
