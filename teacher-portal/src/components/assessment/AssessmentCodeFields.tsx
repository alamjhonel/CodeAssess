
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { AssessmentFormValues } from "./AssessmentForm";
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileCode, Shield, AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AssessmentFileUpload from "./AssessmentFileUpload";

interface AssessmentCodeFieldsProps {
  form: UseFormReturn<AssessmentFormValues>;
}

const AssessmentCodeFields: React.FC<AssessmentCodeFieldsProps> = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="solution_code"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Solution Code <span className="text-muted-foreground">(Required)</span>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="// Reference solution code"
                className="min-h-32 font-mono text-sm"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              This will be used to evaluate student submissions.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <AssessmentFileUpload 
        form={form}
        fieldName="solution_code"
        label="Or Upload Solution Code"
        description="Upload a text file containing your solution code. This will replace any manually entered code."
      />

      <FormField
        control={form.control}
        name="output_expected"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Expected Output <span className="text-muted-foreground">(Required)</span>
            </FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Enter the expected output of the solution code"
                className="min-h-24 font-mono text-sm"
                {...field} 
              />
            </FormControl>
            <FormDescription>
              Specify the expected output that correct solutions should produce.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="enforce_code_quality"
        render={({ field }) => (
          <FormItem className="flex flex-col space-y-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Enforce Code Quality
                </FormLabel>
                <FormDescription>
                  Reject submissions with hard-coded solutions or poor code structure
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </div>
            
            {field.value && (
              <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 text-sm">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-2 mt-0.5" />
                  <div className="space-y-2">
                    <h4 className="font-medium text-amber-800 dark:text-amber-300">Dump Code Detection</h4>
                    <p className="text-amber-700 dark:text-amber-400">
                      System will automatically reject "dump code" submissions that hardcode outputs instead of using 
                      proper programming constructs like loops and variables.
                    </p>
                    <div className="mt-2">
                      <h5 className="font-medium text-amber-800 dark:text-amber-300 mb-1">Example of rejected code:</h5>
                      <pre className="bg-amber-100 dark:bg-amber-900/50 p-2 rounded text-xs overflow-x-auto text-amber-800 dark:text-amber-300">
{`// Hard-coded outputs (C++)
cout << "*\\n";
cout << "**\\n";
cout << "***\\n";

// Instead of proper loops
for (int i = 1; i <= n; i++) {
    for (int j = 1; j <= i; j++) {
        cout << "*";
    }
    cout << endl;
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </FormItem>
        )}
      />
    </>
  );
};

export default AssessmentCodeFields;
