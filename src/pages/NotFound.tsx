
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TextGradient from "@/components/animations/TextGradient";
import FadeIn from "@/components/animations/FadeIn";
import PageTransition from "@/components/animations/PageTransition";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <FadeIn direction="up">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="font-display text-9xl font-bold text-primary/20">404</h1>
            <h2 className="font-display text-3xl font-bold">
              <TextGradient>Page Not Found</TextGradient>
            </h2>
            <p className="text-muted-foreground mb-8">
              The page you are looking for doesn't exist or has been moved.
            </p>
            <Link to="/">
              <Button className="rounded-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to Home
              </Button>
            </Link>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
};

export default NotFound;
