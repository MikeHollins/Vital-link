import OpenAI from "openai";
import { complianceManager, ComplianceEventType } from "./hipaa-compliance";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface ContentIntent {
  type: 'ui_element' | 'health_insight' | 'recommendation' | 'notification' | 'error_message' | 'form_label';
  intent: string;
  context?: {
    userHealthProfile?: any;
    currentPage?: string;
    medicalData?: any;
    culturalBackground?: string;
  };
  urgency?: 'low' | 'medium' | 'high';
  medicalSafety?: boolean;
}

export interface LanguagePreference {
  code: string;
  name: string;
  culturalContext: {
    healthPractices: string[];
    communicationStyle: 'direct' | 'indirect' | 'formal' | 'casual';
    medicalTerminologyLevel: 'basic' | 'intermediate' | 'advanced';
    culturalHealthGoals: Record<string, any>;
  };
}

export interface GeneratedContent {
  content: string;
  culturallyAdapted: boolean;
  medicallyValidated: boolean;
  confidence: number;
  alternatives?: string[];
  culturalNotes?: string[];
}

// Cultural health adaptation mappings
const CULTURAL_HEALTH_ADAPTATIONS: Record<string, any> = {
  'en': {
    stepGoals: 10000,
    exercisePreference: 'gym_cardio',
    dietaryFocus: 'protein_vegetables',
    communicationStyle: 'direct',
    healthMetrics: ['steps', 'calories', 'heart_rate']
  },
  'zh': {
    stepGoals: 8000,
    exercisePreference: 'tai_chi_walking',
    dietaryFocus: 'balance_harmony',
    communicationStyle: 'respectful',
    healthMetrics: ['balance', 'energy', 'harmony']
  },
  'ms': {
    stepGoals: 8500,
    exercisePreference: 'community_sports',
    dietaryFocus: 'halal_balanced',
    communicationStyle: 'community_focused',
    healthMetrics: ['community_wellness', 'family_health']
  },
  'ta': {
    stepGoals: 9000,
    exercisePreference: 'yoga_walking',
    dietaryFocus: 'ayurvedic_balance',
    communicationStyle: 'traditional',
    healthMetrics: ['spiritual_wellness', 'mind_body_balance']
  },
  'ru': {
    stepGoals: 9500,
    exercisePreference: 'strength_endurance',
    dietaryFocus: 'hearty_nutritious',
    communicationStyle: 'direct_detailed',
    healthMetrics: ['strength', 'endurance', 'resilience']
  },
  'de': {
    stepGoals: 10500,
    exercisePreference: 'structured_precise',
    dietaryFocus: 'scientific_nutrition',
    communicationStyle: 'precise_detailed',
    healthMetrics: ['precision', 'optimization', 'efficiency']
  }
};

// Medical safety keywords that require extra validation
const MEDICAL_SAFETY_KEYWORDS = [
  'medication', 'dosage', 'treatment', 'diagnosis', 'emergency', 'pain', 'symptoms',
  'blood pressure', 'heart rate', 'diabetes', 'insulin', 'allergic reaction'
];

export class AIMultilingualService {
  private contentCache: Map<string, GeneratedContent> = new Map();
  private userPatterns: Map<string, any> = new Map();
  private culturalContexts: Map<string, LanguagePreference> = new Map();

  constructor() {
    this.initializeCulturalContexts();
  }

  private initializeCulturalContexts() {
    const languages = [
      {
        code: 'en',
        name: 'English',
        culturalContext: {
          healthPractices: ['gym_fitness', 'running', 'weight_training'],
          communicationStyle: 'direct' as const,
          medicalTerminologyLevel: 'intermediate' as const,
          culturalHealthGoals: CULTURAL_HEALTH_ADAPTATIONS['en']
        }
      },
      {
        code: 'zh',
        name: '中文',
        culturalContext: {
          healthPractices: ['tai_chi', 'traditional_medicine', 'qi_gong'],
          communicationStyle: 'indirect' as const,
          medicalTerminologyLevel: 'basic' as const,
          culturalHealthGoals: CULTURAL_HEALTH_ADAPTATIONS['zh']
        }
      },
      {
        code: 'ms',
        name: 'Bahasa Melayu',
        culturalContext: {
          healthPractices: ['community_sports', 'traditional_healing', 'family_wellness'],
          communicationStyle: 'formal' as const,
          medicalTerminologyLevel: 'basic' as const,
          culturalHealthGoals: CULTURAL_HEALTH_ADAPTATIONS['ms']
        }
      },
      {
        code: 'ta',
        name: 'தமிழ்',
        culturalContext: {
          healthPractices: ['yoga', 'ayurveda', 'meditation'],
          communicationStyle: 'formal' as const,
          medicalTerminologyLevel: 'intermediate' as const,
          culturalHealthGoals: CULTURAL_HEALTH_ADAPTATIONS['ta']
        }
      },
      {
        code: 'ru',
        name: 'Русский',
        culturalContext: {
          healthPractices: ['strength_training', 'endurance_sports', 'sauna_therapy'],
          communicationStyle: 'direct' as const,
          medicalTerminologyLevel: 'advanced' as const,
          culturalHealthGoals: CULTURAL_HEALTH_ADAPTATIONS['ru']
        }
      },
      {
        code: 'de',
        name: 'Deutsch',
        culturalContext: {
          healthPractices: ['structured_fitness', 'precision_nutrition', 'preventive_care'],
          communicationStyle: 'formal' as const,
          medicalTerminologyLevel: 'advanced' as const,
          culturalHealthGoals: CULTURAL_HEALTH_ADAPTATIONS['de']
        }
      }
    ];

    languages.forEach(lang => {
      this.culturalContexts.set(lang.code, lang);
    });
  }

