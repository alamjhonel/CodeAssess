import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import FadeIn from "../animations/FadeIn";
import CodeGradeLogo from "../brand/CodeGradeLogo";
import { useUser } from "@/hooks/useUser";

// Import our components
import ThemeToggler from "./navbar/ThemeToggler";
import CurrentTime from "./navbar/CurrentTime";
import UserMenu from "./navbar/UserMenu";
import AuthButtons from "./navbar/AuthButtons";
import MobileMenu from "./navbar/MobileMenu";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Use the enhanced useUser hook instead of useAuth directly
  const { user, profile, logout, isLoading } = useUser();
  
  // Check if the current route is a public route (login or home page)
  const isPublicPage = ['/', '/login', '/register'].includes(location.pathname);

  useEffect(() => {
    const checkScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", checkScroll);
    return () => {
      window.removeEventListener("scroll", checkScroll);
    };
  }, []);

  const handleSignOut = async () => {
    await logout();
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 px-6 md:px-12",
        {
          "bg-white/80 backdrop-blur-md shadow-sm dark:bg-black/50": isScrolled,
          "bg-white dark:bg-black": !isScrolled,
        }
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        <FadeIn direction="down" duration={600}>
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
            <CodeGradeLogo size="md" />
          </Link>
        </FadeIn>

        {/* Current Time - Desktop */}
        <CurrentTime variant="desktop" />

        {/* Desktop Controls */}
        <div className="hidden md:flex items-center space-x-4">
          <FadeIn direction="down" duration={600} delay={200}>
            <ThemeToggler />
            
            {!isLoading && (
              <>
                {user ? (
                  <UserMenu user={user} profile={profile} onSignOut={handleSignOut} />
                ) : (
                  isPublicPage && <AuthButtons />
                )}
              </>
            )}
          </FadeIn>
        </div>

        {/* Mobile Controls */}
        <div className="flex md:hidden items-center space-x-2">
          <CurrentTime variant="mobile" />
          
          <ThemeToggler />
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileMenu 
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        user={user}
        profile={profile}
        onSignOut={handleSignOut}
      />
    </nav>
  );
};

export default Navbar;
