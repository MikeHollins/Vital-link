import React from 'react';

interface ProgressMetricProps {
  value: number;
  maxValue: number;
  label?: string;
  color?: string;
  showValue?: boolean;
}

export const ProgressMetric: React.FC<ProgressMetricProps> = ({
  value,
  maxValue,
  label,
  color = 'primary',
  showValue = false,
}) => {
  const percentage = Math.min(Math.max(0, (value / maxValue) * 100), 100);
  
  // Determine the color classes based on the color prop
  const getBgColorClass = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-500';
      case 'indigo':
        return 'bg-indigo-500';
      case 'yellow':
        return 'bg-yellow-500';
      case 'red':
        return 'bg-red-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-primary-500';
    }
  };
  
  const getTrackBgColorClass = () => {
    switch (color) {
      case 'primary':
        return 'bg-primary-100 dark:bg-primary-900/30';
      case 'indigo':
        return 'bg-indigo-100 dark:bg-indigo-900/30';
      case 'yellow':
        return 'bg-yellow-100 dark:bg-yellow-900/30';
      case 'red':
        return 'bg-red-100 dark:bg-red-900/30';
      case 'green':
        return 'bg-green-100 dark:bg-green-900/30';
      default:
        return 'bg-primary-100 dark:bg-primary-900/30';
    }
  };
  
  return (
    <div className="w-full">
      {showValue && (
        <div className="flex justify-between mb-1 text-xs font-medium">
          <span>{value}</span>
          <span>{maxValue}</span>
        </div>
      )}
      <div className={`w-full h-2 ${getTrackBgColorClass()} rounded-full`}>
        <div 
          className={`h-full ${getBgColorClass()} rounded-full`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {label && <p className="mt-1 text-xs text-muted-foreground">{label}</p>}
    </div>
  );
};
