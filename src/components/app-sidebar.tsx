import * as React from "react";
import { useTranslation } from "@/i18n";
import { USER_INFO } from "@/constants/user-info";
import {
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  Workflow,
  WorkflowIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavWorkflows } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { AppInfoSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/app-store";
import { APP_VERSION_DISPLAY } from "@/constants/version";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation();
  const { workflows, currentWorkflow, setCurrentWorkflow, currentTool } =
    useAppStore();

  const sidebarNavItems = [
    ...workflows.map((workflow) => ({
      name: workflow.name,
      url: `/workflow/${workflow.id}`,
      icon: Frame,
      onClick: () => {
        setCurrentWorkflow(workflow);
        navigate(`/workflow/${workflow.id}`);
      },
    })),
  ];

  // This is sample data.
  const data = {
    user: USER_INFO,
    teams: [
      // {
      //   name: "flowkit",
      //   logo: WorkflowIcon,
      //   plan: "Enterprise",
      // },
      // {
      //   name: "Evil Corp.",
      //   logo: Command,
      //   plan: "Free",
      // },
    ],
    navMain: [
      {
        title: t("navigation.workflows"),
        url: "/workflows",
        icon: Workflow,
      },
      {
        title: t("navigation.tools"),
        url: "/tools",
        icon: Command,
      },
    ],
    workflows: sidebarNavItems,
  };

  const navigate = useNavigate();
  const location = useLocation();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppInfoSwitcher
          teams={data.teams}
          appName="flowkit"
          appVersion={APP_VERSION_DISPLAY}
          updateUrl="https://github.com/huayemao/flowkit/releases"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavWorkflows workflows={data.workflows} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => navigate("/settings")}
              className={location.pathname === "/settings" ? "bg-accent" : ""}
            >
              <Settings2 className="h-4 w-4" />
              <span>{t("navigation.settings")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      {/* <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter> */}
      <SidebarRail />
    </Sidebar>
  );
}
