import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  Workflow,
  WorkflowIcon,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavWorkflows } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppStore } from "@/store/app-store";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "flowkit",
        logo: WorkflowIcon,
        plan: "Enterprise",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "工作流",
        url: "/workflows",
        icon: Workflow,
      },
      {
        title: "工具",
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
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavWorkflows workflows={data.workflows} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
