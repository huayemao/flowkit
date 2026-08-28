import type React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import { Source_Serif_4, JetBrains_Mono, Playfair_Display } from "next/font/google";
import ClientLayout from "./client-layout";
import { getDirection } from "@/lib/utils";
import { Locale } from "@/lib/types";
import { serverSideTranslation } from "@/lib/i18n";
import { allowedLocales, defaultLocale } from "@/lib/i18n/config";
import { Navigation } from "@/components/navigation";
import I18NProvider from "@/components/i18n-provider";
import { Footer } from "@/components/footer";
import { getAllProjectsMetadata } from "@/lib/projects/mdx";
import "../globals.css";

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "600"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "700"],
});

type RootLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata(
  { params }: RootLayoutProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { locale } = await params;

  // 获取翻译，包含 common 和 blog 命名空间以供全站使用
  const { t } = await serverSideTranslation(locale, ["common", "blog"]);

  // 生成hreflang标签
  const alternates = {
    // canonical: locale === defaultLocale ? "/" : `/${locale}`,
    languages: allowedLocales.reduce((acc, currentLocale) => {
      const path = currentLocale === defaultLocale ? "/" : `/${currentLocale}`;
      acc[currentLocale] = path;
      return acc;
    }, {} as Record<string, string>),
  };

  return {
    title: {
      default: `FlowKit - ${t("hero_title") || '在线实用工具集与自动化工作流'}`,
      template: `%s | FlowKit - ${t("hero_title") || '在线实用工具集'}`,
    },
    description: t("hero_description") || " FlowKit 打造的高效独立应用与自动化工作流工具集",
    generator: "flowkit.huayemao.run",
    keywords: t("keywords") || "flowkit, 自动裁剪图片, 海拔查询, bilibili字幕提取, 图片对比, logo制作, 视频分割, 工作流",
    alternates,
    icons: {
      apple: [
        {
          type: 'image/png',
          sizes: '180x180',
          url: '/api/icon?size=180'
        },
      ],
      icon: [
        {
          type: 'image/png',
          sizes: '16x16',
          url: '/api/icon?size=16'
        },
        {
          type: 'image/png',
          sizes: '32x32',
          url: '/api/icon?size=32'
        },
        {
          type: 'image/png',
          sizes: '48x48',
          url: '/api/icon?size=48'
        },
      ],
    },
    manifest: "/site.webmanifest",
    openGraph: {
      type: "website",
      siteName: "FlowKit",
      title: `FlowKit - ${t("hero_title") || '在线实用工具集与自动化工作流'}`,
      description: t("hero_description") || "FlowKit 打造的高效独立应用与自动化工作流工具集",
      locale: locale,
      images: [
        {
          url: "/api/icon?size=1200",
          width: 1200,
          height: 630,
          alt: "FlowKit logo",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `FlowKit - ${t("hero_title") || '在线实用工具集'}`,
      description: t("hero_description") || "FlowKit 打造的高效独立应用",
      images: [
        "/api/icon?size=1200",
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { locale } = await params;
  const namespaces = ["common", "blog", "shared", "autoTrimImage", "altitude", "bilibiliSubtitle", "logoDash", "videoSplitter"];
  const { t, i18n } = await serverSideTranslation(locale, namespaces);
  const projects = await getAllProjectsMetadata(locale);

  return (
    <html lang={locale} dir={getDirection(locale)} suppressHydrationWarning>
      <body
        className={`font-body ${sourceSerif.variable} ${jetbrainsMono.variable} ${playfair.variable}`}
      >
        <ClientLayout locale={locale}>
          <div className="min-h-screen">
            <I18NProvider
              locale={locale}
              namespaces={namespaces}
              resources={i18n.services.resourceStore.data}
            >
              <Navigation />
              {children}
              <Footer t={t} projects={projects} />
            </I18NProvider>
          </div>
        </ClientLayout>
      </body>
    </html>
  );
}
