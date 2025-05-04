import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Plus, Clock, Users, ListChecks, Pencil, Trash2, Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Assessment, parseRubric } from "@/api/assessments";
import { Badge } from "@/components/ui/badge";
import { Json } from "@/integrations/supabase/types";
import { toast } from "sonner";
import { deleteAssessment } from "@/api/assessments";

interface TeacherAssessmentsProps {
  assessments: Assessment[];
  isLoading: boolean;
}

const TeacherAssessments: React.FC<TeacherAssessmentsProps> = ({ assessments, isLoading }) => {
  const navigate = useNavigate();

  // Sort assessments by creation date in descending order
  const sortedAssessments = React.useMemo(() => {
    if (!assessments) return [];
    return [...assessments].sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB.getTime() - dateA.getTime();
    });
  }, [assessments]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this assessment? This action cannot be undone.")) {
      return;
    }

    try {
      const success = await deleteAssessment(id);
      if (success) {
        toast.success("Assessment deleted successfully");
        // Refresh the page to update the list
        window.location.reload();
      } else {
        toast.error("Failed to delete assessment");
      }
    } catch (error) {
      console.error("Error deleting assessment:", error);
      toast.error("An error occurred while deleting the assessment");
    }
  };

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
          <div className="text-center py-12">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No assessments yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first assessment to get started with your class
            </p>
            <Link to="/create-assessment">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Assessment
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
        <div className="space-y-6">
          {sortedAssessments.map((assessment) => (
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
                <div className="flex items-center space-x-2">
                  {assessment.due_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      Due: {new Date(assessment.due_date).toLocaleDateString()}
                    </div>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate(`/edit-assessment/${assessment.id}`)}
                    title="Edit Assessment"
                    className="hover:bg-muted"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(assessment.id)}
                    title="Delete Assessment"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link to={`/assessment/${assessment.id}`}>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherAssessments; 