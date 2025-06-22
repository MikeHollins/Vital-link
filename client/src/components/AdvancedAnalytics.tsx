import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, AreaChart, Area, BarChart, Bar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Brain, Search, TrendingUp, Users, Calendar, Target, MessageSquare, Globe, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface PredictiveInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'trend';
  title: string;
  description: string;
  confidence: number;
  timeframe: string;
  actionable: boolean;
  category: string;
}

interface HealthComparison {
  metric: string;
  userValue: number;
  populationAverage: number;
  percentile: number;
  trend: 'improving' | 'stable' | 'declining';
}

export const AdvancedAnalytics: React.FC = () => {
  const [nlQuery, setNlQuery] = useState('');
  const [queryResults, setQueryResults] = useState<any[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');

  // Fetch predictive insights
  const { data: predictiveInsights = [] } = useQuery<PredictiveInsight[]>({
    queryKey: ['/api/analytics/predictive-insights'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/predictive-insights');
      return response.json();
    }
  });

  // Fetch population comparisons
  const { data: comparisons = [] } = useQuery<HealthComparison[]>({
    queryKey: ['/api/analytics/population-comparison'],
    queryFn: async () => {
      const response = await fetch('/api/analytics/population-comparison');
      return response.json();
    }
  });

  // Natural language query handler
  const handleNLQuery = async () => {
    if (!nlQuery.trim()) return;
    
    try {
      const response = await fetch('/api/analytics/natural-language-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: nlQuery })
      });
      const results = await response.json();
      setQueryResults(results);
    } catch (error) {
      console.error('Error processing natural language query:', error);
    }
  };

  // 3D Health Journey Data
  const healthJourneyData = [
    { month: 'Jan', sleep: 7.2, heart_rate: 72, steps: 8500, stress: 3.2 },
    { month: 'Feb', sleep: 7.8, heart_rate: 70, steps: 9200, stress: 2.8 },
    { month: 'Mar', sleep: 7.5, heart_rate: 68, steps: 10100, stress: 2.5 },
    { month: 'Apr', sleep: 8.1, heart_rate: 66, steps: 11200, stress: 2.2 },
    { month: 'May', sleep: 8.3, heart_rate: 65, steps: 12000, stress: 2.0 },
    { month: 'Jun', sleep: 8.0, heart_rate: 67, steps: 11800, stress: 2.3 }
  ];

  // Radar chart data for health profile
  const healthProfileData = [
    { metric: 'Cardiovascular', value: 85, fullMark: 100 },
    { metric: 'Sleep Quality', value: 78, fullMark: 100 },
    { metric: 'Activity Level', value: 92, fullMark: 100 },
    { metric: 'Stress Management', value: 71, fullMark: 100 },
    { metric: 'Nutrition', value: 83, fullMark: 100 },
    { metric: 'Mental Health', value: 88, fullMark: 100 }
  ];

  return (
    <div className="space-y-6">
      {/* Natural Language Query Interface */}
      <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 border-purple-200/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            AI Health Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Ask about your health... e.g., 'Show me my sleep quality during stressful weeks'"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleNLQuery()}
              className="flex-1"
            />
            <Button onClick={handleNLQuery} className="bg-purple-600 hover:bg-purple-700">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          
          {queryResults.length > 0 && (
            <div className="mt-4 space-y-2">
              {queryResults.map((result, index) => (
                <div key={index} className="p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                  <p className="text-sm">{result.response}</p>
                  {result.chart && (
                    <div className="mt-2 h-32">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={result.data}>
                          <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="predictive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
          <TabsTrigger value="journey">Health Journey</TabsTrigger>
          <TabsTrigger value="comparison">Population Comparison</TabsTrigger>
          <TabsTrigger value="profile">Health Profile</TabsTrigger>
        </TabsList>

        {/* Predictive Analytics */}
        <TabsContent value="predictive">
          <div className="grid gap-4">
            {predictiveInsights.map((insight) => (
              <Card key={insight.id} className={`border-l-4 ${
                insight.type === 'risk' ? 'border-l-red-500 bg-red-50/30 dark:bg-red-950/10' :
                insight.type === 'opportunity' ? 'border-l-green-500 bg-green-50/30 dark:bg-green-950/10' :
                'border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={insight.type === 'risk' ? 'destructive' : insight.type === 'opportunity' ? 'default' : 'secondary'}>
                          {insight.type}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{insight.timeframe}</span>
                      </div>
                      <h3 className="font-medium">{insight.title}</h3>
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{insight.confidence}% confidence</div>
                      <div className="text-xs text-muted-foreground">{insight.category}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Interactive Health Journey Timeline */}
        <TabsContent value="journey">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Health Journey Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={healthJourneyData}>
                    <defs>
                      <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05}/>
                      </linearGradient>
                      <linearGradient id="heartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="sleep" stackId="1" stroke="#8b5cf6" fill="url(#sleepGradient)" />
                    <Area type="monotone" dataKey="heart_rate" stackId="2" stroke="#ef4444" fill="url(#heartGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Population Comparison */}
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Anonymous Population Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisons.map((comparison, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                    <div>
                      <h4 className="font-medium">{comparison.metric}</h4>
                      <p className="text-sm text-muted-foreground">
                        You: {comparison.userValue} | Average: {comparison.populationAverage}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={comparison.percentile > 70 ? 'default' : comparison.percentile > 40 ? 'secondary' : 'destructive'}>
                        {comparison.percentile}th percentile
                      </Badge>
                      <div className={`text-sm mt-1 ${
                        comparison.trend === 'improving' ? 'text-green-600' :
                        comparison.trend === 'declining' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {comparison.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Health Profile Radar */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Comprehensive Health Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={healthProfileData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Health Score"
                      dataKey="value"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};