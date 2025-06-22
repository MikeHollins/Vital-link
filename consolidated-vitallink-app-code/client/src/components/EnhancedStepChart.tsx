import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ScatterChart,
  Scatter,
  ReferenceLine
} from 'recharts';
import {
  Footprints,
  Brain,
  Moon,
  Smartphone,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Zap,
  Eye,
  Clock
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface StepData {
  date: string;
  steps: number;
  remSleep: number;
  screenTime: number;
  mood: number;
  heartRate: number;
  stressLevel: number;
}

interface AICorrelation {
  id: string;
  primary: string;
  secondary: string;
  correlation: number;
  strength: 'weak' | 'moderate' | 'strong';
  direction: 'positive' | 'negative';
  insight: string;
  confidence: number;
  actionable: string;
}

interface EnhancedStepChartProps {
  userId?: string;
  className?: string;
}

export const EnhancedStepChart: React.FC<EnhancedStepChartProps> = ({ userId, className }) => {
  const [stepData, setStepData] = useState<StepData[]>([]);
  const [correlations, setCorrelations] = useState<AICorrelation[]>([]);
  const [selectedCorrelation, setSelectedCorrelation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Check for connected health platforms and load authentic data
  useEffect(() => {
    const loadHealthData = async () => {
      try {
        // Check for connected platforms first
        const platformsResponse = await fetch('/api/devices');
        const platforms = await platformsResponse.json();
        
        if (platforms.length === 0) {
          // No platforms connected - show connection prompt
          setStepData([]);
          setCorrelations([]);
          toast({
            title: "Connect Your Health Platforms",
            description: "Link Apple Health, Google Fit, or Fitbit to see AI-powered step insights",
            variant: "default",
          });
          setIsLoading(false);
          return;
        }

        // Fetch authentic health data from connected platforms
        const healthResponse = await fetch(`/api/health-data/steps?days=7&userId=${userId || 'demo'}`);
        
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();
          
          if (healthData.length >= 3) {
            setStepData(healthData);
            
            // Generate AI correlations from real data
            const correlationResponse = await fetch('/api/ai-insights/correlations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ healthData })
            });
            
            if (correlationResponse.ok) {
              const correlations = await correlationResponse.json();
              setCorrelations(correlations);
              setSelectedCorrelation(correlations[0]?.id || null);
            }
          }
        } else {
          toast({
            title: "Data Access Required",
            description: "Please ensure your connected health platforms have proper data sharing permissions",
            variant: "default",
          });
        }
      } catch (error) {
        console.error('Health data loading failed:', error);
        toast({
          title: "Platform Connection Needed",
          description: "Connect health platforms to unlock AI-powered step analysis",
          variant: "default",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadHealthData();
  }, [userId, toast]);

  const getCorrelationColor = (strength: string, direction: string) => {
    if (strength === 'strong') {
      return direction === 'positive' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600';
    } else if (strength === 'moderate') {
      return direction === 'positive' ? 'from-blue-500 to-cyan-600' : 'from-orange-500 to-amber-600';
    }
    return 'from-gray-500 to-slate-600';
  };

  const getCorrelationIcon = (secondary: string) => {
    switch (secondary) {
      case 'REM Sleep': return <Moon className="h-4 w-4" />;
      case 'Screen Time': return <Smartphone className="h-4 w-4" />;
      case 'Mood Score': return <Zap className="h-4 w-4" />;
      case 'Stress Level': return <AlertCircle className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const selectedCorr = correlations.find(c => c.id === selectedCorrelation);
  const todaySteps = stepData[stepData.length - 1]?.steps || 0;
  const stepGoal = 10000;
  const stepProgress = Math.min((todaySteps / stepGoal) * 100, 100);

  const getScatterData = () => {
    if (!selectedCorr) return [];
    
    return stepData.map(d => ({
      x: d.steps,
      y: selectedCorr.secondary === 'REM Sleep' ? d.remSleep :
         selectedCorr.secondary === 'Screen Time' ? d.screenTime :
         selectedCorr.secondary === 'Mood Score' ? d.mood :
         selectedCorr.secondary === 'Stress Level' ? d.stressLevel : 0,
      date: d.date
    }));
  };

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Footprints className="h-5 w-5 text-blue-600" />
            Smart Step Analytics
          </CardTitle>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Brain className="h-3 w-3" />
            AI Insights
          </Badge>
        </div>
        
        {/* Step Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Today's Progress</span>
            <span className="font-medium">{todaySteps.toLocaleString()} / {stepGoal.toLocaleString()}</span>
          </div>
          <Progress value={stepProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="correlations">AI Insights</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stepData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { weekday: 'short' })}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => new Date(value).toLocaleDateString()}
                    formatter={(value: number) => [value.toLocaleString(), 'Steps']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="steps" 
                    stroke="#3b82f6" 
                    fill="url(#stepsGradient)" 
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="stepsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <Footprints className="h-4 w-4 mx-auto mb-1 text-blue-600" />
                <p className="text-sm font-medium">{stepData[stepData.length - 1]?.steps.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Today</p>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                <Moon className="h-4 w-4 mx-auto mb-1 text-green-600" />
                <p className="text-sm font-medium">{stepData[stepData.length - 1]?.remSleep}h</p>
                <p className="text-xs text-muted-foreground">REM Sleep</p>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                <Smartphone className="h-4 w-4 mx-auto mb-1 text-orange-600" />
                <p className="text-sm font-medium">{stepData[stepData.length - 1]?.screenTime}h</p>
                <p className="text-xs text-muted-foreground">Screen Time</p>
              </div>
              <div className="text-center p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                <Zap className="h-4 w-4 mx-auto mb-1 text-purple-600" />
                <p className="text-sm font-medium">{stepData[stepData.length - 1]?.mood}/10</p>
                <p className="text-xs text-muted-foreground">Mood</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-4">
            {/* Correlation Selection */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {correlations.map((corr) => (
                <Button
                  key={corr.id}
                  variant={selectedCorrelation === corr.id ? "default" : "outline"}
                  className={`h-auto p-3 ${selectedCorrelation === corr.id ? `bg-gradient-to-r ${getCorrelationColor(corr.strength, corr.direction)} text-white` : ''}`}
                  onClick={() => setSelectedCorrelation(corr.id)}
                >
                  <div className="flex items-center gap-2 w-full">
                    {getCorrelationIcon(corr.secondary)}
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium">
                        Steps → {corr.secondary}
                      </div>
                      <div className="text-xs opacity-80">
                        {corr.correlation > 0 ? '+' : ''}{(corr.correlation * 100).toFixed(0)}% correlation
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        {corr.confidence}%
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Selected Correlation Details */}
            {selectedCorr && (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg bg-gradient-to-r ${getCorrelationColor(selectedCorr.strength, selectedCorr.direction)} text-white`}>
                  <div className="flex items-start gap-3">
                    <Brain className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium mb-1">{selectedCorr.insight}</div>
                      <div className="text-sm opacity-90">{selectedCorr.actionable}</div>
                    </div>
                  </div>
                </div>

                {/* Correlation Scatter Plot */}
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart data={getScatterData()}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="x" 
                        name="Steps"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                      />
                      <YAxis 
                        dataKey="y" 
                        name={selectedCorr.secondary}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          name === 'x' ? `${value.toLocaleString()} steps` : 
                          selectedCorr.secondary === 'Screen Time' ? `${value}h` :
                          selectedCorr.secondary === 'REM Sleep' ? `${value}h` : `${value}`,
                          name === 'x' ? 'Steps' : selectedCorr.secondary
                        ]}
                        labelFormatter={(label, payload) => 
                          payload?.[0]?.payload?.date ? 
                          new Date(payload[0].payload.date).toLocaleDateString() : ''
                        }
                      />
                      <Scatter 
                        name="Correlation" 
                        dataKey="y" 
                        fill={selectedCorr.direction === 'positive' ? '#22c55e' : '#ef4444'}
                        fillOpacity={0.8}
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Weekly Average */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Weekly Average</span>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {Math.round(stepData.reduce((sum, d) => sum + d.steps, 0) / stepData.length).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">steps per day</div>
              </div>

              {/* Best Day */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Best Day</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(...stepData.map(d => d.steps)).toLocaleString()}
                </div>
                <div className="text-xs text-muted-foreground">personal best</div>
              </div>

              {/* Screen Time Impact */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium">Screen Impact</span>
                </div>
                <div className="text-2xl font-bold text-orange-600">
                  -{Math.round(Math.abs(correlations.find(c => c.id === 'steps-screen')?.correlation || 0) * 100)}%
                </div>
                <div className="text-xs text-muted-foreground">steps vs screen time</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedStepChart;