
import React from "react";
import { cn } from "@/lib/utils";

interface TextGradientProps {
  children: React.ReactNode;
  className?: string;
  from?: string;
  to?: string;
}

const TextGradient: React.FC<TextGradientProps> = ({
  children,
  className,
  from = "from-primary",
  to = "to-primary/80",
}) => {
  return (
    <span
      className={cn(
        "bg-gradient-to-r bg-clip-text text-transparent",
        from,
        to,
        className
      )}
    >
      {children}
    </span>
  );
};

export default TextGradient;
