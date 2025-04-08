import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import FadeIn from "@/components/animations/FadeIn";

const CourseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile, isLoading } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      try {
        // Simulate fetching course details from an API
        // Replace this with your actual data fetching logic
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate network delay
        const mockCourse = {
          id: id,
          title: `Course ${id}`,
          description: `Details for Course ${id}. This is a mock course.`,
          instructor: "John Doe",
          modules: [
            { id: "1", title: "Module 1: Introduction", content: "Introduction content goes here." },
            { id: "2", title: "Module 2: Basics", content: "Basics content goes here." },
          ],
        };
        setCourse(mockCourse);
      } catch (error) {
        console.error("Failed to fetch course details", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id]);

  return (
    <MainLayout>
      <div className="container px-4 py-8 mx-auto mt-8">
        <FadeIn>
          {loading ? (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : course ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
                <p className="text-muted-foreground">{course.description}</p>
              </div>

              <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Course Content</CardTitle>
                  <CardDescription>Explore the modules in this course</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {course.modules.map((module) => (
                    <div key={module.id} className="border rounded-md p-4 hover:shadow-sm transition-shadow duration-200">
                      <h2 className="text-xl font-semibold mb-2">{module.title}</h2>
                      <p className="text-gray-600">{module.content}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="text-center">
              <p className="text-muted-foreground">Course not found</p>
              <Link to="/courses">
                <Button variant="link">Back to Courses</Button>
              </Link>
            </div>
          )}
        </FadeIn>
      </div>
    </MainLayout>
  );
};

export default CourseDetails;
