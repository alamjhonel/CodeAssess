import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CircleDollarSign, FileCode, GraduationCap, BookOpen, BarChart } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface DashboardStatsProps {
  statistics: {
    total_submissions: number;
    average_score: number;
    section_averages?: {
      section: string;
      average: number;
    }[];
    subject_averages?: {
      subject: string;
      average: number;
    }[];
  } | null;
  coursesCount: number;
  isLoading: boolean;
  role?: 'student' | 'teacher';
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  statistics, 
  coursesCount,
  isLoading,
  role = 'student'
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {role === 'student' && (
          <Card>
            <CardHeader>
              <CardTitle>Submission Status</CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-32" />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        )}
        {role === 'teacher' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Section Averages</CardTitle>
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
                <CardTitle>Subject Averages</CardTitle>
                <CardDescription>
                  <Skeleton className="h-4 w-32" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          </>
        )}
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
      {role === 'student' && (
        <Card>
          <CardHeader>
            <CardTitle>Submission Status</CardTitle>
            <CardDescription>Your assessment submission progress</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-primary/10 p-3">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <span className="text-2xl font-semibold">{statistics?.total_submissions || 0}</span>
                <p className="text-muted-foreground">Total Submissions</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completed</span>
                <span>{statistics?.total_submissions || 0} / {coursesCount || 0}</span>
              </div>
              <Progress 
                value={((statistics?.total_submissions || 0) / (coursesCount || 1)) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {role === 'teacher' && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Section Averages</CardTitle>
              <CardDescription>Class performance by section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statistics?.section_averages?.map((section) => (
                <div key={section.section} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{section.section}</span>
                    <span>{section.average.toFixed(1)}%</span>
                  </div>
                  <Progress value={section.average} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subject Averages</CardTitle>
              <CardDescription>Class performance by subject</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {statistics?.subject_averages?.map((subject) => (
                <div key={subject.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{subject.subject}</span>
                    <span>{subject.average.toFixed(1)}%</span>
                  </div>
                  <Progress value={subject.average} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}

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
