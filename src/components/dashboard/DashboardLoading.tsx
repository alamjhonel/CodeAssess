
import React from "react";
import { Loader2 } from "lucide-react";

const DashboardLoading: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    </div>
  );
};

export default DashboardLoading;
