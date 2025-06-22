import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import { db } from './db';
import { healthData, aiCorrelationInsights } from '@shared/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface HealthMetricData {
  date: string;
  steps: number;
  remSleep?: number;
  screenTime?: number;
  heartRate?: number;
  mood?: number;
  stressLevel?: number;
}

interface CorrelationAnalysis {
  primaryMetric: string;
  secondaryMetric: string;
  correlationCoefficient: number;
  strength: 'weak' | 'moderate' | 'strong';
  direction: 'positive' | 'negative';
  insight: string;
  confidence: number;
  actionableRecommendation: string;
  dataPoints: number;
  clinicalSignificance: string;
  biologicalPlausibility: number;
}

interface EnhancedHealthInsight {
  type: 'correlation' | 'trend' | 'anomaly' | 'pattern';
  metrics: string[];
  insight: string;
  confidence: number;
  actionable: boolean;
  recommendations: string[];
  timeframe: string;
  medicalRelevance: number;
}

export class AICorrelationAnalyzer {
  private geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  // Calculate Pearson correlation coefficient
  private calculateCorrelation(x: number[], y: number[]): number {
    if (x.length !== y.length || x.length === 0) return 0;

    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumYY = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  }

  private getCorrelationStrength(coefficient: number): 'weak' | 'moderate' | 'strong' {
    const abs = Math.abs(coefficient);
    if (abs >= 0.7) return 'strong';
    if (abs >= 0.4) return 'moderate';
    return 'weak';
  }

  private getCorrelationDirection(coefficient: number): 'positive' | 'negative' {
    return coefficient >= 0 ? 'positive' : 'negative';
  }

  async analyzeStepCorrelations(healthData: HealthMetricData[]): Promise<CorrelationAnalysis[]> {
    const correlations: CorrelationAnalysis[] = [];
    
    if (healthData.length < 3) {
      return correlations; // Need at least 3 data points for meaningful correlation
    }

    const steps = healthData.map(d => d.steps);
    const metrics = [
      { name: 'remSleep', data: healthData.map(d => d.remSleep || 0), unit: 'hours', biologicalRange: [0, 12] },
      { name: 'screenTime', data: healthData.map(d => d.screenTime || 0), unit: 'hours', biologicalRange: [0, 18] },
      { name: 'heartRate', data: healthData.map(d => d.heartRate || 0), unit: 'bpm', biologicalRange: [40, 200] },
      { name: 'mood', data: healthData.map(d => d.mood || 0), unit: 'score', biologicalRange: [1, 10] },
      { name: 'stressLevel', data: healthData.map(d => d.stressLevel || 0), unit: 'level', biologicalRange: [1, 10] }
    ];

    for (const metric of metrics) {
      // Filter out zero values for more accurate correlation
      const validIndices = metric.data
        .map((value, index) => ({ value, index }))
        .filter(item => item.value > 0)
        .map(item => item.index);

      if (validIndices.length < 3) continue;

      const validSteps = validIndices.map(i => steps[i]);
      const validMetricData = validIndices.map(i => metric.data[i]);

      const correlationCoeff = this.calculateCorrelation(validSteps, validMetricData);
      
      if (Math.abs(correlationCoeff) < 0.2) continue; // Skip very weak correlations

      const strength = this.getCorrelationStrength(correlationCoeff);
      const direction = this.getCorrelationDirection(correlationCoeff);

      // Generate AI insight using Gemini
      const insight = await this.generateAIInsight(
        'steps',
        metric.name,
        correlationCoeff,
        strength,
        direction,
        metric.unit,
        validSteps,
        validMetricData
      );

      correlations.push({
        primaryMetric: 'steps',
        secondaryMetric: metric.name,
        correlationCoefficient: Math.round(correlationCoeff * 100) / 100,
        strength,
        direction,
        insight: insight.insight,
        confidence: insight.confidence,
        actionableRecommendation: insight.actionable,
        dataPoints: validIndices.length,
        clinicalSignificance: 'Automatically analyzed correlation',
        biologicalPlausibility: insight.confidence
      });
    }

    return correlations.sort((a, b) => Math.abs(b.correlationCoefficient) - Math.abs(a.correlationCoefficient));
  }

