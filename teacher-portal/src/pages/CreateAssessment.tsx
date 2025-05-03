import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import CreateAssessmentForm from "@/components/assessment/CreateAssessmentForm";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

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
        <div className="container mx-auto py-8">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <CreateAssessmentForm />
      </div>
    </MainLayout>
  );
};

export default CreateAssessment;
