
import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  teacherOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children,
  teacherOnly = false
}) => {
  const { user, profile, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("ProtectedRoute: checking auth state", { user: !!user, isLoading });
    
    // Add a slight delay to allow auth state to stabilize
    const timer = setTimeout(() => {
      if (!isLoading && !user) {
        console.log("ProtectedRoute: redirecting to login");
        navigate('/login', { replace: true });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [user, isLoading, navigate]);

  // Show loading state while auth is being determined
  if (isLoading) {
    console.log("ProtectedRoute: showing loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg">Loading your account...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, render children
  // even if profile data is missing (app should be usable without profile)
  if (user) {
    // Only enforce teacher-only check if we have a profile
    if (teacherOnly && profile && profile.role !== "teacher") {
      console.log("ProtectedRoute: user is not a teacher, redirecting to dashboard");
      return <Navigate to="/dashboard" replace />;
    }

    console.log("ProtectedRoute: rendering protected content");
    return <>{children}</>;
  }

  // Show intermediate state while navigation is occurring
  console.log("ProtectedRoute: no user, showing transitional state");
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Redirecting to login...</p>
      </div>
    </div>
  );
};

export default ProtectedRoute;
