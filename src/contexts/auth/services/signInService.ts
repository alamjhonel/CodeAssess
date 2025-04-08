
import { supabase } from "@/integrations/supabase/client";
import { isEmail } from "../validation";

export async function signInWithCredentials(identifier: string, password: string, birthdate?: Date) {
  try {
    console.log("Signing in with identifier:", identifier);
    
    // Determine if identifier is an email or TUP ID
    let email = identifier;
    
    if (!isEmail(identifier)) {
      // If it's a TUP ID, find the associated email
      console.log("Looking up TUP ID:", identifier);
      const { data, error } = await supabase
        .from("profiles")
        .select("email")
        .eq("tup_id", identifier)
        .maybeSingle();
        
      if (error) {
        console.error("Error looking up TUP ID:", error);
        throw new Error("Error looking up TUP ID");
      }
      
      if (!data || !data.email) {
        console.error("TUP ID not found:", identifier);
        throw new Error("TUP ID not found. Please use your email instead or register if you don't have an account.");
      }
      
      console.log("Found email for TUP ID:", data.email);
      email = data.email;
    }
    
    // Make sure the email is a TUP domain
    if (!email.endsWith('@tup.edu.ph')) {
      throw new Error("Only TUP email addresses (@tup.edu.ph) are allowed");
    }
    
    console.log("Attempting login with email:", email);
    
    // Sign in with email and password
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      throw error;
    }

    console.log("Login successful");
    
    // Check if we need to update the birthdate (if provided)
    if (birthdate && data.user) {
      try {
        // Update the birthdate in the profile
        console.log("Updating birthdate:", birthdate);
        await supabase
          .from("profiles")
          .update({ birthdate: birthdate.toISOString().split('T')[0] })
          .eq("id", data.user.id);
          
        console.log("Birthdate updated");
      } catch (error) {
        console.error("Error updating birthdate:", error);
        // Don't throw error here, continue with auth
      }
    }
    
    return data;
  } catch (error) {
    console.error("Error signing in:", error);
    throw error;
  }
}

export async function signInWithOAuth() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${window.location.origin}/dashboard`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    throw error;
  }
}
