
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface HealthValidationResult {
  isValid: boolean;
  confidence: number;
  biologicalPlausibility: number;
  anomalyScore: number;
  contextualFactors: string[];
  recommendations: string[];
  dataQualityScore: number;
  environmentalAdjustments: {
    altitude?: number;
    temperature?: number;
    humidity?: number;
    timeOfDay?: string;
  };
}

interface UserContext {
  age: number;
  gender: string;
  fitnessLevel: string;
  medicalConditions: string[];
  medications: string[];
  location?: {
    altitude: number;
    climate: string;
  };
}

export class IntelligentHealthValidator {
  private geminiModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  async validateHealthMetric(
    metricType: string,
    value: number | { systolic: number; diastolic: number },
    userContext: UserContext,
    historicalData?: number[],
    environmentalContext?: any
  ): Promise<HealthValidationResult> {
    
    // Basic biological plausibility check
    const biologicalValidation = this.checkBiologicalPlausibility(metricType, value, userContext);
    
    // Anomaly detection based on historical data
    const anomalyScore = historicalData ? this.detectAnomaly(value, historicalData) : 0;
    
    // Environmental factor analysis
    const environmentalAdjustments = this.analyzeEnvironmentalFactors(
      metricType, 
      value, 
      environmentalContext
    );

    // AI-enhanced validation
    const aiValidation = await this.performAIValidation(
      metricType,
      value,
      userContext,
      historicalData,
      environmentalContext
    );

    // Calculate overall data quality score
    const dataQualityScore = this.calculateDataQualityScore(
      biologicalValidation.isPlausible,
      anomalyScore,
      aiValidation.confidence,
      historicalData?.length || 0
    );

    return {
      isValid: biologicalValidation.isPlausible && anomalyScore < 0.8 && aiValidation.confidence > 60,
      confidence: aiValidation.confidence,
      biologicalPlausibility: biologicalValidation.plausibilityScore,
      anomalyScore,
      contextualFactors: [
        ...biologicalValidation.factors,
        ...aiValidation.contextualFactors
      ],
      recommendations: aiValidation.recommendations,
      dataQualityScore,
      environmentalAdjustments
    };
  }

  private checkBiologicalPlausibility(
    metricType: string,
    value: number | { systolic: number; diastolic: number },
    userContext: UserContext
  ): { isPlausible: boolean; plausibilityScore: number; factors: string[] } {
    const factors: string[] = [];
    let plausibilityScore = 100;

    switch (metricType) {
      case 'heartRate':
        const hr = value as number;
        const ageAdjustedMaxHR = 220 - userContext.age;
        const restingHRRange = userContext.fitnessLevel === 'high' ? [40, 60] : [60, 100];
        
        if (hr < 30 || hr > ageAdjustedMaxHR * 1.1) {
          plausibilityScore = 20;
          factors.push('Heart rate outside physiologically possible range');
        } else if (hr < restingHRRange[0] || hr > restingHRRange[1]) {
          plausibilityScore = Math.max(70, plausibilityScore - 20);
          factors.push('Heart rate outside typical resting range for fitness level');
        }
        break;

      case 'bloodPressure':
        const bp = value as { systolic: number; diastolic: number };
        if (bp.systolic < 70 || bp.systolic > 250 || bp.diastolic < 40 || bp.diastolic > 150) {
          plausibilityScore = 30;
          factors.push('Blood pressure readings outside viable range');
        } else if (bp.systolic <= bp.diastolic) {
          plausibilityScore = 40;
          factors.push('Systolic pressure should be higher than diastolic');
        }
        break;

      case 'steps':
        const steps = value as number;
        if (steps < 0 || steps > 100000) {
          plausibilityScore = 25;
          factors.push('Step count outside reasonable daily range');
        } else if (steps > 50000) {
          plausibilityScore = Math.max(60, plausibilityScore - 30);
          factors.push('Unusually high step count - verify device accuracy');
        }
        break;

      case 'sleep':
        const sleepHours = value as number;
        if (sleepHours < 0 || sleepHours > 24) {
          plausibilityScore = 20;
          factors.push('Sleep duration outside possible range');
        } else if (sleepHours < 3 || sleepHours > 15) {
          plausibilityScore = Math.max(50, plausibilityScore - 40);
          factors.push('Sleep duration outside typical healthy range');
        }
        break;
    }

    // Age-based adjustments
    if (userContext.age > 65) {
      factors.push('Age-related physiological considerations applied');
    }

    // Medical condition adjustments
    if (userContext.medicalConditions.length > 0) {
      factors.push('Medical conditions may influence normal ranges');
      plausibilityScore = Math.max(60, plausibilityScore); // More lenient for medical conditions
    }

    return {
      isPlausible: plausibilityScore > 50,
      plausibilityScore,
      factors
    };
  }

