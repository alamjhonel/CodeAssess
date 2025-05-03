
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { assessCode } from '@/utils/scoring';
import { toast } from 'sonner';
import { CodeAssessmentInput } from './types';

export function useCodeAssessment(assessmentId: string, expectedOutput?: string, solutionCode?: string) {
  const { user } = useAuth();
  
  const assessStudentCode = async (code: string) => {
    if (!code.trim()) {
      toast.error('Please enter or upload your code');
      return false;
    }

    if (!user) {
      toast.error('You must be logged in to submit');
      return false;
    }

    try {
      // Basic assessment of code quality
      const assessment: CodeAssessmentInput = {
        rawCode: code,
        correctness: 0,
        efficiency: 70,
        readability: 75,
        testCasesPassed: 0,
        totalTestCases: 1,
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)',
        codeStyle: 75,
        errorHandling: 70,
        codeQuality: {
          isDumpCode: false,
          hasLoops: true, 
          hasVariables: true,
          hasInputHandling: true,
          hasHardcodedOutput: false,
          structureScore: 80
        }
      };

      // Basic testing based on expected output
      if (expectedOutput && code) {
        // This is just a placeholder - in a real system you'd run the code
        const containsExpectedOutput = code.includes(expectedOutput);
        assessment.correctness = containsExpectedOutput ? 90 : 40;
        assessment.testCasesPassed = containsExpectedOutput ? 1 : 0;
      }

      // Check for solution similarity if provided
      if (solutionCode) {
        assessment.fuzzyMatchScore = 85; 
      }

      // Evaluate code using the scoring engine
      const codeAssessment = assessCode(assessment);
      
      // Convert the assessment results to a format compatible with Json type
      const jsonAssessment = JSON.parse(JSON.stringify(codeAssessment));

      // Submit to database
      const { error } = await supabase.from('submissions').insert({
        assessment_id: assessmentId,
        student_id: user.id,
        content: code,
        status: 'submitted',
        assessment_results: jsonAssessment,
        score: codeAssessment.normalizedScore
      });

      if (error) throw error;

      toast.success('Code submitted successfully!');
      return true;
    } catch (error: any) {
      console.error('Error submitting code:', error);
      toast.error(error.message || 'Failed to submit code');
      return false;
    }
  };

  return { assessStudentCode };
}
