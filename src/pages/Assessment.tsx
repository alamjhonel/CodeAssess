import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Code, ArrowLeft, Upload, Play, Download, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAssessmentById, parseRubric } from "@/api/assessments";
import type { Assessment, RubricItem } from "@/api/assessments";
import { Submission } from "@/types/submission";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as XLSX from 'xlsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface GradeBreakdown {
  [key: string]: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
}

const MIN_CODE_LENGTH = 50; // Reduced minimum length for code
const MIN_TEXT_LENGTH = 20; // Reduced minimum length for text
const MAX_WHITESPACE_RATIO = 0.3; // Maximum allowed whitespace ratio

const validateCodeQuality = (code: string, isTextOnly: boolean): { isValid: boolean; message: string } => {
  // Check minimum length
  if (isTextOnly) {
    if (code.length < MIN_TEXT_LENGTH) {
      return {
        isValid: false,
        message: `Text submission must be at least ${MIN_TEXT_LENGTH} characters long.`
      };
    }
  } else {
    if (code.length < MIN_CODE_LENGTH) {
      return {
        isValid: false,
        message: `Code submission must be at least ${MIN_CODE_LENGTH} characters long.`
      };
    }
  }

  // Check for repeated patterns (indicator of copy-paste)
  const repeatedPatterns = code.match(/(.{10,})\1{2,}/g);
  if (repeatedPatterns) {
    return {
      isValid: false,
      message: "Code contains repeated patterns. Please write original code."
    };
  }

  // Check for minimum number of lines
  const lines = code.split('\n').filter(line => line.trim().length > 0);
  if (!isTextOnly && lines.length < 3) {
    return {
      isValid: false,
      message: "Code must contain at least 3 lines."
    };
  }

  return {
    isValid: true,
    message: "Code quality check passed."
  };
};

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [submissionContent, setSubmissionContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [grade, setGrade] = useState<number | null>(null);
  const [gradingFeedback, setGradingFeedback] = useState<string>("");
  const [grades, setGrades] = useState<any[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isViewingSubmission, setIsViewingSubmission] = useState(false);
  const [showGradeDetails, setShowGradeDetails] = useState(false);
  const [fuzzyGrade, setFuzzyGrade] = useState<string>("");
  const [numericalGrade, setNumericalGrade] = useState<number | null>(null);
  const [gradeBreakdown, setGradeBreakdown] = useState<GradeBreakdown>({});
  const [allowedLanguages] = useState<string[]>([]);

  // Fetch assessment data using React Query
  const { 
    data: assessment, 
    isLoading: assessmentLoading, 
    error: assessmentError,
    refetch: refetchAssessment 
  } = useQuery({
    queryKey: ['assessment', id],
    queryFn: async () => {
      if (!id) {
        throw new Error('Assessment ID is required');
      }
      const assessment = await getAssessmentById(id);
      if (!assessment) {
        throw new Error('Assessment not found');
      }
      return assessment;
    },
    enabled: !!id && !!user,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: true
  });

  // Fetch user submission using React Query
  const { 
    data: userSubmission, 
    isLoading: submissionLoading,
    refetch: refetchSubmission 
  } = useQuery({
    queryKey: ['submission', id, user?.id],
    queryFn: async () => {
      if (!id || !user || profile?.role !== 'student') return null;
      
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("assessment_id", id)
        .eq("student_id", user.id)
        .order("submitted_at", { ascending: false })
        .limit(1)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user && profile?.role === 'student',
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Update submission content when userSubmission changes
  useEffect(() => {
    if (userSubmission) {
      setSubmissionContent(userSubmission.content || "");
    }
  }, [userSubmission]);

  const isButtonDisabled = () => {
    return submitting || !submissionContent.trim() || isExecuting;
  };

  const handleSubmit = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please enter your solution before submitting");
      return;
    }

    // Validate code quality
    const isTextOnly = allowedLanguages.length === 0;
    const { isValid, message } = validateCodeQuality(submissionContent, isTextOnly);
    if (!isValid) {
      toast.error(message);
      return;
    }

    setSubmitting(true);
    try {
      // First, submit the solution
      let submissionId;
      if (userSubmission) {
        const { data, error } = await supabase
          .from("submissions")
          .update({ 
            content: submissionContent,
            submitted_at: new Date().toISOString(),
            status: 'pending'
          })
          .eq("id", userSubmission.id)
          .select()
          .single();
          
        if (error) throw error;
        submissionId = data.id;
        toast.success("Your solution has been updated!");
      } else {
        const { data, error } = await supabase
          .from("submissions")
          .insert({ 
            assessment_id: id as string,
            student_id: user?.id,
            content: submissionContent,
            status: 'pending'
          })
          .select()
          .single();
          
        if (error) throw error;
        submissionId = data.id;
        toast.success("Your solution has been submitted!");
      }

      // Then, attempt to grade the submission
      try {
        // Get assessment data
        const { data: assessmentData, error: assessmentError } = await supabase
          .from("assessments")
          .select("*")
          .eq("id", id)
          .single();

        if (assessmentError) {
          console.error("Error fetching assessment:", assessmentError);
          throw new Error("Failed to fetch assessment data");
        }

        if (!assessmentData) {
          throw new Error("Assessment not found");
        }

        // Prepare grading data
        const gradingData = {
          studentCode: submissionContent,
          teacherSolution: assessmentData.solution || "",
          rubric: assessmentData.rubric || {},
          output: codeOutput,
          submissionId: submissionId
        };

        // Call grading function
        const { data: gradingResult, error: gradingError } = await supabase.functions.invoke('grade-submission', {
          body: gradingData
        });

        if (gradingError) {
          console.error("Grading function error:", gradingError);
          throw new Error("Failed to grade submission");
        }

        if (!gradingResult || !gradingResult.score) {
          throw new Error("Invalid grading result");
        }

        const grade = Math.round(gradingResult.score);
        const { category, feedback } = getFuzzyGrade(grade);
        
        // Process grade breakdown
        const breakdown: GradeBreakdown = {};
        if (gradingResult.breakdown) {
          Object.entries(gradingResult.breakdown).forEach(([criterion, score]) => {
            const { feedback, suggestions } = getCriterionFeedback(criterion, score as number);
            breakdown[criterion] = {
              score: score as number,
              feedback,
              suggestions
            };
          });
        }

        // Update submission with grade
        const { error: updateError } = await supabase
          .from("submissions")
          .update({
            score: grade,
            feedback: feedback,
            status: 'graded',
            breakdown: breakdown,
            graded_at: new Date().toISOString()
          })
          .eq("id", submissionId);

        if (updateError) {
          console.error("Error updating submission:", updateError);
          throw new Error("Failed to save grade");
        }

        // Show results
        setNumericalGrade(grade);
        setFuzzyGrade(category);
        setGradingFeedback(feedback);
        setGradeBreakdown(breakdown);

        // Show grade details in a toast
        toast.success(
          <div className="space-y-2">
            <p className="font-medium">Assessment Results:</p>
            <p>Fuzzy Grade: {category}</p>
            <p>Numerical Score: {grade}%</p>
            <p>Feedback: {feedback}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => navigate('/dashboard')}
            >
              Okay
            </Button>
          </div>,
          {
            duration: 5000,
            action: {
              label: "View Details",
              onClick: () => setShowGradeDetails(true)
            }
          }
        );

        // Redirect to dashboard after 5 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 5000);

      } catch (gradingError: any) {
        console.error("Grading error:", gradingError);
        toast.error(gradingError.message || "Failed to grade submission");
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit solution");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validExtensions = ['.txt', '.c', '.cpp', '.py'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Please upload a valid file (.txt, .c, .cpp, or .py)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setSubmissionContent(content);
        setFileName(file.name);
        toast.success('File uploaded successfully');
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to read file content');
      }
    };
    reader.readAsText(file);
  };

  const executeCode = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please enter your code before executing");
      return;
    }

    setIsExecuting(true);
    try {
      // Execute code based on file extension
      const fileExtension = fileName?.substring(fileName.lastIndexOf('.')).toLowerCase() || '.txt';
      let output = "";

      switch (fileExtension) {
        case '.py':
          // Execute Python code
          const { data: pythonOutput, error: pythonError } = await supabase.functions.invoke('execute-python', {
            body: { code: submissionContent }
          });
          if (pythonError) throw pythonError;
          output = pythonOutput.output;
          break;

        case '.c':
        case '.cpp':
          // Execute C/C++ code
          const { data: cppOutput, error: cppError } = await supabase.functions.invoke('execute-cpp', {
            body: { code: submissionContent }
          });
          if (cppError) throw cppError;
          output = cppOutput.output;
          break;

        default:
          output = "Text file - no execution needed";
      }

      setCodeOutput(output);
      toast.success("Code executed successfully");
    } catch (error: any) {
      console.error("Error executing code:", error);
      setCodeOutput(`Error: ${error.message}`);
      toast.error("Failed to execute code");
    } finally {
      setIsExecuting(false);
    }
  };

  const getFuzzyGrade = (score: number): { category: string; feedback: string } => {
    if (score < 50) {
      return {
        category: "Failed",
        feedback: "Your submission needs significant improvement. Please review the requirements and try again."
      };
    }
    if (score < 65) {
      return {
        category: "Passed",
        feedback: "You've met the basic requirements. Consider reviewing the feedback for areas of improvement."
      };
    }
    if (score < 75) {
      return {
        category: "Average",
        feedback: "Good effort! Your submission meets most requirements with some room for improvement."
      };
    }
    if (score < 85) {
      return {
        category: "Above Average",
        feedback: "Well done! Your submission demonstrates a strong understanding of the concepts."
      };
    }
    return {
      category: "Excellent",
      feedback: "Outstanding work! Your submission exceeds expectations and demonstrates mastery of the concepts."
    };
  };

  const getCriterionFeedback = (criterion: string, score: number): { feedback: string; suggestions: string[] } => {
    if (score < 50) {
      return {
        feedback: `Needs significant improvement in ${criterion.toLowerCase()}.`,
        suggestions: [
          "Review the basic concepts",
          "Practice with simpler examples",
          "Seek additional help if needed"
        ]
      };
    }
    if (score < 65) {
      return {
        feedback: `Basic understanding of ${criterion.toLowerCase()} demonstrated.`,
        suggestions: [
          "Focus on understanding the fundamentals",
          "Review the assessment requirements",
          "Practice more examples"
        ]
      };
    }
    if (score < 75) {
      return {
        feedback: `Good understanding of ${criterion.toLowerCase()} shown.`,
        suggestions: [
          "Refine your approach",
          "Consider alternative solutions",
          "Review edge cases"
        ]
      };
    }
    if (score < 85) {
      return {
        feedback: `Strong understanding of ${criterion.toLowerCase()} demonstrated.`,
        suggestions: [
          "Consider optimization",
          "Review best practices",
          "Explore advanced concepts"
        ]
      };
    }
    return {
      feedback: `Excellent mastery of ${criterion.toLowerCase()} shown.`,
      suggestions: [
        "Share your knowledge with others",
        "Explore more advanced topics",
        "Consider contributing to open source"
      ]
    };
  };

  const gradeSubmission = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please submit your code before grading");
      return;
    }

    try {
      // Get teacher's solution and rubric
      const { data: assessmentData, error: assessmentError } = await supabase
        .from("assessments")
        .select("teacher_solution, rubric")
        .eq("id", id)
        .single();

      if (assessmentError) throw assessmentError;

      // Grade using fuzzy logic
      const { data: gradingResult, error: gradingError } = await supabase.functions.invoke('grade-submission', {
        body: {
          studentCode: submissionContent,
          teacherSolution: assessmentData.teacher_solution,
          rubric: assessmentData.rubric,
          output: codeOutput
        }
      });

      if (gradingError) throw gradingError;

      const grade = Math.round(gradingResult.score);
      const { category, feedback } = getFuzzyGrade(grade);
      
      // Process grade breakdown with feedback
      const breakdown: GradeBreakdown = {};
      if (gradingResult.breakdown) {
        Object.entries(gradingResult.breakdown).forEach(([criterion, score]) => {
          const { feedback, suggestions } = getCriterionFeedback(criterion, score as number);
          breakdown[criterion] = {
            score: score as number,
            feedback,
            suggestions
          };
        });
      }

      setNumericalGrade(grade);
      setFuzzyGrade(category);
      setGradingFeedback(feedback);
      setGradeBreakdown(breakdown);
      setShowGradeDetails(true);

      // Update submission with grade
      if (userSubmission) {
        const { error: updateError } = await supabase
          .from("submissions")
          .update({
            score: grade,
            feedback: feedback,
            status: 'graded',
            breakdown: breakdown
          })
          .eq("id", userSubmission.id);

        if (updateError) throw updateError;
      }

      toast.success("Submission graded successfully");
    } catch (error: any) {
      console.error("Error grading submission:", error);
      toast.error("Failed to grade submission");
    }
  };

  const renderSubmissionStatus = () => {
    if (!userSubmission) return null;
    
    return (
      <div className="mb-4 p-4 rounded-lg bg-muted/50">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-medium">Last submitted: {new Date(userSubmission.submitted_at).toLocaleString()}</p>
            <div className="flex items-center mt-1">
              <Badge variant={userSubmission.status === 'graded' ? 'success' : 'warning'}>
                {userSubmission.status === 'graded' ? 'Graded' : 'Pending Review'}
              </Badge>
              {userSubmission.score !== null && (
                <span className="ml-2 text-sm font-medium">
                  Score: {userSubmission.score}/{assessment?.points_possible} points
                </span>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSubmissionContent(userSubmission.content || "")}
          >
            Restore Previous
          </Button>
        </div>
      </div>
    );
  };

  const fetchGrades = async () => {
    if (!id || profile?.role !== 'teacher') return;

    try {
      const { data, error } = await supabase
        .from("submissions")
        .select(`
          *,
          student:profiles(
            id,
            first_name,
            last_name,
            section
          )
        `)
        .eq("assessment_id", id)
        .order("student(last_name)");

      if (error) throw error;
      setGrades(data || []);
    } catch (error: any) {
      console.error("Error fetching grades:", error);
      toast.error("Failed to load grades");
    }
  };

  const exportGradesToExcel = async () => {
    if (!grades.length) {
      toast.error("No grades to export");
      return;
    }

    setIsExporting(true);
    try {
      // Group grades by section
      const gradesBySection = grades.reduce((acc, grade) => {
        const section = grade.student?.section || 'No Section';
        if (!acc[section]) {
          acc[section] = [];
        }
        acc[section].push({
          'Student ID': grade.student?.id,
          'Last Name': grade.student?.last_name,
          'First Name': grade.student?.first_name,
          'Score': grade.score || 'Not Graded',
          'Status': grade.status,
          'Submitted At': new Date(grade.submitted_at).toLocaleString(),
          'Feedback': grade.feedback || ''
        });
        return acc;
      }, {} as Record<string, any[]>);

      // Create workbook
      const workbook = XLSX.utils.book_new();

      // Add each section as a separate sheet
      Object.entries(gradesBySection).forEach(([section, data]) => {
        // Sort by last name
        data.sort((a, b) => a['Last Name'].localeCompare(b['Last Name']));
        
        const worksheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, section);
      });

      // Generate filename
      const assessmentTitle = assessment?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `${assessmentTitle}_grades.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);
      toast.success("Grades exported successfully");
    } catch (error: any) {
      console.error("Error exporting grades:", error);
      toast.error("Failed to export grades");
    } finally {
      setIsExporting(false);
    }
  };

  const viewSubmission = (submission: Submission) => {
    setSelectedSubmission(submission);
    setIsViewingSubmission(true);
  };

  // Fetch grades when component mounts or assessment changes
  useEffect(() => {
    fetchGrades();
  }, [id, profile?.role]);

  const isLoading = authLoading || assessmentLoading || submissionLoading;

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (assessmentError) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Error loading assessment</h3>
                <p className="text-muted-foreground">
                  {assessmentError.message}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  if (!assessment) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-medium">Assessment not found</h3>
                <p className="text-muted-foreground">
                  The assessment you're looking for doesn't exist or you don't have permission to view it.
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="mt-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">{assessment.title}</CardTitle>
                <CardDescription className="mt-1">
                  {assessment.points_possible} points
                </CardDescription>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge variant="outline" className="capitalize">{assessment.type}</Badge>
                <p className="text-sm">
                  Due: {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : 'No deadline'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {assessment.description && (
              <div>
                <h3 className="text-lg font-medium mb-2">Description</h3>
                <p className="text-muted-foreground">{assessment.description}</p>
              </div>
            )}
            
            <div>
              <h3 className="text-lg font-medium mb-2">Instructions</h3>
              <div className="prose dark:prose-invert max-w-none">
                {assessment.content || "No detailed instructions provided."}
              </div>
            </div>

            {assessment.rubric && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Rubric</h3>
                <div className="bg-muted/30 rounded-lg p-4">
                  <p className="text-sm mb-3">This assessment will be graded using Rubric-based Fuzzy Logic on the following criteria:</p>
                  <div className="space-y-2">
                    {(() => {
                      const rubricItems = parseRubric(assessment.rubric);
                      if (!rubricItems || rubricItems.length === 0) {
                        return (
                          <div className="text-sm text-muted-foreground">
                            No rubric items available
                          </div>
                        );
                      }
                      return rubricItems.map((item: RubricItem, index: number) => (
                        <div key={index} className="flex justify-between items-center py-1">
                          <span className="text-sm">{item.name}</span>
                          <Badge variant="outline" className="font-mono">Weight: {item.weight}</Badge>
                        </div>
                      ));
                    })()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    The fuzzy logic system uses the bisector method for defuzzification to provide accurate assessments.
                  </p>
                </div>
              </div>
            )}
            
            {profile?.role === 'student' && (
              <div className="pt-4">
                <h3 className="text-lg font-medium mb-4">Your Submission</h3>
                <div className="border rounded-md p-4">
                  {renderSubmissionStatus()}
                  
                  <Tabs defaultValue="code" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="code">Code</TabsTrigger>
                      <TabsTrigger value="output">Output</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="code">
                      <div className="flex items-center mb-2 gap-2">
                        <Code className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Write or paste your code below:</span>
                      </div>
                      
                      <textarea 
                        className="w-full h-60 p-3 font-mono text-sm border rounded-md bg-background"
                        placeholder="Write your solution here..."
                        value={submissionContent}
                        onChange={(e) => setSubmissionContent(e.target.value)}
                      />

                      {fileName && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                          <span className="truncate">{fileName}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFileName(null);
                              setSubmissionContent('');
                            }}
                          >
                            Clear
                          </Button>
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="output">
                      <div className="flex items-center mb-2 gap-2">
                        <Play className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Code Output:</span>
                      </div>
                      <ScrollArea className="h-60 w-full rounded-md border p-3">
                        <pre className="text-sm font-mono whitespace-pre-wrap">{codeOutput || "No output yet"}</pre>
                      </ScrollArea>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-4 flex justify-end gap-2">
                    <input
                      id="file-upload"
                      type="file"
                      accept=".txt,.c,.cpp,.py"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('file-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={executeCode}
                      disabled={isExecuting || !submissionContent.trim()}
                    >
                      {isExecuting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Run Code
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={isButtonDisabled()}
                      className="min-w-[120px]"
                    >
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {userSubmission ? 'Update Solution' : 'Submit Solution'}
                    </Button>
                  </div>

                  {grade !== null && (
                    <div className="mt-4 p-4 rounded-md bg-muted/30">
                      <h4 className="text-sm font-medium mb-2">Grading Results</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="success">Score: {grade}</Badge>
                        <p className="text-sm text-muted-foreground">{gradingFeedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {profile?.role === 'teacher' && (
              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Student Submissions</h3>
                  <Button
                    onClick={exportGradesToExcel}
                    disabled={isExporting || !grades.length}
                  >
                    {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Download className="mr-2 h-4 w-4" />
                    Export Grades
                  </Button>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left p-4">Student</th>
                            <th className="text-left p-4">Section</th>
                            <th className="text-left p-4">Score</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Submitted At</th>
                            <th className="text-left p-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {grades.map((grade) => (
                            <tr key={grade.id} className="border-b">
                              <td className="p-4">
                                {grade.student?.last_name}, {grade.student?.first_name}
                              </td>
                              <td className="p-4">{grade.student?.section || 'No Section'}</td>
                              <td className="p-4">
                                {grade.score !== null ? (
                                  <Badge variant="success">{grade.score}</Badge>
                                ) : (
                                  <Badge variant="secondary">Not Graded</Badge>
                                )}
                              </td>
                              <td className="p-4">
                                <Badge variant={grade.status === 'graded' ? 'success' : 'warning'}>
                                  {grade.status}
                                </Badge>
                              </td>
                              <td className="p-4">
                                {new Date(grade.submitted_at).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => viewSubmission(grade)}
                                >
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* Submission Details Dialog */}
                {isViewingSubmission && selectedSubmission && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
                      <CardHeader className="flex justify-between items-center">
                        <div>
                          <CardTitle>Submission Details</CardTitle>
                          <CardDescription>
                            {selectedSubmission.student?.last_name}, {selectedSubmission.student?.first_name}
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsViewingSubmission(false)}
                        >
                          Close
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Submission Info</h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Status:</span>{' '}
                                <Badge variant={selectedSubmission.status === 'graded' ? 'success' : 'warning'}>
                                  {selectedSubmission.status}
                                </Badge>
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Score:</span>{' '}
                                {selectedSubmission.score !== null ? (
                                  <Badge variant="success">{selectedSubmission.score}</Badge>
                                ) : (
                                  <Badge variant="secondary">Not Graded</Badge>
                                )}
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Submitted:</span>{' '}
                                {new Date(selectedSubmission.submitted_at).toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-2">Student Info</h4>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="text-muted-foreground">Section:</span>{' '}
                                {selectedSubmission.student?.section || 'No Section'}
                              </p>
                              <p className="text-sm">
                                <span className="text-muted-foreground">Student ID:</span>{' '}
                                {selectedSubmission.student?.id}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Submission Content</h4>
                          <ScrollArea className="h-60 w-full rounded-md border p-3">
                            <pre className="text-sm font-mono whitespace-pre-wrap">
                              {selectedSubmission.content}
                            </pre>
                          </ScrollArea>
                        </div>

                        {selectedSubmission.feedback && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Feedback</h4>
                            <div className="p-3 rounded-md bg-muted/30">
                              <p className="text-sm">{selectedSubmission.feedback}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}

            {/* Grade Details Dialog */}
            <Dialog open={showGradeDetails} onOpenChange={setShowGradeDetails}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assessment Results</DialogTitle>
                  <DialogDescription>
                    Your submission has been graded using fuzzy logic assessment.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="flex items-center justify-center">
                    <Badge 
                      variant={
                        fuzzyGrade === "Failed" ? "destructive" :
                        fuzzyGrade === "Passed" ? "warning" :
                        fuzzyGrade === "Average" ? "default" :
                        fuzzyGrade === "Above Average" ? "success" :
                        "success"
                      }
                      className="text-lg px-4 py-2"
                    >
                      {fuzzyGrade}
                    </Badge>
                  </div>
                  
                  <div className="p-4 rounded-md bg-muted/30">
                    <p className="text-sm mb-2">{gradingFeedback}</p>
                    
                    {Object.entries(gradeBreakdown).length > 0 && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium mb-2">Grade Breakdown:</h4>
                        <div className="space-y-4">
                          {Object.entries(gradeBreakdown).map(([criterion, data]) => (
                            <div key={criterion} className="text-sm">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-muted-foreground">{criterion}:</span>
                                <span>{data.score}%</span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">{data.feedback}</p>
                              <div className="pl-2 border-l-2 border-muted">
                                <p className="text-xs font-medium mb-1">Suggestions:</p>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {data.suggestions.map((suggestion, index) => (
                                    <li key={index} className="flex items-start">
                                      <span className="mr-1">•</span>
                                      {suggestion}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (numericalGrade !== null) {
                          toast.info(`Your numerical grade is: ${numericalGrade}%`);
                        }
                      }}
                    >
                      <Info className="mr-2 h-4 w-4" />
                      Show Numerical Grade
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowGradeDetails(false)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Assessment;
