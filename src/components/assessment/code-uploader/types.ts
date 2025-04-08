
import { Json } from '@/integrations/supabase/types';
import { ProgrammingLanguage } from '../AssessmentLanguageFields';

export interface StudentCodeUploaderProps {
  assessmentId: string;
  allowedLanguages: ProgrammingLanguage[];
  enforceLanguage?: boolean;
  expectedOutput?: string;
  solutionCode?: string;
}

export interface CodeAssessmentInput {
  rawCode: string;
  correctness: number;
  efficiency: number;
  readability: number;
  testCasesPassed: number;
  totalTestCases: number;
  timeComplexity: string;
  spaceComplexity: string;
  codeStyle: number;
  errorHandling: number;
  codeQuality: {
    isDumpCode: boolean;
    hasLoops: boolean;
    hasVariables: boolean;
    hasInputHandling: boolean;
    hasHardcodedOutput: boolean;
    structureScore: number;
  };
  fuzzyMatchScore?: number;
}
