import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Github, Twitter, Mail, Share2, MessageSquare } from "lucide-react"
import { TFunction } from 'i18next'
import { ProjectMetadata } from '@/lib/projects/mdx';

export function Footer({ t, projects = [] }: { t: TFunction, projects?: ProjectMetadata[] }) {
  return (
    <footer className="bg-background border-t border-border/80 mt-20">
      <div className="container mx-auto px-4 sm:px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-4 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center font-bold text-lg shadow-sm">
                ⚡
              </div>
              <span className="font-bold text-xl tracking-tight">FlowKit</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">{t('footer.description')}</p>
            <div className="flex space-x-2 pt-2">
              <Link href="https://github.com/huayemao" className="p-2.5 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm" aria-label="GitHub">
                <Github size={18} strokeWidth={1.75} />
              </Link>
              <Link href="https://twitter.com/huayemao4t" className="p-2.5 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm" aria-label="Twitter">
                <Twitter size={18} strokeWidth={1.75} />
              </Link>
              <Link href="mailto:dev@huayemao.fun" className="p-2.5 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm" aria-label="Email">
                <Mail size={18} strokeWidth={1.75} />
              </Link>
              <Link href="https://www.xiaohongshu.com/user/profile/csu_huayemao" className="p-2.5 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm" aria-label="Xiaohongshu">
                <Share2 size={18} strokeWidth={1.75} />
              </Link>
              <Link href="#" className="p-2.5 rounded-xl border border-border/80 bg-card hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all shadow-sm" aria-label="WeChat">
                <MessageSquare size={18} strokeWidth={1.75} />
              </Link>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Twitter: huayemao4t</p>
              <p>Xiaohongshu: csu_huayemao</p>
              <p>WeChat: csu_huayemao</p>
            </div>
          </div>

          {/* Projects */}
          <div className="md:col-span-2 space-y-8">
            <h3 className="font-serif font-bold uppercase tracking-widest text-sm">{t('footer.popularProjects')}</h3>
            <nav className="space-y-4">
              {projects
                .filter(project => project.popular)
                .map(project => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block text-sm text-foreground hover:underline underline-offset-4 transition-all"
                  >
                    {project.name}
                  </Link>
                ))
              }
            </nav>
          </div>

          {/* Company */}
          <div className="md:col-span-2 space-y-8">
            <h3 className="font-serif font-bold uppercase tracking-widest text-sm">{t('footer.company')}</h3>
            <nav className="space-y-4">
              <Link
                href="/about"
                className="block text-sm text-foreground hover:underline underline-offset-4 transition-all"
              >
                {t('footer.aboutUs')}
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-foreground hover:underline underline-offset-4 transition-all"
              >
                {t('footer.contactUs')}
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-foreground hover:underline underline-offset-4 transition-all"
              >
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                href="/terms"
                className="block text-sm text-foreground hover:underline underline-offset-4 transition-all"
              >
                {t('footer.termsOfService')}
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-4 space-y-8">
            <h3 className="font-serif font-bold uppercase tracking-widest text-sm">{t('footer.newsletter')}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.newsletterDescription')}</p>
            <form className="space-y-4">
              <Input type="email" placeholder={t('footer.emailPlaceholder')} className="bg-transparent border-2 border-foreground" />
              <Button
                type="submit"
                className="w-full"
              >
                {t('footer.subscribe')}
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t-2 border-foreground mt-24 pt-12 text-center">
          <p className="text-sm font-mono uppercase tracking-widest">{t('footer.copyright', { year: new Date().getFullYear(), company: 'UTILITIES.ONLINE' })}</p>
        </div>
      </div>
    </footer>
  )
}
