
import React, { useEffect, useState } from "react";

const BackgroundAnimation: React.FC = () => {
  const [neonLines, setNeonLines] = useState<Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    speed: number;
    direction: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    // Generate random neon lines
    const generateNeonLines = () => {
      const lines = [];
      // Enhanced color palette that works in both light and dark mode
      const darkModeColors = ['#FF00FF', '#00FFFF', '#FF5555', '#55FF55', '#5555FF', '#FFFF55'];
      const lightModeColors = ['#8800AA', '#0088AA', '#AA3333', '#33AA33', '#3333AA', '#AAAA33'];
      
      // Detect if dark mode is active
      const isDarkMode = document.documentElement.classList.contains('dark');
      const colors = isDarkMode ? darkModeColors : lightModeColors;
      
      for (let i = 0; i < 15; i++) {
        const isHorizontal = Math.random() > 0.5;
        lines.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          width: isHorizontal ? Math.random() * 20 + 5 : 1,
          height: isHorizontal ? 1 : Math.random() * 20 + 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          speed: Math.random() * 0.05 + 0.01,
          direction: Math.random() > 0.5 ? 1 : -1,
          opacity: isDarkMode ? Math.random() * 0.2 + 0.05 : Math.random() * 0.3 + 0.1
        });
      }
      return lines;
    };

    setNeonLines(generateNeonLines());

    // Re-generate lines when dark mode changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.documentElement) {
          setNeonLines(generateNeonLines());
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });

    // Move neon lines
    const interval = setInterval(() => {
      setNeonLines(prevLines => 
        prevLines.map(line => {
          const newX = isHorizontal(line) 
            ? (line.x + line.speed * line.direction + 100) % 100 
            : line.x;
            
          const newY = !isHorizontal(line) 
            ? (line.y + line.speed * line.direction + 100) % 100 
            : line.y;
            
          return {
            ...line,
            x: newX,
            y: newY
          };
        })
      );
    }, 50);

    return () => {
      clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  const isHorizontal = (line: {width: number, height: number}) => line.width > line.height;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] dark:opacity-[0.03]" />
      
      {/* Animated neon lines */}
      {neonLines.map((line, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            left: `${line.x}%`,
            top: `${line.y}%`,
            width: `${line.width}%`,
            height: `${line.height}px`,
            background: line.color,
            opacity: line.opacity,
            boxShadow: `0 0 10px ${line.color}, 0 0 20px ${line.color}`,
            transition: 'all 0.5s linear'
          }}
        />
      ))}
      
      {/* Floating blobs - enhanced for better visibility in light mode */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full bg-primary/5 dark:bg-primary/5 blur-3xl"
        style={{
          top: '20%',
          left: '10%',
          animation: 'blob-movement 25s infinite alternate ease-in-out',
        }}
      />
      <div 
        className="absolute w-[300px] h-[300px] rounded-full bg-secondary/5 dark:bg-secondary/5 blur-3xl"
        style={{
          bottom: '10%',
          right: '15%',
          animation: 'blob-movement 30s infinite alternate-reverse ease-in-out',
        }}
      />
      <div 
        className="absolute w-[400px] h-[400px] rounded-full bg-accent/5 dark:bg-accent/5 blur-3xl"
        style={{
          top: '60%',
          left: '60%',
          animation: 'blob-movement 35s infinite alternate ease-in-out',
        }}
      />
      
      {/* Fixed TypeScript error by using standard style element */}
      <style>
        {`
          @keyframes blob-movement {
            0% {
              transform: translate(0%, 0%) rotate(0deg) scale(1);
            }
            33% {
              transform: translate(10%, 10%) rotate(15deg) scale(1.1);
            }
            66% {
              transform: translate(-10%, 5%) rotate(-15deg) scale(0.9);
            }
            100% {
              transform: translate(0%, 0%) rotate(0deg) scale(1);
            }
          }
          
          .bg-grid-pattern {
            background-size: 50px 50px;
            background-image: 
              linear-gradient(to right, rgba(var(--foreground-rgb), 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(var(--foreground-rgb), 0.05) 1px, transparent 1px);
          }
        `}
      </style>
    </div>
  );
};

export default BackgroundAnimation;
