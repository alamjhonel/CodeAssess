import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Clock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Assessment } from "@/api/assessments";
import { Badge } from "@/components/ui/badge";

interface TeacherAssessmentsProps {
  assessments: Assessment[];
  isLoading: boolean;
}

const TeacherAssessments: React.FC<TeacherAssessmentsProps> = ({ assessments, isLoading }) => {
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Assessments</CardTitle>
              <CardDescription>No assessments available</CardDescription>
            </div>
            <Link to="/create-assessment">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No assessments yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first assessment to get started
            </p>
            <Link to="/create-assessment">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Assessment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Assessments</CardTitle>
            <CardDescription>Manage and create assessments for your students</CardDescription>
          </div>
          <Link to="/create-assessment">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Assessment
            </Button>
          </Link>
        </div>
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
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="h-4 w-4 mr-1" />
                  <span>0 submissions</span>
                </div>
                <Link to={`/assessment/${assessment.id}`}>
                  <Button variant="outline" size="sm">
                    View Details
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

export default TeacherAssessments; 