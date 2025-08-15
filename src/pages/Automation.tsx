import { UnifiedContentHub } from "@/components/UnifiedContentHub";
import { AuthGate } from "@/components/AuthGate";

const Automation = () => {
  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Content & Automation Hub</h1>
            <p className="text-muted-foreground">
              Complete automated workflow from content creation to viral social media distribution.
            </p>
          </div>
          
          <UnifiedContentHub />
        </div>
      </div>
    </AuthGate>
  );
};

export default Automation;