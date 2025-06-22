import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Moon, 
  Footprints, 
  Scale, 
  Thermometer,
  Zap,
  Brain,
  Target,
  Plus,
  ExternalLink,
  Sparkles,
  ChevronRight,
  BarChart3,
  LineChart,
  PieChart,
  Calendar,
  Clock,
  Award,
  Maximize2
} from 'lucide-react';

interface MetricData {
  id: string;
  name: string;
  value: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  target?: number;
  status: 'excellent' | 'good' | 'average' | 'needs_attention';
  isConnected: boolean;
  platform?: string;
  lastUpdated?: string;
  insights?: string[];
}

interface ComparisonData {
  period: '7d' | '30d' | '90d' | '1y';
  metrics: MetricData[];
  correlations: Array<{
    metric1: string;
    metric2: string;
    correlation: number;
    insight: string;
  }>;
}

const mockMetrics: MetricData[] = [
  {
    id: 'heart-rate',
    name: 'Heart Rate',
    value: 72,
    unit: 'BPM',
    trend: 'stable',
    trendValue: 2,
    target: 70,
    status: 'good',
    isConnected: true,
    platform: 'Apple Health',
    lastUpdated: '2 minutes ago',
    insights: ['Resting HR improved 5% this week', 'Exercise recovery time decreased']
  },
  {
    id: 'steps',
    name: 'Daily Steps',
    value: 8542,
    unit: 'steps',
    trend: 'up',
    trendValue: 12,
    target: 10000,
    status: 'average',
    isConnected: true,
    platform: 'Fitbit',
    lastUpdated: '1 hour ago',
    insights: ['Weekend activity increased 15%', 'Morning walks showing consistency']
  },
  {
    id: 'sleep',
    name: 'Sleep Quality',
    value: 78,
    unit: '%',
    trend: 'up',
    trendValue: 8,
    target: 85,
    status: 'good',
    isConnected: true,
    platform: 'Samsung Health',
    lastUpdated: '8 hours ago',
    insights: ['Deep sleep duration improved', 'Sleep latency reduced by 3 minutes']
  },
  {
    id: 'weight',
    name: 'Weight',
    value: 0,
    unit: 'kg',
    trend: 'stable',
    trendValue: 0,
    status: 'needs_attention',
    isConnected: false,
    insights: ['Connect a smart scale for weight tracking']
  },
  {
    id: 'nutrition',
    name: 'Nutrition Score',
    value: 0,
    unit: 'points',
    trend: 'stable',
    trendValue: 0,
    status: 'needs_attention',
    isConnected: false,
    insights: ['Track meals for personalized nutrition insights']
  },
  {
    id: 'stress',
    name: 'Stress Level',
    value: 0,
    unit: 'score',
    trend: 'stable',
    trendValue: 0,
    status: 'needs_attention',
    isConnected: false,
    insights: ['Enable stress monitoring for mental health tracking']
  }
];

const getMetricIcon = (metricId: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'heart-rate': <Heart className="h-5 w-5" />,
    'steps': <Footprints className="h-5 w-5" />,
    'sleep': <Moon className="h-5 w-5" />,
    'weight': <Scale className="h-5 w-5" />,
    'nutrition': <Zap className="h-5 w-5" />,
    'stress': <Brain className="h-5 w-5" />,
  };
  return iconMap[metricId] || <Activity className="h-5 w-5" />;
};

const getStatusColor = (status: string) => {
  const colorMap = {
    excellent: 'text-green-600 bg-green-100 dark:bg-green-900/30',
    good: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
    average: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30',
    needs_attention: 'text-red-600 bg-red-100 dark:bg-red-900/30'
  };
  return colorMap[status as keyof typeof colorMap] || colorMap.average;
};

