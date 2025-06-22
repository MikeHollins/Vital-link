import { Router } from 'express';
import { biologicalValidator } from '../biological-validation-service';
import { aiHealthNormalizer } from '../ai-health-normalization';
import { AICorrelationAnalyzer } from '../ai-correlation-analysis';
import { db } from '../db';
import { healthData, healthConstraints } from '@shared/schema';
import { eq, and, desc, gte } from 'drizzle-orm';

const router = Router();
const correlationAnalyzer = new AICorrelationAnalyzer();

// Validate health data against biological constraints
router.post('/validate-biological', async (req, res) => {
  try {
    const { metricType, value, userContext } = req.body;
    
    if (!metricType || value === undefined) {
      return res.status(400).json({ 
        error: 'metricType and value are required' 
      });
    }

    const validation = await biologicalValidator.validateBiologicalConstraints(
      metricType,
      value,
      userContext
    );

    res.json({
      success: true,
      validation
    });

  } catch (error) {
    console.error('Biological validation error:', error);
    res.status(500).json({ 
      error: 'Validation service temporarily unavailable' 
    });
  }
});

// Normalize health data using AI engine
router.post('/normalize-data', async (req, res) => {
  try {
    const { userId, deviceType, rawData, timestamp, metadata } = req.body;
    
    if (!userId || !deviceType || !rawData) {
      return res.status(400).json({ 
        error: 'userId, deviceType, and rawData are required' 
      });
    }

    const input = {
      userId,
      deviceType,
      rawData,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
      metadata
    };

    const normalization = await aiHealthNormalizer.normalizeHealthData(input);

    res.json({
      success: true,
      normalization
    });

  } catch (error) {
    console.error('Data normalization error:', error);
    res.status(500).json({ 
      error: 'Normalization service temporarily unavailable' 
    });
  }
});

// Analyze health metric correlations
router.post('/analyze-correlations', async (req, res) => {
  try {
    const { userId, primaryMetric, secondaryMetric, timeWindow = 30 } = req.body;
    
    if (!userId || !primaryMetric || !secondaryMetric) {
      return res.status(400).json({ 
        error: 'userId, primaryMetric, and secondaryMetric are required' 
      });
    }

    // Get health data for correlation analysis
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - timeWindow);
    
    const [primaryData, secondaryData] = await Promise.all([
      db.select()
        .from(healthData)
        .where(
          and(
            eq(healthData.userId, userId),
            eq(healthData.type, primaryMetric),
            gte(healthData.timestamp, cutoffDate)
          )
        )
        .orderBy(desc(healthData.timestamp)),
      
      db.select()
        .from(healthData)
        .where(
          and(
            eq(healthData.userId, userId),
            eq(healthData.type, secondaryMetric),
            gte(healthData.timestamp, cutoffDate)
          )
        )
        .orderBy(desc(healthData.timestamp))
    ]);

    if (primaryData.length < 3 || secondaryData.length < 3) {
      return res.status(400).json({ 
        error: 'Insufficient data for correlation analysis. Need at least 3 data points for each metric.' 
      });
    }

    // Format data for correlation analysis
    const healthMetricData = primaryData.map((item, index) => {
      const secondaryItem = secondaryData[index];
      return {
        date: item.timestamp.toISOString().split('T')[0],
        steps: primaryMetric === 'steps' ? Number(item.value) : (secondaryItem ? Number(secondaryItem.value) : 0),
        remSleep: primaryMetric === 'sleep' ? Number(item.value) : (secondaryItem && secondaryMetric === 'sleep' ? Number(secondaryItem.value) : undefined),
        screenTime: primaryMetric === 'screen_time' ? Number(item.value) : (secondaryItem && secondaryMetric === 'screen_time' ? Number(secondaryItem.value) : undefined),
        heartRate: primaryMetric === 'heart_rate' ? Number(item.value) : (secondaryItem && secondaryMetric === 'heart_rate' ? Number(secondaryItem.value) : undefined)
      };
    }).slice(0, Math.min(primaryData.length, secondaryData.length));

    const analysis = await correlationAnalyzer.analyzeStepCorrelations(healthMetricData);

    res.json({
      success: true,
      analysis: {
        ...analysis,
        dataPoints: Math.min(primaryData.length, secondaryData.length),
        timeWindow
      }
    });

  } catch (error) {
    console.error('Correlation analysis error:', error);
    res.status(500).json({ 
      error: 'Correlation analysis service temporarily unavailable' 
    });
  }
});

