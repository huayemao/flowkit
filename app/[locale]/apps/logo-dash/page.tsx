import type { Metadata } from 'next'
import { serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import LogoDashApp from '@/packages/logo-dash/src/App'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const { t } = await serverSideTranslation(locale, ['logoDash', 'common'])
  const title = t('logoDash.title') || 'LogoDash - 极简品牌 Logo 设计器'
  const description = t('logoDash.description') || '快速创建专业、现代的图标与品牌标识，支持 SVG 与 高清 PNG 导出。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function LogoDashPage({ params }: Props) {
  const { locale } = await params
  await serverSideTranslation(locale, ['logoDash', 'common'])

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8">
      <LogoDashApp />
    </div>
  )
}
