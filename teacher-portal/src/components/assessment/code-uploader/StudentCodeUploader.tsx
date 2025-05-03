
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, FileCode } from 'lucide-react';
import { StudentCodeUploaderProps } from './types';
import { useCodeAssessment } from './useCodeAssessment';
import CodeFileUploader from './CodeFileUploader';
import LanguageSelector from './LanguageSelector';

const StudentCodeUploader: React.FC<StudentCodeUploaderProps> = ({
  assessmentId,
  allowedLanguages,
  enforceLanguage = false,
  expectedOutput,
  solutionCode,
}) => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState(allowedLanguages[0] || 'cpp');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const { assessStudentCode } = useCodeAssessment(assessmentId, expectedOutput, solutionCode);

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value as any);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await assessStudentCode(code);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileCode className="h-5 w-5 mr-2" />
          Submit Your Code
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <LanguageSelector 
          language={language}
          allowedLanguages={allowedLanguages}
          enforceLanguage={enforceLanguage}
          onLanguageChange={handleLanguageChange}
        />

        <div className="space-y-2">
          <Label htmlFor="code">Your Code</Label>
          <Textarea
            id="code"
            placeholder="Write or paste your code here..."
            className="font-mono h-64"
            value={code}
            onChange={handleCodeChange}
          />
        </div>

        <CodeFileUploader 
          fileName={fileName}
          setFileName={setFileName}
          setCode={setCode}
        />
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !code.trim()}
          className="w-full"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Code'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentCodeUploader;
