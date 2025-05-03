
import React, { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CurrentTimeProps {
  variant?: "desktop" | "mobile";
}

const CurrentTime: React.FC<CurrentTimeProps> = ({ variant = "desktop" }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  if (variant === "desktop") {
    return (
      <div className="hidden md:flex items-center">
        <div className="flex items-center text-sm font-medium bg-muted/40 rounded-full px-4 py-1.5 text-high-contrast">
          <Clock className="h-4 w-4 mr-2 text-primary" />
          <span>{format(currentTime, "MMMM d, yyyy hh:mm:ss a")}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center text-xs mr-2 bg-muted/40 rounded-full px-2 py-1 text-high-contrast")}>
      <Clock className="h-3 w-3 mr-1 text-primary" />
      <span>{format(currentTime, "hh:mm a")}</span>
    </div>
  );
};

export default CurrentTime;
