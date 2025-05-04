import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Clock, ListChecks, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Assessment, parseRubric } from "@/api/assessments";
import { Json } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";

interface StudentAssessmentsProps {
  assessments: Assessment[];
  isLoading: boolean;
}

const StudentAssessments: React.FC<StudentAssessmentsProps> = ({ assessments, isLoading }) => {
  // Sort assessments by due date, with overdue assessments first
  const sortedAssessments = React.useMemo(() => {
    if (!assessments) return [];
    return [...assessments].sort((a, b) => {
      const now = new Date();
      const dueDateA = new Date(a.due_date || 0);
      const dueDateB = new Date(b.due_date || 0);
      
      // If both are overdue, sort by how overdue they are
      if (dueDateA < now && dueDateB < now) {
        return dueDateA.getTime() - dueDateB.getTime();
      }
      // If only one is overdue, put it first
      if (dueDateA < now) return -1;
      if (dueDateB < now) return 1;
      // If neither is overdue, sort by due date
      return dueDateA.getTime() - dueDateB.getTime();
    });
  }, [assessments]);

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
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No assessments yet</h3>
            <p className="text-muted-foreground">
              Your teacher hasn't assigned any assessments yet. Check back later!
            </p>
          </div>
        </CardContent>
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
        <div className="space-y-6">
          {sortedAssessments.map((assessment) => {
            const dueDate = new Date(assessment.due_date || 0);
            const isOverdue = dueDate < new Date();
            
            return (
              <div
                key={assessment.id}
                className="flex flex-col p-6 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">{assessment.title}</h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline">{assessment.type}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {assessment.points_possible} points
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    {assessment.due_date && (
                      <div className={`flex items-center text-sm ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                        <Clock className="h-4 w-4 mr-1" />
                        {isOverdue ? (
                          <span className="flex items-center">
                            Overdue: {dueDate.toLocaleDateString()}
                            <AlertCircle className="h-4 w-4 ml-1" />
                          </span>
                        ) : (
                          `Due: ${dueDate.toLocaleDateString()}`
                        )}
                      </div>
                    )}
                    <Link to={`/assessment/${assessment.id}`}>
                      <Button variant="outline" size="sm">
                        View Assessment
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-2 text-sm text-muted-foreground">
                  <p className="mb-2 line-clamp-2">{assessment.content}</p>
                </div>

                <div className="mt-4">
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <ListChecks className="h-4 w-4 mr-2" />
                    <span>Grading Criteria</span>
                  </div>
                  <div className="pl-6">
                    <p className="text-sm text-muted-foreground">
                      This assessment will be graded using Rubric-based Fuzzy Logic on the following criteria:
                    </p>
                    {(() => {
                      const rubricItems = parseRubric(assessment.rubric);
                      if (!rubricItems || rubricItems.length === 0) {
                        return (
                          <p className="text-sm text-muted-foreground italic mt-2">
                            No rubric items available
                          </p>
                        );
                      }
                      return (
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          {rubricItems.map((item, index) => (
                            <li key={index} className="text-sm text-muted-foreground">
                              {item.name} (Weight: {item.weight}%)
                            </li>
                          ))}
                        </ul>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentAssessments; 