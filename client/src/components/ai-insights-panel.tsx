import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Globe, Target, Sparkles, MessageSquare } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface AIInsightsProps {
  healthData: {
    steps?: number[];
    heartRate?: number[];
    sleep?: number[];
    weight?: number[];
    bloodPressure?: { systolic: number; diastolic: number }[];
    dates: string[];
  };
  userProfile?: any;
}

export function AIInsightsPanel({ healthData, userProfile }: AIInsightsProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedCulture, setSelectedCulture] = useState('general');

  const healthInsightsMutation = useMutation({
    mutationFn: async (params: { healthData: any; timeframe: string; language: string; culturalContext: string }) => {
      const response = await apiReques'POST', '/api/ai/health-insights', params;
      return response.json();
    }
  });

  const patternAnalysisMutation = useMutation({
    mutationFn: async (params: { healthData: any }) => {
      const response = await apiReques'POST', '/api/ai/analyze-patterns', params;
      return response.json();
    }
  });

  const recommendationsMutation = useMutation({
    mutationFn: async (params: { healthData: any; userProfile: any; language: string }) => {
      const response = await apiReques'POST', '/api/ai/personalized-recommendations', params;
      return response.json();
    }
  });

  const translateMutation = useMutation({
    mutationFn: async (params: { content: string; targetLanguage: string; culturalContext: string }) => {
      const response = await apiReques'POST', '/api/ai/translate-content', params;
      return response.json();
    }
  });

  const generateHealthInsights = () => {
    healthInsightsMutation.mutate({
      healthData,
      timeframe: selectedTimeframe,
      language: selectedLanguage,
      culturalContext: selectedCulture
    });
  };

  const analyzePatterns = () => {
    patternAnalysisMutation.mutate({ healthData });
  };

  const getRecommendations = () => {
    recommendationsMutation.mutate({
      healthData,
      userProfile: userProfile || {},
      language: selectedLanguage
    });
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' }
  ];

  const cultures = [
    { code: 'general', name: 'General' },
    { code: 'western', name: 'Western' },
    { code: 'asian', name: 'Asian' },
    { code: 'mediterranean', name: 'Mediterranean' },
    { code: 'nordic', name: 'Nordic' },
    { code: 'latin', name: 'Latin American' }
  ];

  const timeframes = [
    { code: 'week', name: 'Past Week' },
    { code: 'month', name: 'Past Month' },
    { code: 'quarter', name: 'Past Quarter' },
    { code: 'year', name: 'Past Year' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-900 dark:text-purple-100">
            <Brain className="h-5 w-5" />
            AI-Powered Health Insights
          </CardTitle>
          <CardDescription className="text-purple-700 dark:text-purple-300">
            Get advanced analysis and personalized recommendations using Google Gemini AI
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      {lang.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                {timeframes.map((tf) => (
                  <SelectItem key={tf.code} value={tf.code}>
                    {tf.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCulture} onValueChange={setSelectedCulture}>
              <SelectTrigger>
                <SelectValue placeholder="Cultural context" />
              </SelectTrigger>
              <SelectContent>
                {cultures.map((culture) => (
                  <SelectItem key={culture.code} value={culture.code}>
                    {culture.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="insights" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="insights">Health Insights</TabsTrigger>
              <TabsTrigger value="patterns">Pattern Analysis</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>

            <TabsContent value="insights" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Comprehensive Health Analysis</h3>
                <Button 
                  onClick={generateHealthInsights}
                  disabled={healthInsightsMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {healthInsightsMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Generate Insights
                    </div>
                  )}
                </Button>
              </div>

              {healthInsightsMutation.data && (
                <Card className="bg-white dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                      {healthInsightsMutation.data.title}
                    </CardTitle>
                    <CardDescription>{healthInsightsMutation.data.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {healthInsightsMutation.data.insights?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Key Insights</h4>
                        <ul className="space-y-2">
                          {healthInsightsMutation.data.insights.map((insight: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {healthInsightsMutation.data.trends?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Health Trends</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {healthInsightsMutation.data.trends.map((trend: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                              <Badge variant={trend.direction === 'improving' ? 'default' : trend.direction === 'declining' ? 'destructive' : 'secondary'}>
                                {trend.metric}
                              </Badge>
                              <span className="text-sm capitalize">{trend.direction}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="patterns" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Advanced Pattern Analysis</h3>
                <Button 
                  onClick={analyzePatterns}
                  disabled={patternAnalysisMutation.isPending}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {patternAnalysisMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Analyze Patterns
                    </div>
                  )}
                </Button>
              </div>

              {patternAnalysisMutation.data && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patternAnalysisMutation.data.patterns?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Patterns Detected</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {patternAnalysisMutation.data.patterns.map((pattern: string, index: number) => (
                            <li key={index} className="text-sm">{pattern}</li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {patternAnalysisMutation.data.correlations?.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Correlations Found</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {patternAnalysisMutation.data.correlations.map((corr: any, index: number) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{corr.metric1}</Badge>
                                <span className="text-xs">↔</span>
                                <Badge variant="outline">{corr.metric2}</Badge>
                                <Badge variant={corr.strength > 0.7 ? 'default' : corr.strength > 0.4 ? 'secondary' : 'outline'}>
                                  {Math.round(corr.strength * 100)}%
                                </Badge>
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-300">{corr.explanation}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Personalized Recommendations</h3>
                <Button 
                  onClick={getRecommendations}
                  disabled={recommendationsMutation.isPending}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {recommendationsMutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      Get Recommendations
                    </div>
                  )}
                </Button>
              </div>

              {recommendationsMutation.data && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-green-600" />
                      Your Personalized Action Plan
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        recommendationsMutation.data.priorityLevel === 'high' ? 'destructive' :
                        recommendationsMutation.data.priorityLevel === 'medium' ? 'default' : 'secondary'
                      }>
                        {recommendationsMutation.data.priorityLevel} priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recommendationsMutation.data.recommendations?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Recommended Actions</h4>
                        <ul className="space-y-2">
                          {recommendationsMutation.data.recommendations.map((rec: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {recommendationsMutation.data.goalSuggestions?.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2">Goal Suggestions</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {recommendationsMutation.data.goalSuggestions.map((goal: string, index: number) => (
                            <div key={index} className="p-2 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-500">
                              <span className="text-sm">{goal}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}