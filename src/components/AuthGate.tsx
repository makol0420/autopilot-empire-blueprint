import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Loader2, LogIn, LogOut, DollarSign, Target, Calendar } from "lucide-react";

interface AuthGateProps {
  children: React.ReactNode;
}

export const AuthGate = ({ children }: AuthGateProps) => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your empire...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Digital Empire Blueprint
            </CardTitle>
            <p className="text-xl text-muted-foreground">
              Your $0 to $5000/month automation system
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-semibold">$5K Monthly Goal</h3>
                <p className="text-sm text-muted-foreground">Automated revenue system</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-success/10 to-success/5 rounded-lg">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-success" />
                <h3 className="font-semibold">90-Day Timeline</h3>
                <p className="text-sm text-muted-foreground">Step-by-step roadmap</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-warning/10 to-warning/5 rounded-lg">
                <Target className="h-8 w-8 mx-auto mb-2 text-warning" />
                <h3 className="font-semibold">Zero Investment</h3>
                <p className="text-sm text-muted-foreground">Free tools & AI only</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-center">What You'll Get:</h3>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">AI Content Toolkit</Badge>
                <Badge variant="outline">90-Day Roadmap</Badge>
                <Badge variant="outline">Automation Checklist</Badge>
                <Badge variant="outline">Revenue Tracking</Badge>
                <Badge variant="outline">Growth Loops</Badge>
                <Badge variant="outline">Progress Dashboard</Badge>
              </div>
            </div>

            <div className="text-center space-y-4">
              <Button 
                variant="hero" 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="w-full"
              >
                <LogIn className="h-5 w-5 mr-2" />
                Start Your Digital Empire
              </Button>
              <p className="text-xs text-muted-foreground">
                Free to start • No credit card required
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 z-50">
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
      {children}
    </div>
  );
};