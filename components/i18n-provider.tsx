"use client";

import { useMemo } from "react";
import { I18nextProvider } from "react-i18next";
import { initI18n, changeLanguage } from "@flowkit/shared-ui";
import { Locale } from "@/lib/types";

type Props = {
  children: React.ReactNode;
  locale: Locale;
  namespaces?: string[];
  resources?: any;
};

export default function I18NProvider({
  children,
  locale,
}: Props) {
  const i18n = useMemo(() => {
    const instance = initI18n(undefined, locale);
    if (instance.language !== locale) {
      changeLanguage(locale);
    }
    return instance;
  }, [locale]);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
