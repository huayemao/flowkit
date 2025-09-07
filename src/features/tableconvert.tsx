import { WebAppEmbed } from '../components/web-app-embed'
import { useTranslation } from '@/i18n'

export function TableConvert() {
  const { t } = useTranslation()
  return (
    <WebAppEmbed
      url="https://tableconvert.com/"
      title={t('tableConvert.title')}
    />
  )
}