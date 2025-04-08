
import { supabase } from "@/integrations/supabase/client";

export async function getStatistics(userId: string) {
  try {
    // Get total submissions
    const { data: submissions, error: submissionsError } = await supabase
      .from('submissions')
      .select('*')
      .eq('student_id', userId);
    
    if (submissionsError) throw submissionsError;
    
    // Calculate average score from graded submissions
    const gradedSubmissions = submissions.filter(s => s.status === 'graded' && s.score !== null);
    const totalScore = gradedSubmissions.reduce((sum, sub) => sum + (sub.score || 0), 0);
    const averageScore = gradedSubmissions.length > 0 ? totalScore / gradedSubmissions.length : 0;
    
    return {
      total_submissions: submissions.length,
      graded_submissions: gradedSubmissions.length,
      average_score: averageScore
    };
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return {
      total_submissions: 0,
      graded_submissions: 0,
      average_score: 0
    };
  }
}
