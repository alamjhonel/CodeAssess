
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useSubmissionData(assessmentId: string, userId: string | undefined) {
  const [submission, setSubmission] = useState<any>(null);
  const [assessment, setAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !assessmentId) return;

      try {
        // Fetch assessment details
        const { data: assessmentData, error: assessmentError } = await supabase
          .from('assessments')
          .select('*')
          .eq('id', assessmentId)
          .single();

        if (assessmentError) throw assessmentError;
        setAssessment(assessmentData);

        // Fetch submission if it exists
        const { data: submissionData, error: submissionError } = await supabase
          .from('submissions')
          .select('*')
          .eq('assessment_id', assessmentId)
          .eq('student_id', userId)
          .order('submitted_at', { ascending: false })
          .maybeSingle();

        if (submissionError && submissionError.code !== 'PGRST116') {
          throw submissionError;
        }

        setSubmission(submissionData || null);
      } catch (error) {
        console.error('Error fetching submission data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, userId]);

  return { submission, assessment, loading };
}
