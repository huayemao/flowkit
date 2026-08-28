import { memo, Suspense } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ProjectMetadata } from '@/lib/projects/mdx'
import { LucideIcon } from '@/components/lucide-icon'
import { getResolvedProjectImages } from '@/lib/projects/images'
import { Locale } from '@/lib/types'

interface ProjectsShowcaseProps {
  t: (key: string) => string
  projects: ProjectMetadata[]
  locale: Locale
}

const ProjectsShowcase = memo(({ t, projects, locale }: ProjectsShowcaseProps) => {
  return (
    <section id="projects" className="py-16 lg:py-24 px-4 sm:px-6 bg-[#f8f9ff] dark:bg-[#181d33]">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 border-b border-indigo-100 dark:border-indigo-950 pb-6">
          <div className="max-w-2xl space-y-2">
            <Badge variant="outline" className="px-3 py-1 text-xs rounded-full bg-indigo-50 text-indigo-700 border-indigo-200/80 font-medium">
              FLOWKIT APPLICATIONS
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1e2540] dark:text-white">{t('projects_showcase_title') || '独立实用工具集'}</h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400">
              {t('projects_showcase_description') || '挑选适合您的专属高效工具，即刻开启快速处理体验'}
            </p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-xs font-mono text-indigo-600 dark:text-indigo-400 tracking-wider uppercase font-semibold">FLOWKIT UTILITIES</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Suspense
            fallback={
              Array(6).fill(0).map((_, index) => (
                <div key={index} className="rounded-xl border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-slate-900 p-5 min-h-[260px]">
                   <Skeleton className="h-9 w-9 rounded-lg mb-4" />
                   <Skeleton className="h-6 w-2/3 mb-3" />
                   <Skeleton className="h-16 w-full" />
                </div>
              ))
            }
          >
            {projects.map((project) => {
              const projectImages = getResolvedProjectImages(project.screenshots || [], locale)
              const coverImage = projectImages?.screenshots?.[0]?.resolvedPath || project.coverImage || '/images/placeholder.jpg'

              return (
                <Link
                  key={project.id}
                  href={`/projects/${project.id}`}
                  className="group relative flex flex-col justify-between rounded-xl border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-slate-900 p-5 text-slate-800 dark:text-slate-100 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:border-indigo-400 overflow-hidden"
                >
                  <div>
                    {/* Project Image */}
                    <div className="aspect-[16/9] overflow-hidden rounded-lg border border-indigo-100 dark:border-slate-800 relative mb-4 bg-indigo-50/50">
                      <img
                        src={coverImage}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 h-8 w-8 rounded-lg border border-indigo-200/60 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm">
                        <LucideIcon name={project.icon} className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="text-base font-semibold text-[#1e2540] dark:text-white group-hover:text-indigo-600 transition-colors truncate">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <Badge variant="outline" className="text-[11px] font-normal px-2 py-0.5 rounded-md bg-indigo-50/60 border-indigo-200/60 text-indigo-700">
                          {project.category}
                        </Badge>
                        {project.popular && (
                          <Badge variant="outline" className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 border-indigo-300">
                            热门
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 mb-5">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-indigo-100 dark:border-slate-800 mt-auto transition-colors">
                    <span className="group-hover:translate-x-1 transition-transform duration-200 flex items-center gap-1">
                      {t("try_now") || "立即体验"} →
                    </span>
                  </div>
                </Link>
              )
            })}
          </Suspense>
        </div>
      </div>
    </section>
  )
})

ProjectsShowcase.displayName = 'ProjectsShowcase'

export { ProjectsShowcase }