
import { supabase } from "@/integrations/supabase/client";
import { Profile } from "../types";

export async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    console.log(`Attempting to fetch profile for user ${userId}`);
    
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.log("Error fetching profile:", error);
      
      // If profile doesn't exist, create a default one
      if (error.code === 'PGRST116') {
        console.log("Profile not found, checking if we can get user metadata");
        
        // Get user metadata
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData && userData.user) {
          const metadata = userData.user.user_metadata;
          console.log("User metadata found:", metadata);
          
          // Create a default profile
          const defaultProfile: Omit<Profile, 'created_at' | 'updated_at'> = {
            id: userId,
            first_name: metadata?.first_name || 'New',
            last_name: metadata?.last_name || 'User',
            role: metadata?.role || 'student',
            tup_id: metadata?.tup_id || '',
            email: userData.user.email || '',
            birthdate: null
          };
          
          console.log("Creating default profile:", defaultProfile);
          
          // Use upsert instead of insert to handle potential race conditions
          const { data: newProfile, error: insertError } = await supabase
            .from("profiles")
            .upsert(defaultProfile)
            .select()
            .single();
            
          if (insertError) {
            console.error("Error creating default profile:", insertError);
            return null;
          }
          
          console.log("Default profile created:", newProfile);
          return newProfile as Profile;
        }
      }
      
      return null;
    }

    return data as Profile;
  } catch (error) {
    console.error("Error in fetchProfile:", error);
    return null;
  }
}
