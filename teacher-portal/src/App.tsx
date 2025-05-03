
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Assessment from "./pages/Assessment";
import Analytics from "./pages/Analytics";
import ExportData from "./pages/ExportData";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Privacy from "./pages/Privacy";
import Documentation from "./pages/Documentation";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import CreateAssessment from "./pages/CreateAssessment";
import CoursesList from "./pages/CoursesList";
import CourseDetails from "./pages/CourseDetails";
import Register from "./pages/Register";
import BackgroundAnimation from "./components/animations/BackgroundAnimation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <BackgroundAnimation />
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/assessment/:id" element={<ProtectedRoute><Assessment /></ProtectedRoute>} />
            <Route path="/create-assessment" element={<ProtectedRoute teacherOnly><CreateAssessment /></ProtectedRoute>} />
            <Route path="/analytics" element={<ProtectedRoute teacherOnly><Analytics /></ProtectedRoute>} />
            <Route path="/export" element={<ProtectedRoute teacherOnly><ExportData /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/courses" element={<ProtectedRoute><CoursesList /></ProtectedRoute>} />
            <Route path="/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/docs" element={<Documentation />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
