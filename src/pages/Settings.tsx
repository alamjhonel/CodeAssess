
import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth";
import MainLayout from "@/components/layout/MainLayout";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, profile, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  useEffect(() => {
    // Show a welcome message when the settings page loads
    if (profile && profile.first_name) {
      toast.success(`Welcome back, ${profile.first_name}!`);
    }
  }, [profile]);

  const handleSignOut = async () => {
    try {
      setSignOutLoading(true);
      await signOut();
      toast.success("Successfully logged out");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Error signing out. Please try again.");
    } finally {
      setSignOutLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <Button 
            variant="destructive" 
            onClick={handleSignOut} 
            className="flex items-center gap-2"
            disabled={signOutLoading}
          >
            {signOutLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Logging Out...
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                Log Out
              </>
            )}
          </Button>
        </div>
        
        {user && profile ? (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">User ID:</p>
                    <p className="text-foreground">{user.id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">Email:</p>
                    <p className="text-foreground">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">First Name:</p>
                    <p className="text-foreground">{profile.first_name || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">Last Name:</p>
                    <p className="text-foreground">{profile.last_name || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">Role:</p>
                    <p className="text-foreground capitalize">{profile.role || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">TUP ID:</p>
                    <p className="text-foreground">{profile.tup_id || "Not set"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">Birthdate:</p>
                    <p className="text-foreground">
                      {profile.birthdate ? format(new Date(profile.birthdate), 'MMMM d, yyyy') : 'Not set'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-muted-foreground text-sm">Account Created:</p>
                    <p className="text-foreground">
                      {profile.created_at ? format(new Date(profile.created_at), 'MMMM d, yyyy') : 'Unknown'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Change your password or update account security settings</p>
                    <Button variant="outline" disabled>Change Password</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-sm">Customize your application experience</p>
                    <Button variant="outline" disabled>Edit Preferences</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex justify-center items-center h-60">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground">Loading your account information...</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Settings;
