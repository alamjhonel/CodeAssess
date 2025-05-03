import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export type AssessmentType = "quiz" | "assignment" | "project" | "exam";

export interface Assessment {
  id: string;
  title: string;
  description?: string;
  content: string;
  course_id: string | null;
  created_at: string;
  updated_at: string;
  due_date?: string;
  points_possible: number;
  type: AssessmentType;
  rubric?: Json;
  created_by: string;
  solution_code?: string;
  test_cases?: Json;
  profiles?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface RubricItem {
  name: string;
  weight: number;
}

// Helper function to parse rubric data
export function parseRubric(rubric: Json): RubricItem[] | null {
  try {
    if (!rubric) return null;
    
    let parsed: unknown;
    if (typeof rubric === 'string') {
      parsed = JSON.parse(rubric);
    } else {
      parsed = rubric;
    }

    if (!Array.isArray(parsed)) return null;

    return parsed.map(item => {
      if (typeof item === 'object' && item !== null) {
        const rubricItem = item as Record<string, unknown>;
        if (
          typeof rubricItem.name === 'string' &&
          typeof rubricItem.weight === 'number'
        ) {
          return {
            name: rubricItem.name,
            weight: rubricItem.weight
          };
        }
      }
      return null;
    }).filter((item): item is RubricItem => item !== null);
  } catch (error) {
    console.error('Error parsing rubric:', error);
    return null;
  }
}

export const getAssessments = async (): Promise<Assessment[]> => {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return [];
    }

    if (!session) {
      console.error('No active session');
      return [];
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return [];
    }

    let query = supabase
      .from('assessments')
      .select(`
        *,
        profiles:created_by (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching assessments:', error);
      throw error;
    }

    console.log('Fetched assessments:', {
      userId: session.user.id,
      role: profile.role,
      count: data?.length || 0
    });

    return data || [];
  } catch (error) {
    console.error('Error in getAssessments:', error);
    return [];
  }
};

export async function getAssessmentById(id: string): Promise<Assessment | null> {
  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Error getting session:', sessionError);
      return null;
    }

    if (!session) {
      console.error('No active session');
      return null;
    }

    // Get user profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return null;
    }

    console.log('Fetching assessment:', {
      id,
      userId: session.user.id,
      role: profile.role
    });

    const { data, error } = await supabase
      .from('assessments')
      .select(`
        *,
        profiles:created_by (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching assessment:', error);
      throw error;
    }

    if (!data) {
      console.error('Assessment not found');
      return null;
    }

    console.log('Fetched assessment:', {
      id: data.id,
      title: data.title,
      createdBy: data.created_by,
      userId: session.user.id
    });

    return data;
  } catch (error) {
    console.error('Error in getAssessmentById:', error);
    return null;
  }
}

export async function createAssessment(assessment: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>): Promise<Assessment | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return null;
    }

    console.log('Creating assessment:', assessment);

    const { data, error } = await supabase
      .from('assessments')
      .insert({
        ...assessment,
        type: assessment.type as AssessmentType
      })
      .select(`
        *,
        profiles:created_by (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }

    console.log('Created assessment:', data);
    return data;
  } catch (error) {
    console.error('Error in createAssessment:', error);
    return null;
  }
}

export async function updateAssessment(id: string, assessment: Partial<Omit<Assessment, 'id' | 'created_at' | 'updated_at'>>): Promise<Assessment | null> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return null;
    }

    console.log('Updating assessment:', id, assessment);

    const { data, error } = await supabase
      .from('assessments')
      .update({
        ...assessment,
        type: assessment.type as AssessmentType | undefined
      })
      .eq('id', id)
      .select(`
        *,
        profiles:created_by (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .single();

    if (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }

    console.log('Updated assessment:', data);
    return data;
  } catch (error) {
    console.error('Error in updateAssessment:', error);
    return null;
  }
}

export async function deleteAssessment(id: string): Promise<boolean> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session');
      return false;
    }

    console.log('Deleting assessment:', id);

    const { error } = await supabase
      .from('assessments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }

    console.log('Deleted assessment:', id);
    return true;
  } catch (error) {
    console.error('Error in deleteAssessment:', error);
    return false;
  }
}