export const AdvancedMetricsComparison: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);

  const { data: insights } = useQuery({
    queryKey: ['/api/insights/correlations'],
    refetchInterval: 30000,
  });

  const connectedMetrics = mockMetrics.filter(m => m.isConnected);
  const disconnectedMetrics = mockMetrics.filter(m => !m.isConnected);

  const MetricCard = ({ metric, onClick }: { metric: MetricData; onClick?: () => void }) => (
    <Card 
      className={`relative group transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-pointer ${
        metric.isConnected 
          ? 'bg-gradient-to-br from-white/90 to-gray-50/80 dark:from-gray-900/90 dark:to-gray-800/80' 
          : 'bg-gradient-to-br from-gray-100/50 to-gray-200/30 dark:from-gray-800/50 dark:to-gray-900/30 border-dashed'
      }`}
      onClick={onClick}
    >
      {metric.isConnected && (
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      )}
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-lg ${metric.isConnected ? 'bg-primary/10' : 'bg-gray-300/50'}`}>
              {getMetricIcon(metric.id)}
            </div>
            <div>
              <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
              {metric.platform && (
                <p className="text-xs text-muted-foreground">{metric.platform}</p>
              )}
            </div>
          </div>
          
          {metric.isConnected ? (
            <Badge className={getStatusColor(metric.status)}>
              {metric.status.replace('_', ' ')}
            </Badge>
          ) : (
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-3 w-3" />
              Connect
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-0">
        {metric.isConnected ? (
          <>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-bold">{metric.value.toLocaleString()}</span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
              <div className="flex items-center gap-1 ml-auto">
                {metric.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : metric.trend === 'down' ? (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ) : (
                  <div className="h-4 w-4" />
                )}
                <span className={`text-sm ${
                  metric.trend === 'up' ? 'text-green-500' : 
                  metric.trend === 'down' ? 'text-red-500' : 
                  'text-muted-foreground'
                }`}>
                  {metric.trendValue > 0 && metric.trend !== 'stable' && '+'}{metric.trendValue}%
                </span>
              </div>
            </div>
            
            {metric.target && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress to goal</span>
                  <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-1" />
              </div>
            )}

            {metric.lastUpdated && (
              <p className="text-xs text-muted-foreground mt-2">Updated {metric.lastUpdated}</p>
            )}
          </>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">No data available</p>
            <div className="space-y-1">
              {metric.insights?.map((insight, index) => (
                <p key={index} className="text-xs text-blue-600 dark:text-blue-400">
                  • {insight}
                </p>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const FullscreenView = () => (
    <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Advanced Health Metrics Analysis
          </DialogTitle>
          <DialogDescription>
            Comprehensive view of your health data with AI-powered insights
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* Sidebar - Metrics List */}
          <div className="w-80 space-y-4 overflow-y-auto">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Connected Metrics
              </h3>
              <div className="space-y-2">
                {connectedMetrics.map((metric) => (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedMetric === metric.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {getMetricIcon(metric.id)}
                      <div className="flex-1">
                        <p className="font-medium text-sm">{metric.name}</p>
                        <p className="text-xs text-muted-foreground">{metric.platform}</p>
                      </div>
                      <ChevronRight className="h-4 w-4" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Available to Connect
              </h3>
              <div className="space-y-2">
                {disconnectedMetrics.map((metric) => (
                  <div
                    key={metric.id}
                    className="p-3 rounded-lg border border-dashed border-muted-foreground/30 bg-muted/20"
                  >
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-muted">
                        {getMetricIcon(metric.id)}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{metric.name}</p>
                        <p className="text-xs text-muted-foreground">Not connected</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            <Tabs defaultValue="overview" className="h-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="correlations">Correlations</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {connectedMetrics.map((metric) => (
                    <MetricCard key={metric.id} metric={metric} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="trends" className="space-y-4 mt-4">
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive trend charts coming soon</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="correlations" className="space-y-4 mt-4">
                <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Correlation analysis visualization</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4 mt-4">
                <div className="space-y-3">
                  {insights?.insights?.slice(0, 5).map((insight: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <Sparkles className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">
                            {insight.metrics?.join(' & ')} Correlation
                          </h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            {insight.insight}
                          </p>
                          {insight.recommendedActions && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-primary">Recommended:</p>
                              <p className="text-xs text-muted-foreground">
                                {insight.recommendedActions[0]}
                              </p>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {insight.impact}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <Card className="relative group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02]" 
            onClick={() => setIsFullscreen(true)}>
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-lg blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Health Insights
                  <Badge variant="secondary" className="text-xs">Live</Badge>
                </CardTitle>
                <CardDescription>
                  Advanced metrics comparison with intelligent analysis
                </CardDescription>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="gap-2">
              <Maximize2 className="h-4 w-4" />
              Expand
            </Button>
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {connectedMetrics.slice(0, 6).map((metric) => (
              <div key={metric.id} className="text-center p-3 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-center mb-1">
                  {getMetricIcon(metric.id)}
                </div>
                <p className="text-sm font-medium">{metric.value.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">{metric.name}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-muted-foreground">
                {connectedMetrics.length} metrics connected
              </span>
            </div>
            <div className="flex items-center gap-1 text-primary">
              <span>View detailed analysis</span>
              <ExternalLink className="h-3 w-3" />
            </div>
          </div>
        </CardContent>
      </Card>

      <FullscreenView />
    </>
  );
};