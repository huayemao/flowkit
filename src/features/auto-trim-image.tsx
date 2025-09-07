import { useState, useRef } from 'react'
import { useTranslation } from '@/i18n'
import { AutoTrimImage as AutoTrimImageComponent } from '@flowkit/auto-trim-image'

export function AutoTrimImage() {
  const { t } = useTranslation()
  return (
    <AutoTrimImageComponent />
  )
}