import i18next, { createInstance, type TFunction } from "i18next";
import { initReactI18next } from "react-i18next/initReactI18next";
import { defaultLocale, allowedLocales, i18nConfig } from "./config";
import type { Locale } from "../types";
import { cache } from "react";

import zhCommon from "./translations/zh/common.json";
import enCommon from "./translations/en/common.json";
import zhBlog from "./translations/zh/blog.json";
import enBlog from "./translations/en/blog.json";

const unwrap = (mod: any) => (mod && mod.default ? mod.default : mod);

const zhMerged = { ...unwrap(zhCommon), blog: unwrap(zhBlog) };
const enMerged = { ...unwrap(enCommon), blog: unwrap(enBlog) };

// Synchronous static resources for instant SSR metadata resolution with full restored landing page & sub-app translations
const staticResources: Record<string, any> = {
  zh: { translation: zhMerged, common: zhMerged },
  en: { translation: enMerged, common: enMerged },
};

async function initTranslations(
  locale: Locale,
  namespaces: string[],
  options?: { keyPrefix?: string; i18nInstance?: any; resources?: any }
) {
  const i18nInstance = options?.i18nInstance || createInstance();

  i18nInstance.use(initReactI18next);

  const initialResources = options?.resources || staticResources;

  await new Promise((resolve) => {
    i18nInstance.init(
      {
        lng: locale,
        resources: initialResources,
        fallbackLng: i18nConfig.defaultLocale,
        supportedLngs: i18nConfig.locales,
        defaultNS: "common",
        fallbackNS: "common",
        ns: namespaces.length > 0 ? namespaces : ["common"],
        nsSeparator: '::',
        interpolation: {
          escapeValue: false,
        },
        react: {
          useSuspense: false,
        },
      },
      () => resolve(null)
    );
  });

  const primaryNS = Array.isArray(namespaces) && namespaces.length > 0 ? namespaces[0] : "common";

  return {
    i18n: i18nInstance,
    resources: i18nInstance.services.resourceStore.data,
    t: i18nInstance.getFixedT(locale, primaryNS),
  };
}

/**
 * 缓存翻译实例，避免在同一个请求中重复初始化
 */
export function getTranslation(locale: Locale) {
  const res = locale === 'en' ? enMerged : zhMerged;
  return {
    t: (key: string) => {
      const keys = key.split('.');
      let val: any = res;
      for (const k of keys) {
        if (val && typeof val === 'object' && k in val) {
          val = val[k];
        } else {
          return key;
        }
      }
      return typeof val === 'string' ? val : key;
    },
    resources: { [locale]: { common: res, translation: res } }
  };
}

export const serverSideTranslation = cache(async (
  locale: Locale,
  namespaces?: string[],
  options?: { keyPrefix?: string; i18nInstance?: any; resources?: any }
) => {
  return await initTranslations(locale, namespaces || ["common"], options);
});