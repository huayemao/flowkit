import { serverSideTranslation } from '@/lib/i18n';
import { Locale } from '@/lib/types';
import { getAllProjectsMetadata } from '@/lib/projects/mdx';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { LucideIcon } from '@/components/lucide-icon';

export const dynamic = 'force-static'

interface ProjectsListProps {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { t } = await serverSideTranslation((await params).locale as Locale, ['common']);
  return {
    title: `${t('projects_list_title')} - utities.online`,
    description: t('projects_list_description'),
    keywords: t('keywords'),
  };
}

export const generateStaticParams = async () => {
  const locales: Locale[] = ['en', 'zh'] as Locale[];
  return locales.map((locale) => ({ locale }));
};

export default async function ProjectsListPage({ params }: ProjectsListProps) {
  const { locale } = await params;
  const { t } = await serverSideTranslation(locale, ['common']);
  const projects = await getAllProjectsMetadata(locale);

  return (
    <main className="py-12 sm:py-16 px-4 sm:px-6 bg-[#f8f9ff] dark:bg-[#181d33] min-h-screen">
      <div className="container mx-auto max-w-6xl">
        {/* 页面标题部分 */}
        <div className="mb-10 space-y-2">
          <Badge variant="outline" className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border-indigo-200/80 font-medium">
            FLOWKIT TOOLS & UTILITIES
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1e2540] dark:text-white">
            {t('projects_list_title') || '工具集'}
          </h1>
          <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-2xl">
            {t('projects_list_description') || '探索为高效办公与多媒体创作量身打造的极简独立应用与数字工具'}
          </p>
        </div>

        {/* 项目列表部分 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => {
            return (
              <div 
                key={project.id} 
                className="group relative flex flex-col justify-between rounded-xl border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-slate-900 p-5 text-slate-800 dark:text-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-indigo-400 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      <LucideIcon name={project.icon} className="h-5 w-5" />
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-indigo-50/60 border-indigo-200/60 text-indigo-700">
                        {project.category}
                      </Badge>
                      {project.popular && (
                        <Badge variant="outline" className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border-indigo-300">
                          {t('popular') || '热门'}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-semibold text-[#1e2540] dark:text-white group-hover:text-indigo-600 transition-colors mb-1.5">
                    {project.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-indigo-100 dark:border-slate-800 mt-auto">
                  <Button asChild variant="soft" className="w-full rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white border border-indigo-200/80 transition-all">
                    <Link href={`/projects/${project.id}`} aria-label={project.name}>
                      {t('try_now') || '立即体验'} →
                    </Link>
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 无项目时的提示 */}
        {projects.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-xl border border-indigo-100 dark:border-indigo-950 mt-6">
            <p className="text-sm text-slate-500">{t('no_projects_available') || '暂无可用应用'}</p>
          </div>
        )}
      </div>
    </main>
  );
}