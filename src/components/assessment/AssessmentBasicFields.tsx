
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AssessmentFormValues } from "./AssessmentForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AssessmentBasicFieldsProps {
  form: UseFormReturn<AssessmentFormValues>;
}

const AssessmentBasicFields: React.FC<AssessmentBasicFieldsProps> = ({ form }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-foreground">Title <span className="text-red-500">*</span></FormLabel>
            <FormControl>
              <Input 
                placeholder="C++ Array Manipulation Assignment" 
                {...field} 
                className="text-foreground bg-background"
              />
            </FormControl>
            <FormDescription className="text-muted-foreground">
              A clear, descriptive title for the assessment
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default AssessmentBasicFields;
