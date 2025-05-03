import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Users, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const CoursesList = () => {
  const { user, profile, isLoading } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoadingCourses(true);
        
        let query;
        
        // Different query based on user role
        if (profile?.role === 'teacher') {
          // For teachers, get courses they created
          query = supabase
            .from("courses")
            .select("*")
            .eq("teacher_id", user.id);
        } else {
          // For students, get all available courses
          // This is a simplified approach - in a real app, you might have enrollment logic
          query = supabase
            .from("courses")
            .select("*");
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error("Error fetching courses:", error);
          toast.error("Failed to load courses");
          setCourses([]);
        } else {
          // Format data based on the role
          setCourses(data || []);
          
          // Initialize progress for each course (simulated data)
          const initialProgress = {};
          data.forEach(course => {
            initialProgress[course.id] = Math.floor(Math.random() * 100);
          });
          
          // Get stored progress if available
          const storedProgress = localStorage.getItem('courseProgress');
          if (storedProgress) {
            setProgress(JSON.parse(storedProgress));
          } else {
            setProgress(initialProgress);
            localStorage.setItem('courseProgress', JSON.stringify(initialProgress));
          }
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred while loading courses");
      } finally {
        setLoadingCourses(false);
      }
    };

    if (user && profile) {
      fetchCourses();
    }
  }, [user, profile]);

  // Function to update progress
  const updateProgress = (courseId, newProgress) => {
    const updatedProgress = { ...progress, [courseId]: newProgress };
    setProgress(updatedProgress);
    localStorage.setItem('courseProgress', JSON.stringify(updatedProgress));
  };

  if (isLoading || loadingCourses) {
    return (
      <MainLayout>
        <div className="container mx-auto py-8 px-4">
          <h1 className="text-2xl font-bold mb-6">My Courses</h1>
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Courses</h1>
          {profile?.role === 'teacher' && (
            <Button>
              <Users className="mr-2 h-4 w-4" /> Create New Course
            </Button>
          )}
        </div>
        
        {courses.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-medium">No courses found</h3>
                <p className="text-muted-foreground">
                  {profile?.role === 'teacher' 
                    ? "You haven't created any courses yet. Create your first course to get started."
                    : "There are no courses available at the moment."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl">{course.name}</CardTitle>
                  <CardDescription>{course.code}</CardDescription>
                </CardHeader>
                <CardContent className="pb-3">
                  <p className="text-foreground mb-4">{course.description || "No description available."}</p>
                  
                  {profile?.role === 'student' && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{progress[course.id] || 0}%</span>
                      </div>
                      <Progress value={progress[course.id] || 0} className="h-2" />
                      
                      {/* For demonstration purposes, add buttons to update progress */}
                      <div className="flex justify-between mt-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateProgress(course.id, Math.max(0, (progress[course.id] || 0) - 10))}
                        >
                          -10%
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => updateProgress(course.id, Math.min(100, (progress[course.id] || 0) + 10))}
                        >
                          +10%
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center mt-4 text-sm">
                    <Users className="h-4 w-4 mr-1 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {profile?.role === 'teacher' ? "25 students enrolled" : "Prof. Johnson"}
                    </span>
                    <div className="ml-auto flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-muted-foreground">Updated 2 days ago</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to={`/courses/${course.id}`} className="w-full">
                    <Button variant="secondary" className="w-full group">
                      View Course Details
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CoursesList;
