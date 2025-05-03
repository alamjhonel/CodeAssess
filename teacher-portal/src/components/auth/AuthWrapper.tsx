
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import CodeGradeLogo from "../brand/CodeGradeLogo";
import { toast } from "sonner";

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    console.log("AuthWrapper: checking auth state", { user: !!user, isLoading });
    
    // Only check when loading is complete
    if (!isLoading) {
      if (!user) {
        console.log("AuthWrapper: no user found, redirecting to login");
        setIsRedirecting(true);
        
        // Add a small delay before redirect to avoid flickering
        const timer = setTimeout(() => {
          navigate('/login', { replace: true });
          toast.error("Please log in to access this page");
        }, 300);
        
        return () => clearTimeout(timer);
      } else {
        console.log("AuthWrapper: user authenticated");
        // Ensure we're not in redirecting state when we have a user
        setIsRedirecting(false);
      }
    }
  }, [isLoading, user, navigate]);

  // Show loading state while auth is being determined
  if (isLoading) {
    console.log("AuthWrapper: showing loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <CodeGradeLogo size="lg" />
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading your account...</p>
        </div>
      </div>
    );
  }

  // Show redirecting state
  if (isRedirecting) {
    console.log("AuthWrapper: showing redirecting state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <CodeGradeLogo size="lg" />
          <p className="text-lg">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  // If we have a user, render children
  if (user) {
    console.log("AuthWrapper: user is authenticated, rendering children");
    return <>{children}</>;
  }

  // Fallback loading state (should rarely be seen)
  console.log("AuthWrapper: fallback loading state");
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <CodeGradeLogo size="lg" />
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Checking authentication...</p>
      </div>
    </div>
  );
}

export default AuthWrapper;
