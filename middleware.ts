import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./lib/i18n/config";

const MAIN_HOST = "www.utities.online";

const SUBDOMAIN_REDIRECT_MAP: Record<string, string> = {
  "idiff.utities.online": "/apps/idiff",
  "altitude.utities.online": "/apps/altitude",
  "itrim.utities.online": "/apps/itrim",
  "logo.utities.online": "/apps/logo-dash",
  "split-v.utities.online": "/apps/video-splitter",
  "immersiview.utities.online": "/projects/immersiview",
};

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || request.nextUrl.hostname;
  const hostname = host.split(":")[0].toLowerCase();

  // Check if request is coming from a legacy subdomain
  if (hostname in SUBDOMAIN_REDIRECT_MAP) {
    const targetPath = SUBDOMAIN_REDIRECT_MAP[hostname];
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = MAIN_HOST;
    if (url.pathname === "/") {
      url.pathname = targetPath;
    } else if (!url.pathname.startsWith(targetPath)) {
      url.pathname = `${targetPath}${url.pathname}`;
    }
    return NextResponse.redirect(url, 301);
  }

  // Redirect any other generic subdomains (e.g. *.utities.online) to main domain
  if (
    hostname.endsWith(".utities.online") &&
    hostname !== "utities.online" &&
    hostname !== "www.utities.online"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = "https";
    url.host = MAIN_HOST;
    return NextResponse.redirect(url, 301);
  }

  return i18nRouter(request, i18nConfig);
}

export const config = {
  matcher: "/((?!api|static|.*\\..*|_next).*)",
};

