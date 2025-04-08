
import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SocialAuthProps {
  onSuccess?: () => void;
}

const SocialAuth: React.FC<SocialAuthProps> = ({ onSuccess }) => {
  const handleSocialLogin = (provider: string) => {
    // Simulate social login
    console.log(`Logging in with ${provider}`);
    
    // Call success callback after "successful" social login
    if (onSuccess) {
      setTimeout(() => {
        onSuccess();
      }, 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <Separator className="flex-1" />
        <span className="px-3 text-xs text-muted-foreground">OR</span>
        <Separator className="flex-1" />
      </div>

      <div className="grid grid-cols-1 gap-2">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 hover:bg-accent transition-all"
          onClick={() => handleSocialLogin('Google')}
        >
          <img src="/google.svg" alt="Google" className="w-4 h-4" />
          <span>Continue with Google</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialAuth;
