
import { supabase } from "@/integrations/supabase/client";

export interface Course {
  id: string;
  name: string;
  code: string;
  description?: string;
  status: 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
  teacher_id: string;
}

export async function getCourses(): Promise<Course[]> {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Add the status field which might not be in the database yet
    return data?.map(course => ({
      ...course,
      // Use optional chaining and type assertion to handle the missing status field
      status: (course as any).status || 'ongoing'
    })) as Course[] || [];
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}
