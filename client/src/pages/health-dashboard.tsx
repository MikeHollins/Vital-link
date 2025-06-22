import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { SwipeableMetricCard } from "@/components/SwipeableMetricCard";
import { useLocation } from "wouter";
import OneClickConnector from "@/components/OneClickConnector";
import { ComprehensivePlatformConnector } from "@/components/ComprehensivePlatformConnector";

import { EnhancedStepChart } from "@/components/EnhancedStepChart";

import { 
  Activity, 
  Heart, 
  Moon, 
  Footprints, 
  TrendingUp, 
  Shield, 
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  Watch,
  Zap,
  BarChart2
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

// Mock health data for demonstration - in production this would come from real APIs
const healthMetrics = {
  steps: {
    current: 8742,
    goal: 10000,
    data: [
      { date: "Mon", value: 8500 },
      { date: "Tue", value: 9200 },
      { date: "Wed", value: 7800 },
      { date: "Thu", value: 10300 },
      { date: "Fri", value: 8742 },
    ]
  },
  heartRate: {
    current: 72,
    resting: 65,
    data: [
      { time: "6am", value: 65 },
      { time: "9am", value: 78 },
      { time: "12pm", value: 85 },
      { time: "3pm", value: 92 },
      { time: "6pm", value: 72 },
    ]
  },
  sleep: {
    lastNight: 7.5,
    goal: 8,
    quality: "Good", // Will translate in display
    data: [
      { date: "Mon", hours: 7.2 },
      { date: "Tue", hours: 8.1 },
      { date: "Wed", hours: 6.8 },
      { date: "Thu", hours: 7.9 },
      { date: "Fri", hours: 7.5 },
    ]
  }
};

export default function HealthDashboard() {
  const { t, i18n } = useTranslation(['dashboard', 'health', 'common']);
  const [, setLocation] = useLocation();
  
  // Debug logging
  console.log('Current language in dashboard:', i18n.language);
  console.log('Translation test:', t('dashboard:welcomeMessage'));
  const [showPlatformConnector, setShowPlatformConnector] = useState(false);
  const [showFullPlatformConnector, setShowFullPlatformConnector] = useState(false);

  const connectedDevices = [
    { name: "Apple Watch Series 9", type: "apple_health", status: "connected", lastSync: 'twoMinAgo', icon: Watch },
    { name: "iPhone Health App", type: "apple_health", status: "connected", lastSync: 'fiveMinAgo', icon: Smartphone },
    { name: "Fitbit Charge 6", type: "fitbit", status: "pending", lastSync: 'never', icon: Activity },
  ];

  const MetricCard = ({ title, value, unit, goal, progress, icon: Icon, color }: any) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value} {unit}
        </div>
        {goal && (
          <div className="mt-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>{t('dashboard:dailyGoals')}: {goal} {unit}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">

        {/* Sleek Header */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8 overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-purple-500/5 dark:from-blue-400/10 dark:via-teal-400/10 dark:to-purple-400/10"></div>
          
          <div className="relative px-8 py-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {/* Icon container */}
                <div className="p-3 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                
                {/* Title and description */}
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                    {t('dashboard:welcomeMessage')}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm font-medium">
                    {t('dashboard:healthOverview')}
                  </p>
                </div>
              </div>
              
              {/* Right side stats */}
              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {connectedDevices.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {t('common:connected')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    84
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {t('dashboard:healthOverview')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    7d
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {t('common:lastUpdated')}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{t('dashboard:dailyGoals')}</span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">73% {t('common:success')}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-500 ease-out" style={{ width: '73%' }}></div>
              </div>
            </div>
          </div>
        </div>



        {/* Featured Connect Button */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col items-center space-y-4">
            <Button 
              onClick={() => setShowFullPlatformConnector(true)}
              className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg min-w-[200px]"
            >
              <Zap className="w-5 h-5 mr-3" />
{t('dashboard:quickConnect')}
            </Button>
            <p className="text-sm text-muted-foreground mt-3">
              {t('dashboard:connectPlatformsDescription')}
            </p>
          </div>
        </div>

        {/* Quick Connect Platforms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              {t('dashboard:quickConnect')}
            </CardTitle>
            <CardDescription>
              {t('dashboard:connectPlatformsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <OneClickConnector 
              onViewAllPlatforms={() => setShowFullPlatformConnector(true)}
            />
          </CardContent>
        </Card>

        {/* Connected Devices */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
{t('dashboard:connectedDevices')}
            </CardTitle>
            <CardDescription>
              {t('dashboard:manageDevicesSync')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {connectedDevices.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <device.icon className="h-5 w-5" />
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-xs text-muted-foreground">{'lastSync'}: {device.lastSync}</p>
                    </div>
                  </div>
                  <Badge variant={device.status === "connected" ? "default" : "secondary"}>
                    {device.status === "connected" ? 'connected' : device.status === "pending" ? 'pending' : 'disconnected'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Swipeable Health Metrics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <SwipeableMetricCard
            title={'dailySteps'}
            icon={<Footprints className="h-5 w-5 text-white" />}
            metric={{
              current: healthMetrics.steps.current,
              goal: healthMetrics.steps.goal,
              unit: "steps",
              trend: "up",
              trendPercentage: 12
            }}
            color="from-green-500 to-emerald-600"
            detailedViews={[
              { period: "today", title: 'todaysActivity', data: {} },
              { period: "week", title: 'weeklyProgress', data: {} },
              { period: "insights", title: 'aiInsightsCard', data: {} }
            ]}
          />
          
          <SwipeableMetricCard
            title={'heartRate'}
            icon={<Heart className="h-5 w-5 text-white" />}
            metric={{
              current: healthMetrics.heartRate.current,
              unit: "bpm",
              trend: "stable",
              trendPercentage: 2
            }}
            color="from-red-500 to-rose-600"
            detailedViews={[
              { period: "today", title: 'heartRateZones', data: {} },
              { period: "week", title: 'weeklyTrends', data: {} },
              { period: "insights", title: 'cardiovascularHealth', data: {} }
            ]}
          />
          
          <SwipeableMetricCard
            title={'sleepQuality'}
            icon={<Moon className="h-5 w-5 text-white" />}
            metric={{
              current: healthMetrics.sleep.lastNight,
              goal: healthMetrics.sleep.goal,
              unit: 'hours',
              trend: "up",
              trendPercentage: 8
            }}
            color="from-purple-500 to-violet-600"
            detailedViews={[
              { period: "today", title: 'lastNightSleep', data: {} },
              { period: "week", title: 'sleepPatterns', data: {} },
              { period: "insights", title: 'sleepOptimization', data: {} }
            ]}
          />
        </div>

        {/* Detailed Charts */}
        <Tabs defaultValue="activity" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">{'activity'}</TabsTrigger>
            <TabsTrigger value="heart">{'heartRate'}</TabsTrigger>
            <TabsTrigger value="sleep">{'sleep'}</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-4">
            <EnhancedStepChart userId="demo" className="mb-6" />
            
            {/* Screen Time Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5 text-orange-600" />
                  Digital Wellness & Screen Time
                </CardTitle>
                <CardDescription>
                  Track your digital habits and their correlation with physical activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                    <Smartphone className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                    <div className="text-2xl font-bold text-orange-600">6.2h</div>
                    <div className="text-sm text-muted-foreground">Daily Average</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Eye className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                    <div className="text-2xl font-bold text-blue-600">127</div>
                    <div className="text-sm text-muted-foreground">Daily Pickups</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <TrendingUp className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <div className="text-2xl font-bold text-green-600">-68%</div>
                    <div className="text-sm text-muted-foreground">Steps Correlation</div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Vital AI Insight:</strong> Your screen time shows a strong negative correlation with step count. 
                    Consider replacing 30 minutes of screen time with a walk to boost daily activity.
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heart" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{'heartRateToday'}</CardTitle>
                <CardDescription>{'heartRateDesc'}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthMetrics.heartRate.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sleep" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{'sleepPattern'}</CardTitle>
                <CardDescription>{'sleepPatternDesc'}</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={healthMetrics.sleep.data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            {'viewAiInsights'}
          </Button>
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{'linkVitalData'}</h2>
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
                      setShowPlatformConnector(false);
                      setShowFullPlatformConnector(true);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comprehensive Platform Connector Modal */}
        {showFullPlatformConnector && (
          <div 
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && setShowFullPlatformConnector(false)}
          >
            <div 
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{'connectAllPlatforms'}</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFullPlatformConnector(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </Button>
              </div>
              <div className="overflow-y-auto max-h-[calc(95vh-120px)] overscroll-contain">
                <div className="p-6 pb-8">
                  <ComprehensivePlatformConnector onClose={() => setShowFullPlatformConnector(false)} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}