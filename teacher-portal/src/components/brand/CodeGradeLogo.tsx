
import React from "react";
import TextGradient from "../animations/TextGradient";

interface CodeGradeLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const CodeGradeLogo: React.FC<CodeGradeLogoProps> = ({ 
  size = "md", 
  showText = true 
}) => {
  // Size mapping
  const sizeMap = {
    sm: { svg: 30, text: "text-lg" },
    md: { svg: 40, text: "text-xl" },
    lg: { svg: 50, text: "text-2xl" },
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative overflow-hidden">
        <svg 
          width={sizeMap[size].svg} 
          height={sizeMap[size].svg} 
          viewBox="0 0 40 40" 
          className="overflow-visible"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6">
                <animate attributeName="stop-color" 
                  values="#3b82f6; #8b5cf6; #3b82f6" 
                  dur="4s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#8b5cf6">
                <animate attributeName="stop-color" 
                  values="#8b5cf6; #3b82f6; #8b5cf6" 
                  dur="4s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
          </defs>
          
          {/* Left bracket */}
          <path 
            d="M10 5 L3 20 L10 35" 
            stroke="url(#logoGradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          >
            <animate 
              attributeName="stroke-dasharray" 
              from="60,60" 
              to="60,0" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </path>
          
          {/* Right bracket */}
          <path 
            d="M30 5 L37 20 L30 35" 
            stroke="url(#logoGradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          >
            <animate 
              attributeName="stroke-dasharray" 
              from="60,60" 
              to="60,0" 
              dur="3s" 
              repeatCount="indefinite" 
            />
          </path>
          
          {/* Code symbol / checkmark */}
          <path 
            d="M15 20 L19 25 L25 15" 
            stroke="url(#logoGradient)" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none"
          >
            <animate 
              attributeName="stroke-dashoffset" 
              values="30;0" 
              dur="1.5s" 
              repeatCount="indefinite" 
            />
            <animate 
              attributeName="stroke-dasharray" 
              values="30,30;30,0" 
              dur="1.5s" 
              repeatCount="indefinite" 
            />
          </path>
        </svg>
      </div>
      
      {showText && (
        <TextGradient className={`font-display font-bold ${sizeMap[size].text}`}>
          CodeGrade
        </TextGradient>
      )}
    </div>
  );
};

export default CodeGradeLogo;
