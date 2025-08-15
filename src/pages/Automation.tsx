import { AutomationChecklist } from "@/components/AutomationChecklist";
import { AIAgentWorkflow } from "@/components/AIAgentWorkflow";
import { DashboardHeader } from "@/components/DashboardHeader";
import { AuthGate } from "@/components/AuthGate";

const Automation = () => {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Automation Center</h1>
            <p className="text-muted-foreground">
              Streamline your workflow with these essential automation tools and integrations.
            </p>
          </div>
          
          <AIAgentWorkflow />
          <AutomationChecklist />
        </div>
      </div>
    </AuthGate>
  );
};

export default Automation;