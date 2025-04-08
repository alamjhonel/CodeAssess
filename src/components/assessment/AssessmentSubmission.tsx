
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { StudentCodeUploader } from './code-uploader';
import { SubmissionResults } from './submission';
import { useSubmissionData } from './submission/useSubmissionData';
import { AssessmentSubmissionProps } from './submission/types';

const AssessmentSubmission: React.FC<AssessmentSubmissionProps> = ({
  assessmentId,
  allowedLanguages,
  enforceLanguage = false,
  dueDate
}) => {
  const { user } = useAuth();
  const { submission, assessment, loading } = useSubmissionData(assessmentId, user?.id);

  const canSubmit = () => {
    if (!assessment) return false;
    if (!dueDate) return true;
    
    const now = new Date();
    const due = new Date(dueDate);
    return now <= due;
  };

  return (
    <div>
      <SubmissionResults submission={submission} />
      
      {canSubmit() && (
        <StudentCodeUploader 
          assessmentId={assessmentId}
          allowedLanguages={allowedLanguages}
          enforceLanguage={enforceLanguage}
          expectedOutput={assessment?.test_cases?.[0]?.expected_output}
          solutionCode={assessment?.solution_code}
        />
      )}
      
      {!canSubmit() && (
        <Card className="bg-muted/30">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              The submission deadline has passed. You can no longer submit for this assessment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AssessmentSubmission;