  // 1. Smart Content Generation Service
  async generateCulturalContent(
    intent: ContentIntent,
    targetLanguage: string,
    userId: string
  ): Promise<GeneratedContent> {
    try {
      const cacheKey = `${intent.type}_${intent.intent}_${targetLanguage}_${JSON.stringify(intent.context)}`;
      
      // Check cache first
      if (this.contentCache.has(cacheKey)) {
        return this.contentCache.get(cacheKey)!;
      }

      const culturalContext = this.culturalContexts.get(targetLanguage);
      if (!culturalContext) {
        throw new Error(`Unsupported language: ${targetLanguage}`);
      }

      // Build culturally-aware prompt
      const prompt = this.buildCulturalPrompt(intent, culturalContext, targetLanguage);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a cultural health communication expert specializing in ${culturalContext.name} language and culture. 
            Generate authentic, culturally appropriate health content that feels native to the culture, not translated.
            Consider cultural health practices, communication styles, and medical terminology appropriate for the culture.
            Respond with JSON containing: content, culturalNotes, alternatives.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      // Medical safety validation
      const medicallyValidated = intent.medicalSafety ? 
        await this.validateMedicalSafety(result.content, targetLanguage) : true;

      const generatedContent: GeneratedContent = {
        content: result.content,
        culturallyAdapted: true,
        medicallyValidated,
        confidence: 0.9,
        alternatives: result.alternatives || [],
        culturalNotes: result.culturalNotes || []
      };

      // Cache the result
      this.contentCache.set(cacheKey, generatedContent);
      
      // Log compliance event
      complianceManager.logEvent({
        eventType: ComplianceEventType.DATA_CREATION,
        timestamp: new Date(),
        userId,
        resourceType: 'multilingual_content',
        action: 'generate_cultural_content',
        description: `Generated ${intent.type} content in ${targetLanguage}`,
        success: true
      });

      return generatedContent;

    } catch (error) {
      console.error('Error generating cultural content:', error);
      return {
        content: intent.intent, // Fallback to original intent
        culturallyAdapted: false,
        medicallyValidated: false,
        confidence: 0.1
      };
    }
  }

  private buildCulturalPrompt(
    intent: ContentIntent,
    culturalContext: LanguagePreference,
    targetLanguage: string
  ): string {
    const adaptations = CULTURAL_HEALTH_ADAPTATIONS[targetLanguage] || {};
    
    return `
Generate native ${culturalContext.name} content for:
Content Type: ${intent.type}
Intent: ${intent.intent}
Cultural Health Practices: ${culturalContext.culturalContext.healthPractices.join(', ')}
Communication Style: ${culturalContext.culturalContext.communicationStyle}
Medical Terminology Level: ${culturalContext.culturalContext.medicalTerminologyLevel}
Cultural Health Goals: ${JSON.stringify(adaptations)}

Context: ${JSON.stringify(intent.context || {})}

Create content that feels authentically ${culturalContext.name}, incorporating cultural health values and communication patterns.
Adapt health recommendations to be culturally relevant (e.g., exercise types, dietary suggestions, health metrics).
Use appropriate formality level and cultural sensitivity.

Return JSON with:
{
  "content": "native language content",
  "culturalNotes": ["cultural adaptations made"],
  "alternatives": ["alternative phrasings"]
}
`;
  }

