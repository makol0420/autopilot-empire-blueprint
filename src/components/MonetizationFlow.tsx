import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { DollarSign, TrendingUp, Users, Zap, ArrowRight } from "lucide-react";

interface Revenue {
  source: string;
  amount: number;
  percentage: number;
  growth: number;
}

const initialRevenueStreams: Revenue[] = [
  { source: "Digital Templates", amount: 1200, percentage: 35, growth: 23 },
  { source: "Mini Courses", amount: 800, percentage: 25, growth: 45 },
  { source: "Consulting Calls", amount: 600, percentage: 20, growth: 12 },
  { source: "Affiliate Revenue", amount: 400, percentage: 12, growth: 67 },
  { source: "Email Products", amount: 300, percentage: 8, growth: 89 }
];

export function MonetizationFlow() {
  const [streams, setStreams] = useState<Revenue[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("revenueStreams");
    if (stored) {
      setStreams(JSON.parse(stored));
    } else {
      setStreams(initialRevenueStreams);
    }
  }, []);

  const saveStreams = (updated: Revenue[]) => {
    setStreams(updated);
    localStorage.setItem("revenueStreams", JSON.stringify(updated));
  };

  const handleGrowth = () => {
    const updated = streams.map((stream) => {
      const growthRate = Math.random() * (stream.growth / 100); // simulate dynamic growth
      const added = Math.round(stream.amount * growthRate);
      return {
        ...stream,
        amount: stream.amount + added
      };
    });

    // Recalculate new percentages
    const total = updated.reduce((sum, s) => sum + s.amount, 0);
    const withPercentages = updated.map((s) => ({
      ...s,
      percentage: Math.round((s.amount / total) * 100)
    }));

    saveStreams(withPercentages);
  };

  const totalRevenue = streams.reduce((sum, stream) => sum + stream.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Streams
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center p-4 bg-gradient-to-r from-success/10 to-success/5 rounded-lg">
            <p className="text-sm text-muted-foreground">Total Monthly Revenue</p>
            <p className="text-3xl font-bold text-success">${totalRevenue.toLocaleString()}</p>
          </div>

          {streams.map((stream) => (
            <div key={stream.source} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{stream.source}</span>
                <div className="text-right">
                  <p className="text-sm font-semibold">${stream.amount}</p>
                  <p className="text-xs text-success">+{stream.growth}%</p>
                </div>
              </div>
              <Progress value={stream.percentage} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Growth Loop
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                1
              </div>
              <div>
                <p className="font-medium">AI Content Creation</p>
                <p className="text-xs text-muted-foreground">Generate viral content daily</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-warning/10 rounded-lg">
              <div className="w-8 h-8 bg-warning rounded-full flex items-center justify-center text-warning-foreground text-sm font-bold">
                2
              </div>
              <div>
                <p className="font-medium">Audience Growth</p>
                <p className="text-xs text-muted-foreground">Convert views to followers</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-success/10 rounded-lg">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center text-success-foreground text-sm font-bold">
                3
              </div>
              <div>
                <p className="font-medium">Email Capture</p>
                <p className="text-xs text-muted-foreground">Convert followers to subscribers</p>
              </div>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-destructive/10 rounded-lg">
              <div className="w-8 h-8 bg-destructive rounded-full flex items-center justify-center text-destructive-foreground text-sm font-bold">
                4
              </div>
              <div>
                <p className="font-medium">Product Sales</p>
                <p className="text-xs text-muted-foreground">Automated email sequences</p>
              </div>
            </div>
          </div>

          <Button variant="hero" className="w-full" onClick={handleGrowth}>
            <Zap className="h-4 w-4 mr-2" />
            Activate Growth Loop
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
