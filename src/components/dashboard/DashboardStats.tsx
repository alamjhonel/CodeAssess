import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleDollarSign, FileCode } from "lucide-react";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap */}
        <Card>
          <CardHeader>
            <CardTitle>Total Submissions</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Average Score</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-48" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6"> {/* Increased gap */}
      <Card>
        <CardHeader>
          <CardTitle>Total Submissions</CardTitle>
          <CardDescription>All submissions across your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-primary/10 p-3">
              <FileCode className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-semibold">{statistics?.total_submissions || 0}</span>
              <p className="text-muted-foreground">Total</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Average Score</CardTitle>
          <CardDescription>Average score across all graded submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-success/10 p-3">
              <CircleDollarSign className="h-6 w-6 text-success" />
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-semibold">{statistics?.average_score?.toFixed(2) || '0.00'}</span>
              <p className="text-muted-foreground">Average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;