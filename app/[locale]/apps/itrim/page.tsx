import type { Metadata } from 'next'
import { getTranslation, serverSideTranslation } from '@/lib/i18n'
import { Locale } from '@/lib/types'
import AutoTrimApp from '@/packages/auto-trim-image/src/App'

type Props = {
  params: Promise<{ locale: Locale }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const { t } = getTranslation(locale)
  const title = t('autoTrimImage.title')
  const description = t('autoTrimImage.description')

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  }
}

export default async function AutoTrimImagePage({ params }: Props) {
  const { locale } = await params
  await serverSideTranslation(locale, ['autoTrimImage', 'common'])

  return (
    <div className="w-full min-h-screen py-6 px-4 md:px-8">
      <AutoTrimApp />
    </div>
  )
}
