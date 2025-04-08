
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileCode, Upload, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface CodeFileUploaderProps {
  fileName: string | null;
  setFileName: (name: string | null) => void;
  setCode: (code: string) => void;
}

const CodeFileUploader: React.FC<CodeFileUploaderProps> = ({ 
  fileName, 
  setFileName, 
  setCode 
}) => {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type extensions
    const validExtensions = ['.txt', '.c', '.cpp', '.py'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
      toast.error('Please upload a valid text or code file (.txt, .c, .cpp, .py)');
      return;
    }

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        setCode(content);
        toast.success('Code file loaded successfully');
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error('Failed to read file content');
      }
    };

    reader.onerror = () => {
      toast.error('Failed to read file');
      setFileName(null);
    };

    reader.readAsText(file);
  };

  const clearFile = () => {
    setFileName(null);
    setCode('');
  };

  return (
    <div className="space-y-2">
      <Label>Or Upload Code File</Label>
      <div className="flex items-center gap-2">
        <input
          id="code-file-upload"
          type="file"
          accept=".txt,.c,.cpp,.py"
          className="hidden"
          onChange={handleFileUpload}
        />
        {!fileName ? (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById('code-file-upload')?.click()}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload File
          </Button>
        ) : (
          <div className="flex items-center gap-2 p-2 w-full border rounded-md">
            <FileCode className="h-4 w-4 text-primary" />
            <span className="flex-1 truncate text-sm">{fileName}</span>
            <div className="flex">
              <Check className="h-4 w-4 text-green-500 mr-1.5" />
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
          </div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        Supported formats: .txt, .c, .cpp, .py
      </p>
    </div>
  );
};

export default CodeFileUploader;
