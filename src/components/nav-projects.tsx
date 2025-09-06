import {
  Edit,
  Folder,
  Forward,
  MoreHorizontal,
  Trash2,
  WorkflowIcon,
  type LucideIcon,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link, useNavigate } from "react-router-dom";

export function NavWorkflows({
  workflows: workflows,
}: {
  workflows: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t('navigation.workflows')}</SidebarGroupLabel>
      <SidebarMenu>
        {workflows.map((workflow) => (
          <SidebarMenuItem key={workflow.url}>
            <SidebarMenuButton asChild>
              <Link to={workflow.url}>
                {workflow.icon && <workflow.icon />}
                <span>{workflow.name}</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-8 w-8 rounded-md p-0 hover:bg-accent hover:text-accent-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 rounded-lg"  
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}>
                  <DropdownMenuItem onClick={() => navigate(`${workflow.url}/edit`)}>
                    <Edit className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>编辑工作流</span>
                  </DropdownMenuItem>
                  {/* <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>删除工作流</span>
                  </DropdownMenuItem> */}
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
