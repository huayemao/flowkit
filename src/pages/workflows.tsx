import { useAppStore } from "@/store/app-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WorkflowsPage() {
  const { workflows } = useAppStore();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">工作流</h1>
        <Button onClick={() => navigate("/workflow/new")}>
          <Plus className="mr-2 h-4 w-4" />
          新建工作流
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/workflow/${workflow.id}`)}
          >
            <CardHeader>
              <CardTitle>{workflow.name}</CardTitle>
              <CardDescription>{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                工具数量: {workflow.tools.length}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
