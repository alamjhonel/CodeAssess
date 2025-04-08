
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Loader2, PlusCircle, Save, X, Check, Code } from "lucide-react";
import AssessmentBasicFields from "./AssessmentBasicFields";
import AssessmentTypeFields from "./AssessmentTypeFields";
import AssessmentContentFields from "./AssessmentContentFields";
import AssessmentCodeFields from "./AssessmentCodeFields";
import AssessmentRubricFields from "./AssessmentRubricFields";
import AssessmentLanguageFields from "./AssessmentLanguageFields";
import { ProgrammingLanguage } from "./AssessmentLanguageFields";

// Export the schema so it can be imported elsewhere
export const assessmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  content: z.string().min(10, "Content must be at least 10 characters long"),
  course_id: z.string().uuid("Please select a course"),
  type: z.enum(["quiz", "assignment", "project", "exam"]),
  due_date: z.date().optional(),
  points_possible: z.coerce.number().min(1, "Points must be at least 1").max(1000, "Points cannot exceed 1000"),
  solution_code: z.string().min(10, "Solution code must be at least 10 characters long"),
  output_expected: z.string().min(1, "Expected output must be provided").optional(),
  enforce_code_quality: z.boolean().default(true),
  rubricItems: z.array(z.string()).default([]),
  customRubricItems: z.array(z.string()).default([]),
  allowedLanguages: z.array(z.enum(["c", "cpp", "python"])).default(["cpp"]),
  enforceLanguage: z.boolean().default(true),
  testCases: z.array(z.object({
    input: z.string().optional(),
    expected_output: z.string(),
    description: z.string().optional(),
    weight: z.number().min(1).max(100).default(10)
  })).optional()
});

export type AssessmentFormValues = z.infer<typeof assessmentSchema>;

interface AssessmentFormProps {
  courses: any[];
  isSubmitting: boolean;
  onSubmit: (data: AssessmentFormValues) => Promise<void>;
}

const defaultRubricItems = [
  "Code compiles without errors",
  "Variable names are descriptive",
  "Code has proper indentation",
  "Comments explain the code",
  "Solution addresses all requirements",
  "Efficient algorithm implementation",
  "Proper error handling",
  "Code follows standard conventions"
];

const AssessmentForm: React.FC<AssessmentFormProps> = ({ courses, isSubmitting, onSubmit }) => {
  const [customRubricItem, setCustomRubricItem] = useState("");

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      course_id: "",
      type: "assignment",
      points_possible: 100,
      solution_code: "",
      output_expected: "",
      enforce_code_quality: true,
      rubricItems: [],
      customRubricItems: [],
      allowedLanguages: ["cpp"],
      enforceLanguage: true,
      testCases: []
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <AssessmentBasicFields form={form} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AssessmentTypeFields form={form} courses={courses} />
        </div>
        
        <AssessmentContentFields form={form} />
        
        <div className="p-4 border rounded-md bg-card/50">
          <h3 className="text-lg font-medium mb-4 flex items-center text-foreground">
            <Code className="mr-2 h-5 w-5" />
            Programming Requirements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <AssessmentLanguageFields form={form} />
          </div>
          
          <AssessmentCodeFields form={form} />
        </div>
        
        <AssessmentRubricFields 
          form={form} 
          defaultItems={defaultRubricItems}
        />

        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Assessment
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AssessmentForm;
