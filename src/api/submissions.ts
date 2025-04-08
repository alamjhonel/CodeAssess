
import { supabase } from "@/integrations/supabase/client";
import { Submission } from "@/types/submission";

export async function getSubmissions(userId: string): Promise<Submission[]> {
  try {
    const { data, error } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', userId)
      .order('submitted_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return [];
  }
}
