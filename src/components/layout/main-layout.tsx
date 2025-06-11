import { ThemeToggle } from "../ui/theme-toggle"
import { SidebarNav } from "../ui/sidebar-nav"
import { Home, Settings, Wrench } from "lucide-react"

const sidebarNavItems = [
  {
    title: "首页",
    href: "/",
    icon: <Home className="h-4 w-4" />,
  },
  {
    title: "工具",
    href: "/tools",
    icon: <Wrench className="h-4 w-4" />,
  },
  {
    title: "设置",
    href: "/settings",
    icon: <Settings className="h-4 w-4" />,
  },
]

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* 侧边栏 */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">WToolkit</h2>
          </div>
          <SidebarNav items={sidebarNavItems} className="mt-4" />
        </aside>

        {/* 主内容区 */}
        <div className="flex-1 pl-64">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-end">
              <nav className="flex items-center">
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="container py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 