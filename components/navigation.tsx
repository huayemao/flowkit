'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState, memo } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { useTranslation } from 'react-i18next'
import LocaleSwitch from './locale-switch'

// 优化的导航组件
const Navigation = memo(() => {
  const { t } = useTranslation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border/80">
      <nav
        className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8"
        role="navigation"
        aria-label="主导航"
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center font-bold text-lg shadow-sm transition-transform group-hover:scale-105">
              ⚡
            </div>
            <span className="font-bold text-xl tracking-tight text-[#1e2540] dark:text-white">FlowKit</span>
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link 
            href="/projects" 
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50/60 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
          >
            {t('nav_projects') || '应用集'}
          </Link>
          <Link 
            href="/blog" 
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50/60 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
          >
            {t('nav_blog') || '博客'}
          </Link>
          <Link 
            href="/about" 
            className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50/60 px-3.5 py-2 rounded-lg text-sm font-medium transition-all"
          >
            {t('nav_about') || '关于'}
          </Link>
          <div className="flex items-center space-x-3 border-l border-indigo-100 dark:border-slate-800 pl-4 ml-2">
            <ThemeToggle />
            <LocaleSwitch />
            <Button size="sm" className="rounded-xl font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all" asChild>
              <Link href="/projects">{t('nav_get_started') || '立即体验'}</Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <ThemeToggle />
          <LocaleSwitch />
          <button 
            className="p-2 rounded-lg border border-border/80 bg-card text-card-foreground hover:bg-muted transition-colors" 
            onClick={toggleMenu} 
            aria-label="切换菜单"
            suppressHydrationWarning
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/80 md:hidden z-50 shadow-lg">
            <div className="px-6 py-6 space-y-4 flex flex-col items-stretch">
              <Link
                href="/projects"
                className="px-4 py-2.5 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav_projects') || '应用集'}
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2.5 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav_blog') || '博客'}
              </Link>
              <Link
                href="/about"
                className="px-4 py-2.5 rounded-lg text-base font-medium hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('nav_about') || '关于'}
              </Link>
              <div className="pt-4 border-t border-border/80">
                <Button size="lg" className="w-full rounded-xl font-medium" asChild>
                  <Link href="/projects" onClick={() => setIsMenuOpen(false)}>
                    {t('nav_get_started') || '立即体验'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
})

Navigation.displayName = 'Navigation'

export { Navigation }
