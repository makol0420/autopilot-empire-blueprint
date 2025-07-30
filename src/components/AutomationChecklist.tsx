import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Settings, ExternalLink, CheckCircle } from "lucide-react";
import { useAutomationTasks } from "@/hooks/useAutomationTasks";

interface AutomationTask {
  id: string;
  title: string;
  description: string;
  tool: string;
  difficulty: "Easy" | "Medium" | "Hard";
  timeToSetup: string;
  url?: string;
  completed: boolean;
}

const automationTasks: AutomationTask[] = [
  {
    id: "zapier-content",
    title: "Content Auto-Publishing",
    description: "Auto-post to Twitter, LinkedIn, and Facebook when you publish new content",
    tool: "Zapier",
    difficulty: "Easy",
    timeToSetup: "15 mins",
    url: "https://zapier.com/apps/twitter/integrations",
    completed: false
  },
  {
    id: "email-automation",
    title: "Email Welcome Series",
    description: "Automatically send welcome emails and product sequences to new subscribers",
    tool: "ConvertKit",
    difficulty: "Medium",
    timeToSetup: "1 hour",
    url: "https://convertkit.com/automations",
    completed: false
  },
  {
    id: "lead-magnets",
    title: "Lead Magnet Delivery",
    description: "Instantly deliver free resources when someone joins your email list",
    tool: "Typeform + Zapier",
    difficulty: "Easy",
    timeToSetup: "30 mins",
    url: "https://typeform.com",
    completed: false
  },
  {
    id: "social-scheduling",
    title: "Social Media Scheduling",
    description: "Schedule posts across all platforms for the next 30 days",
    tool: "Buffer",
    difficulty: "Easy",
    timeToSetup: "20 mins",
    url: "https://buffer.com",
    completed: false
  },
  {
    id: "sales-tracking",
    title: "Revenue Tracking",
    description: "Automatically track sales and update your dashboard",
    tool: "Google Sheets + Zapier",
    difficulty: "Medium",
    timeToSetup: "45 mins",
    url: "https://zapier.com/apps/google-sheets/integrations",
    completed: false
  },
  {
    id: "customer-onboarding",
    title: "Customer Onboarding",
    description: "Send product access and onboarding materials after purchase",
    tool: "Gumroad + ConvertKit",
    difficulty: "Medium",
    timeToSetup: "1 hour",
    url: "https://gumroad.com",
    completed: false
  }
];

export function AutomationChecklist() {
  const { toggleTask, isTaskCompleted, completedCount } = useAutomationTasks();
  const completionPercentage = Math.round((completedCount / automationTasks.length) * 100);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "success";
      case "Medium": return "warning";
      case "Hard": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Automation Setup Checklist
        </CardTitle>
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
            {completedCount} of {automationTasks.length} automations complete
          </p>
          <Badge variant="success" className="text-xs">
            {completionPercentage}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {automationTasks.map((task) => {
          const completed = isTaskCompleted(task.id);
          return (
          <Card key={task.id} className="p-4">
            <div className="flex items-start gap-3">
              <Checkbox
                checked={completed}
                onCheckedChange={() => toggleTask(task.id)}
                className="mt-1"
              />
              
              <div className="flex-1 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className={`font-medium ${completed ? 'line-through text-muted-foreground' : ''}`}>
                      {task.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {task.description}
                    </p>
                  </div>
                  {completed && (
                    <CheckCircle className="h-5 w-5 text-success" />
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs">
                    {task.tool}
                  </Badge>
                  <Badge variant={getDifficultyColor(task.difficulty) as any} className="text-xs">
                    {task.difficulty}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {task.timeToSetup}
                  </Badge>
                </div>
                
                {task.url && !completed && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={task.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Setup Now
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Card>
          );
        })}
        
        {completionPercentage === 100 && (
          <Card className="p-4 bg-success/10 border-success/20">
            <div className="text-center space-y-2">
              <CheckCircle className="h-8 w-8 text-success mx-auto" />
              <h3 className="font-semibold text-success">All Automations Complete!</h3>
              <p className="text-sm text-muted-foreground">
                Your empire is now running on autopilot. Time to scale!
              </p>
            </div>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}