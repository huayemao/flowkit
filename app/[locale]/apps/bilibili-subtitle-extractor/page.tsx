import type { Metadata } from 'next'
import { serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import BilibiliApp from '@/packages/bilibili-subtitle-extractor/src/App'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const { t } = await serverSideTranslation(locale, ['bilibiliSubtitle', 'common'])
  const title = t('bilibiliSubtitleExtractor.title') || 'Bilibili 字幕提取工具'
  const description = t('bilibiliSubtitleExtractor.description') || '快速提取 B站 视频 CC 字幕，支持一键导出 TXT, SRT, JSON 等多种格式。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function BilibiliSubtitlePage({ params }: Props) {
  const { locale } = await params
  await serverSideTranslation(locale, ['bilibiliSubtitle', 'common'])

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8">
      <BilibiliApp />
    </div>
  )
}
