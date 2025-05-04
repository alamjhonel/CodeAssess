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
      <div className="w-full mt-8"> {/* Changed to full width */}
        <Card className="w-full"> {/* Removed max-width constraint */}
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-32" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" /> {/* Kept same height */}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full mt-8"> {/* Changed to full width */}
      <Card className="w-full"> {/* Removed max-width constraint */}
        <CardHeader>
          <CardTitle>Submission Status</CardTitle>
          <CardDescription>Breakdown of submission statuses</CardDescription>
        </CardHeader>
        <CardContent className="pb-6"> {/* Kept same padding */}
          <BarChart
            data={submissionsBarChartData}
            xField="name"
            yField="submissions"
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;