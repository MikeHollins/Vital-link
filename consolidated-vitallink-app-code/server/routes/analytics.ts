import { Router } from 'express';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// Predictive insights endpoint
router.get('/predictive-insights', isAuthenticated, async (req, res) => {
  try {
    // Mock predictive insights data
    const insights = [
      {
        id: '1',
        type: 'opportunity',
        title: 'Sleep Optimization Opportunity',
        description: 'Your sleep quality could improve by 23% if you maintain consistent bedtime within the next 2 weeks.',
        confidence: 87,
        timeframe: '2 weeks',
        actionable: true,
        category: 'Sleep Health'
      },
      {
        id: '2',
        type: 'risk',
        title: 'Cardiovascular Risk Alert',
        description: 'Recent heart rate variability patterns suggest increased stress levels. Consider stress management techniques.',
        confidence: 74,
        timeframe: '1 month',
        actionable: true,
        category: 'Heart Health'
      },
      {
        id: '3',
        type: 'trend',
        title: 'Activity Pattern Trend',
        description: 'Your step count has been consistently increasing by 8% weekly. Excellent progress!',
        confidence: 95,
        timeframe: '6 weeks',
        actionable: false,
        category: 'Physical Activity'
      }
    ];

    res.json(insights);
  } catch (error) {
    console.error('Error fetching predictive insights:', error);
    res.status(500).json({ error: 'Failed to fetch predictive insights' });
  }
});

// Population comparison endpoint
router.get('/population-comparison', isAuthenticated, async (req, res) => {
  try {
    const comparisons = [
      {
        metric: 'Daily Steps',
        userValue: 8500,
        populationAverage: 7200,
        percentile: 72,
        trend: 'improving'
      },
      {
        metric: 'Sleep Duration',
        userValue: 7.5,
        populationAverage: 7.2,
        percentile: 65,
        trend: 'stable'
      },
      {
        metric: 'Resting Heart Rate',
        userValue: 68,
        populationAverage: 75,
        percentile: 85,
        trend: 'improving'
      },
      {
        metric: 'Stress Score',
        userValue: 2.3,
        populationAverage: 3.1,
        percentile: 78,
        trend: 'stable'
      }
    ];

    res.json(comparisons);
  } catch (error) {
    console.error('Error fetching population comparison:', error);
    res.status(500).json({ error: 'Failed to fetch population comparison' });
  }
});

// Natural language query endpoint
router.post('/natural-language-query', isAuthenticated, async (req, res) => {
  try {
    const { query } = req.body;
    
    // Simple query processing (in real app, this would use NLP/AI)
    let response = '';
    let data = [];
    let chart = false;

    if (query.toLowerCase().includes('sleep') && query.toLowerCase().includes('stress')) {
      response = 'Your sleep quality tends to be 15% better on days with lower stress scores (< 2.5). Consider relaxation techniques before bedtime.';
      chart = true;
      data = [
        { date: 'Mon', value: 7.2 },
        { date: 'Tue', value: 6.8 },
        { date: 'Wed', value: 8.1 },
        { date: 'Thu', value: 7.9 },
        { date: 'Fri', value: 7.5 }
      ];
    } else if (query.toLowerCase().includes('heart rate')) {
      response = 'Your average resting heart rate has decreased by 5 BPM over the last 3 months, indicating improved cardiovascular fitness.';
      chart = true;
      data = [
        { date: 'Jan', value: 73 },
        { date: 'Feb', value: 71 },
        { date: 'Mar', value: 69 },
        { date: 'Apr', value: 68 }
      ];
    } else {
      response = 'I analyzed your query and found relevant patterns in your health data. Would you like me to be more specific about any particular metric?';
    }

    res.json([{ response, chart, data }]);
  } catch (error) {
    console.error('Error processing natural language query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
});

export default router;