import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Assessment } from "@/api/assessments";

interface StudentAssessmentsProps {
  assessments: Assessment[];
  isLoading: boolean;
}

const StudentAssessments: React.FC<StudentAssessmentsProps> = ({ assessments, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Assessments</CardTitle>
          <CardDescription>Loading your assessments...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted/30 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!assessments || assessments.length === 0) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Assessments</CardTitle>
          <CardDescription>No assessments available at the moment</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Your Assessments</CardTitle>
        <CardDescription>View and complete your assigned assessments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assessments.map((assessment) => (
            <div
              key={assessment.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{assessment.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {assessment.points_possible} points • {assessment.type}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {assessment.due_date && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Due: {new Date(assessment.due_date).toLocaleDateString()}
                  </div>
                )}
                <Link to={`/assessment/${assessment.id}`}>
                  <Button variant="outline" size="sm">
                    View Assessment
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAssessments; 