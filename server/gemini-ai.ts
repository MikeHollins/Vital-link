import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is required');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export interface HealthInsightRequest {
  healthData: {
    steps?: number[];
    heartRate?: number[];
    sleep?: number[];
    weight?: number[];
    bloodPressure?: { systolic: number; diastolic: number }[];
    dates: string[];
  };
  userId: string;
  timeframe: 'week' | 'month' | 'quarter' | 'year';
  language?: string;
  culturalContext?: string;
}

export interface HealthInsight {
  id: string;
  title: string;
  description: string;
  insights: string[];
  recommendations: string[];
  trends: {
    metric: string;
    direction: 'improving' | 'stable' | 'declining';
    confidence: number;
  }[];
  riskFactors?: string[];
  positiveFactors?: string[];
  actionPlan?: string[];
  culturallyAdapted: boolean;
  language: string;
  createdAt: string;
}

export interface MultilingualContent {
  originalText: string;
  translatedText: string;
  language: string;
  culturalAdaptations: string[];
  medicalTermsSimplified: boolean;
}

class GeminiHealthAI {
  private model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  async generateHealthInsights(request: HealthInsightRequest): Promise<HealthInsight> {
    const prompt = this.buildHealthInsightPrompt(request);

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const insight = this.parseHealthInsightResponse(text, request);
      return insight;
    } catch (error) {
      console.error('Error generating health insights:', error);
      throw new Error('Failed to generate health insights');
    }
  }

  async generateMultilingualHealthContent(
    content: string,
    targetLanguage: string,
    culturalContext?: string
  ): Promise<MultilingualContent> {
    const prompt = `
    Translate and culturally adapt this health content to ${targetLanguage}.
    Original content: "${content}"

    Cultural context: ${culturalContext || 'General'}

    Instructions:
    1. Translate accurately while preserving medical meaning
    2. Adapt to cultural health practices and communication styles
    3. Simplify complex medical terms where appropriate
    4. Ensure cultural sensitivity around health topics

    Respond in JSON format:
    {
      "translatedText": "translated content",
      "culturalAdaptations": ["adaptation1", "adaptation2"],
      "medicalTermsSimplified": true/false
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const parsed = JSON.parse(text.replace(/```json\n?|\n?```/g, ''));

      return {
        originalText: content,
        translatedText: parsed.translatedText,
        language: targetLanguage,
        culturalAdaptations: parsed.culturalAdaptations || [],
        medicalTermsSimplified: parsed.medicalTermsSimplified || false
      };
    } catch (error) {
      console.error('Error generating multilingual content:', error);
      throw new Error('Failed to generate multilingual content');
    }
  }

  async analyzeAdvancedHealthPatterns(healthData: any, userProfile?: any): Promise<{
    patterns: string[];
    correlations: { metric1: string; metric2: string; strength: number; explanation: string }[];
    anomalies: { metric: string; value: number; explanation: string }[];
    predictions: { metric: string; trend: string; confidence: number }[];
    seasonalPatterns: { season: string; insights: string[] }[];
    behavioralInsights: { behavior: string; impact: string; recommendation: string }[];
    riskAssessment: { level: 'low' | 'medium' | 'high'; factors: string[] };
  }> {
    const culturalContext = userProfile?.culturalBackground || 'general';
    const lifestyle = userProfile?.lifestyle || 'standard';

    const prompt = `
    As an advanced health analytics AI, analyze these comprehensive health patterns:
    ${JSON.stringify(healthData, null, 2)}

    User Context: ${JSON.stringify(userProfile, null, 2)}
    Cultural Context: ${culturalContext}
    Lifestyle: ${lifestyle}

    Provide detailed analysis including:
    1. Notable patterns and trends in the data
    2. Correlations between different health metrics
    3. Any anomalies or concerning values that need attention
    4. Predicted trends based on current trajectory
    5. Seasonal patterns if time-series data is available
    6. Behavioral insights linking lifestyle to health outcomes
    7. Risk assessment considering cultural and lifestyle factors

    Consider cultural health practices, dietary patterns, and lifestyle norms for ${culturalContext} background.

    Respond in JSON format:
    {
      "patterns": ["pattern1", "pattern2"],
      "correlations": [{"metric1": "steps", "metric2": "sleep", "strength": 0.7, "explanation": "..."}],
      "anomalies": [{"metric": "heartRate", "value": 120, "explanation": "..."}],
      "predictions": [{"metric": "fitness", "trend": "improving", "confidence": 0.8}],
      "seasonalPatterns": [{"season": "winter", "insights": ["insight1"]}],
      "behavioralInsights": [{"behavior": "late_eating", "impact": "sleep_quality", "recommendation": "..."}],
      "riskAssessment": {"level": "low", "factors": ["factor1"]}
    }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error('Error analyzing health patterns:', error);
      throw new Error('Failed to analyze health patterns');
    }
  }

  async generatePersonalizedRecommendations(
    healthData: any,
    userProfile: any,
    language: string = 'en'
  ): Promise<{
    recommendations: string[];
    goalSuggestions: string[];
    lifestyleChanges: string[];
    priorityLevel: 'high' | 'medium' | 'low';
  }> {
    const prompt = `
    Generate personalized health recommendations based on:
    Health Data: ${JSON.stringify(healthData, null, 2)}
    User Profile: ${JSON.stringify(userProfile, null, 2)}

    Language: ${language}

    Provide:
    1. Specific, actionable recommendations
    2. Goal suggestions for improvement
    3. Lifestyle changes that would benefit the user
    4. Priority level for urgency

    Respond in JSON format with recommendations, goalSuggestions, lifestyleChanges, and priorityLevel.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw new Error('Failed to generate personalized recommendations');
    }
  }

  private buildHealthInsightPrompt(request: HealthInsightRequest): string {
    const { healthData, timeframe, language = 'en', culturalContext } = request;

    return `
    Analyze this health data and provide comprehensive insights:

    Health Data: ${JSON.stringify(healthData, null, 2)}
    Timeframe: ${timeframe}
    Language: ${language}
    Cultural Context: ${culturalContext || 'General'}

    Provide analysis including:
    1. Overall health trends and patterns
    2. Specific insights about each metric
    3. Actionable recommendations for improvement
    4. Risk factors and positive factors identified
    5. Detailed action plan with specific steps

    Adapt language and recommendations to the cultural context.
    Use simple, encouraging language that motivates positive health behaviors.

    Respond in JSON format:
    {
      "title": "Insight title",
      "description": "Brief description",
      "insights": ["insight1", "insight2"],
      "recommendations": ["rec1", "rec2"],
      "trends": [{"metric": "steps", "direction": "improving", "confidence": 0.8}],
      "riskFactors": ["risk1"],
      "positiveFactors": ["positive1"],
      "actionPlan": ["action1", "action2"]
    }
    `;
  }

  private parseHealthInsightResponse(response: string, request: HealthInsightRequest): HealthInsight {
    try {
      const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, ''));

      return {
        id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: parsed.title || 'Health Insight',
        description: parsed.description || 'Analysis of your health data',
        insights: parsed.insights || [],
        recommendations: parsed.recommendations || [],
        trends: parsed.trends || [],
        riskFactors: parsed.riskFactors || [],
        positiveFactors: parsed.positiveFactors || [],
        actionPlan: parsed.actionPlan || [],
        culturallyAdapted: !!request.culturalContext,
        language: request.language || 'en',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing health insight response:', error);
      // Return a basic insight if parsing fails
      return {
        id: `insight_${Date.now()}`,
        title: 'Health Analysis',
        description: 'Unable to parse detailed analysis',
        insights: ['Your health data has been analyzed'],
        recommendations: ['Continue monitoring your health metrics'],
        trends: [],
        riskFactors: [],
        positiveFactors: [],
        actionPlan: [],
        culturallyAdapted: false,
        language: request.language || 'en',
        createdAt: new Date().toISOString()
      };
    }
  }
}

export const geminiHealthAI = new GeminiHealthAI();