  private async generateAIInsight(
    primaryMetric: string,
    secondaryMetric: string,
    correlation: number,
    strength: string,
    direction: string,
    unit: string,
    primaryData: number[],
    secondaryData: number[]
  ): Promise<{ insight: string; confidence: number; actionable: string }> {
    const avgPrimary = primaryData.reduce((a, b) => a + b) / primaryData.length;
    const avgSecondary = secondaryData.reduce((a, b) => a + b) / secondaryData.length;
    
    const prompt = `As Vital AI, a health data analysis system, analyze this correlation:

Primary Metric: ${primaryMetric} (average: ${Math.round(avgPrimary).toLocaleString()})
Secondary Metric: ${secondaryMetric} (average: ${Math.round(avgSecondary * 10) / 10} ${unit})
Correlation Coefficient: ${correlation}
Strength: ${strength}
Direction: ${direction}
Data Points: ${primaryData.length}

Generate a health insight in this exact format:
INSIGHT: [One sentence starting with "Vital AI detects that" explaining the correlation]
CONFIDENCE: [Number 60-95 based on correlation strength and data quality]
ACTIONABLE: [One specific, actionable recommendation for the user]

Make it conversational and health-focused. Focus on practical implications for the user's wellness.`;

    try {
      const result = await this.geminiModel.generateContent(prompt);
      const response = result.response.text();
      
      // Parse the AI response
      const insightMatch = response.match(/INSIGHT:\s*(.+)/);
      const confidenceMatch = response.match(/CONFIDENCE:\s*(\d+)/);
      const actionableMatch = response.match(/ACTIONABLE:\s*(.+)/);

      return {
        insight: insightMatch?.[1] || `Vital AI detects a ${strength} ${direction} correlation between ${primaryMetric} and ${secondaryMetric}`,
        confidence: parseInt(confidenceMatch?.[1] || '75'),
        actionable: actionableMatch?.[1] || `Monitor your ${primaryMetric} patterns to optimize ${secondaryMetric}`
      };
    } catch (error) {
      console.error('AI insight generation failed:', error);
      
      // Fallback insight based on correlation data
      const relationshipWord = direction === 'positive' ? 'higher' : 'lower';
      const metricName = secondaryMetric === 'remSleep' ? 'REM sleep quality' :
                        secondaryMetric === 'screenTime' ? 'screen time usage' :
                        secondaryMetric === 'heartRate' ? 'heart rate' :
                        secondaryMetric === 'mood' ? 'mood scores' :
                        secondaryMetric === 'stressLevel' ? 'stress levels' : secondaryMetric;

      return {
        insight: `Vital AI detects that ${relationshipWord} step counts correlate with ${direction === 'positive' ? 'improved' : 'changes in'} ${metricName}`,
        confidence: strength === 'strong' ? 85 : strength === 'moderate' ? 75 : 65,
        actionable: direction === 'positive' ? 
          `Increase daily steps to potentially improve your ${metricName}` :
          `Consider balancing activity levels to optimize your ${metricName}`
      };
    }
  }

  async generateScreenTimeInsights(screenTimeData: number[], stepsData: number[]): Promise<string> {
    if (screenTimeData.length === 0) return '';

    const avgScreenTime = screenTimeData.reduce((a, b) => a + b) / screenTimeData.length;
    const correlation = this.calculateCorrelation(stepsData, screenTimeData);

    const prompt = `As Vital AI, analyze this user's digital wellness pattern:

Average daily screen time: ${Math.round(avgScreenTime * 10) / 10} hours
Correlation with steps: ${Math.round(correlation * 100)}%
Data points: ${screenTimeData.length} days

Generate a brief insight about their digital wellness and physical activity balance. 
Start with "Vital AI detects" and keep it under 100 words.`;

    try {
      const result = await this.geminiModel.generateContent(prompt);
      return result.response.text().trim();
    } catch (error) {
      console.error('Screen time insight generation failed:', error);
      return `Vital AI detects an average screen time of ${Math.round(avgScreenTime * 10) / 10} hours daily. Consider balancing digital engagement with physical activity.`;
    }
  }
}

export const aiCorrelationAnalyzer = new AICorrelationAnalyzer();