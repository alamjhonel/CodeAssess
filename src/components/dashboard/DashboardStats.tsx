
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleDollarSign, FileCode, GraduationCap } from "lucide-react";

interface DashboardStatsProps {
  statistics: {
    total_submissions: number;
    average_score: number;
  } | null;
  coursesCount: number;
  isLoading: boolean;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  statistics, 
  coursesCount,
  isLoading 
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-32" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-32" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Courses Enrolled</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-32" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Submissions</CardTitle>
          <CardDescription>All submissions across your courses</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <div className="rounded-full bg-primary/10 p-3">
            <FileCode className="h-6 w-6 text-primary" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-semibold">{statistics?.total_submissions || 0}</span>
            <p className="text-muted-foreground">Total</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Score</CardTitle>
          <CardDescription>Average score across all graded submissions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <div className="rounded-full bg-success/10 p-3">
            <CircleDollarSign className="h-6 w-6 text-success" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-semibold">{statistics?.average_score?.toFixed(2) || '0.00'}</span>
            <p className="text-muted-foreground">Average</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Courses Enrolled</CardTitle>
          <CardDescription>Total number of courses you're enrolled in</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <div className="rounded-full bg-secondary/10 p-3">
            <GraduationCap className="h-6 w-6 text-secondary" />
          </div>
          <div className="space-y-1">
            <span className="text-2xl font-semibold">{coursesCount || 0}</span>
            <p className="text-muted-foreground">Courses</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
