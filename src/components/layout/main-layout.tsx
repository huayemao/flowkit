import { ThemeToggle } from "../ui/theme-toggle"
import { SidebarNav } from "../ui/sidebar-nav"
import { Settings, Workflow } from "lucide-react"
import { useAppStore } from "../../store/app-store"
import { useLocation, useNavigate, useParams, useRoutes } from "react-router-dom"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu"
import { cn } from "../../lib/utils"

function WorkflowHeader() {
  const { currentWorkflow, currentTool, setCurrentTool } = useAppStore()

  if (!currentWorkflow) return null

  return (
    <NavigationMenu>
      <NavigationMenuList className="gap-2">
        {currentWorkflow.tools.map((tool) => (
          <NavigationMenuLink
            key={tool.id}
            className={cn(
              'px-4 py-2 rounded-md transition-colors',
              currentTool?.id === tool.id 
                ? 'bg-accent text-accent-foreground' 
                : 'hover:bg-accent/50'
            )}
            href={`/workflow/${currentWorkflow.id}/${tool.id}`}
            onClick={(e) => {
              e.preventDefault()
              setCurrentTool(tool)
            }}
          >
            {tool.name}
          </NavigationMenuLink>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { workflows, currentWorkflow, setCurrentWorkflow } = useAppStore()
  const navigate = useNavigate()
  const location = useLocation()

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
    <div className="h-screen overflow-hidden bg-background">
      <div className="flex h-full">
        {/* 侧边栏 */}
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-background">
          <div className="flex h-14 items-center border-b px-4">
            <h2 className="text-lg font-semibold">FlowKit</h2>
          </div>
          <SidebarNav items={sidebarNavItems} className="mt-4" />
        </aside>

        {/* 主内容区 */}
        <div className="flex-1 pl-64 h-full overflow-hidden">
          <header className="sticky top-0 z-50 w-full bg-background/20 backdrop-blur supports-[backdrop-filter]:bg-background/20">
            <div className="flex h-20 items-center justify-between px-6">
              {location.pathname.startsWith('/workflow') && <WorkflowHeader />}
              <nav className="flex items-center">
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="relative h-[calc(100vh-5rem)]  flex flex-col overflow-hidden px-6 pb-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 