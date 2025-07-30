import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface DashboardHeaderProps {
  currentRevenue: number;
  targetRevenue: number;
  daysRemaining: number;
}

export function DashboardHeader({ currentRevenue, targetRevenue, daysRemaining }: DashboardHeaderProps) {
  const progressPercentage = Math.min((currentRevenue / targetRevenue) * 100, 100);
  
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Digital Empire Blueprint
        </h1>
        <p className="text-muted-foreground text-lg">
          Your $0 to $5000/month automation system
        </p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-card to-muted/20 border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Current Revenue</p>
            <p className="text-2xl font-bold text-success">
              ${currentRevenue.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Target Revenue</p>
            <p className="text-2xl font-bold">
              ${targetRevenue.toLocaleString()}
            </p>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Days Remaining</p>
            <p className="text-2xl font-bold text-warning">
              {daysRemaining}
            </p>
          </div>
        </div>
        
        <div className="mt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress to Goal</span>
            <span>{progressPercentage.toFixed(1)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3" />
        </div>
      </Card>
    </div>
  );
}