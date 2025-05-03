
import { supabase } from "@/integrations/supabase/client";

export async function signOutUser() {
  try {
    // First, perform the Supabase signout
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out from Supabase:", error);
      throw error;
    }
    
    // Clear any local storage related to authentication
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
    
    // Reset any cached auth data
    localStorage.removeItem('sb-btptsqprylnktkceyuad-auth-token');
    sessionStorage.removeItem('sb-btptsqprylnktkceyuad-auth-token');
    
    console.log("Successfully signed out");
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}
