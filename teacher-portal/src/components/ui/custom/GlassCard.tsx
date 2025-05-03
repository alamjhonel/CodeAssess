
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  intensity?: "low" | "medium" | "high";
  border?: boolean;
  hover?: boolean;
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({
  intensity = "medium",
  border = true,
  hover = true,
  className,
  children,
  ...props
}) => {
  const getIntensityClass = () => {
    switch (intensity) {
      case "low":
        return "bg-white/5 dark:bg-black/10 backdrop-blur-sm";
      case "medium":
        return "bg-white/10 dark:bg-black/20 backdrop-blur-md";
      case "high":
        return "bg-white/20 dark:bg-black/40 backdrop-blur-xl";
      default:
        return "bg-white/10 dark:bg-black/20 backdrop-blur-md";
    }
  };

  const getBorderClass = () => {
    return border ? "border border-white/10 dark:border-white/5" : "";
  };

  const getHoverClass = () => {
    return hover
      ? "transition-all duration-300 hover:bg-white/15 dark:hover:bg-black/30 hover:shadow-lg"
      : "";
  };

  return (
    <div
      className={cn(
        "rounded-2xl shadow-sm",
        getIntensityClass(),
        getBorderClass(),
        getHoverClass(),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
