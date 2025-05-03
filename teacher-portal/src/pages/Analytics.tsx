
import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Download, FileText, Loader2, Users, PieChart, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

const Analytics = () => {
  const { profile, user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [loading, setLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        if (profile?.role === 'teacher') {
          // Fetch teacher's courses
          const { data, error } = await supabase
            .from("courses")
            .select("*")
            .eq("teacher_id", user.id);
            
          if (error) {
            console.error("Error fetching courses:", error);
          } else {
            setCourses(data || []);
          }
        } else {
          // For students we'd fetch their enrollment and assessment data
          // Simplified for now
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, profile]);

  // Export data to Excel
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Get the current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("No valid session found");
        return;
      }
      
      // Call the Supabase Edge Function
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/export-excel`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ 
          exportType: 'assessment-results',
          courseId: selectedCourse !== 'all' ? selectedCourse : null 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export data');
      }
      
      // Get the CSV content
      const csvContent = await response.text();
      
      // Create a download link and trigger download
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `analytics-${selectedCourse}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Successfully exported analytics data");
    } catch (error) {
      console.error("Export error:", error);
      toast.error(error.message || "Failed to export analytics data");
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          
          {profile?.role === 'teacher' && (
            <Button 
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Export to Excel
                </>
              )}
            </Button>
          )}
        </div>
        
        {profile?.role === 'teacher' && (
          <div className="mb-6">
            <label htmlFor="course-filter" className="block text-sm font-medium mb-1">
              Filter by Course:
            </label>
            <select
              id="course-filter"
              className="w-full sm:w-60 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              <option value="all">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.name} ({course.code})</option>
              ))}
            </select>
          </div>
        )}
        
        {profile?.role === 'teacher' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <CardTitle>Student Performance</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-40 flex items-center justify-center bg-muted/40 rounded-md">
                      <BarChart className="h-20 w-20 text-muted-foreground/30" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Class Average</span>
                          <span>78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Passing Rate</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-green-500" />
                    <CardTitle>Assessment Completion</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-40 flex items-center justify-center bg-muted/40 rounded-md">
                      <PieChart className="h-20 w-20 text-muted-foreground/30" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">On Time</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Late</span>
                          <span>12%</span>
                        </div>
                        <Progress value={12} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <BarChart className="h-5 w-5 text-purple-500" />
                    <CardTitle>Time Analysis</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-40 flex items-center justify-center bg-muted/40 rounded-md">
                      <Activity className="h-20 w-20 text-muted-foreground/30" />
                    </div>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Avg. Completion Time</span>
                          <span>65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Time Efficiency</span>
                          <span>73%</span>
                        </div>
                        <Progress value={73} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Detailed Reports</CardTitle>
                <CardDescription>Assessment performance by class and student</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Assessment</th>
                        <th className="text-left py-3 px-4">Students</th>
                        <th className="text-left py-3 px-4">Avg. Score</th>
                        <th className="text-left py-3 px-4">Completion</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">Introduction to Programming</td>
                        <td className="py-3 px-4">24</td>
                        <td className="py-3 px-4">78%</td>
                        <td className="py-3 px-4">92%</td>
                        <td className="py-3 px-4">2025-03-15</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Export
                          </Button>
                        </td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">Data Structures</td>
                        <td className="py-3 px-4">18</td>
                        <td className="py-3 px-4">65%</td>
                        <td className="py-3 px-4">83%</td>
                        <td className="py-3 px-4">2025-03-02</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Export
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4">Algorithms</td>
                        <td className="py-3 px-4">21</td>
                        <td className="py-3 px-4">72%</td>
                        <td className="py-3 px-4">88%</td>
                        <td className="py-3 px-4">2025-03-20</td>
                        <td className="py-3 px-4">
                          <Button variant="outline" size="sm">
                            <Download className="h-3.5 w-3.5 mr-1" />
                            Export
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          // Student view
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle>Your Performance</CardTitle>
                  <CardDescription>Overall academic performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Overall Grade</span>
                        <span className="font-bold">85%</span>
                      </div>
                      <Progress value={85} className="h-2.5" />
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium">Course Breakdown</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Introduction to Programming</span>
                            <span>92%</span>
                          </div>
                          <Progress value={92} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Data Structures</span>
                            <span>78%</span>
                          </div>
                          <Progress value={78} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Algorithm Analysis</span>
                            <span>81%</span>
                          </div>
                          <Progress value={81} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Database Systems</span>
                            <span>88%</span>
                          </div>
                          <Progress value={88} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Full Report
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Skill Assessment</CardTitle>
                  <CardDescription>Performance across different skill categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="h-48 flex items-center justify-center bg-muted/40 rounded-md">
                      <BarChart className="h-20 w-20 text-muted-foreground/30" />
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Problem Solving</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Code Quality</span>
                          <span>79%</span>
                        </div>
                        <Progress value={79} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Algorithm Efficiency</span>
                          <span>72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Testing</span>
                          <span>91%</span>
                        </div>
                        <Progress value={91} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Assessment Results</CardTitle>
                <CardDescription>Detailed results from your latest assessments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Assessment</th>
                        <th className="text-left py-3 px-4">Course</th>
                        <th className="text-left py-3 px-4">Score</th>
                        <th className="text-left py-3 px-4">Feedback</th>
                        <th className="text-left py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">Recursion Lab</td>
                        <td className="py-3 px-4">Data Structures</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                            92%
                          </span>
                        </td>
                        <td className="py-3 px-4">Excellent work on the recursive solutions</td>
                        <td className="py-3 px-4">2025-03-18</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">Binary Trees Quiz</td>
                        <td className="py-3 px-4">Data Structures</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                            85%
                          </span>
                        </td>
                        <td className="py-3 px-4">Strong understanding of tree traversal</td>
                        <td className="py-3 px-4">2025-03-15</td>
                      </tr>
                      <tr className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">Database Design Project</td>
                        <td className="py-3 px-4">Database Systems</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-900 px-2.5 py-0.5 text-xs font-medium text-yellow-800 dark:text-yellow-300">
                            78%
                          </span>
                        </td>
                        <td className="py-3 px-4">Good schema design, improve normalization</td>
                        <td className="py-3 px-4">2025-03-10</td>
                      </tr>
                      <tr className="hover:bg-muted/50">
                        <td className="py-3 px-4">Sorting Algorithms Test</td>
                        <td className="py-3 px-4">Algorithm Analysis</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                            90%
                          </span>
                        </td>
                        <td className="py-3 px-4">Excellent time complexity analysis</td>
                        <td className="py-3 px-4">2025-03-05</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="ml-auto">View All Results</Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Analytics;
