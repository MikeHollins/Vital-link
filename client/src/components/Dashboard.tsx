import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Activity, 
  Moon, 
  Footprints, 
  Zap, 
  TrendingUp, 
  Plus,
  Award,
  ChevronRight,
  Star,
  Flame,
  Brain,
  Waves,
  TestTube
} from "lucide-react";
import { ComprehensivePlatformConnector, TOTAL_PLATFORM_COUNT } from './ComprehensivePlatformConnector';
import { OneClickConnector } from './OneClickConnector';
import BloodGlucoseMonitor from "./advanced-health/BloodGlucoseMonitor";
import BloodPressureMonitor from "./advanced-health/BloodPressureMonitor";
import MoodTracker from "./mental-health/MoodTracker";
import { SwipeableMetricCard } from './SwipeableMetricCard';
import DynamicPlatformWidget from './DynamicPlatformWidget';
import { useDynamicPlatforms } from '../hooks/useDynamicPlatforms';

// Apple HealthKit-inspired metric card with haptic feedback
const HealthKitMetricCard = ({ 
  icon, 
  title, 
  value, 
  unit, 
  change, 
  trend, 
  color = "blue",
  onClick 
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  unit: string;
  change?: string;
  trend?: "up" | "down" | "stable";
  color?: "blue" | "green" | "orange" | "red" | "purple";
  onClick?: () => void;
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const colorClasses = {
    blue: "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400",
    green: "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-600 dark:text-green-400",
    orange: "bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800 text-orange-600 dark:text-orange-400",
    red: "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400",
    purple: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400",
  };

  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(30);
    }
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
  };

  return (
    <Card 
      className={`${colorClasses[color]} border transition-all duration-300 cursor-pointer transform ${
        isPressed ? 'scale-95' : 'hover:scale-105 hover:shadow-lg'
      }`}
      onMouseDown={triggerHaptic}
      onTouchStart={triggerHaptic}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="transform transition-transform duration-200 hover:rotate-12">
              {icon}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-1">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">{value}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span>
          </div>
          {change && (
            <div className="flex items-center gap-1">
              {trend === "up" && <TrendingUp className="w-3 h-3 text-green-500 animate-pulse" />}
              {trend === "down" && <TrendingUp className="w-3 h-3 text-red-500 rotate-180 animate-pulse" />}
              <span className={`text-xs ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-500"}`}>
                {change}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced summary card with 3D effects
const HealthKitSummaryCard = ({ 
  title, 
  subtitle, 
  children, 
  action 
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.01]">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">{title}</CardTitle>
          {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
    </CardHeader>
    <CardContent className="pt-0">
      {children}
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { t } = useTranslation(['dashboard', 'common']);
  const [showPlatformConnector, setShowPlatformConnector] = useState(false);
  const [showFullPlatformConnector, setShowFullPlatformConnector] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const { connectedPlatforms, platformWidgets, connectPlatform, disconnectPlatform, syncPlatformData } = useDynamicPlatforms();

  const triggerHaptic = (intensity = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(intensity);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-950 dark:to-teal-950">
      {/* Apple HealthKit-inspired Header with glassmorphism */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                {t('dashboard:overview')}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {t('dashboard:today')} • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <Button
              onClick={() => {
                triggerHaptic(100);
                setShowPlatformConnector(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              {t('dashboard:connectPlatform')}
            </Button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Today's Activity Summary - Now Swipeable */}
        <HealthKitSummaryCard 
          title={t('dashboard:recentActivity')} 
          subtitle={t('dashboard:swipeForInsights')}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SwipeableMetricCard
              title={t('health:metrics.steps')}
              icon={<Activity className="h-5 w-5 text-white" />}
              metric={{
                current: 8742,
                goal: 10000,
                unit: t('health:units.steps'),
                trend: 'up',
                trendPercentage: 15
              }}
              color="from-blue-500 to-cyan-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Details',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'AI Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title={t('dashboard:activeCalories')}
              icon={<Flame className="h-5 w-5 text-white" />}
              metric={{
                current: 847,
                goal: 1000,
                unit: t('health:units.calories'),
                trend: 'up',
                trendPercentage: 18
              }}
              color="from-orange-500 to-red-600"
              detailedViews={[
                {
                  period: 'today',
                  title: t('dashboard:todaysDetails'),
                  data: {}
                },
                {
                  period: 'week',
                  title: t('dashboard:thisWeek'),
                  data: {}
                },
                {
                  period: 'month',
                  title: t('dashboard:thisMonth'),
                  data: {}
                },
                {
                  period: 'insights',
                  title: t('dashboard:aiInsights'),
                  data: {}
                }
              ]}
            />
          </div>
        </HealthKitSummaryCard>

        {/* Advanced Vitals Section - Now Swipeable */}
        <HealthKitSummaryCard 
          title="Advanced Vitals" 
          subtitle="Swipe for detailed health monitoring"
          action={
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
              View All
            </Button>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SwipeableMetricCard
              title="Blood Glucose"
              icon={<TestTube className="h-5 w-5 text-white" />}
              metric={{
                current: 92,
                goal: 100,
                unit: 'mg/dL',
                trend: 'stable',
                trendPercentage: 0
              }}
              color="from-emerald-500 to-green-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Readings',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Glucose Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title="Blood Pressure"
              icon={<Heart className="h-5 w-5 text-white" />}
              metric={{
                current: 120,
                goal: 120,
                unit: 'mmHg',
                trend: 'stable',
                trendPercentage: 2
              }}
              color="from-rose-500 to-pink-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Readings',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Blood Pressure Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title="Blood Oxygen"
              icon={<Waves className="h-5 w-5 text-white" />}
              metric={{
                current: 98,
                goal: 95,
                unit: '%',
                trend: 'up',
                trendPercentage: 1
              }}
              color="from-blue-500 to-cyan-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Readings',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Oxygen Level Insights',
                  data: {}
                }
              ]}
            />
          </div>
        </HealthKitSummaryCard>

        {/* Mental Health & Wellness - Now Fully Swipeable */}
        <HealthKitSummaryCard 
          title="Mental Health & Wellness" 
          subtitle="Swipe for emotional well-being insights"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SwipeableMetricCard
              title="Mood Score"
              icon={<Heart className="h-5 w-5 text-white" />}
              metric={{
                current: 8.2,
                goal: 8.0,
                unit: '/10',
                trend: 'up',
                trendPercentage: 5
              }}
              color="from-pink-500 to-rose-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Mood',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Mood Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title="Mindfulness"
              icon={<Brain className="h-5 w-5 text-white" />}
              metric={{
                current: 12,
                goal: 15,
                unit: 'minutes',
                trend: 'up',
                trendPercentage: 20
              }}
              color="from-purple-500 to-indigo-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Sessions',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Mindfulness Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title="Stress Level"
              icon={<Zap className="h-5 w-5 text-white" />}
              metric={{
                current: 2,
                goal: 3,
                unit: 'Low',
                trend: 'stable',
                trendPercentage: 0
              }}
              color="from-green-500 to-emerald-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Stress',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Stress Insights',
                  data: {}
                }
              ]}
            />
          </div>
        </HealthKitSummaryCard>

        {/* Sleep & Recovery - Now Swipeable */}
        <HealthKitSummaryCard 
          title="Sleep & Recovery" 
          subtitle="Swipe for detailed sleep insights"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SwipeableMetricCard
              title="Sleep Duration"
              icon={<Moon className="h-5 w-5 text-white" />}
              metric={{
                current: 7.4,
                goal: 8.0,
                unit: 'hours',
                trend: 'up',
                trendPercentage: 8
              }}
              color="from-indigo-500 to-purple-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Last Night',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Sleep Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title="Sleep Quality"
              icon={<Waves className="h-5 w-5 text-white" />}
              metric={{
                current: 87,
                goal: 85,
                unit: '%',
                trend: 'up',
                trendPercentage: 5
              }}
              color="from-blue-500 to-cyan-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Last Night Quality',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'This Month',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Sleep Quality Insights',
                  data: {}
                }
              ]}
            />
          </div>
        </HealthKitSummaryCard>

        {/* Achievements - Now Swipeable */}
        <HealthKitSummaryCard 
          title="Achievements" 
          subtitle="Swipe for detailed milestone insights"
          action={
            <Star className="w-5 h-5 text-yellow-500 animate-pulse" />
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <SwipeableMetricCard
              title="Step Goal Streak"
              icon={<Award className="h-5 w-5 text-white" />}
              metric={{
                current: 7,
                goal: 7,
                unit: 'days',
                trend: 'up',
                trendPercentage: 100
              }}
              color="from-green-500 to-emerald-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Progress',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'Monthly Streaks',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Achievement Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title="Mindfulness Master"
              icon={<Brain className="h-5 w-5 text-white" />}
              metric={{
                current: 5,
                goal: 7,
                unit: 'sessions',
                trend: 'up',
                trendPercentage: 25
              }}
              color="from-blue-500 to-cyan-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Sessions',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'Monthly Progress',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Mindfulness Insights',
                  data: {}
                }
              ]}
            />
            <SwipeableMetricCard
              title="Heart Health Hero"
              icon={<Heart className="h-5 w-5 text-white" />}
              metric={{
                current: 3,
                goal: 5,
                unit: 'level',
                trend: 'up',
                trendPercentage: 15
              }}
              color="from-purple-500 to-pink-600"
              detailedViews={[
                {
                  period: 'today',
                  title: 'Today\'s Heart Health',
                  data: {}
                },
                {
                  period: 'week',
                  title: 'This Week',
                  data: {}
                },
                {
                  period: 'month',
                  title: 'Monthly Progress',
                  data: {}
                },
                {
                  period: 'insights',
                  title: 'Heart Health Insights',
                  data: {}
                }
              ]}
            />
          </div>
        </HealthKitSummaryCard>

        {/* Dynamic Platform Widgets - Auto-generated from connected platforms */}
        {platformWidgets.length > 0 && (
          <HealthKitSummaryCard 
            title="Connected Platforms" 
            subtitle="Real-time data from your linked health apps"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {platformWidgets.map((widget, index) => (
                <DynamicPlatformWidget
                  key={`${widget.platformId}-${widget.dataType}-${index}`}
                  platformData={widget}
                />
              ))}
            </div>
          </HealthKitSummaryCard>
        )}
      </div>

      {/* Platform Connector Modal */}
      {showPlatformConnector && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowPlatformConnector(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Link Health Platforms</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlatformConnector(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] overscroll-contain">
              <div className="p-6 pb-8">
                <OneClickConnector 
                  onViewAllPlatforms={() => {
                    // Instant transition for smoother UX
                    setShowPlatformConnector(false);
                    setShowFullPlatformConnector(true);
                  }}
                  onPlatformConnect={(platformId: string, platformName: string, dataTypes: string[]) => {
                    connectPlatform(platformId, platformName, dataTypes);
                    setShowPlatformConnector(false);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Platform Connector Modal */}
      {showFullPlatformConnector && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && setShowFullPlatformConnector(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">All Health Platforms</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFullPlatformConnector(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] overscroll-contain">
              <div className="p-6 pb-8">
                <ComprehensivePlatformConnector />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;