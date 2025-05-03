
import { useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "./types";
import { fetchProfile } from "./services";

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("Setting up auth state listener");
    let mounted = true;
    
    // First set up the listener for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state changed:", event, !!newSession);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_OUT') {
          // Clear all state on sign out
          setSession(null);
          setUser(null);
          setProfile(null);
          console.log("State cleared due to sign out event");
          setIsLoading(false);
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          console.log("Setting session and user from auth event");
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // IMPORTANT: Mark as not loading immediately, then fetch profile
          // This ensures the UI doesn't wait for profile fetch to complete
          setIsLoading(false);
          
          if (newSession?.user) {
            console.log("Fetching profile for user:", newSession.user.id);
            // Use setTimeout to avoid Supabase auth deadlocks
            setTimeout(async () => {
              try {
                const userProfile = await fetchProfile(newSession.user.id);
                console.log("Profile fetched:", userProfile);
                
                if (mounted) {
                  setProfile(userProfile);
                }
              } catch (error) {
                console.error("Error fetching profile:", error);
                // Continue with authentication even if profile fetch fails
                // This is critical - we don't want to block the user from accessing the app
              } 
            }, 0);
          }
        } else {
          // For any other event, ensure loading is turned off
          if (mounted) setIsLoading(false);
        }
      }
    );

    // Then check for an existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      if (!mounted) return;
      
      console.log("Initial session check:", !!existingSession);
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      
      // IMPORTANT: Mark as not loading first, then fetch profile
      setIsLoading(false);
      setIsInitialized(true);
      
      if (existingSession?.user) {
        console.log("Found existing session, fetching profile");
        // Use setTimeout to avoid Supabase auth deadlocks
        setTimeout(async () => {
          try {
            const userProfile = await fetchProfile(existingSession.user.id);
            if (mounted) {
              console.log("Initial profile loaded:", userProfile);
              setProfile(userProfile);
            }
          } catch (err) {
            console.error("Error fetching initial profile:", err);
            // Continue without profile data - don't block the user experience
          }
        }, 0);
      }
    }).catch(err => {
      console.error("Error getting session:", err);
      if (mounted) {
        setIsLoading(false);
        setIsInitialized(true);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, user, profile, isLoading, isInitialized, setProfile };
}
