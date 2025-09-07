import { useAppStore } from "../store/app-store"
import { Button } from "../components/ui/button"
import { useTranslation } from "@/i18n"
import { LanguageSwitcher } from "../components/language-switcher"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Settings as SettingsIcon, Info, ExternalLink } from "lucide-react"
import { APP_VERSION_DISPLAY } from "@/constants/version"
import { USER_INFO } from "@/constants/user-info"

export function SettingsPage() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>

      <div className="space-y-6">
        {/* 语言设置 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              {t('settings.language.title')}
            </CardTitle>
            <CardDescription>{t('settings.languageDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span>{t('settings.currentLanguage')}</span>
              <LanguageSwitcher />
            </div>
          </CardContent>
        </Card>

        {/* 关于应用 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              {t('settings.about')}
            </CardTitle>
            <CardDescription>{t('settings.aboutDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('settings.version')}</span>
                <span className="text-sm text-muted-foreground">{APP_VERSION_DISPLAY}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{t('settings.developer')}</span>
                <a
                  href={USER_INFO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {USER_INFO.name}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
              <div className="pt-4 space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(USER_INFO.repository, '_blank')}
                >
                  {t('settings.viewOnGitHub')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.open(USER_INFO.github, '_blank')}
                >
                  {t('settings.personalPage')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}