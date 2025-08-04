import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/components/AuthProvider";
import { AuthGate } from "@/components/AuthGate";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Profile = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useProfile();
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    target_revenue: profile?.target_revenue || 5000,
  });

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: formData.display_name,
          target_revenue: formData.target_revenue,
          email: user.email,
        });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <AuthGate>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-muted-foreground">Loading profile...</div>
        </div>
      </AuthGate>
    );
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-8 max-w-2xl">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and revenue goals.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>
                Update your personal information and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email cannot be changed from this interface.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display_name">Display Name</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, display_name: e.target.value }))}
                    placeholder="Enter your display name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_revenue">Target Revenue ($)</Label>
                  <Input
                    id="target_revenue"
                    type="number"
                    value={formData.target_revenue}
                    onChange={(e) => setFormData(prev => ({ ...prev, target_revenue: Number(e.target.value) }))}
                    placeholder="5000"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={updating}>
                    {updating ? "Updating..." : "Update Profile"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => signOut()}
                  >
                    Sign Out
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Progress</CardTitle>
              <CardDescription>
                Your current progress towards your revenue goal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current Revenue</span>
                  <span>${profile?.current_revenue || 0}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Target Revenue</span>
                  <span>${profile?.target_revenue || 5000}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        ((profile?.current_revenue || 0) / (profile?.target_revenue || 5000)) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round(((profile?.current_revenue || 0) / (profile?.target_revenue || 5000)) * 100)}% of your goal achieved
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGate>
  );
};

export default Profile;