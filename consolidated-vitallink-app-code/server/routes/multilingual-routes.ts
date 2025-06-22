import { Express } from "express";
import { aiMultilingualService, ContentIntent } from "../ai-multilingual";
import { isAuthenticated } from "../replitAuth";
import { z } from "zod";

const contentIntentSchema = z.object({
  type: z.enum(['ui_element', 'health_insight', 'recommendation', 'notification', 'error_message', 'form_label']),
  intent: z.string(),
  context: z.object({
    userHealthProfile: z.any().optional(),
    currentPage: z.string().optional(),
    medicalData: z.any().optional(),
    culturalBackground: z.string().optional(),
  }).optional(),
  urgency: z.enum(['low', 'medium', 'high']).optional(),
  medicalSafety: z.boolean().optional()
});

const languageSwitchSchema = z.object({
  targetLanguage: z.string(),
  currentContext: z.any().optional(),
  preserveState: z.boolean().optional()
});

const userInteractionSchema = z.object({
  content: z.string(),
  language: z.string(),
  engagement: z.enum(['positive', 'negative', 'neutral']),
  feedback: z.string().optional()
});

export function registerMultilingualRoutes(app: Express): void {
  // Main content generation endpoint
  app.post('/api/multilingual/generate-content', isAuthenticated, async (req, res) => {
    try {
      const { intent, targetLanguage } = contentIntentSchema.parse(req.body).intent ? 
        { intent: contentIntentSchema.parse(req.body), targetLanguage: req.body.targetLanguage } :
        { intent: req.body, targetLanguage: req.body.targetLanguage };

      const userId = (req.user as any)?.claims?.sub || 'anonymous';

      const generatedContent = await aiMultilingualService.generateCulturalContent(
        intent,
        targetLanguage,
        userId
      );

      res.json({
        success: true,
        content: generatedContent,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Content generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate multilingual content',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Seamless language switching endpoint
  app.post('/api/multilingual/switch-language', isAuthenticated, async (req, res) => {
    try {
      const { targetLanguage, currentContext, preserveState } = languageSwitchSchema.parse(req.body);
      const userId = (req.user as any)?.claims?.sub || 'anonymous';

      // Preserve context if requested
      if (preserveState && currentContext) {
        aiMultilingualService.preserveContext(userId, currentContext, targetLanguage);
      }

      // Pre-load content for the target language
      await aiMultilingualService.predictAndPreloadContent(userId, targetLanguage);

      // Get preserved context for seamless transition
      const preservedContext = aiMultilingualService.getPreservedContext(userId, targetLanguage);

      res.json({
        success: true,
        targetLanguage,
        preservedContext,
        message: `Language switched to ${targetLanguage}`,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Language switching error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to switch language',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Content adaptation for user profile
  app.post('/api/multilingual/adapt-content', isAuthenticated, async (req, res) => {
    try {
      const { content, targetLanguage, userProfile } = req.body;
      const userId = (req.user as any)?.claims?.sub || 'anonymous';

      const adaptedContent = await aiMultilingualService.adaptToUserProfile(
        content,
        targetLanguage,
        userProfile
      );

      res.json({
        success: true,
        adaptedContent,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Content adaptation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to adapt content',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // User interaction recording for learning
  app.post('/api/multilingual/record-interaction', isAuthenticated, async (req, res) => {
    try {
      const { content, language, engagement, feedback } = userInteractionSchema.parse(req.body);
      const userId = (req.user as any)?.claims?.sub || 'anonymous';

      aiMultilingualService.recordUserInteraction(
        userId,
        content,
        language,
        engagement,
        feedback
      );

      res.json({
        success: true,
        message: 'Interaction recorded for learning improvement',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Interaction recording error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to record interaction',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Content prediction and pre-loading
  app.post('/api/multilingual/preload-content', isAuthenticated, async (req, res) => {
    try {
      const { currentLanguage } = req.body;
      const userId = (req.user as any)?.claims?.sub || 'anonymous';

      await aiMultilingualService.predictAndPreloadContent(userId, currentLanguage);

      res.json({
        success: true,
        message: 'Content preloaded for predicted languages',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Content preloading error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to preload content',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Batch content generation for common UI elements
  app.post('/api/multilingual/batch-generate', isAuthenticated, async (req, res) => {
    try {
      const { intents, targetLanguages } = req.body;
      const userId = (req.user as any)?.claims?.sub || 'anonymous';

      const results: Record<string, Record<string, any>> = {};

      for (const language of targetLanguages) {
        results[language] = {};
        
        for (const intent of intents) {
          try {
            const content = await aiMultilingualService.generateCulturalContent(
              intent,
              language,
              userId
            );
            results[language][intent.intent] = content;
          } catch (error) {
            console.error(`Failed to generate ${intent.intent} for ${language}:`, error);
            results[language][intent.intent] = {
              content: intent.intent,
              culturallyAdapted: false,
              medicallyValidated: false,
              confidence: 0.1,
              error: error instanceof Error ? error.message : 'Unknown error'
            };
          }
        }
      }

      res.json({
        success: true,
        results,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Batch content generation error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate batch content',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Cache management endpoints
  app.get('/api/multilingual/cache-stats', isAuthenticated, async (req, res) => {
    try {
      const stats = aiMultilingualService.getCacheStats();
      
      res.json({
        success: true,
        cacheStats: stats,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Cache stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get cache statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.post('/api/multilingual/clear-cache', isAuthenticated, async (req, res) => {
    try {
      aiMultilingualService.clearCache();
      
      res.json({
        success: true,
        message: 'Content cache cleared successfully',
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Cache clearing error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to clear cache',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Health endpoint for monitoring
  app.get('/api/multilingual/health', (req, res) => {
    res.json({
      success: true,
      service: 'AI Multilingual Service',
      status: 'healthy',
      supportedLanguages: ['en', 'zh', 'ms', 'ta', 'ru', 'de'],
      features: [
        'Cultural Content Generation',
        'Medical Safety Validation',
        'Contextual Memory Preservation',
        'Intelligent Content Prediction',
        'Real-time Learning',
        'Seamless Language Switching'
      ],
      timestamp: new Date().toISOString()
    });
  });
}