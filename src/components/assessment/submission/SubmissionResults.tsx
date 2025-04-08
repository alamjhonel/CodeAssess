
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  BarChart3, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ThumbsUp,
  ThumbsDown
} from 'lucide-react';
import { SubmissionResultsProps } from './types';

const SubmissionResults: React.FC<SubmissionResultsProps> = ({ submission }) => {
  if (!submission) return null;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Submission Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {submission.status === 'pending' && (
          <div className="flex items-center p-4 bg-amber-50 dark:bg-amber-900/20 rounded-md">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2" />
            <p>Your submission is pending review.</p>
          </div>
        )}

        {submission.status === 'submitted' && submission.assessment_results && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">Score</span>
                <Badge variant={submission.score > 70 ? "default" : "destructive"}>
                  {Math.round(submission.score)}%
                </Badge>
              </div>
              <Progress value={submission.score} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {submission.assessment_results.letterGrade && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Letter Grade</span>
                  <Badge variant="outline" className="px-3 py-1">
                    {submission.assessment_results.letterGrade}
                  </Badge>
                </div>
              )}
              
              {submission.assessment_results.fuzzyGrade && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Performance</span>
                  <Badge 
                    variant="outline" 
                    className={`px-3 py-1 ${
                      submission.assessment_results.fuzzyGrade === "Excellent" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" :
                      submission.assessment_results.fuzzyGrade === "Above Average" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100" :
                      submission.assessment_results.fuzzyGrade === "Average" ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100" :
                      submission.assessment_results.fuzzyGrade === "Passed" ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100" :
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
                    }`}
                  >
                    {submission.assessment_results.fuzzyGrade}
                  </Badge>
                </div>
              )}
            </div>

            {submission.assessment_results.rejected && (
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive dark:text-destructive/90">
                <h4 className="font-medium flex items-center mb-2">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Submission Rejected
                </h4>
                <p className="text-sm">{submission.assessment_results.rejectionReason}</p>
              </div>
            )}

            {!submission.assessment_results.rejected && (
              <>
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Performance Breakdown</h4>
                  
                  {submission.assessment_results.rubric?.metrics.map((metric: any, index: number) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center text-sm">
                        <span>{metric.name}</span>
                        <span>{Math.round(metric.score)}%</span>
                      </div>
                      <Progress value={metric.score} className="h-1.5" />
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                {submission.assessment_results.feedback && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Feedback</h4>
                    <ul className="space-y-2">
                      {submission.assessment_results.feedback.map((item: string, index: number) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="mr-2 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {(submission.assessment_results.strengths?.length > 0 || 
                 submission.assessment_results.weaknesses?.length > 0) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {submission.assessment_results.strengths?.length > 0 && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <h5 className="font-medium flex items-center mb-2 text-green-700 dark:text-green-400">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          Strengths
                        </h5>
                        <ul className="space-y-1">
                          {submission.assessment_results.strengths.map((strength: string, index: number) => (
                            <li key={index} className="text-sm text-green-700 dark:text-green-400 flex items-start">
                              <CheckCircle className="h-3 w-3 mr-1 mt-0.5" />
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {submission.assessment_results.weaknesses?.length > 0 && (
                      <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-md">
                        <h5 className="font-medium flex items-center mb-2 text-amber-700 dark:text-amber-400">
                          <ThumbsDown className="h-4 w-4 mr-1" />
                          Areas for Improvement
                        </h5>
                        <ul className="space-y-1">
                          {submission.assessment_results.weaknesses.map((weakness: string, index: number) => (
                            <li key={index} className="text-sm text-amber-700 dark:text-amber-400 flex items-start">
                              <AlertCircle className="h-3 w-3 mr-1 mt-0.5" />
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            
            <div className="pt-4 text-center">
              <p className="text-sm text-muted-foreground">
                {submission.submitted_at && 
                  `Submitted on ${new Date(submission.submitted_at).toLocaleString()}`}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionResults;
