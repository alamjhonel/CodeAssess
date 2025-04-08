
import React from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";
import RegisterForm from "@/components/auth/RegisterForm";
import CodeGradeLogo from "@/components/brand/CodeGradeLogo";

const Register = () => {
  const { user, isLoading } = useAuth();

  if (user && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        <header className="py-6 px-8 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <CodeGradeLogo size="md" />
          </Link>
          <Link to="/login">
            <Button variant="outline">Sign in</Button>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4">
          <FadeIn className="w-full max-w-md">
            <RegisterForm />
          </FadeIn>
        </main>
      </div>
    </PageTransition>
  );
};

export default Register;