  private detectAnomaly(currentValue: number | { systolic: number; diastolic: number }, historicalData: number[]): number {
    if (historicalData.length < 5) return 0; // Need sufficient history

    const numericValue = typeof currentValue === 'number' ? currentValue : currentValue.systolic;
    const mean = historicalData.reduce((sum, val) => sum + val, 0) / historicalData.length;
    const variance = historicalData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / historicalData.length;
    const stdDev = Math.sqrt(variance);

    // Z-score based anomaly detection
    const zScore = Math.abs((numericValue - mean) / stdDev);
    
    // Convert z-score to anomaly score (0-1)
    if (zScore > 3) return 1.0; // Extreme outlier
    if (zScore > 2.5) return 0.9; // Strong outlier
    if (zScore > 2) return 0.7; // Moderate outlier
    if (zScore > 1.5) return 0.4; // Mild outlier
    return zScore / 3; // Normal range
  }

  private analyzeEnvironmentalFactors(
    metricType: string,
    value: number | { systolic: number; diastolic: number },
    environmentalContext?: any
  ): any {
    if (!environmentalContext) return {};

    const adjustments: any = {};

    // Altitude adjustments
    if (environmentalContext.altitude > 2500) {
      adjustments.altitude = environmentalContext.altitude;
      if (metricType === 'heartRate') {
        adjustments.altitudeEffect = 'Heart rate may be 10-20% higher at high altitude';
      }
    }

    // Temperature adjustments  
    if (environmentalContext.temperature > 30 || environmentalContext.temperature < 5) {
      adjustments.temperature = environmentalContext.temperature;
      adjustments.temperatureEffect = 'Extreme temperatures can affect cardiovascular metrics';
    }

    // Time of day considerations
    if (environmentalContext.timeOfDay) {
      adjustments.timeOfDay = environmentalContext.timeOfDay;
      if (metricType === 'heartRate' && environmentalContext.timeOfDay === 'morning') {
        adjustments.circadianEffect = 'Morning heart rate typically lower';
      }
    }

    return adjustments;
  }

  private async performAIValidation(
    metricType: string,
    value: number | { systolic: number; diastolic: number },
    userContext: UserContext,
    historicalData?: number[],
    environmentalContext?: any
  ): Promise<{ confidence: number; contextualFactors: string[]; recommendations: string[] }> {
    
    const prompt = `As a health data validation expert, analyze this health measurement:

Metric: ${metricType}
Value: ${JSON.stringify(value)}
User Profile: Age ${userContext.age}, Gender: ${userContext.gender}, Fitness: ${userContext.fitnessLevel}
Medical Conditions: ${userContext.medicalConditions.join(', ') || 'None'}
Historical Average: ${historicalData ? (historicalData.reduce((a, b) => a + b, 0) / historicalData.length).toFixed(1) : 'No history'}
Environmental: ${JSON.stringify(environmentalContext || {})}

Provide analysis in this JSON format:
{
  "confidence": 85,
  "contextualFactors": ["factor1", "factor2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "analysis": "Brief medical analysis"
}

Focus on medical accuracy and practical health insights.`;

    try {
      const result = await this.geminiModel.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        confidence: parsed.confidence || 75,
        contextualFactors: parsed.contextualFactors || [],
        recommendations: parsed.recommendations || []
      };
      
    } catch (error) {
      console.error('AI validation error:', error);
      
      // Fallback analysis
      return {
        confidence: 60,
        contextualFactors: ['AI analysis temporarily unavailable'],
        recommendations: ['Consult healthcare provider if values seem unusual']
      };
    }
  }

  private calculateDataQualityScore(
    biologicallyPlausible: boolean,
    anomalyScore: number,
    aiConfidence: number,
    historicalDataPoints: number
  ): number {
    let score = 100;

    // Biological plausibility weight (40%)
    if (!biologicallyPlausible) score -= 40;

    // Anomaly detection weight (30%)
    score -= (anomalyScore * 30);

    // AI confidence weight (20%)
    score -= ((100 - aiConfidence) * 0.2);

    // Historical data availability weight (10%)
    const historyBonus = Math.min(10, historicalDataPoints * 2);
    score -= (10 - historyBonus);

    return Math.max(0, Math.min(100, score));
  }

  async performBatchValidation(
    healthDataBatch: Array<{
      type: string;
      value: number | { systolic: number; diastolic: number };
      timestamp: Date;
    }>,
    userContext: UserContext
  ): Promise<{ validatedData: any[]; overallQualityScore: number; alerts: string[] }> {
    
    const validatedData = [];
    const qualityScores = [];
    const alerts = [];

    for (const dataPoint of healthDataBatch) {
      const validation = await this.validateHealthMetric(
        dataPoint.type,
        dataPoint.value,
        userContext
      );

      validatedData.push({
        ...dataPoint,
        validation
      });

      qualityScores.push(validation.dataQualityScore);

      if (!validation.isValid) {
        alerts.push(`${dataPoint.type} reading may be inaccurate: ${validation.contextualFactors[0]}`);
      }
    }

    const overallQualityScore = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;

    return {
      validatedData,
      overallQualityScore,
      alerts
    };
  }
}

export const intelligentHealthValidator = new IntelligentHealthValidator();
