
import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { intelligentHealthValidator } from '../intelligent-health-validator';
import { aiCorrelationAnalyzer } from '../ai-correlation-analysis';
import { geminiHealthAI } from '../gemini-ai';
import { db } from '../db';
import { healthData, users } from '@shared/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Enhanced health insights with intelligent validation
router.post('/api/ai/enhanced-health-insights', async (req, res) => {
  try {
    const { userId, timeframe = 'month', language = 'en', culturalContext = 'general' } = req.body;

    // Get user's health data
    const userHealthData = await db
      .select()
      .from(healthData)
      .where(
        and(
          eq(healthData.userId, userId),
          gte(healthData.timestamp, new Date(Date.now() - getTimeframeMs(timeframe)))
        )
      )
      .orderBy(desc(healthData.timestamp));

    if (userHealthData.length === 0) {
      return res.json({
        insights: [],
        quality: { score: 0, message: 'Insufficient data for analysis' }
      });
    }

    // Get user profile for context
    const userProfile = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    const user = userProfile[0];
    const userContext = {
      age: user?.age || 30,
      gender: user?.gender || 'unknown',
      fitnessLevel: user?.fitnessLevel || 'medium',
      medicalConditions: user?.medicalConditions || [],
      medications: user?.medications || [],
      culturalBackground: culturalContext
    };

    // Perform intelligent validation on recent data
    const recentData = userHealthData.slice(0, 10);
    const validationResults = await intelligentHealthValidator.performBatchValidation(
      recentData.map(d => ({
        type: d.type,
        value: d.value,
        timestamp: d.timestamp
      })),
      userContext
    );

    // Analyze correlations with enhanced context
    const correlationAnalysis = await aiCorrelationAnalyzer.analyzeStepCorrelations(
      userHealthData
        .filter(d => d.type === 'steps')
        .map(d => ({
          date: d.timestamp.toISOString().split('T')[0],
          steps: d.value,
          remSleep: getMetricValue(userHealthData, 'sleep', d.timestamp),
          heartRate: getMetricValue(userHealthData, 'heartRate', d.timestamp),
          mood: getMetricValue(userHealthData, 'mood', d.timestamp)
        }))
    );

    // Generate comprehensive AI insights
    const aiInsights = await geminiHealthAI.generateHealthInsights({
      healthData: organizeHealthDataByType(userHealthData),
      timeframe,
      language,
      culturalContext,
      userProfile: user
    });

    // Combine all insights
    const enhancedInsights = {
      ...aiInsights,
      correlations: correlationAnalysis,
      dataQuality: {
        overallScore: validationResults.overallQualityScore,
        alerts: validationResults.alerts,
        validatedDataPoints: validationResults.validatedData.length
      },
      culturalAdaptations: await generateCulturalHealthAdaptations(
        culturalContext, 
        language, 
        aiInsights
      ),
      intelligentRecommendations: await generateIntelligentRecommendations(
        userHealthData,
        correlationAnalysis,
        userContext,
        language
      )
    };

    res.json(enhancedInsights);

  } catch (error) {
    console.error('Enhanced AI insights error:', error);
    res.status(500).json({ error: 'Failed to generate enhanced insights' });
  }
});

