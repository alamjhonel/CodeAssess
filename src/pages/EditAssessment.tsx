import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import MainLayout from "@/components/layout/MainLayout";
import CreateAssessmentForm from "@/components/assessment/CreateAssessmentForm";
import { getAssessmentById, updateAssessment, Assessment } from "@/api/assessments";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type UpdateAssessmentData = {
  id: string;
  data: Partial<Omit<Assessment, "id" | "created_at" | "updated_at">>;
};

const EditAssessment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();

  const { data: assessment, isLoading, error } = useQuery({
    queryKey: ["assessment", id],
    queryFn: () => getAssessmentById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation<Assessment | null, Error, UpdateAssessmentData>({
    mutationFn: ({ id, data }) => updateAssessment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assessment", id] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      toast.success("Assessment updated successfully!");
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error("Failed to update assessment", {
        description: error.message || "Please try again later.",
      });
    },
  });

  if (!user || !profile || profile.role !== "teacher") {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-muted-foreground">
            You must be a teacher to edit assessments.
          </p>
        </div>
      </MainLayout>
    );
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !assessment) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-lg text-destructive">
            {error instanceof Error ? error.message : "Failed to load assessment"}
          </p>
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async (data: any) => {
    if (!user || !id) return;

    const assessmentData = {
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
      updated_at: new Date().toISOString()
    };

    await updateMutation.mutateAsync({ id, data: assessmentData });
  };

  return (
    <MainLayout>
      <div className="container max-w-2xl py-8">
        <CreateAssessmentForm
          initialData={assessment}
          onSubmit={handleSubmit}
          isEditing={true}
        />
      </div>
    </MainLayout>
  );
};

export default EditAssessment; 