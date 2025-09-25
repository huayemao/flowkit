import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import { supportedLanguages, languageDisplayNames, languageFlags } from '../i18n';

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // 保存语言选择到localStorage
    localStorage.setItem('flowkit-language', lng);
  };

  const currentLanguage = i18n.language;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
          <Globe className="h-4 w-4" />
          <span className="sr-only">{t('common.language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {supportedLanguages.map((lang) => (
          <DropdownMenuItem
            key={lang}
            onClick={() => changeLanguage(lang)}
            className={`flex items-center gap-2 ${currentLanguage === lang ? 'bg-accent' : ''}`}
          >
            <span className="w-6 text-center">{languageFlags[lang as keyof typeof languageFlags] || ''}</span>
            <span>{languageDisplayNames[lang as keyof typeof languageDisplayNames] || lang}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}