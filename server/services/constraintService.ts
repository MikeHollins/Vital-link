import OpenAI from "openai";
import { db } from "../db";
import { healthConstraints, aiNormalizationResults } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import type { EnvironmentalContext } from "./environmentalService";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface BiometricReading {
  type: string;
  value: number;
  unit: string;
  timestamp: Date;
}

export interface ConstraintParameters {
  minValue: number;
  maxValue: number;
  optimalValue?: number;
  adjustmentFactor: number;
  environmentallyAdjusted: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  constraintsSatisfied: boolean;
  adjustedParameters: ConstraintParameters;
  riskAssessment: {
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  recommendations: string[];
}

export class ConstraintService {
  // Core constraint parameter selection based on environmental metadata
  async selectConstraintParameters(
    biometricType: string,
    environmentalContext: EnvironmentalContext,
    userId: string
  ): Promise<ConstraintParameters> {
    try {
      // Get base constraints from database
      const [baseConstraint] = await db
        .select()
        .from(healthConstraints)
        .where(
          and(
            eq(healthConstraints.userId, userId),
            eq(healthConstraints.metricType, biometricType),
            eq(healthConstraints.isActive, true)
          )
        )
        .limit(1);

      if (!baseConstraint) {
        // Generate AI-powered default constraints
        return this.generateDefaultConstraints(biometricType, environmentalContext);
      }

      // Apply environmental adjustments using AI analysis
      return this.applyEnvironmentalAdjustments(baseConstraint, environmentalContext);
    } catch (error) {
      console.error("Error selecting constraint parameters:", error);
      throw error;
    }
  }

