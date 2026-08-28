'use client'

import dynamic from 'next/dynamic'

const SettingsPageClient = dynamic(
  () => import('@/src/desktop-pages/settings').then((mod) => mod.SettingsPage),
  {
    ssr: false,
  }
)

export default function SettingsPage() {
  return (
    <div className="min-h-screen py-8 px-4 md:px-8">
      <SettingsPageClient />
    </div>
  )
}
