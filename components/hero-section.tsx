import { memo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles, Wand2, Workflow, Cpu, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const HeroSection = memo(({ t }: { t: (key: string) => string }) => {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-28 px-4 sm:px-6 bg-[#f8f9ff] dark:bg-[#181d33]">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Tag Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/80 text-indigo-700 text-xs sm:text-sm font-medium shadow-sm">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>{t('hero.introduce') || 'FlowKit 实用工具与自动化框架'}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#1e2540] dark:text-white leading-[1.15]">
            {t("hero_title") || "打造高效极简的数字应用与工作流"}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {t("hero_description") || "专注于图像处理、数据清洗、多媒体加工与自动化工作流，赋能现代化高效办公与创作。"}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2">
            <Button
              size="lg"
              asChild
              className="rounded-xl px-7 py-3 text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 transition-all w-full sm:w-auto"
            >
              <Link href="#projects">
                {t("hero_try_demo") || "立即体验应用集"} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-xl px-7 py-3 text-sm font-medium border-indigo-200/80 bg-white text-indigo-700 hover:bg-indigo-50 transition-all w-full sm:w-auto"
            >
              <Link href="/about">{t("hero_learn_more") || "了解更多"}</Link>
            </Button>
          </div>
        </div>

        {/* Desktop-style Showcase Preview Cards */}
        <div className="mt-16 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group relative flex flex-col justify-between rounded-xl border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-slate-900 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-indigo-400 transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#1e2540] dark:text-white group-hover:text-indigo-600 transition-colors">
                  智能图像与多媒体
                </h3>
                <Badge variant="outline" className="text-[11px] mt-1 bg-indigo-50/60 border-indigo-200/60 text-indigo-700 font-normal">
                  独立应用
                </Badge>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              支持智能裁剪、Logo提取、视频分割与格式转换，高效率处理各类多媒体素材。
            </p>
          </div>

          <div className="group relative flex flex-col justify-between rounded-xl border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-slate-900 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-indigo-400 transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <Workflow className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#1e2540] dark:text-white group-hover:text-indigo-600 transition-colors">
                  自动化工作流
                </h3>
                <Badge variant="outline" className="text-[11px] mt-1 bg-indigo-50/60 border-indigo-200/60 text-indigo-700 font-normal">
                  可视化节点
                </Badge>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              自由编排多工具处理链路，一键执行多阶段批量任务，大幅释放生产力。
            </p>
          </div>

          <div className="group relative flex flex-col justify-between rounded-xl border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-slate-900 p-6 shadow-sm hover:-translate-y-1 hover:shadow-md hover:border-indigo-400 transition-all duration-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-base text-[#1e2540] dark:text-white group-hover:text-indigo-600 transition-colors">
                  跨平台多端可用
                </h3>
                <Badge variant="outline" className="text-[11px] mt-1 bg-indigo-50/60 border-indigo-200/60 text-indigo-700 font-normal">
                  Web & Desktop
                </Badge>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              支持网页端在线访问与桌面客户端快速调用，零门槛开箱即用。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
})

HeroSection.displayName = 'HeroSection'

export { HeroSection }
