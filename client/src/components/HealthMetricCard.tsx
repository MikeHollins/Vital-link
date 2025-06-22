import { Card, CardContent } from "@/components/ui/card";
import { ProgressMetric } from "@/components/ui/progress-metric";
import { LucideIcon } from "lucide-react";

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  progress?: number;
  maxValue?: number;
  progressLabel?: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

const HealthMetricCard = ({
  title,
  value,
  unit,
  icon,
  progress,
  maxValue = 100,
  progressLabel,
  change,
  color = "primary"
}: HealthMetricCardProps) => {
  const bgColorClass = `bg-${color}-100 dark:bg-${color}-900/30`;
  const textColorClass = `text-${color}-600 dark:text-${color}-400`;

  return (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-full flex items-center justify-center ${bgColorClass} ${textColorClass}`}>
              {icon}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">{title}</h3>
              <div className="flex items-baseline space-x-2">
                <p className="text-2xl font-bold tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground font-medium">{unit}</p>
              </div>
            </div>
          </div>
          {change && (
            <div className={`flex flex-col items-center justify-center w-12 h-12 rounded-full ${
              change.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 mb-0.5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={change.isPositive 
                    ? "M5 10l7-7m0 0l7 7m-7-7v18" 
                    : "M19 14l-7 7m0 0l-7-7m7 7V3"
                  } 
                />
              </svg>
              <span className="text-xs font-bold">{Math.abs(change.value)}%</span>
            </div>
          )}
        </div>
        {progress !== undefined && (
          <ProgressMetric 
            value={progress} 
            maxValue={maxValue} 
            label={progressLabel}
            color={color} 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default HealthMetricCard;
