
import { useAuth } from "@/contexts/auth";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useUser() {
  const { user, isLoading: authLoading, signOut, profile } = useAuth();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  // Force check session state on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        setIsLoggedOut(true);
      }
    };
    
    checkSession();
  }, []);
  
  const logout = async () => {
    try {
      console.log("Starting logout process...");
      
      // First attempt to use the context's signOut
      await signOut();
      setIsLoggedOut(true);
      
      // Force clear all auth data to ensure clean logout
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.removeItem('supabase.auth.token');
      localStorage.removeItem('sb-btptsqprylnktkceyuad-auth-token');
      sessionStorage.removeItem('sb-btptsqprylnktkceyuad-auth-token');
      
      // Force direct logout through Supabase as backup
      await supabase.auth.signOut();
      
      // Hard redirect to login to ensure a clean state
      console.log("Redirecting to login page...");
      window.location.href = '/login';
    } catch (error) {
      console.error("Logout failed:", error);
      
      // Even if the above fails, attempt a hard reset
      try {
        // Force clear storage
        console.log("Attempting hard reset...");
        localStorage.clear();
        sessionStorage.clear();
        
        // Force direct logout through Supabase
        await supabase.auth.signOut();
        
        // Force reload to clear any state
        console.log("Hard redirecting to login...");
        window.location.replace('/login');
      } catch (e) {
        console.error("Failed to force logout:", e);
        // Last resort - just reload the page to the login URL
        window.location.replace('/login');
      }
    }
  };
  
  return {
    user,
    profile,
    isLoading: authLoading,
    isLoggedOut,
    logout
  };
}
