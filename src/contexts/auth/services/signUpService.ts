
import { supabase } from "@/integrations/supabase/client";

export async function signUpWithCredentials(
  email: string, 
  password: string, 
  firstName: string,
  lastName: string,
  role: "teacher" | "student",
  tupId: string,
  birthdate: Date | null = null
) {
  // Check for TUP email domain
  if (!email.endsWith('@tup.edu.ph')) {
    throw new Error("Only TUP email addresses (@tup.edu.ph) are allowed");
  }
  
  // For teachers, TUP ID is optional, but for students it's required
  if (role === "student" && (!tupId || tupId.trim() === "")) {
    throw new Error("TUP ID is required for students");
  }
  
  // Format birthdate to ISO string if provided
  const birthdateISO = birthdate ? birthdate.toISOString().split('T')[0] : null;
  
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        role,
        tup_id: tupId || null, // Use null for empty TUP IDs (for teachers)
        birthdate: birthdateISO
      },
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  if (error) {
    throw error;
  }
}
