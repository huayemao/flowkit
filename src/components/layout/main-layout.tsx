import { ThemeToggle } from "../ui/theme-toggle"
import { SidebarNav } from "../ui/sidebar-nav"
import { Settings, Workflow } from "lucide-react"
import { useAppStore } from "../../store/app-store"
import { useNavigate } from "react-router-dom"

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { workflows, currentWorkflow, setCurrentWorkflow } = useAppStore()
  const navigate = useNavigate()

  const sidebarNavItems = [
    ...workflows.map((workflow) => ({
      title: workflow.name,
      href: `/workflow/${workflow.id}`,
      icon: <Workflow className="h-4 w-4" />,
      onClick: () => {
        setCurrentWorkflow(workflow)
        navigate(`/workflow/${workflow.id}`)
      }
    })),
    {
      title: "设置",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
    }
  ]

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
            <div className="container flex h-14 items-center justify-between">
              {currentWorkflow && (
                <h1 className="text-lg font-semibold">{currentWorkflow.name}</h1>
              )}
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