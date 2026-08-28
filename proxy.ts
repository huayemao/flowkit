import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./lib/i18n/config";

export function proxy(request: any) {
  return i18nRouter(request, i18nConfig);
}

// 只对相关路由应用代理（排除API、静态文件和Next.js内部路径）
export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};