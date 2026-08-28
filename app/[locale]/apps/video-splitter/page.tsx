import type { Metadata } from 'next'
import { serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import VideoSplitterApp from '@/packages/video-splitter/src/App'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const { t } = await serverSideTranslation(locale, ['videoSplitter', 'common'])
  const title = t('videoSplitter.title') || '视频切片与分段提取工具'
  const description = t('videoSplitter.description') || '无损切割大视频文件，支持按时间点切分、视频片段快速拆分导出。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function VideoSplitterPage({ params }: Props) {
  const { locale } = await params
  await serverSideTranslation(locale, ['videoSplitter', 'common'])

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8">
      <VideoSplitterApp />
    </div>
  )
}
