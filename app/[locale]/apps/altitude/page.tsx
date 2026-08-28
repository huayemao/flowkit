import type { Metadata } from 'next'
import { serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import AltitudeApp from '@/packages/altitude/src/App'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const { t } = await serverSideTranslation(locale, ['altitude', 'common'])
  const title = t('altitude.title') || '海拔高度查询工具 - 快速获取全球城市海拔与位置信息'
  const description = t('altitude.description') || '通过Altitude工具，您可以即时查询任何位置的海拔高度。查看当前位置海拔与全球城市对比。'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function AltitudePage({ params }: Props) {
  const { locale } = await params
  await serverSideTranslation(locale, ['altitude', 'common'])

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8">
      <AltitudeApp />
    </div>
  )
}
