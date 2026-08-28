export type Locale = "en" | "zh" | "ar";

export type AllowedLocales = Locale[];

export type I18NConfig = {
  locales: string[];
  defaultLocale: string;
  prefixDefault: boolean;
};