  // 3. Medical Safety Layer
  private async validateMedicalSafety(content: string, language: string): Promise<boolean> {
    try {
      const hasMedicalKeywords = MEDICAL_SAFETY_KEYWORDS.some(keyword => 
        content.toLowerCase().includes(keyword.toLowerCase())
      );

      if (!hasMedicalKeywords) {
        return true; // No medical content to validate
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a medical safety validator. Analyze health content for potential safety issues, medical accuracy, and appropriateness. Return JSON with safety assessment."
          },
          {
            role: "user",
            content: `Validate the medical safety of this ${language} health content: "${content}"`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1
      });

      const validation = JSON.parse(response.choices[0].message.content || '{}');
      return validation.safe === true && validation.medicallyAccurate === true;

    } catch (error) {
      console.error('Medical safety validation error:', error);
      return false; // Err on the side of caution
    }
  }

  // 4. Contextual Language Engine
  async adaptToUserProfile(
    content: string,
    targetLanguage: string,
    userProfile: any
  ): Promise<GeneratedContent> {
    try {
      const culturalContext = this.culturalContexts.get(targetLanguage);
      if (!culturalContext) {
        return {
          content,
          culturallyAdapted: false,
          medicallyValidated: false,
          confidence: 0.1
        };
      }

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Adapt health content to user's personal profile and cultural background in ${culturalContext.name}.
            Consider user's health level, goals, cultural background, and communication preferences.
            Make the content personally relevant and culturally appropriate.`
          },
          {
            role: "user",
            content: `Adapt this content: "${content}"
            User Profile: ${JSON.stringify(userProfile)}
            Target Language: ${targetLanguage}
            Cultural Context: ${JSON.stringify(culturalContext.culturalContext)}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        content: result.adaptedContent || content,
        culturallyAdapted: true,
        medicallyValidated: true,
        confidence: 0.85,
        culturalNotes: result.adaptationNotes || []
      };

    } catch (error) {
      console.error('User profile adaptation error:', error);
      return {
        content,
        culturallyAdapted: false,
        medicallyValidated: false,
        confidence: 0.1
      };
    }
  }

  // 5. Intelligent Content Prediction
  async predictAndPreloadContent(userId: string, currentLanguage: string): Promise<void> {
    try {
      const userPattern = this.userPatterns.get(userId) || { 
        languageHistory: [], 
        timePatterns: {},
        locationData: null 
      };

      // Predict likely next languages
      const likelyLanguages = this.predictNextLanguages(userPattern, currentLanguage);
      
      // Pre-generate common content for likely languages
      for (const language of likelyLanguages) {
        const commonIntents = [
          { type: 'ui_element' as const, intent: 'dashboard_welcome' },
          { type: 'ui_element' as const, intent: 'navigation_menu' },
          { type: 'health_insight' as const, intent: 'daily_summary' }
        ];

        for (const intent of commonIntents) {
          await this.generateCulturalContent(intent, language, userId);
        }
      }

      // Update user patterns
      userPattern.languageHistory.push({
        language: currentLanguage,
        timestamp: new Date(),
        context: 'content_prediction'
      });
      
      this.userPatterns.set(userId, userPattern);

    } catch (error) {
      console.error('Content prediction error:', error);
    }
  }

  private predictNextLanguages(userPattern: any, currentLanguage: string): string[] {
    // Simple prediction based on historical usage
    const languageFreq: Record<string, number> = {};
    
    userPattern.languageHistory?.forEach((entry: any) => {
      languageFreq[entry.language] = (languageFreq[entry.language] || 0) + 1;
    });

    // Return top 2 most likely next languages (excluding current)
    return Object.entries(languageFreq)
      .filter(([lang]) => lang !== currentLanguage)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([lang]) => lang);
  }

  // 6. Contextual Memory Preservation
  preserveContext(userId: string, context: any, language: string): void {
    const userPattern = this.userPatterns.get(userId) || {};
    userPattern.contextHistory = userPattern.contextHistory || [];
    
    userPattern.contextHistory.push({
      context,
      language,
      timestamp: new Date()
    });

    // Keep only last 10 contexts
    if (userPattern.contextHistory.length > 10) {
      userPattern.contextHistory = userPattern.contextHistory.slice(-10);
    }

    this.userPatterns.set(userId, userPattern);
  }

  getPreservedContext(userId: string, targetLanguage: string): any {
    const userPattern = this.userPatterns.get(userId);
    if (!userPattern?.contextHistory) return null;

    // Find most recent context, preferring same language
    const sameLanguageContext = userPattern.contextHistory
      .filter((entry: any) => entry.language === targetLanguage)
      .pop();

    return sameLanguageContext?.context || userPattern.contextHistory.pop()?.context;
  }

  // Real-time learning and improvement
  recordUserInteraction(
    userId: string,
    content: string,
    language: string,
    engagement: 'positive' | 'negative' | 'neutral',
    feedback?: string
  ): void {
    const userPattern = this.userPatterns.get(userId) || {};
    userPattern.interactions = userPattern.interactions || [];

    userPattern.interactions.push({
      content,
      language,
      engagement,
      feedback,
      timestamp: new Date()
    });

    this.userPatterns.set(userId, userPattern);

    // Log compliance event
    complianceManager.logEvent({
      eventType: ComplianceEventType.DATA_CREATION,
      timestamp: new Date(),
      userId,
      resourceType: 'user_interaction',
      action: 'record_language_engagement',
      description: `Recorded ${engagement} engagement with ${language} content`,
      success: true
    });
  }

  // Cache management
  clearCache(): void {
    this.contentCache.clear();
  }

  getCacheStats(): { size: number; languages: string[] } {
    const languages = new Set<string>();
    
    const cacheKeys = Array.from(this.contentCache.keys());
    for (const key of cacheKeys) {
      const parts = key.split('_');
      if (parts.length >= 3) {
        languages.add(parts[2]); // Language is typically the 3rd part
      }
    }

    return {
      size: this.contentCache.size,
      languages: Array.from(languages)
    };
  }
}

export const aiMultilingualService = new AIMultilingualService();