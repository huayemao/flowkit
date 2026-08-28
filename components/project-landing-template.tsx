import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, ArrowRight, Shield, Zap, Users } from "lucide-react"
import Link from "next/link"
import { TFunction } from 'i18next'
import { BlogPost } from "@/lib/types/blog"
import RecentBlogPosts from "@/components/blog/recent-blog-posts"
import { Locale } from "@/lib/types"

interface ProjectConfig {
  name: string
  description: string
  longDescription: string
  features: string[]
  benefits: string[]
  useCases: string[]
  appUrl: string
  image?: string
}

interface ProjectLandingTemplateProps {
  project: ProjectConfig
  t: TFunction
  locale?: Locale
  blogPosts?: BlogPost[]
  children?: React.ReactNode
}

const FEATURE_ICONS = [Zap, Shield, Users, CheckCircle, ArrowRight, Zap]

export function ProjectLandingTemplate({ project, t, locale = 'zh', blogPosts = [], children }: ProjectLandingTemplateProps) {
  return (
    <div className="min-h-screen bg-[#f8f9ff] dark:bg-[#181d33]">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-indigo-50/40 via-transparent to-transparent">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge variant="outline" className="mb-4 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border-indigo-200/80 font-medium">
            {t('project.landing.free_online_project') || '在线免费工具'}
          </Badge>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 text-[#1e2540] dark:text-white">{project.name}</h1>
          <p className="text-lg sm:text-xl text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            {project.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" asChild className="rounded-xl text-base px-8 py-6 bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/20 font-semibold transition-all">
              <Link href={project.appUrl}>
                {t('project.landing.start_using')} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="rounded-xl text-base px-8 py-6 font-semibold border-indigo-200/80 bg-white text-indigo-700 hover:bg-indigo-50 transition-all">
              {t('project.landing.view_demo')}
            </Button>
          </div>

          {/* Stats */}
          <div className="flex justify-center">
            <div className="flex flex-col items-center">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 shadow-sm">
                <Users className="h-6 w-6" />
              </div>
              <div className="text-2xl font-bold text-[#1e2540] dark:text-white">10,000+</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{t('project.landing.users')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 space-y-2">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1e2540] dark:text-white">{t('project.landing.powerful_features')}</h2>
            <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">{project.longDescription}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {project.features.map((feature, index) => {
              const Icon = FEATURE_ICONS[index % FEATURE_ICONS.length]
              return (
                <Card
                  key={index}
                  className="group rounded-2xl border border-indigo-100 dark:border-indigo-950 bg-white dark:bg-slate-900 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-300"
                >
                  <CardHeader className="p-0">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-base font-semibold leading-snug text-[#1e2540] dark:text-white">{feature}</CardTitle>
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 [font-family:var(--font-playfair)]">{t('project.landing.why_choose_us')}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('project.landing.core_benefits')}</h3>
              <ul className="space-y-3">
                {project.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">{t('project.landing.use_cases')}</h3>
              <ul className="space-y-3">
                {project.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start">
                    <ArrowRight className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* MDX Content Section */}
      {children && (
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-5xl">
            {children}
          </div>
        </section>
      )}

      {/* Blog Articles Section */}
      {blogPosts.length > 0 && (
        <RecentBlogPosts locale={locale} posts={blogPosts} limit={5} t={t as unknown as (key: string) => string} />
      )}

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 [font-family:var(--font-playfair)]">{t('project.landing.get_started_now')}</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              {t('project.landing.free_no_registration')}
            </p>
            <Button size="lg" asChild className="text-lg px-8">
              <Link href={project.appUrl}>
                {t('project.landing.start_using')} {project.name} <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
