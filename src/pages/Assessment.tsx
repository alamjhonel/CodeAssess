import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Submission } from "@/types/submission";

// Define the rubric-based fuzzy logic assessment model
interface RubricItem {
  name: string;
  weight: number;
}

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile, isLoading } = useAuth();
  const [assessment, setAssessment] = useState<any>(null);
  const [userSubmission, setUserSubmission] = useState<Submission | null>(null);
  const [submissionContent, setSubmissionContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchAssessment = async () => {
      if (!id || !user) return;
      
      setLoading(true);
      try {
        // Fetch the assessment details
        const { data, error } = await supabase
          .from("assessments")
          .select(`
            *,
            course:courses(
              name,
              code
            )
          `)
          .eq("id", id)
          .single();

        if (error) {
          console.error("Error fetching assessment:", error);
          toast.error("Failed to load assessment");
          return;
        }

        setAssessment(data);
        
        // If user is a student, check for existing submissions
        if (profile?.role === 'student') {
          const { data: submissionData, error: submissionError } = await supabase
            .from("submissions")
            .select("*")
            .eq("assessment_id", id)
            .eq("student_id", user.id)
            .order("submitted_at", { ascending: false })
            .limit(1)
            .single();
            
          if (!submissionError && submissionData) {
            setUserSubmission(submissionData);
            setSubmissionContent(submissionData.content || "");
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading the assessment");
      } finally {
        setLoading(false);
      }
    };

    fetchAssessment();
  }, [id, user, profile?.role]);

  const handleSubmit = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please enter your solution before submitting");
      return;
    }
    
    setSubmitting(true);
    try {
      // If there's an existing submission, update it
      if (userSubmission) {
        const { error } = await supabase
          .from("submissions")
          .update({ 
            content: submissionContent,
            submitted_at: new Date().toISOString(),
            status: 'pending' as "pending" | "submitted" | "graded" // Use type assertion to match our Submission type
          })
          .eq("id", userSubmission.id);
          
        if (error) throw error;
        
        toast.success("Your solution has been updated!");
        
        // Use type assertion to make TypeScript happy
        setUserSubmission({
          ...userSubmission,
          content: submissionContent,
          submitted_at: new Date().toISOString(),
          status: 'pending' as "pending" | "submitted" | "graded"
        });
      } else {
        // Create a new submission
        const { data, error } = await supabase
          .from("submissions")
          .insert({ 
            assessment_id: id,
            student_id: user?.id,
            content: submissionContent,
            status: 'pending' as "pending" | "submitted" | "graded"
          })
          .select()
          .single();
          
        if (error) throw error;
        
        toast.success("Your solution has been submitted!");
        setUserSubmission(data as Submission);
      }
    } catch (error: any) {
      console.error("Error submitting solution:", error);
      toast.error(`Submission failed: ${error.message}`);
    } finally {
      setSubmitting(false);
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
                  Score: {userSubmission.score}/{assessment.points_possible} points
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

  if (isLoading || loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4 flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                  {assessment.course?.name} ({assessment.course?.code})
                </CardDescription>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <Badge variant="outline" className="capitalize">{assessment.type}</Badge>
                <p className="text-sm">
                  {assessment.points_possible} points • 
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
                    {JSON.parse(assessment.rubric).map((item: RubricItem, index: number) => (
                      <div key={index} className="flex justify-between items-center py-1">
                        <span className="text-sm">{item.name}</span>
                        <Badge variant="outline" className="font-mono">Weight: {item.weight}</Badge>
                      </div>
                    ))}
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
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleSubmit}
                      disabled={submitting || !submissionContent.trim()}
                    >
                      {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {userSubmission ? 'Update Solution' : 'Submit Solution'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              This assessment uses rubric-based fuzzy logic for evaluation with bisector method defuzzification.
            </p>
          </CardFooter>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Assessment;
