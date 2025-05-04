import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import CreateAssessmentForm from "@/components/assessment/CreateAssessmentForm";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const CreateAssessment = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("You must be logged in to create an assessment");
      navigate('/login');
      return;
    }

    if (!authLoading && profile?.role !== 'teacher') {
      toast.error("Only teachers can create assessments");
      navigate('/dashboard');
      return;
    }
  }, [user, profile, authLoading, navigate]);

  if (authLoading) {
    return (
      <MainLayout>
        <div className="container max-w-2xl py-8">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async (data: any) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('assessments').insert({
        title: data.title,
        type: data.type,
        content: data.instructions,
        solution_code: data.code,
        test_cases: [{
          input: "",
          expected_output: data.sampleOutput,
          description: "Default test case",
          weight: 100
        }],
        due_date: data.deadline,
        points_possible: data.points_possible,
        rubric: data.rubric.map((item: string) => ({ name: item, weight: 10 })),
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success("Assessment created successfully!");
      navigate('/dashboard');
    } catch (error: any) {
      toast.error("Failed to create assessment", {
        description: error.message || "Please try again later.",
      });
    }
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl py-8">
        <CreateAssessmentForm onSubmit={handleSubmit} />
      </div>
    </MainLayout>
  );
};

export default CreateAssessment;
