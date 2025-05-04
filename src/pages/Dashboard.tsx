import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStatistics } from "@/api/statistics";
import { getSubmissions } from "@/api/submissions";
import { getCourses } from "@/api/courses";
import { getAssessments } from "@/api/assessments";
import { useAuth } from "@/contexts/auth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageTransition from "@/components/animations/PageTransition";
import { DashboardLoading, DashboardStats, DashboardCharts } from "@/components/dashboard";
import StudentAssessments from "@/components/dashboard/StudentAssessments";
import TeacherAssessments from "@/components/dashboard/TeacherAssessments";
import { toast } from "sonner";

const Dashboard: React.FC = () => {
  const { user, profile, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  console.log("Dashboard rendering, auth state:", { user: !!user, authLoading });

  // Authentication check
  useEffect(() => {
    console.log("Dashboard useEffect checking auth", { user: !!user, authLoading });
    if (!authLoading && !user) {
      console.log("No user found, redirecting to login");
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  // Show a welcome toast when dashboard loads for logged-in users
  useEffect(() => {
    if (user && !authLoading) {
      toast.success(`Welcome to CodeGrade, ${user.email?.split('@')[0] || 'User'}`);
    }
  }, [user, authLoading]);

  // Only enable these queries when user is available
  const shouldFetchData = !!user;

  // Data fetching queries
  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: getCourses,
    enabled: shouldFetchData,
  });

  const { data: assessments, isLoading: assessmentsLoading } = useQuery({
    queryKey: ['assessments', user?.id],
    queryFn: getAssessments,
    enabled: shouldFetchData,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard', 'statistics'],
    queryFn: async () => {
      if (!user) return null;
      return await getStatistics(user.id);
    },
    enabled: shouldFetchData,
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ['dashboard', 'submissions'],
    queryFn: async () => {
      if (!user) return null;
      return await getSubmissions(user.id);
    },
    enabled: shouldFetchData,
  });

  const submissionsBarChartData = React.useMemo(() => {
    if (!submissions) return [];

    const pending = submissions.filter(s => s.status === 'pending').length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const submitted = submissions.filter(s => s.status === 'submitted').length;

    return [
      { name: 'Pending', submissions: pending },
      { name: 'Submitted', submissions: submitted },
      { name: 'Graded', submissions: graded },
    ];
  }, [submissions]);

  const courseCompletionData = React.useMemo(() => {
    if (!courses) return [];

    const completed = courses.filter(c => c.status === 'completed').length;
    const ongoing = courses.filter(c => c.status === 'ongoing').length;

    return [
      { name: 'Completed', value: completed },
      { name: 'Ongoing', value: ongoing },
    ];
  }, [courses]);

  // Check if any data is loading
  const isLoading = authLoading || statsLoading || submissionsLoading || coursesLoading || assessmentsLoading;

  // If auth is still loading, show a loading indicator
  if (authLoading) {
    console.log("Auth is loading, showing loading state");
    return <DashboardLoading />;
  }

  // If no user is found and not loading, redirect to login
  if (!user) {
    console.log("No user found, returning transitional state (will redirect)");
    return <DashboardLoading />;
  }

  console.log("Dashboard ready to render content");
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        
        <div className="flex-grow container mx-auto px-4 py-12 mt-8">
          <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
  
          {/* SWAPPED POSITIONS: Assessments now first, Stats second */}
          {profile?.role === 'student' ? (
            <StudentAssessments 
              assessments={assessments || []}
              isLoading={isLoading}
            />
          ) : (
            <TeacherAssessments 
              assessments={assessments || []}
              isLoading={isLoading}
            />
          )}
  
          <DashboardStats 
            statistics={statistics}
            coursesCount={courses?.length || 0}
            isLoading={isLoading}
          />
  
          <DashboardCharts 
            submissionsBarChartData={submissionsBarChartData}
            courseCompletionData={courseCompletionData}
            isLoading={isLoading}
          />
        </div>
        
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Dashboard;
