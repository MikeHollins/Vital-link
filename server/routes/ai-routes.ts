import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';
import { storage } from '../storage';
import { generateHealthInsights, generateHealthCoachResponse, analyzeHealthPatterns } from '../ai-services';

const router = Router();

// Get AI insights for the current user
router.get('/ai-insights', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const insights = await storage.getUserInsights(userId);
    res.json(insights);
  } catch (error) {
    console.error('Error fetching AI insights:', error);
    res.status(500).json({ message: 'Failed to fetch insights' });
  }
});

// Generate new AI insights
router.post('/ai-insights/generate', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Get user's health data for analysis
    const healthData = await storage.getHealthData(userId, 'all');
    
    // Generate AI insights
    const insights = await generateHealthInsights(userId, healthData);
    
    // Store insights in database
    for (const insight of insights) {
      await storage.createInsight({
        userId,
        type: insight.type,
        title: insight.title,
        description: insight.description,
        category: insight.category,
        priority: insight.priority === 'high' ? 3 : insight.priority === 'medium' ? 2 : 1,
        confidence: insight.confidence,
        data: {
          actionItems: insight.actionItems,
          dataPoints: insight.dataPoints
        },
        isRead: false
      });
    }
    
    res.json({ message: 'Insights generated successfully', count: insights.length });
  } catch (error) {
    console.error('Error generating AI insights:', error);
    res.status(500).json({ message: 'Failed to generate insights' });
  }
});

// AI Health Coach Chat
router.post('/ai-chat', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message is required' });
    }
    
    // Get user's recent health data for context
    const healthData = await storage.getHealthData(userId, 'all');
    
    // Generate AI response
    const response = await generateHealthCoachResponse(message, healthData);
    
    res.json({ message: response });
  } catch (error) {
    console.error('Error in AI chat:', error);
    res.status(500).json({ message: 'Failed to generate response' });
  }
});

// Analyze health patterns
router.get('/ai-analytics', isAuthenticated, async (req: any, res) => {
  try {
    const userId = req.user.claims.sub;
    
    // Get user's health data
    const healthData = await storage.getHealthData(userId, 'all');
    
    // Analyze patterns using AI
    const analysis = await analyzeHealthPatterns(healthData);
    
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing health patterns:', error);
    res.status(500).json({ message: 'Failed to analyze patterns' });
  }
});

export default router;