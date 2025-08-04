import { MonetizationFlow } from "@/components/MonetizationFlow";
import { AuthGate } from "@/components/AuthGate";

const Revenue = () => {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Revenue Streams</h1>
            <p className="text-muted-foreground">
              Track and optimize your revenue streams to reach your financial goals.
            </p>
          </div>
          
          <MonetizationFlow />
        </div>
      </div>
    </AuthGate>
  );
};

export default Revenue;