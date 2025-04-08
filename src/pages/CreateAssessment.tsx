
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AssessmentTypeFields, 
  AssessmentBasicFields, 
  AssessmentContentFields, 
  AssessmentLanguageFields, 
  AssessmentCodeFields, 
  AssessmentRubricFields,
  assessmentSchema,
  AssessmentFormValues
} from "@/components/assessment";
import MainLayout from "@/components/layout/MainLayout";
import FadeIn from "@/components/animations/FadeIn";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/auth";
import EmptyCoursesCard from "@/components/assessment/EmptyCoursesCard";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const CreateAssessment = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasCourses, setHasCourses] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<any[]>([]);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  
  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "assignment",
      course_id: "",
      points_possible: 100,
      enforce_code_quality: true,
      solution_code: "",
      output_expected: "",
      content: "",
      due_date: undefined,
      rubricItems: [],
      customRubricItems: [],
      allowedLanguages: ["cpp"],
      enforceLanguage: true
    }
  });
  
  useEffect(() => {
    const checkCourses = async () => {
      if (!user) return;
      
      try {
        console.log("Checking courses for user:", user.id);
        const { data, error } = await supabase
          .from('courses')
          .select('id, name, code')
          .eq('teacher_id', user.id);
          
        if (error) throw error;
        
        console.log("Courses data:", data);
        setHasCourses(data && data.length > 0);
        setCourses(data || []);
      } catch (error) {
        console.error('Error checking courses:', error);
        toast.error('Failed to check courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkCourses();
  }, [user]);

  // Check if user is a teacher before rendering
  useEffect(() => {
    if (profile && profile.role !== 'teacher' && !isLoading) {
      toast.error('Only teachers can create assessments');
      navigate('/dashboard');
    }
  }, [profile, isLoading, navigate]);
  
  const onSubmit = async (data: AssessmentFormValues) => {
    if (!user) {
      toast.error('You must be logged in to create an assessment');
      return;
    }
    
    if (profile?.role !== 'teacher') {
      toast.error('Only teachers can create assessments');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Convert Date object to ISO string for storage
      const formattedDueDate = data.due_date ? data.due_date.toISOString() : null;
      
      // Combine rubric items for storage
      const rubricItems = [
        ...data.rubricItems,
        ...data.customRubricItems
      ];

      // Create the assessment
      const { error } = await supabase.from('assessments').insert({
        title: data.title,
        description: data.description,
        course_id: data.course_id,
        type: data.type,
        language: data.allowedLanguages[0], // Get the first language from the array
        points_possible: data.points_possible,
        solution_code: data.solution_code,
        content: data.content, 
        due_date: formattedDueDate,
        created_by: user.id,
        rubric: rubricItems,
        test_cases: [{ 
          expected_output: data.output_expected,
          weight: 100
        }]
      });
      
      if (error) throw error;
      
      toast.success('Assessment created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating assessment:', error);
      toast.error(error.message || 'Failed to create assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 h-[80vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }
  
  if (!hasCourses) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8">
          <EmptyCoursesCard />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <FadeIn>
          <Card className="mb-8 border-border/40">
            <CardHeader>
              <CardTitle className="text-2xl">Create New Assessment</CardTitle>
              <CardDescription>
                Create a new programming assessment for your students to complete
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                      <AssessmentTypeFields form={form} courses={courses} />
                      <AssessmentBasicFields form={form} />
                      <AssessmentLanguageFields form={form} />
                    </div>
                    <div className="space-y-6">
                      <AssessmentContentFields form={form} />
                      <AssessmentCodeFields form={form} />
                    </div>
                  </div>
                  
                  <AssessmentRubricFields form={form} defaultItems={[
                    "Code compiles without errors",
                    "Variable names are descriptive",
                    "Code has proper indentation",
                    "Comments explain the code",
                    "Solution addresses all requirements",
                    "Efficient algorithm implementation",
                    "Proper error handling",
                    "Code follows standard conventions"
                  ]} />
                  
                  <Button
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Assessment...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Create Assessment
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </MainLayout>
  );
};

export default CreateAssessment;
