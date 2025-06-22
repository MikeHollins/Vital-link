import React from 'react';
import { SwipeableMetricCard } from './SwipeableMetricCard';
import { Activity, Heart, Flame, Moon, Brain, Droplets, Wind, Scale } from 'lucide-react';

interface PlatformData {
  platformId: string;
  platformName: string;
  dataType: string;
  currentValue: number;
  unit: string;
  goal?: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  lastSyncTime: Date;
}

interface DynamicPlatformWidgetProps {
  platformData: PlatformData;
}

export const DynamicPlatformWidget: React.FC<DynamicPlatformWidgetProps> = ({ platformData }) => {
  // Get appropriate icon and color based on data type
  const getIconAndColor = (dataType: string) => {
    switch (dataType.toLowerCase()) {
      case 'steps':
        return {
          icon: <Activity className="h-5 w-5 text-white" />,
          color: 'from-blue-500 to-cyan-600'
        };
      case 'heart_rate':
        return {
          icon: <Heart className="h-5 w-5 text-white" />,
          color: 'from-red-500 to-pink-600'
        };
      case 'calories':
        return {
          icon: <Flame className="h-5 w-5 text-white" />,
          color: 'from-orange-500 to-red-600'
        };
      case 'sleep':
        return {
          icon: <Moon className="h-5 w-5 text-white" />,
          color: 'from-indigo-500 to-purple-600'
        };
      case 'mindfulness':
      case 'meditation':
        return {
          icon: <Brain className="h-5 w-5 text-white" />,
          color: 'from-purple-500 to-indigo-600'
        };
      case 'hydration':
      case 'water':
        return {
          icon: <Droplets className="h-5 w-5 text-white" />,
          color: 'from-blue-400 to-cyan-500'
        };
      case 'breathing':
        return {
          icon: <Wind className="h-5 w-5 text-white" />,
          color: 'from-teal-500 to-emerald-600'
        };
      case 'weight':
        return {
          icon: <Scale className="h-5 w-5 text-white" />,
          color: 'from-emerald-500 to-green-600'
        };
      default:
        return {
          icon: <Activity className="h-5 w-5 text-white" />,
          color: 'from-gray-500 to-gray-600'
        };
    }
  };

  const { icon, color } = getIconAndColor(platformData.dataType);

  // Generate realistic detailed views based on the data type
  const generateDetailedViews = (dataType: string, platformName: string) => [
    {
      period: 'today' as const,
      title: 'Today\'s Data',
      data: {}
    },
    {
      period: 'week' as const,
      title: 'This Week',
      data: {}
    },
    {
      period: 'month' as const,
      title: 'This Month',
      data: {}
    },
    {
      period: 'insights' as const,
      title: `${platformName} Insights`,
      data: {}
    }
  ];

  return (
    <SwipeableMetricCard
      title={`${platformData.dataType} (${platformData.platformName})`}
      icon={icon}
      metric={{
        current: platformData.currentValue,
        goal: platformData.goal,
        unit: platformData.unit,
        trend: platformData.trend,
        trendPercentage: platformData.trendPercentage
      }}
      color={color}
      detailedViews={generateDetailedViews(platformData.dataType, platformData.platformName)}
    />
  );
};

export default DynamicPlatformWidget;