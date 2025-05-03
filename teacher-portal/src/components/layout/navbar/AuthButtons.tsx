
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth";

const AuthButtons: React.FC = () => {
  const { user, profile } = useAuth();
  const isTeacher = profile?.role === "teacher";

  return (
    <>
      {user ? (
        <div className="flex items-center">
          {isTeacher && (
            <Link to="/create-assessment">
              <Button
                variant="default"
                size="sm"
                className="rounded-full px-4 mr-3"
              >
                <Plus className="h-4 w-4 mr-1" />
                Create Assessment
              </Button>
            </Link>
          )}
        </div>
      ) : (
        <>
          <Link to="/register">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full px-4 mr-3"
            >
              Sign Up
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="default"
              size="sm"
              className="rounded-full px-4"
            >
              <LogIn className="h-4 w-4 mr-1" />
              Sign In
            </Button>
          </Link>
        </>
      )}
    </>
  );
};

export default AuthButtons;
