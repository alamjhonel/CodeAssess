import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";

const assessmentSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  language: z.enum(["c", "cpp", "python"]),
  instructions: z.string().min(10, "Instructions must be at least 10 characters"),
  code: z.string().min(10, "Code must be at least 10 characters"),
  sampleOutput: z.string().min(1, "Sample output is required"),
  deadline: z.string().min(1, "Deadline is required"),
  rubric: z.array(z.string()).min(1, "Select at least one rubric item"),
  type: z.enum(["quiz", "assignment", "project", "exam"]),
  points_possible: z.number().min(1, "Points must be at least 1").max(1000, "Points cannot exceed 1000"),
});

type AssessmentFormValues = z.infer<typeof assessmentSchema>;

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

const CreateAssessmentForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileContent, setFileContent] = useState<string>("");
  const [customRubricItem, setCustomRubricItem] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const form = useForm<AssessmentFormValues>({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      title: "",
      language: "cpp",
      instructions: "",
      code: "",
      sampleOutput: "",
      deadline: "",
      rubric: [],
      type: "assignment",
      points_possible: 100,
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFileContent(content);
        form.setValue("code", content);
      };
      reader.readAsText(file);
    }
  };

  const handleAddCustomRubric = () => {
    if (customRubricItem.trim()) {
      const currentRubric = form.getValues("rubric");
      form.setValue("rubric", [...currentRubric, customRubricItem.trim()]);
      setCustomRubricItem("");
    }
  };

  const onSubmit = async (data: AssessmentFormValues) => {
    console.log("Form submitted with data:", data);
    
    if (!user) {
      console.error("No user found");
      toast.error("You must be logged in to create an assessment");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create the assessment in the database
      console.log("Creating assessment in database...");
      
      // Log the data we're trying to insert
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
        rubric: data.rubric,
        created_by: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      console.log("Attempting to insert:", assessmentData);

      const { data: result, error } = await supabase
        .from('assessments')
        .insert(assessmentData)
        .select(`
          *,
          profiles:created_by (
            id,
            first_name,
            last_name,
            email
          )
        `);

      if (error) {
        console.error('Database error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw new Error(error.message);
      }

      console.log("Assessment created successfully:", result);

      // Show success message
      toast.success("Assessment created successfully!", {
        description: "The assessment has been added to your dashboard.",
        duration: 5000,
      });

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);

    } catch (error: any) {
      console.error('Error creating assessment:', error);
      toast.error("Failed to create assessment", {
        description: error.message || "Please try again later.",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Assessment</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter assessment title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="quiz">Quiz</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="project">Project</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Programming Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="c">C</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="instructions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instructions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter assessment instructions"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code</FormLabel>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Input
                        ref={fileInputRef}
                        type="file"
                        accept=".txt"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Code
                      </Button>
                    </div>
                    <Textarea
                      placeholder="Or paste your code here"
                      className="min-h-[200px] font-mono"
                      {...field}
                      value={fileContent || field.value}
                    />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sampleOutput"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sample Output</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter expected output"
                      className="min-h-[100px] font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="points_possible"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points Possible</FormLabel>
                  <FormControl>
                    <Input type="number" min="1" max="1000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rubric"
              render={() => (
                <FormItem>
                  <FormLabel>Rubric</FormLabel>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      {defaultRubricItems.map((item) => (
                        <div key={item} className="flex items-center space-x-2">
                          <Checkbox
                            id={item}
                            checked={form.watch("rubric").includes(item)}
                            onCheckedChange={(checked) => {
                              const currentRubric = form.getValues("rubric");
                              if (checked) {
                                form.setValue("rubric", [...currentRubric, item]);
                              } else {
                                form.setValue(
                                  "rubric",
                                  currentRubric.filter((i) => i !== item)
                                );
                              }
                            }}
                          />
                          <label
                            htmlFor={item}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {item}
                          </label>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Input
                          placeholder="Add custom rubric item"
                          value={customRubricItem}
                          onChange={(e) => setCustomRubricItem(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleAddCustomRubric}
                          disabled={!customRubricItem.trim()}
                        >
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {form.watch("rubric")
                        .filter((item) => !defaultRubricItems.includes(item))
                        .map((item) => (
                          <div key={item} className="flex items-center space-x-2">
                            <Checkbox
                              id={item}
                              checked={true}
                              onCheckedChange={(checked) => {
                                if (!checked) {
                                  const currentRubric = form.getValues("rubric");
                                  form.setValue(
                                    "rubric",
                                    currentRubric.filter((i) => i !== item)
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={item}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item}
                            </label>
                          </div>
                        ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Assessment...
                </>
              ) : (
                "Create Assessment"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CreateAssessmentForm; 