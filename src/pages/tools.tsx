import { defaultTools, useAppStore } from "@/store/app-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function ToolsPage() {
  const { customTools } = useAppStore();
  const navigate = useNavigate();

  const allTools = [...defaultTools, ...customTools];

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">工具</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allTools.map((tool) => (
          <Card
            key={tool.id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/tools" + tool.path)}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{tool.name}</CardTitle>
                <Badge
                  variant={tool.type === "component" ? "default" : "secondary"}
                >
                  {tool.type === "component" ? "组件" : "Web 应用"}
                </Badge>
              </div>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground">
                {tool.type === "web-app" && tool.url && (
                  <a
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {tool.url}
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
