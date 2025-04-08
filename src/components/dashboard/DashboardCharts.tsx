
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/bar-chart";
import { DoughnutChart } from "@/components/ui/doughnut-chart";
import { Skeleton } from "@/components/ui/skeleton";

interface DashboardChartsProps {
  submissionsBarChartData: { name: string; submissions: number }[];
  courseCompletionData: { name: string; value: number }[];
  isLoading: boolean;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  submissionsBarChartData,
  courseCompletionData,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-32" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course Completion</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-32" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Submission Status</CardTitle>
          <CardDescription>Breakdown of submission statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={submissionsBarChartData}
            xField="name"
            yField="submissions"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Course Completion</CardTitle>
          <CardDescription>Your progress in enrolled courses</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <DoughnutChart data={courseCompletionData} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
