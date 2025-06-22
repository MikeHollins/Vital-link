import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface BiologicalConstraints {
  heartRate: { min: number; max: number; contextFactors: string[] };
  steps: { min: number; max: number; dailyRealistic: number };
  sleep: { minHours: number; maxHours: number; qualityFactors: string[] };
  weight: { maxDailyChangeKg: number; contextualFactors: string[] };
  bloodPressure: { 
    systolic: { min: number; max: number }; 
    diastolic: { min: number; max: number };
    ageFactors: boolean;
  };
  bloodOxygen: { min: number; max: number; altitudeAdjustment: boolean };
  bodyTemperature: { minCelsius: number; maxCelsius: number };
  respiratoryRate: { min: number; max: number; ageAdjusted: boolean };
}

interface ValidationResult {
  isValid: boolean;
  confidence: number;
  violations: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    suggestedAction: string;
  }>;
  biologicalPlausibility: number;
  contextualFactors: string[];
  aiAnalysis: string;
}

export class BiologicalValidationService {
  private constraints: BiologicalConstraints = {
    heartRate: { 
      min: 30, 
      max: 220, 
      contextFactors: ['age', 'fitness_level', 'medication', 'activity_state'] 
    },
    steps: { 
      min: 0, 
      max: 100000, 
      dailyRealistic: 50000 
    },
    sleep: { 
      minHours: 1, 
      maxHours: 18, 
      qualityFactors: ['rem_cycles', 'interruptions', 'sleep_debt'] 
    },
    weight: { 
      maxDailyChangeKg: 0.5, 
      contextualFactors: ['hydration', 'meal_timing', 'medication', 'medical_conditions'] 
    },
    bloodPressure: { 
      systolic: { min: 70, max: 200 }, 
      diastolic: { min: 40, max: 130 },
      ageFactors: true
    },
    bloodOxygen: { 
      min: 70, 
      max: 100, 
      altitudeAdjustment: true 
    },
    bodyTemperature: { 
      minCelsius: 35.0, 
      maxCelsius: 42.0 
    },
    respiratoryRate: { 
      min: 8, 
      max: 40, 
      ageAdjusted: true 
    }
  };

  /**
   * Validates health data against biological constraints
   * Implements patent constraint validation methodology with enhanced AI analysis
   */
  async validateBiologicalConstraints(
    metricType: string,
    value: any,
    userContext?: {
      age?: number;
      fitness_level?: string;
      medical_conditions?: string[];
      medications?: string[];
      altitude?: number;
      environmental_factors?: any;
    }
  ): Promise<ValidationResult> {
    try {
      const basicValidation = this.performBasicConstraintCheck(metricType, value);
      const aiEnhancedValidation = await this.performAIEnhancedValidation(metricType, value, userContext);
      
      return {
        isValid: basicValidation.isValid && aiEnhancedValidation.confidence > 70,
        confidence: aiEnhancedValidation.confidence,
        violations: [...basicValidation.violations, ...aiEnhancedValidation.violations],
        biologicalPlausibility: aiEnhancedValidation.biologicalPlausibility,
        contextualFactors: aiEnhancedValidation.contextualFactors,
        aiAnalysis: aiEnhancedValidation.analysis
      };
    } catch (error) {
      console.error('Biological validation error:', error);
      
      // Fallback to basic validation only
      const basicValidation = this.performBasicConstraintCheck(metricType, value);
      return {
        isValid: basicValidation.isValid,
        confidence: 60,
        violations: basicValidation.violations,
        biologicalPlausibility: 60,
        contextualFactors: ['ai_analysis_unavailable'],
        aiAnalysis: 'AI analysis temporarily unavailable, using basic constraint validation'
      };
    }
  }

