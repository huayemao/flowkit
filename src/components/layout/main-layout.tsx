import { ThemeToggle } from "../ui/theme-toggle";
import { SidebarNav } from "../ui/sidebar-nav";
import { Settings, Workflow, ChevronDown } from "lucide-react";
import { useAppStore, defaultTools } from "../../store/app-store";
import {
  useLocation,
  Link
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import { cn } from "../../lib/utils";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../app-sidebar";
import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { currentWorkflow, currentTool, setCurrentTool } = useAppStore();
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {location.pathname.startsWith('/workflow') && currentWorkflow && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to={`/workflow/${currentWorkflow.id}`}>
                          {currentWorkflow.name}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <NavigationMenu>
                        <NavigationMenuList>
                          <NavigationMenuItem>
                            <NavigationMenuTrigger className="h-7 px-2 py-1">
                              {currentTool?.name || t("messages.selectATool")}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              <ul className="grid w-[200px] gap-1 p-2">
                                {currentWorkflow.tools.map((tool) => (
                                  <li key={tool.id}>
                                    <NavigationMenuLink
                                      className={cn(
                                        "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                        currentTool?.id === tool.id
                                          ? "bg-accent text-accent-foreground"
                                          : ""
                                      )}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentTool(tool);
                                      }}
                                    >
                                      {tool.name}
                                    </NavigationMenuLink>
                                  </li>
                                ))}
                              </ul>
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        </NavigationMenuList>
                      </NavigationMenu>
                    </BreadcrumbItem>
                  </>
                )}
                {location.pathname.startsWith('/tools') && (
                  <>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link to="/tools">{t("breadcrumb.tools")}</Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    {location.pathname !== '/tools' && (
                      <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          <BreadcrumbPage>
                            {(() => {
                              const toolId = location.pathname.split('/').pop();
                              const tool = defaultTools.find(t => t.id === toolId);
                              return tool ? t(tool.name) : '';
                            })()}
                          </BreadcrumbPage>
                        </BreadcrumbItem>
                      </>
                    )}
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-6">
          <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <main className="relative h-[calc(100vh-6rem)]  flex flex-col overflow-hidden px-6">
            {children}
          </main>
          <div className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
        </div>
      </SidebarInset>
    </SidebarProvider>

  );
}
