import { WebAppEmbed } from '../components/web-app-embed'
import { useTranslation } from '@/i18n'

export function Excalidraw() {
  const { t } = useTranslation()
  return (
    <WebAppEmbed
      url="https://excalidraw.com/"
      title={t('excalidraw.title')}
    />
  )
}