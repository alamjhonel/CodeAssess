import React from "react";
import { Link } from "react-router-dom";
import { LogOut, User } from "lucide-react";
import { Profile } from "@/contexts/auth/types";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  user: any | null;
  profile: Profile | null;
  onSignOut: () => Promise<void>;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  onClose,
  user,
  profile,
  onSignOut,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-40 bg-background dark:bg-background pt-20">
      <div className="p-6 space-y-6">
        <ul className="space-y-3">
          {user ? (
            <>
              <li className="flex items-center mb-4">
                <User className="h-4 w-4 mr-2" />
                <span className="font-semibold">{profile?.first_name || user.email}</span>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-muted"
                  onClick={onClose}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-muted"
                  onClick={onClose}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/settings"
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-muted"
                  onClick={onClose}
                >
                  Settings
                </Link>
              </li>
              <li>
                <button
                  className="w-full text-left px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 bg-destructive/10 text-destructive hover:bg-destructive/20"
                  onClick={() => {
                    onSignOut();
                    onClose();
                  }}
                >
                  <LogOut className="h-4 w-4 inline mr-2" />
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link
                  to="/login"
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 bg-primary text-primary-foreground"
                  onClick={onClose}
                >
                  Sign In
                </Link>
              </li>
              <li>
                <Link
                  to="/login?tab=sign-up"
                  className="block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 bg-secondary/50 text-secondary-foreground"
                  onClick={onClose}
                >
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default MobileMenu;
