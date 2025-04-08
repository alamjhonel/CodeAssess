
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthContext } from "./AuthContext";
import { AuthContextType } from "./types";
import { useAuthState } from "./useAuthState";
import { 
  signInWithCredentials, 
  signUpWithCredentials, 
  signOutUser, 
  signInWithOAuth, 
  fetchProfile 
} from "./services";
import { validateTupId, validateTupEmail, isEmail } from "./validation";
import { supabase } from "@/integrations/supabase/client";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { session, user, profile, isLoading, isInitialized, setProfile } = useAuthState();

  const signIn = async (identifier: string, password: string, birthdate?: Date) => {
    try {
      console.log("AuthProvider: Starting sign in process with:", identifier);
      
      // Determine if the identifier is an email or TUP ID
      const isIdentifierEmail = isEmail(identifier);
      
      // Validate TUP email format if it's an email
      if (isIdentifierEmail && !validateTupEmail(identifier)) {
        throw new Error("Only TUP email addresses (@tup.edu.ph) are allowed");
      }
      
      console.log(`Attempting login with ${isIdentifierEmail ? 'email' : 'TUP ID'}: ${identifier}`);

      // Skip strict validation for login to help users
      const isValidFormat = isIdentifierEmail ? true : validateTupId(identifier);
      
      if (!isValidFormat) {
        console.warn(`The format of ${isIdentifierEmail ? 'email' : 'TUP ID'} doesn't match our standards, but we'll try to log you in.`);
      }
      
      try {
        const authResult = await signInWithCredentials(identifier, password, birthdate);
        if (authResult) {
          console.log("AuthProvider: Sign in successful");
          toast.success("Signed in successfully");
          navigate("/dashboard");
        }
      } catch (error: any) {
        console.error("AuthProvider: Sign in error:", error);
        // Check if error message indicates authentication issues
        if (error.message && (
            error.message.includes("Invalid login credentials") || 
            error.message.includes("Email not confirmed"))) {
          throw new Error("Account not found. Please sign up first.");
        }
        throw error;
      }
    } catch (error: any) {
      console.error("AuthProvider: Overall sign in error:", error);
      toast.error(error.message || "Error signing in");
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    firstName: string,
    lastName: string,
    role: "teacher" | "student",
    tupId: string,
    birthdate?: Date
  ) => {
    try {
      console.log("AuthProvider: Starting sign up process");
      
      // Check for TUP email domain
      if (!validateTupEmail(email)) {
        throw new Error("Only TUP email addresses (@tup.edu.ph) are allowed");
      }
      
      // For sign up, we'll maintain the validation to ensure data quality
      if (!validateTupId(tupId)) {
        throw new Error("Invalid TUP ID format. Must be TUPM-YY-XXXX");
      }
      
      await signUpWithCredentials(email, password, firstName, lastName, role, tupId, birthdate || null);
      toast.success("Registration successful! Please check your email to confirm your account.");
    } catch (error: any) {
      console.error("AuthProvider: Sign up error:", error);
      toast.error(error.message || "Error signing up");
      throw error;
    }
  };

  const signOut = async () => {
    try {
      console.log("AuthProvider: Starting signout process");
      await signOutUser();
      toast.success("Signed out successfully");
      
      // Reset auth state
      setProfile(null);
      
      // Force a page reload to ensure all state is cleared
      console.log("AuthProvider: Redirecting to login page");
      window.location.href = '/login';
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast.error("Error signing out, forcing logout...");
      
      // Force logout even if there's an error with Supabase
      try {
        localStorage.clear(); // Clear any stored auth data
        sessionStorage.clear();
        await supabase.auth.signOut();
        window.location.href = '/login';
      } catch (e) {
        console.error("Failed to force logout:", e);
        window.location.replace('/login');
      }
    }
  };

  const signInWithGoogle = async () => {
    try {
      await signInWithOAuth();
      toast.success("Redirecting to Google for authentication...");
    } catch (error: any) {
      toast.error(error.message || "Error signing in with Google");
      throw error;
    }
  };

  const value: AuthContextType = {
    session,
    user,
    profile,
    isLoading: isLoading || !isInitialized,
    signIn,
    signUp,
    signOut,
    signInWithGoogle,
    validateTupId,
    validateTupEmail
  };

  console.log("AuthProvider: Rendering with auth state:", {
    hasUser: !!user,
    hasProfile: !!profile,
    isLoading: isLoading || !isInitialized
  });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
