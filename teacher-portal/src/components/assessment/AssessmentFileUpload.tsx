
import React, { useState } from 'react';
import { FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Loader2, File, Check, X } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { AssessmentFormValues } from './AssessmentForm';

interface AssessmentFileUploadProps {
  form: UseFormReturn<AssessmentFormValues>;
  fieldName: 'content' | 'solution_code';
  label: string;
  description: string;
}

const AssessmentFileUpload: React.FC<AssessmentFileUploadProps> = ({
  form,
  fieldName,
  label,
  description
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's a text file
    if (file.type !== 'text/plain') {
      toast.error('Please upload a text (.txt) file only');
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        form.setValue(fieldName, content);
        toast.success(`${label} uploaded successfully`);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to read file content');
      } finally {
        setIsUploading(false);
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
      setIsUploading(false);
      setFileName(null);
    };

    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileName(null);
    form.setValue(fieldName, '');
  };

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="space-y-2">
          <FormLabel>{label}</FormLabel>
          <div className="flex flex-col gap-2">
            {!fileName ? (
              <div className="flex items-center gap-2">
                <Input
                  id={`file-upload-${fieldName}`}
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-dashed h-20"
                  onClick={() => document.getElementById(`file-upload-${fieldName}`)?.click()}
                >
                  <div className="flex flex-col items-center justify-center w-full">
                    <Upload className="h-5 w-5 mb-1 text-muted-foreground" />
                    <span className="text-sm">Upload .txt file</span>
                  </div>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 border rounded-md bg-muted/50">
                {isUploading ? (
                  <Loader2 className="h-5 w-5 text-primary animate-spin" />
                ) : (
                  <File className="h-5 w-5 text-primary" />
                )}
                <span className="flex-1 truncate text-sm">{fileName}</span>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  onClick={clearFile}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div>
              <FormDescription>
                {description}
              </FormDescription>
              <FormMessage />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default AssessmentFileUpload;
