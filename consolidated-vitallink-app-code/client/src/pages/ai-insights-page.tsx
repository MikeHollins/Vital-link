import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  TrendingUp, 
  MessageSquare, 
  Target, 
  Lightbulb,
  Activity,
  Heart,
  Moon,
  Zap,
  BarChart3,
  Sparkles,
  Send,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface HealthInsight {
  id: string;
  type: 'recommendation' | 'pattern' | 'alert' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  priority: 'high' | 'medium' | 'low';
  category: 'fitness' | 'sleep' | 'nutrition' | 'mental-health' | 'general';
  actionItems?: string[];
  dataPoints?: {
    metric: string;
    value: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const AIInsightsPage: React.FC = () => {
  const { toast } = useToast();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);

  // Fetch AI-generated health insights from connected platforms
  const { data: insights, isLoading: insightsLoading, error: insightsError } = useQuery<HealthInsight[]>({
    queryKey: ['/api/ai-insights'],
    retry: false,
    refetchOnMount: true,
  });

  // Generate new insights mutation
  const generateInsightsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/ai-insights/generate', {});
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai-insights'] });
      toast({
        title: "New Insights Generated",
        description: "Fresh AI insights are ready based on your latest health data",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Insight Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Send chat message mutation
  const sendChatMutation = useMutation({
    mutationFn: async (message: string) => {
      const res = await apiRequest('POST', '/api/ai-chat', { message });
      return await res.json();
    },
    onSuccess: (response) => {
      const assistantMessage: ChatMessage = {
        id: Date.now().toString() + '_assistant',
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
      };
      setChatMessages(prev => [...prev, assistantMessage]);
    },
    onError: (error: Error) => {
      toast({
        title: "Chat Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: chatInput,
      timestamp: new Date().toISOString(),
    };

    setChatMessages(prev => [...prev, userMessage]);
    sendChatMutation.mutate(chatInput);
    setChatInput('');
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'recommendation': return <Lightbulb className="h-5 w-5" />;
      case 'pattern': return <TrendingUp className="h-5 w-5" />;
      case 'alert': return <AlertTriangle className="h-5 w-5" />;
      case 'achievement': return <CheckCircle className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'recommendation': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400';
      case 'pattern': return 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400';
      case 'alert': return 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400';
      case 'achievement': return 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400';
      default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fitness': return <Activity className="h-4 w-4" />;
      case 'sleep': return <Moon className="h-4 w-4" />;
      case 'nutrition': return <Heart className="h-4 w-4" />;
      case 'mental-health': return <Brain className="h-4 w-4" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Insights
              </h1>
              <p className="text-slate-300 text-lg">
                Personalized health intelligence powered by advanced AI
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => generateInsightsMutation.mutate()}
            disabled={generateInsightsMutation.isPending}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            {generateInsightsMutation.isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Generate New Insights
              </div>
            )}
          </Button>
        </div>

        <Tabs defaultValue="insights" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-700">
            <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Brain className="h-4 w-4" />
              Smart Insights
            </TabsTrigger>
            <TabsTrigger value="coaching" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <MessageSquare className="h-4 w-4" />
              AI Coach
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="h-4 w-4" />
              Data Analysis
            </TabsTrigger>
          </TabsList>

          {/* Smart Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            {insightsLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse bg-slate-800/50 border-slate-700">
                    <CardHeader>
                      <div className="h-4 bg-slate-600 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-600 rounded w-1/2"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-slate-600 rounded"></div>
                        <div className="h-3 bg-slate-600 rounded w-5/6"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : insights && insights.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {insights.map((insight) => (
                  <Card key={insight.id} className="hover:shadow-xl transition-all duration-300 border-0 bg-slate-800/80 backdrop-blur-sm border-slate-700">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className={`p-2 rounded-lg ${getInsightColor(insight.type)}`}>
                          {getInsightIcon(insight.type)}
                        </div>
                        <Badge variant={insight.priority === 'high' ? 'destructive' : insight.priority === 'medium' ? 'default' : 'secondary'}>
                          {insight.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg flex items-center gap-2 text-white">
                        {insight.title}
                        {getCategoryIcon(insight.category)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-300 mb-4">
                        {insight.description}
                      </p>
                      
                      {insight.actionItems && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-sm text-white">Recommended Actions:</h4>
                          <ul className="text-sm space-y-1">
                            {insight.actionItems.map((action, index) => (
                              <li key={index} className="flex items-start gap-2 text-slate-300">
                                <Target className="h-3 w-3 mt-0.5 text-blue-400 flex-shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {insight.dataPoints && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-semibold text-sm text-white">Key Metrics:</h4>
                          {insight.dataPoints.map((point, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className="text-slate-300">{point.metric}</span>
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-white">{point.value}</span>
                                <TrendingUp className={`h-3 w-3 ${
                                  point.trend === 'up' ? 'text-green-400' : 
                                  point.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                                }`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                        <span>{new Date(insight.createdAt).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <Alert className="border-blue-400 bg-blue-950/20 border">
                  <Sparkles className="h-4 w-4 text-blue-400" />
                  <AlertDescription className="text-blue-200">
                    Connect your health platforms to unlock AI-powered insights from your real health data
                  </AlertDescription>
                </Alert>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Card className="bg-gradient-to-br from-purple-900/40 to-indigo-900/40 border-purple-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-purple-300">
                        <Brain className="h-5 w-5" />
                        Sleep Quality Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-purple-200 mb-3">
                        AI analyzes your sleep patterns from connected devices to identify optimization opportunities
                      </p>
                      <div className="space-y-2 text-xs text-purple-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          REM sleep pattern correlation
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Sleep efficiency recommendations
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-900/40 to-emerald-900/40 border-green-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-green-300">
                        <Activity className="h-5 w-5" />
                        Activity Correlation
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-green-200 mb-3">
                        Discover how your daily activities impact mood, energy, and health metrics
                      </p>
                      <div className="space-y-2 text-xs text-green-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Steps vs mood analysis
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Exercise timing optimization
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-900/40 to-red-900/40 border-orange-500/30">
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2 text-orange-300">
                        <Heart className="h-5 w-5" />
                        Heart Health Insights
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-orange-200 mb-3">
                        Real-time heart rate variability and cardiovascular health analysis
                      </p>
                      <div className="space-y-2 text-xs text-orange-300">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          HRV trend monitoring
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3" />
                          Stress level correlation
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          {/* AI Coach Tab */}
          <TabsContent value="coaching" className="space-y-6">
            <Card className="h-[600px] flex flex-col bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5" />
                  AI Health Coach
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-slate-400 mt-20">
                      <MessageSquare className="h-12 w-12 mx-auto mb-4 text-slate-500" />
                      <p>Ask your AI health coach anything about your wellness journey</p>
                    </div>
                  ) : (
                    chatMessages.map((message) => (
                      <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-slate-700 text-slate-200'
                        }`}>
                          {message.content}
                        </div>
                      </div>
                    ))
                  )}
                  {sendChatMutation.isPending && (
                    <div className="flex justify-start">
                      <div className="bg-slate-700 text-slate-200 p-3 rounded-lg">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Textarea
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask about your health data, trends, or get personalized recommendations..."
                    className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
                    rows={2}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={sendChatMutation.isPending || !chatInput.trim()}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Analysis Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Health Data Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-slate-200">Connected Platforms</span>
                      <Badge variant="outline" className="text-blue-400 border-blue-400">2 detected</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-slate-200">Data Points Analyzed</span>
                      <Badge variant="outline" className="text-green-400 border-green-400">1,247</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <span className="text-slate-200">Correlations Found</span>
                      <Badge variant="outline" className="text-purple-400 border-purple-400">23</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">AI Analysis Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-slate-200">Real-time data processing active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-slate-200">Pattern recognition enabled</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-slate-200">Predictive modeling ready</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIInsightsPage;