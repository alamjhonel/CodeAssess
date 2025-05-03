
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AssessmentFormValues } from "./AssessmentForm";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { FileText } from "lucide-react";
import AssessmentFileUpload from "./AssessmentFileUpload";

interface AssessmentContentFieldsProps {
  form: UseFormReturn<AssessmentFormValues>;
}

const AssessmentContentFields: React.FC<AssessmentContentFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Brief description of the assessment"
                className="min-h-24"
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="content"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Instructions <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Detailed instructions for students..."
                className="min-h-32"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Provide clear instructions on what students need to implement
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <AssessmentFileUpload 
        form={form}
        fieldName="content"
        label="Or Upload Instructions File"
        description="Upload a text file containing your instructions. This will replace any manually entered instructions."
      />
    </>
  );
};

export default AssessmentContentFields;
