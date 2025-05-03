
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AssessmentFormValues } from "@/components/assessment/AssessmentForm";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Languages } from "lucide-react";

// Explicitly define allowed language types
export type ProgrammingLanguage = "c" | "cpp" | "python";

interface AssessmentLanguageFieldsProps {
  form: UseFormReturn<AssessmentFormValues>;
}

const AssessmentLanguageFields: React.FC<AssessmentLanguageFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="allowedLanguages"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <Languages className="mr-2 h-4 w-4" />
              Programming Language <span className="text-red-500">*</span>
            </FormLabel>
            <Select 
              onValueChange={(value) => {
                // Ensure the type is treated as a ProgrammingLanguage
                const language = value as ProgrammingLanguage;
                field.onChange([language]);
              }}
              defaultValue={field.value?.[0]}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="c">C</SelectItem>
                <SelectItem value="cpp">C++</SelectItem>
                <SelectItem value="python">Python</SelectItem>
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the programming language for this assessment (C, C++, or Python only)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AssessmentLanguageFields;