  // Generate default constraints using AI when no user-specific data exists
  private async generateDefaultConstraints(
    biometricType: string,
    environmentalContext: EnvironmentalContext
  ): Promise<ConstraintParameters> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a medical expert specializing in physiological constraints. Provide safe, evidence-based ranges for biometric measurements considering environmental factors."
          },
          {
            role: "user",
            content: `Generate physiological constraint parameters for ${biometricType} considering:
            - Altitude: ${environmentalContext.weather.altitude}m
            - Temperature: ${environmentalContext.weather.temperature}°C
            - Humidity: ${environmentalContext.weather.humidity}%
            - Pressure: ${environmentalContext.weather.pressure}hPa
            
            Return JSON with: minValue, maxValue, optimalValue, adjustmentFactor (0.8-1.2), explanation.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        minValue: result.minValue || 60,
        maxValue: result.maxValue || 100,
        optimalValue: result.optimalValue,
        adjustmentFactor: result.adjustmentFactor || 1.0,
        environmentallyAdjusted: true
      };
    } catch (error) {
      console.error("AI constraint generation failed:", error);
      // Return conservative defaults for safety
      return this.getConservativeDefaults(biometricType);
    }
  }

  // Apply environmental adjustments to existing constraints
  private async applyEnvironmentalAdjustments(
    baseConstraint: any,
    environmentalContext: EnvironmentalContext
  ): Promise<ConstraintParameters> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a physiological adaptation specialist. Adjust baseline health parameters based on environmental conditions using medical evidence."
          },
          {
            role: "user",
            content: `Adjust these baseline constraints for environmental conditions:
            - Baseline min: ${baseConstraint.minValue}
            - Baseline max: ${baseConstraint.maxValue}
            - Metric type: ${baseConstraint.metricType}
            - Current altitude: ${environmentalContext.weather.altitude}m
            - Temperature: ${environmentalContext.weather.temperature}°C
            - Pressure: ${environmentalContext.weather.pressure}hPa
            
            Return JSON with: adjustedMin, adjustedMax, adjustmentFactor, reasoning.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 400,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        minValue: result.adjustedMin || baseConstraint.minValue,
        maxValue: result.adjustedMax || baseConstraint.maxValue,
        optimalValue: baseConstraint.optimalValue,
        adjustmentFactor: result.adjustmentFactor || 1.0,
        environmentallyAdjusted: true
      };
    } catch (error) {
      console.error("Environmental adjustment failed:", error);
      // Return base constraints without adjustment
      return {
        minValue: baseConstraint.minValue,
        maxValue: baseConstraint.maxValue,
        optimalValue: baseConstraint.optimalValue,
        adjustmentFactor: 1.0,
        environmentallyAdjusted: false
      };
    }
  }

  // Validate biometric data against dynamically adjusted constraints
  async validateBiometricData(
    reading: BiometricReading,
    constraints: ConstraintParameters,
    environmentalContext: EnvironmentalContext
  ): Promise<ValidationResult> {
    try {
      // Basic constraint validation
      const constraintsSatisfied = 
        reading.value >= constraints.minValue && 
        reading.value <= constraints.maxValue;

      // AI-powered comprehensive validation and risk assessment
      const aiAssessment = await this.performAIValidation(
        reading,
        constraints,
        environmentalContext
      );

      return {
        isValid: constraintsSatisfied && aiAssessment.isPhysiologicallyPlausible,
        constraintsSatisfied,
        adjustedParameters: constraints,
        riskAssessment: aiAssessment.riskAssessment,
        recommendations: aiAssessment.recommendations
      };
    } catch (error) {
      console.error("Biometric validation failed:", error);
      throw error;
    }
  }

  // AI-powered validation for physiological plausibility
  private async performAIValidation(
    reading: BiometricReading,
    constraints: ConstraintParameters,
    environmentalContext: EnvironmentalContext
  ): Promise<{
    isPhysiologicallyPlausible: boolean;
    riskAssessment: { level: 'low' | 'medium' | 'high'; factors: string[] };
    recommendations: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a medical AI analyzing biometric readings for physiological plausibility and health risks."
          },
          {
            role: "user",
            content: `Analyze this biometric reading:
            - Type: ${reading.type}
            - Value: ${reading.value} ${reading.unit}
            - Allowed range: ${constraints.minValue}-${constraints.maxValue}
            - Environmental context: ${environmentalContext.weather.altitude}m altitude, ${environmentalContext.weather.temperature}°C
            
            Return JSON with: isPhysiologicallyPlausible (boolean), riskLevel (low/medium/high), riskFactors (array), recommendations (array).`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        isPhysiologicallyPlausible: result.isPhysiologicallyPlausible !== false,
        riskAssessment: {
          level: result.riskLevel || 'low',
          factors: result.riskFactors || []
        },
        recommendations: result.recommendations || []
      };
    } catch (error) {
      console.error("AI validation failed:", error);
      return {
        isPhysiologicallyPlausible: true,
        riskAssessment: { level: 'low', factors: [] },
        recommendations: []
      };
    }
  }

  // Patent-specific: Altitude-based oxygen saturation constraint adjustment
  async adjustOxygenSaturationForAltitude(
    baseMinSaturation: number,
    baseMaxSaturation: number,
    altitudeMeters: number
  ): Promise<ConstraintParameters> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an altitude medicine specialist. Calculate oxygen saturation adjustments based on elevation using established medical formulas."
          },
          {
            role: "user",
            content: `Calculate adjusted oxygen saturation ranges for altitude ${altitudeMeters}m.
            - Sea level baseline: ${baseMinSaturation}%-${baseMaxSaturation}%
            - Use standard altitude physiology: approximately 1% decrease per 1000m above 1500m
            
            Return JSON with: adjustedMin, adjustedMax, adjustmentFactor, medicalRationale.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        minValue: result.adjustedMin || baseMinSaturation,
        maxValue: result.adjustedMax || baseMaxSaturation,
        adjustmentFactor: result.adjustmentFactor || 1.0,
        environmentallyAdjusted: true
      };
    } catch (error) {
      console.error("Altitude adjustment calculation failed:", error);
      // Fallback to simple calculation
      const altitudeAdjustment = Math.max(0, (altitudeMeters - 1500) / 1000);
      const adjustmentFactor = Math.max(0.8, 1 - (altitudeAdjustment * 0.01));
      
      return {
        minValue: Math.round(baseMinSaturation * adjustmentFactor),
        maxValue: Math.round(baseMaxSaturation * adjustmentFactor),
        adjustmentFactor,
        environmentallyAdjusted: true
      };
    }
  }

  // Circadian rhythm analysis for temporal constraint validation
  async validateCircadianConstraints(
    reading: BiometricReading,
    environmentalContext: EnvironmentalContext,
    userChronotype?: string
  ): Promise<{
    isCircadianValid: boolean;
    expectedRange: { min: number; max: number };
    circadianPhase: string;
  }> {
    try {
      const localTime = new Date(reading.timestamp.toLocaleString("en-US", {
        timeZone: environmentalContext.location.timezone
      }));

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a chronobiology expert analyzing biometric patterns against circadian rhythms."
          },
          {
            role: "user",
            content: `Analyze circadian validity for:
            - Metric: ${reading.type}
            - Value: ${reading.value}
            - Local time: ${localTime.toTimeString()}
            - Chronotype: ${userChronotype || 'unknown'}
            
            Return JSON with: isCircadianValid, expectedMin, expectedMax, circadianPhase.`
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 300,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        isCircadianValid: result.isCircadianValid !== false,
        expectedRange: {
          min: result.expectedMin || reading.value * 0.9,
          max: result.expectedMax || reading.value * 1.1
        },
        circadianPhase: result.circadianPhase || 'unknown'
      };
    } catch (error) {
      console.error("Circadian analysis failed:", error);
      return {
        isCircadianValid: true,
        expectedRange: { min: reading.value * 0.9, max: reading.value * 1.1 },
        circadianPhase: 'unknown'
      };
    }
  }

  // Conservative defaults for safety
  private getConservativeDefaults(biometricType: string): ConstraintParameters {
    const defaults: Record<string, ConstraintParameters> = {
      heart_rate: { minValue: 60, maxValue: 100, adjustmentFactor: 1.0, environmentallyAdjusted: false },
      oxygen_saturation: { minValue: 95, maxValue: 100, adjustmentFactor: 1.0, environmentallyAdjusted: false },
      blood_pressure_systolic: { minValue: 90, maxValue: 140, adjustmentFactor: 1.0, environmentallyAdjusted: false },
      blood_pressure_diastolic: { minValue: 60, maxValue: 90, adjustmentFactor: 1.0, environmentallyAdjusted: false },
      body_temperature: { minValue: 36.1, maxValue: 37.2, adjustmentFactor: 1.0, environmentallyAdjusted: false }
    };

    return defaults[biometricType] || { 
      minValue: 0, 
      maxValue: 1000, 
      adjustmentFactor: 1.0, 
      environmentallyAdjusted: false 
    };
  }
}

export const constraintService = new ConstraintService();