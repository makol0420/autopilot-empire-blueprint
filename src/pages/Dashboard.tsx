import { DashboardHeader } from "@/components/DashboardHeader";
import { StepByStepRoadmap } from "@/components/StepByStepRoadmap";
import { MonetizationFlow } from "@/components/MonetizationFlow";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Calendar } from "lucide-react";

const Dashboard = () => {
  // Calculate days remaining (90 days from now)
  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
  const daysRemaining = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-6 space-y-6">
      <DashboardHeader 
        currentRevenue={0}
        targetRevenue={5000}
        daysRemaining={daysRemaining}
      />
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12%</div>
            <p className="text-xs text-muted-foreground">+2% from last week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 completed today</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{daysRemaining}</div>
            <p className="text-xs text-muted-foreground">Until target deadline</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <StepByStepRoadmap />
        </div>
        
        <div className="space-y-6">
          <MonetizationFlow />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;