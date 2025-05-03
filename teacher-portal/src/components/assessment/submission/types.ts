
import { ProgrammingLanguage } from '../AssessmentLanguageFields';

export interface AssessmentSubmissionProps {
  assessmentId: string;
  allowedLanguages: ProgrammingLanguage[];
  enforceLanguage?: boolean;
  dueDate?: string;
}

export interface SubmissionResultsProps {
  submission: any;
}

export interface SubmissionStatus {
  status: string;
  score?: number;
  assessment_results?: any;
  submitted_at?: string;
}