  private performBasicConstraintCheck(metricType: string, value: any) {
    const violations: any[] = [];
    let isValid = true;

    switch (metricType.toLowerCase()) {
      case 'heart_rate':
      case 'heartrate':
        const hr = Number(value);
        if (hr < this.constraints.heartRate.min || hr > this.constraints.heartRate.max) {
          violations.push({
            type: 'heart_rate_out_of_range',
            severity: hr < 40 || hr > 180 ? 'critical' : 'high',
            description: `Heart rate ${hr} BPM outside biological range (${this.constraints.heartRate.min}-${this.constraints.heartRate.max})`,
            suggestedAction: hr < 40 ? 'Seek immediate medical attention for bradycardia' : 'Verify measurement accuracy, consider medical evaluation'
          });
          isValid = false;
        }
        break;

      case 'steps':
      case 'step_count':
        const steps = Number(value);
        if (steps < this.constraints.steps.min || steps > this.constraints.steps.max) {
          violations.push({
            type: 'step_count_unrealistic',
            severity: steps > 80000 ? 'high' : 'medium',
            description: `Step count ${steps} outside realistic daily range`,
            suggestedAction: 'Verify device calibration and measurement period'
          });
          isValid = false;
        }
        break;

      case 'sleep_duration':
      case 'sleep':
        const sleepHours = typeof value === 'object' ? 
          (value.hours || 0) + (value.minutes || 0) / 60 : 
          Number(value);
        
        if (sleepHours < this.constraints.sleep.minHours || sleepHours > this.constraints.sleep.maxHours) {
          violations.push({
            type: 'sleep_duration_abnormal',
            severity: sleepHours < 2 || sleepHours > 16 ? 'high' : 'medium',
            description: `Sleep duration ${sleepHours.toFixed(1)} hours outside normal range`,
            suggestedAction: sleepHours < 3 ? 'Consider sleep disorder evaluation' : 'Review sleep tracking accuracy'
          });
          isValid = false;
        }
        break;

      case 'blood_pressure':
        if (typeof value === 'object' && value.systolic && value.diastolic) {
          const { systolic, diastolic } = value;
          
          if (systolic < this.constraints.bloodPressure.systolic.min || 
              systolic > this.constraints.bloodPressure.systolic.max) {
            violations.push({
              type: 'systolic_pressure_abnormal',
              severity: systolic > 180 || systolic < 80 ? 'critical' : 'high',
              description: `Systolic pressure ${systolic} mmHg outside normal range`,
              suggestedAction: systolic > 180 ? 'Seek immediate medical attention' : 'Monitor and consult healthcare provider'
            });
            isValid = false;
          }
          
          if (diastolic < this.constraints.bloodPressure.diastolic.min || 
              diastolic > this.constraints.bloodPressure.diastolic.max) {
            violations.push({
              type: 'diastolic_pressure_abnormal',
              severity: diastolic > 120 || diastolic < 50 ? 'critical' : 'high',
              description: `Diastolic pressure ${diastolic} mmHg outside normal range`,
              suggestedAction: diastolic > 120 ? 'Seek immediate medical attention' : 'Monitor and consult healthcare provider'
            });
            isValid = false;
          }
        }
        break;

      case 'blood_oxygen':
      case 'spo2':
        const oxygen = Number(value);
        if (oxygen < this.constraints.bloodOxygen.min || oxygen > this.constraints.bloodOxygen.max) {
          violations.push({
            type: 'blood_oxygen_abnormal',
            severity: oxygen < 85 ? 'critical' : 'high',
            description: `Blood oxygen ${oxygen}% outside safe range`,
            suggestedAction: oxygen < 90 ? 'Seek immediate medical attention' : 'Verify measurement and consider medical evaluation'
          });
          isValid = false;
        }
        break;

      case 'body_temperature':
      case 'temperature':
        const temp = Number(value);
        if (temp < this.constraints.bodyTemperature.minCelsius || temp > this.constraints.bodyTemperature.maxCelsius) {
          violations.push({
            type: 'body_temperature_abnormal',
            severity: temp < 32 || temp > 40 ? 'critical' : 'high',
            description: `Body temperature ${temp}°C outside safe range`,
            suggestedAction: temp > 39 || temp < 35 ? 'Seek immediate medical attention' : 'Monitor and verify measurement'
          });
          isValid = false;
        }
        break;
    }

    return { isValid, violations };
  }

