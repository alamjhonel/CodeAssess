import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { useQuery } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Code, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { getAssessmentById, parseRubric } from "@/api/assessments";
import type { Assessment, RubricItem } from "@/api/assessments";

const Assessment = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [submissionContent, setSubmissionContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async () => {
    if (!submissionContent.trim()) {
      toast.error("Please enter your solution before submitting");
      return;
    }
    
    setSubmitting(true);
    try {
      if (userSubmission) {
        const { error } = await supabase
          .from("submissions")
          .update({ 
            content: submissionContent,
            submitted_at: new Date().toISOString(),
            status: 'pending'
          })
          .eq("id", userSubmission.id);
          
        if (error) throw error;
        toast.success("Your solution has been updated!");
      } else {
        const { error } = await supabase
          .from("submissions")
          .insert({ 
            assessment_id: id as string,
            student_id: user?.id,
            content: submissionContent,
            status: 'pending'
          });
          
        if (error) throw error;
        toast.success("Your solution has been submitted!");
      }
      await refetchSubmission();
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
                  
                  <div className="flex items-center mb-2 gap-2">
                    <Code className="h-4 w-4" />
                    <span className="text-sm font-medium">Your Solution</span>
                  </div>
                  
                  <textarea
                    className="w-full h-64 p-2 font-mono text-sm bg-muted/30 rounded-md"
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Enter your solution here..."
                  />
                  
                  <div className="mt-4 flex justify-end">
                    <Button 
                      onClick={handleSubmit}
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        userSubmission ? 'Update Submission' : 'Submit Solution'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Assessment;
