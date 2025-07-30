import { DashboardHeader } from "@/components/DashboardHeader";
import { StepByStepRoadmap } from "@/components/StepByStepRoadmap";
import { MonetizationFlow } from "@/components/MonetizationFlow";
import { AIToolkit } from "@/components/AIToolkit";
import { AutomationChecklist } from "@/components/AutomationChecklist";
import { AuthGate } from "@/components/AuthGate";

const Index = () => {
  // Calculate days remaining (90 days from now)
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <DashboardHeader 
            currentRevenue={0}
            targetRevenue={5000}
            daysRemaining={daysRemaining}
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-8">
              <StepByStepRoadmap />
              <AIToolkit />
            </div>
            
            <div className="space-y-8">
              <MonetizationFlow />
              <AutomationChecklist />
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
};

export default Index;
