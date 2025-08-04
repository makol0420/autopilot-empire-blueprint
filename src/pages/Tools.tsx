import { AIToolkit } from "@/components/AIToolkit";
import { AutomationChecklist } from "@/components/AutomationChecklist";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Bot, Zap } from "lucide-react";

const Tools = () => {
  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">AI Tools & Automation</h1>
        <p className="text-muted-foreground">
          Supercharge your productivity with AI-powered tools and automated workflows
        </p>
      </div>

      {/* Tools Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Tools Active</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">ChatGPT, Claude, Buffer, Zapier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Automations</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Running workflows</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Generated</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-xs text-muted-foreground">Pieces this month</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tools */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AIToolkit />
        </div>
        
        <div className="space-y-6">
          <AutomationChecklist />
        </div>
      </div>
    </div>
  );
};

export default Tools;