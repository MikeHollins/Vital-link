import React from 'react';

interface HealthScoreProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  textColor?: string;
  pathColor?: string;
  trailColor?: string;
  className?: string;
}

export const HealthScore: React.FC<HealthScoreProps> = ({
  value,
  size = 100,
  strokeWidth = 8,
  textColor = 'currentColor',
  pathColor = 'hsl(var(--primary-500))',
  trailColor = 'hsl(var(--muted))',
  className = '',
}) => {
  // Calculate the radius and center point
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  
  // Calculate the offset for the path
  const offset = circumference - (value / 100) * circumference;
  
  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={trailColor}
          fill="none"
        />
        
        {/* Foreground circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={pathColor}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${center} ${center})`}
        />
      </svg>
      
      {/* Text in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold" style={{ color: textColor }}>{value}</span>
      </div>
    </div>
  );
};
