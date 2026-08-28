import { Locale } from '@/lib/types';
import { i18nConfig } from '@/lib/i18n/config';
import { ProjectImageAsset } from '@/lib/types/projects';

const supportedExtensions = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'];

/**
 * Resolve image path with locale fallback
 * Tries: locale-specific extension -> default locale extension -> first available extension
 */
export const resolveImagePath = (basePath: string, locale: Locale): string | null => {
  const locales = [locale, i18nConfig.defaultLocale, ...i18nConfig.locales.filter(l => l !== locale)];

  for (const loc of locales) {
    for (const ext of supportedExtensions) {
      const fullPath = `${basePath}.${loc}${ext}`;
      return fullPath;
    }
  }
  return null;
};

/**
 * Get resolved images for a project with locale
 */
export const getResolvedProjectImages = (screenshots: ProjectImageAsset[] = [], locale: Locale) => {
  return {
    screenshots: screenshots.map(ss => ({
      ...ss,
      resolvedPath: resolveImagePath(ss.path, locale),
    })),
  };
};