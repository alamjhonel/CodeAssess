
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  content: string;
  course_id: string;
  created_at: string;
  updated_at: string;
  due_date?: string;
  points_possible: number;
  type: string;
  rubric?: Json;
  created_by: string;
  solution_code?: string;
  test_cases?: Json;
}

export async function getAssessments(): Promise<Assessment[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return [];
  }
}
