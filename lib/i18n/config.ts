
export const defaultLocale = "zh" as const;
export const allowedLocales = ["zh", "en"] as const;

export const i18nConfig = {
  locales: allowedLocales,
  defaultLocale,
  prefixDefault: true,
};