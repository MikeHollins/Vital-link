import OpenAI from 'openai';
import { HealthData, User } from '@shared/schema';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AIInsight {
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

export async function generateHealthInsights(
  userId: string,
  healthData: HealthData[]
): Promise<AIInsight[]> {
  if (!healthData || healthData.length === 0) {
    return [];
  }

  try {
    // Prepare health data summary for AI analysis
    const dataSummary = healthData.reduce((acc, data) => {
      if (!acc[data.type]) {
        acc[data.type] = [];
      }
      acc[data.type].push({
        value: data.value,
        timestamp: data.timestamp,
        deviceId: data.deviceId
      });
      return acc;
    }, {} as Record<string, any[]>);

    const prompt = `
    Analyze this health data and provide personalized insights as a health AI assistant.
    
    Health Data Summary:
    ${JSON.stringify(dataSummary, null, 2)}
    
    Please generate 3-5 actionable health insights in JSON format with the following structure:
    {
      "insights": [
        {
          "type": "recommendation|pattern|alert|achievement",
          "title": "Brief insight title",
          "description": "Detailed explanation of the insight",
          "confidence": 0.85,
          "priority": "high|medium|low",
          "category": "fitness|sleep|nutrition|mental-health|general",
          "actionItems": ["Action 1", "Action 2"],
          "dataPoints": [
            {
              "metric": "Metric name",
              "value": 123,
              "trend": "up|down|stable"
            }
          ]
        }
      ]
    }
    
    Focus on:
    - Identifying meaningful patterns in the data
    - Providing actionable recommendations
    - Highlighting achievements and positive trends
    - Warning about concerning patterns
    - Suggesting specific, measurable improvements
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert health AI assistant. Analyze health data patterns and provide personalized, actionable insights. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"insights": []}');
    
    return result.insights.map((insight: any, index: number) => ({
      ...insight,
      id: `insight_${userId}_${Date.now()}_${index}`,
      createdAt: new Date().toISOString()
    }));

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return [];
  }
}

export async function generateHealthCoachResponse(
  message: string,
  userHealthData?: HealthData[],
  conversationHistory?: { role: string; content: string }[]
): Promise<string> {
  try {
    const healthContext = userHealthData ? `
    User's Recent Health Data:
    ${userHealthData.slice(-20).map(data => 
      `${data.type}: ${data.value} (${new Date(data.timestamp).toLocaleDateString()})`
    ).join('\n')}
    ` : '';

    const messages = [
      {
        role: "system",
        content: `You are a knowledgeable, supportive health coach AI. Your role is to:
        - Provide personalized health advice based on user data
        - Answer questions about health metrics and trends
        - Offer motivation and encouragement
        - Suggest practical, achievable health improvements
        - Reference the user's actual health data when relevant
        
        ${healthContext}
        
        Always be supportive, evidence-based, and practical in your responses.`
      },
      ...(conversationHistory || []),
      {
        role: "user",
        content: message
      }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      temperature: 0.8,
      max_tokens: 500,
    });

    return response.choices[0].message.content || "I'm sorry, I couldn't process that request right now.";

  } catch (error) {
    console.error('Error generating coach response:', error);
    throw new Error('Unable to generate response at this time');
  }
}

export async function analyzeHealthPatterns(
  healthData: HealthData[]
): Promise<{
  correlations: Array<{
    metrics: string[];
    correlation: number;
    insight: string;
  }>;
  trends: Array<{
    metric: string;
    direction: 'improving' | 'declining' | 'stable';
    confidence: number;
  }>;
}> {
  if (!healthData || healthData.length === 0) {
    return { correlations: [], trends: [] };
  }

  try {
    const dataByType = healthData.reduce((acc, data) => {
      if (!acc[data.type]) {
        acc[data.type] = [];
      }
      acc[data.type].push({
        value: data.value,
        timestamp: data.timestamp
      });
      return acc;
    }, {} as Record<string, any[]>);

    const prompt = `
    Analyze these health metrics for patterns, correlations, and trends:
    
    ${JSON.stringify(dataByType, null, 2)}
    
    Please provide analysis in JSON format:
    {
      "correlations": [
        {
          "metrics": ["metric1", "metric2"],
          "correlation": 0.75,
          "insight": "Description of the relationship"
        }
      ],
      "trends": [
        {
          "metric": "metric_name",
          "direction": "improving|declining|stable",
          "confidence": 0.85
        }
      ]
    }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a health data analyst. Identify meaningful patterns, correlations, and trends in health data. Respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    return JSON.parse(response.choices[0].message.content || '{"correlations": [], "trends": []}');

  } catch (error) {
    console.error('Error analyzing health patterns:', error);
    return { correlations: [], trends: [] };
  }
}