// Get biological constraints for a metric type
router.get('/constraints/:metricType', async (req, res) => {
  try {
    const { metricType } = req.params;
    
    const constraints = biologicalValidator.getConstraintsForMetric(metricType);
    
    if (!constraints) {
      return res.status(404).json({ 
        error: 'Constraints not found for metric type' 
      });
    }

    res.json({
      success: true,
      metricType,
      constraints
    });

  } catch (error) {
    console.error('Constraints retrieval error:', error);
    res.status(500).json({ 
      error: 'Unable to retrieve constraints' 
    });
  }
});

// Batch validate multiple health measurements
router.post('/validate-batch', async (req, res) => {
  try {
    const { measurements } = req.body;
    
    if (!Array.isArray(measurements) || measurements.length === 0) {
      return res.status(400).json({ 
        error: 'measurements array is required' 
      });
    }

    const validations = await biologicalValidator.validateBatch(measurements);

    res.json({
      success: true,
      validations,
      totalProcessed: measurements.length
    });

  } catch (error) {
    console.error('Batch validation error:', error);
    res.status(500).json({ 
      error: 'Batch validation service temporarily unavailable' 
    });
  }
});

// Get health data quality assessment
router.get('/quality-assessment/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 7 } = req.query;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - Number(days));
    
    const recentData = await db
      .select()
      .from(healthData)
      .where(
        and(
          eq(healthData.userId, userId),
          gte(healthData.timestamp, cutoffDate)
        )
      )
      .orderBy(desc(healthData.timestamp));

    if (recentData.length === 0) {
      return res.json({
        success: true,
        assessment: {
          overallQuality: 0,
          dataPoints: 0,
          metrics: {},
          recommendations: ['Start tracking health metrics consistently']
        }
      });
    }

    // Group by metric type and assess quality
    const metricGroups: Record<string, any[]> = {};
    recentData.forEach(item => {
      if (!metricGroups[item.type]) {
        metricGroups[item.type] = [];
      }
      metricGroups[item.type].push(item);
    });

    const metricAssessments: Record<string, any> = {};
    let totalQualityScore = 0;
    let assessedMetrics = 0;

    for (const [metricType, data] of Object.entries(metricGroups)) {
      const validations = await biologicalValidator.validateBatch(
        data.map(d => ({
          metricType,
          value: d.value,
          timestamp: d.timestamp
        }))
      );

      const validCount = validations.filter(v => v.isValid).length;
      const avgConfidence = validations.reduce((sum, v) => sum + v.confidence, 0) / validations.length;
      
      metricAssessments[metricType] = {
        dataPoints: data.length,
        validPercentage: (validCount / validations.length) * 100,
        averageConfidence: Math.round(avgConfidence),
        qualityScore: Math.round((validCount / validations.length) * avgConfidence)
      };

      totalQualityScore += metricAssessments[metricType].qualityScore;
      assessedMetrics++;
    }

    const overallQuality = assessedMetrics > 0 ? Math.round(totalQualityScore / assessedMetrics) : 0;

    const recommendations = [];
    if (overallQuality < 60) {
      recommendations.push('Review device connectivity and calibration');
    }
    if (Object.keys(metricGroups).length < 3) {
      recommendations.push('Expand health metric tracking for better insights');
    }
    if (recentData.length < 10) {
      recommendations.push('Increase data collection frequency');
    }

    res.json({
      success: true,
      assessment: {
        overallQuality,
        dataPoints: recentData.length,
        timeWindow: Number(days),
        metrics: metricAssessments,
        recommendations
      }
    });

  } catch (error) {
    console.error('Quality assessment error:', error);
    res.status(500).json({ 
      error: 'Quality assessment service temporarily unavailable' 
    });
  }
});

export default router;