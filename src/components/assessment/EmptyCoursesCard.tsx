
import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

const EmptyCoursesCard: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>No Courses Available</CardTitle>
        <CardDescription>You need to create a course before creating an assessment</CardDescription>
      </CardHeader>
      <CardContent className="text-center py-8">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="mb-6">You don't have any courses yet. Create a course first to add assessments.</p>
        <Button onClick={() => navigate("/courses")}>Create Course</Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCoursesCard;
