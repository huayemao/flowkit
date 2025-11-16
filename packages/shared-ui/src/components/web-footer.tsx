import React from "react";
import { useTranslation } from "react-i18next";
import { ExternalLink, Github, Mail, Heart } from "lucide-react";

export const WebFooter: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const toolCategories = [
    {
      title: t("webFooter.imageProcessing"),
      tools: [
        {
          name: t("webFooter.imageCompare"),
          href: "https://idiff.utities.online",
        },
        {
          name: t("webFooter.autoTrimImage"),
          href: "https://itrim.utities.online",
        },
        {
          name: t("webFooter.immersiveImageView"),
          href: "https://immersiview.utities.online",
        },
      ],
    },
    {
      title: t("webFooter.videoTools"),
      tools: [
        {
          name: t("webFooter.videoSplitter"),
          href: "https://split-v.utities.online",
        },
      ],
    },
    {
      title: t("webFooter.designTools"),
      tools: [
        { name: t("webFooter.logoMaker"), href: "https://logo.utities.online" },
      ],
    },
    {
      title: t("webFooter.geographicTools"),
      tools: [
        {
          name: t("webFooter.altitudeQuery"),
          href: "https://altitude.utities.online",
        },
      ],
    },
  ];

  const companyLinks = [
    { name: t("webFooter.aboutUs"), href: "https://utities.online/about" },
    { name: t("webFooter.termsOfUse"), href: "https://utities.online/terms" },
    {
      name: t("webFooter.privacyPolicy"),
      href: "https://utities.online/privacy",
    },
    { name: t("webFooter.contactUs"), href: "https://utities.online/contact" },
  ];

  const socialLinks = [
    {
      name: "GitHub",
      href: "https://github.com/huayemao",
      icon: Github,
    },
    {
      name: "Email",
      href: "mailto:support@utities.online",
      icon: Mail,
    },
  ];

  return (
    <footer className="bg-background/80 backdrop-blur-md border-t border-border/40">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* 额外的CTA区域 */}
        <div className="mt-8 text-center mb-6">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-indigo-200/60 dark:border-indigo-700/60">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {t("webFooter.discoverMoreTools")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl mx-auto">
              {t("webFooter.exploreCompleteCollection")}
            </p>
            <a
              href="https://www.utities.online/tools"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {t("webFooter.browseAllTools")}
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 主要内容区域 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 工具分类 */}
          {toolCategories.map((category, index) => (
            <div key={index} className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.tools.map((tool, toolIndex) => (
                  <li key={toolIndex}>
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200 flex items-center gap-1 group"
                    >
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {tool.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 分隔线 */}
        <div className="border-t border-border/40 my-8"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* 左侧：公司信息和链接 */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                <span className="text-sm text-indigo-600 dark:text-indigo-400 font-bold">
                  U
                </span>
              </div>
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                utities.online
              </span>
            </div>

            <nav className="flex flex-wrap items-center gap-6">
              {companyLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </div>

          {/* 右侧：社交链接和版权信息 */}
          <div className="flex flex-col items-center space-y-4">
            {/* 社交链接 */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                );
              })}
            </div>

            {/* 版权信息 */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center justify-center gap-1">
                {t("webFooter.copyright", { year: currentYear })}
                <Heart className="w-3 h-3 text-red-500" />
                {t("webFooter.madeWithHeart")}
              </p>
              <p className="mt-1">{t("webFooter.providePowerfulTools")}</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
