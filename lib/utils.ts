import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { Locale } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDirection(locale: Locale) {
  if (locale === "ar") {
    return "rtl";
  }
  return "ltr";
}