  /**
   * Advanced physiological validation with environmental factors
   */
  private async validatePhysiologicalConstraints(
    metricType: string,
    value: any,
    userContext?: any
  ): Promise<{
    isPhysiologicallyValid: boolean;
    adjustedRange: { min: number; max: number };
    environmentalAdjustments: string[];
  }> {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      
      const prompt = `As a medical physiologist, analyze this health measurement with environmental context:

Metric: ${metricType}
Value: ${JSON.stringify(value)}
User Context: ${JSON.stringify(userContext || {})}

Provide physiological analysis in JSON format:
{
  "isPhysiologicallyValid": boolean,
  "adjustedRange": {
    "min": number,
    "max": number,
    "reasoning": "string"
  },
  "environmentalAdjustments": ["adjustment1", "adjustment2"],
  "medicalFlags": [
    {
      "type": "string",
      "severity": "low|medium|high|critical",
      "recommendation": "string"
    }
  ],
  "circadianFactors": {
    "timeOfDay": "string",
    "expectedVariation": number
  }
}

Consider altitude effects, medication interactions, age-related changes, and circadian rhythms.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid physiological analysis response');
      }
      
      const analysis = JSON.parse(jsonMatch[0]);
      
      return {
        isPhysiologicallyValid: analysis.isPhysiologicallyValid,
        adjustedRange: analysis.adjustedRange || { min: 0, max: 1000 },
        environmentalAdjustments: analysis.environmentalAdjustments || []
      };
    } catch (error) {
      console.error('Physiological validation error:', error);
      return {
        isPhysiologicallyValid: true,
        adjustedRange: { min: 0, max: 1000 },
        environmentalAdjustments: ['ai_analysis_failed']
      };
    }
  }

  private async performAIEnhancedValidation(
    metricType: string,
    value: any,
    userContext?: any
  ) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    const prompt = `As a medical expert, analyze this health measurement for biological plausibility:

Metric: ${metricType}
Value: ${JSON.stringify(value)}
User Context: ${JSON.stringify(userContext || {})}

Provide analysis in JSON format:
{
  "biologicalPlausibility": "number 0-100 (how biologically plausible)",
  "confidence": "number 0-100 (confidence in assessment)", 
  "contextualFactors": ["factor1", "factor2"],
  "violations": [
    {
      "type": "string",
      "severity": "low|medium|high|critical",
      "description": "string",
      "suggestedAction": "string"
    }
  ],
  "analysis": "Brief medical assessment of the measurement"
}

Consider:
- Age-related normal variations
- Medical conditions and medications
- Environmental factors (altitude, temperature)
- Activity state and fitness level
- Measurement accuracy and device limitations
- Clinical significance of deviations`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid AI response format');
      }
      
      const parsed = JSON.parse(jsonMatch[0]);
      
      return {
        biologicalPlausibility: parsed.biologicalPlausibility || 50,
        confidence: parsed.confidence || 50,
        contextualFactors: parsed.contextualFactors || [],
        violations: parsed.violations || [],
        analysis: parsed.analysis || 'AI analysis completed'
      };
      
    } catch (error) {
      console.error('AI enhanced validation error:', error);
      
      // Fallback analysis using OpenAI
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are a medical expert analyzing health measurements for biological plausibility."
          }, {
            role: "user",
            content: `Analyze ${metricType}: ${JSON.stringify(value)} for biological plausibility. Consider user context: ${JSON.stringify(userContext)}. Respond with a confidence score 0-100 and brief analysis.`
          }],
          max_tokens: 200
        });

        const analysis = completion.choices[0]?.message?.content || 'Analysis completed';
        const confidenceMatch = analysis.match(/(\d+)/);
        const confidence = confidenceMatch ? parseInt(confidenceMatch[0]) : 70;

        return {
          biologicalPlausibility: confidence,
          confidence,
          contextualFactors: ['openai_fallback_analysis'],
          violations: [],
          analysis
        };
        
      } catch (fallbackError) {
        console.error('Fallback AI analysis failed:', fallbackError);
        return {
          biologicalPlausibility: 50,
          confidence: 40,
          contextualFactors: ['ai_analysis_failed'],
          violations: [],
          analysis: 'AI analysis unavailable, manual review recommended'
        };
      }
    }
  }

  /**
   * Batch validation for multiple health measurements
   */
  async validateBatch(
    measurements: Array<{
      metricType: string;
      value: any;
      timestamp: Date;
      userContext?: any;
    }>
  ): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];
    
    // Process in batches to respect API rate limits
    const batchSize = 5;
    for (let i = 0; i < measurements.length; i += batchSize) {
      const batch = measurements.slice(i, i + batchSize);
      
      const batchResults = await Promise.all(
        batch.map(m => this.validateBiologicalConstraints(m.metricType, m.value, m.userContext))
      );
      
      results.push(...batchResults);
      
      // Rate limiting delay
      if (i + batchSize < measurements.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    return results;
  }

  /**
   * Get constraint configuration for a specific metric type
   */
  getConstraintsForMetric(metricType: string) {
    switch (metricType.toLowerCase()) {
      case 'heart_rate':
      case 'heartrate':
        return this.constraints.heartRate;
      case 'steps':
      case 'step_count':
        return this.constraints.steps;
      case 'sleep_duration':
      case 'sleep':
        return this.constraints.sleep;
      case 'blood_pressure':
        return this.constraints.bloodPressure;
      case 'blood_oxygen':
      case 'spo2':
        return this.constraints.bloodOxygen;
      case 'body_temperature':
      case 'temperature':
        return this.constraints.bodyTemperature;
      case 'respiratory_rate':
        return this.constraints.respiratoryRate;
      default:
        return null;
    }
  }
}

export const biologicalValidator = new BiologicalValidationService();