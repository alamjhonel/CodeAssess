
import React, { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Filter } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Define simple interface for course data instead of using complex inferred types
interface Course {
  id: string;
  name: string;
}

const ExportData = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Form state
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [includeFuzzyGrades, setIncludeFuzzyGrades] = useState(true);
  const [includePercentageScores, setIncludePercentageScores] = useState(true);
  const [includeRemarks, setIncludeRemarks] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('id, name')
          .eq('teacher_id', user.id);
          
        if (error) throw error;
        setCourses(data || []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        toast.error('Failed to load courses');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [user]);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to export data');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const { data: functionData, error } = await supabase.functions.invoke('export-excel', {
        body: {
          courseId: selectedCourseId || undefined,
          options: {
            includeFuzzyGrades,
            includePercentageScores,
            includeRemarks,
          },
          userId: user.id
        }
      });
      
      if (error) throw error;
      
      if (functionData && functionData.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = functionData.url;
        link.setAttribute('download', 'assessment-data.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('Data exported successfully!');
      } else {
        throw new Error('No data returned from export function');
      }
    } catch (error: any) {
      console.error('Error exporting data:', error);
      toast.error(error.message || 'Failed to export data');
    } finally {
      setIsExporting(false);
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

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="mr-2 h-5 w-5" />
              Export Assessment Data
            </CardTitle>
            <CardDescription>
              Export assessment data to Excel for further analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">You don't have any courses yet</p>
                <Button onClick={() => window.location.href = '/courses'}>Create a Course</Button>
              </div>
            ) : (
              <form onSubmit={handleExport} className="space-y-6">
                <div className="space-y-2">
                  <Label className="flex items-center">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter by Course (Optional)
                  </Label>
                  <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select a specific course or export data for all courses
                  </p>
                </div>
                
                <div className="space-y-4 border rounded-md p-4">
                  <h3 className="font-medium">Export Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeFuzzyGrades"
                        checked={includeFuzzyGrades}
                        onCheckedChange={(checked) => setIncludeFuzzyGrades(checked as boolean)}
                      />
                      <Label htmlFor="includeFuzzyGrades">Include Fuzzy Grades</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includePercentageScores"
                        checked={includePercentageScores}
                        onCheckedChange={(checked) => setIncludePercentageScores(checked as boolean)}
                      />
                      <Label htmlFor="includePercentageScores">Include Percentage Scores</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="includeRemarks"
                        checked={includeRemarks}
                        onCheckedChange={(checked) => setIncludeRemarks(checked as boolean)}
                      />
                      <Label htmlFor="includeRemarks">Include Remarks</Label>
                    </div>
                  </div>
                </div>
                
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isExporting}
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting Data...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export to Excel
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default ExportData;