// Advanced pattern analysis endpoint
router.post('/api/ai/advanced-pattern-analysis', async (req, res) => {
  try {
    const { healthData: inputData, userId, analysisType = 'comprehensive' } = req.body;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    
    const prompt = `
    Perform advanced pattern analysis on this health data:
    ${JSON.stringify(inputData, null, 2)}
    
    Analysis Type: ${analysisType}
    
    Identify:
    1. Hidden patterns not obvious to users
    2. Weekly/monthly cycles and rhythms
    3. Correlation networks between multiple metrics
    4. Early warning indicators for health changes
    5. Optimization opportunities for better health outcomes
    6. Behavioral patterns affecting health metrics
    
    Provide actionable insights that users can implement immediately.
    
    Respond in JSON format with detailed analysis.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysis = JSON.parse(response.text().replace(/```json\n?|\n?```/g, ''));

    res.json({
      analysis,
      confidence: 'high',
      actionableInsights: analysis.actionableInsights || [],
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Advanced pattern analysis error:', error);
    res.status(500).json({ error: 'Failed to perform pattern analysis' });
  }
});

// Cultural health adaptation endpoint
router.post('/api/ai/cultural-health-adaptation', async (req, res) => {
  try {
    const { content, culturalContext, language, healthMetrics } = req.body;

    const adaptedContent = await geminiHealthAI.generateMultilingualHealthContent(
      content,
      language,
      culturalContext
    );

    // Add cultural health insights
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
    const culturalInsightPrompt = `
    Provide culturally-adapted health insights for ${culturalContext} background:
    
    Health Metrics: ${JSON.stringify(healthMetrics)}
    Language: ${language}
    
    Consider:
    1. Traditional health practices and beliefs
    2. Dietary patterns and food culture
    3. Activity patterns and lifestyle norms
    4. Family and community health approaches
    5. Religious or cultural health observances
    
    Provide respectful, culturally-sensitive health guidance.
    `;

    const culturalResult = await model.generateContent(culturalInsightPrompt);
    const culturalInsights = culturalResult.response.text();

    res.json({
      adaptedContent,
      culturalInsights,
      culturallyAdapted: true,
      language
    });

  } catch (error) {
    console.error('Cultural adaptation error:', error);
    res.status(500).json({ error: 'Failed to generate cultural adaptation' });
  }
});

// Helper functions
function getTimeframeMs(timeframe: string): number {
  const timeframes = {
    'week': 7 * 24 * 60 * 60 * 1000,
    'month': 30 * 24 * 60 * 60 * 1000,
    'quarter': 90 * 24 * 60 * 60 * 1000,
    'year': 365 * 24 * 60 * 60 * 1000
  };
  return timeframes[timeframe] || timeframes.month;
}

function getMetricValue(healthData: any[], type: string, timestamp: Date): number {
  const dayData = healthData.filter(d => 
    d.type === type && 
    Math.abs(d.timestamp.getTime() - timestamp.getTime()) < 24 * 60 * 60 * 1000
  );
  return dayData.length > 0 ? dayData[0].value : 0;
}

function organizeHealthDataByType(healthData: any[]): Record<string, any[]> {
  return healthData.reduce((acc, data) => {
    if (!acc[data.type]) acc[data.type] = [];
    acc[data.type].push({
      value: data.value,
      timestamp: data.timestamp,
      deviceId: data.deviceId
    });
    return acc;
  }, {});
}

async function generateCulturalHealthAdaptations(
  culturalContext: string, 
  language: string, 
  insights: any
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `
  Adapt these health insights for ${culturalContext} cultural context:
  ${JSON.stringify(insights.insights)}
  
  Language: ${language}
  
  Provide 3-5 culturally-appropriate adaptations that respect traditional practices while promoting modern health science.
  `;

  try {
    const result = await model.generateContent(prompt);
    const adaptations = result.response.text();
    return adaptations.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    return ['Cultural adaptations temporarily unavailable'];
  }
}

async function generateIntelligentRecommendations(
  healthData: any[],
  correlations: any[],
  userContext: any,
  language: string
): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  
  const prompt = `
  Generate intelligent, personalized health recommendations based on:
  
  Health Data: ${JSON.stringify(healthData.slice(0, 20))}
  Correlations: ${JSON.stringify(correlations)}
  User Context: ${JSON.stringify(userContext)}
  Language: ${language}
  
  Provide 5-7 specific, actionable recommendations that:
  1. Address identified patterns and correlations
  2. Are appropriate for the user's age and fitness level
  3. Consider cultural background
  4. Include specific metrics to track improvement
  5. Are achievable within 2-4 weeks
  `;

  try {
    const result = await model.generateContent(prompt);
    const recommendations = result.response.text();
    return recommendations.split('\n').filter(line => line.trim().length > 0);
  } catch (error) {
    return ['Personalized recommendations temporarily unavailable'];
  }
}

export default router;
