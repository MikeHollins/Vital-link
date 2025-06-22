import OpenAI from "openai";
import { HealthData } from "@shared/schema";

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const MODEL = "gpt-4o";

interface MetricPair {
  metric1: {
    name: string;
    values: number[];
    dates: string[];
  };
  metric2: {
    name: string;
    values: number[];
    dates: string[];
  };
  correlation: number;
}

interface CorrelationInsight {
  metrics: string[];
  correlation: number;
  insight: string;
  explanation: string;
  recommendedActions?: string[];
  impact: "high" | "medium" | "low";
}

// Calculate Pearson correlation coefficient between two arrays of values
function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) {
    throw new Error("Arrays must have the same length");
  }
  if (x.length < 2) {
    return 0;
  }

  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / x.length;
  const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;

  // Calculate variances and covariance
  let xxVar = 0;
  let yyVar = 0;
  let xyVar = 0;

  for (let i = 0; i < x.length; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    xxVar += xDiff * xDiff;
    yyVar += yDiff * yDiff;
    xyVar += xDiff * yDiff;
  }

  // Calculate correlation
  const correlation = xyVar / (Math.sqrt(xxVar) * Math.sqrt(yyVar));
  
  // Handle NaN (happens when one variable is constant)
  return isNaN(correlation) ? 0 : correlation;
}

// Find correlations between different metrics
export function findCorrelations(healthData: Record<string, any[]>): MetricPair[] {
  const metrics = Object.keys(healthData);
  const correlations: MetricPair[] = [];

  for (let i = 0; i < metrics.length; i++) {
    for (let j = i + 1; j < metrics.length; j++) {
      const metric1 = metrics[i];
      const metric2 = metrics[j];
      
      const values1 = healthData[metric1].map(item => Number(item.value));
      const values2 = healthData[metric2].map(item => Number(item.value));
      const dates1 = healthData[metric1].map(item => item.timestamp);
      const dates2 = healthData[metric2].map(item => item.timestamp);
      
      if (values1.some(isNaN) || values2.some(isNaN)) {
        continue; // Skip if not numeric values
      }
      
      const correlation = calculateCorrelation(values1, values2);
      
      correlations.push({
        metric1: {
          name: metric1,
          values: values1,
          dates: dates1
        },
        metric2: {
          name: metric2,
          values: values2,
          dates: dates2
        },
        correlation: correlation
      });
    }
  }
  
  // Sort by absolute correlation value (descending)
  return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation));
}

// Generate AI insights based on correlation data
export async function generateInsights(
  correlationData: MetricPair[],
  metricLabels: Record<string, string>,
  limit: number = 3
): Promise<CorrelationInsight[]> {
  // Take top correlations
  const topCorrelations = correlationData
    .filter(pair => Math.abs(pair.correlation) > 0.3) // Only meaningful correlations
    .slice(0, limit);
  
  if (topCorrelations.length === 0) {
    return [];
  }

  const correlationPrompt = topCorrelations.map(pair => {
    const metric1Name = metricLabels[pair.metric1.name] || pair.metric1.name;
    const metric2Name = metricLabels[pair.metric2.name] || pair.metric2.name;
    
    // Format examples of the data
    const dataExamples = pair.metric1.dates.slice(0, 5).map((date, i) => 
      `${new Date(date).toLocaleDateString()}: ${metric1Name}=${pair.metric1.values[i]}, ${metric2Name}=${pair.metric2.values[i]}`
    ).join('\n');

    return `
Correlation between ${metric1Name} and ${metric2Name}: ${pair.correlation.toFixed(2)}
Sample data points:
${dataExamples}
    `;
  }).join('\n\n');

  try {
    const response = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system", 
          content: `You are an AI health analytics expert. Analyze the correlation data between health metrics and provide detailed, data-driven insights. For each correlation:
1. Explain the relationship (positive/negative correlation) 
2. Provide a clear explanation of how these metrics might influence each other
3. Suggest actionable steps the user might take based on this insight
4. Rate the impact of this insight (high/medium/low)

Focus on being medically accurate but accessible. Don't make claims that aren't supported by the data.`
        },
        {
          role: "user", 
          content: `I'm analyzing health data and found these correlations. Please provide insights:
${correlationPrompt}

Format your response as JSON with this structure for each insight:
{
  "metrics": ["metric1", "metric2"],
  "correlation": number,
  "insight": "brief headline about what was found",
  "explanation": "detailed explanation of the relationship",
  "recommendedActions": ["action1", "action2", "action3"],
  "impact": "high|medium|low"
}
`
        }
      ],
      response_format: { type: "json_object" }
    });

    const insights = JSON.parse(response.choices[0].message.content);
    if (Array.isArray(insights.insights)) {
      return insights.insights;
    } else {
      // Handle case where OpenAI returns a different format
      return [{
        metrics: [topCorrelations[0].metric1.name, topCorrelations[0].metric2.name],
        correlation: topCorrelations[0].correlation,
        insight: "Correlation detected between health metrics",
        explanation: "Our analysis detected a relationship between these metrics that may be worth investigating.",
        impact: "medium"
      }];
    }
  } catch (error) {
    console.error("Error generating AI insights:", error);
    // Return basic insights based on correlation data without AI
    return topCorrelations.map(pair => ({
      metrics: [pair.metric1.name, pair.metric2.name],
      correlation: pair.correlation,
      insight: `${pair.correlation > 0 ? "Positive" : "Negative"} correlation detected`,
      explanation: `There appears to be a ${Math.abs(pair.correlation) > 0.7 ? "strong" : "moderate"} ${pair.correlation > 0 ? "positive" : "negative"} correlation between ${metricLabels[pair.metric1.name] || pair.metric1.name} and ${metricLabels[pair.metric2.name] || pair.metric2.name}.`,
      impact: Math.abs(pair.correlation) > 0.7 ? "high" : "medium" as "high" | "medium" | "low"
    }));
  }
}

// Process multiple health metrics data and return insights
export async function getHealthMetricsInsights(
  multiMetricData: any[],
  metricMapping: Record<string, string> // Maps dataKeys to readable labels
): Promise<CorrelationInsight[]> {
  // Skip if insufficient data
  if (!multiMetricData || multiMetricData.length < 5) {
    return [];
  }

  // Extract metrics from the data
  const healthMetrics: Record<string, any[]> = {};
  
  const metricKeys = Object.keys(multiMetricData[0])
    .filter(key => key !== 'timestamp' && key !== 'date');
  
  metricKeys.forEach(metric => {
    healthMetrics[metric] = multiMetricData.map(dataPoint => ({
      value: dataPoint[metric],
      timestamp: dataPoint.timestamp || new Date(dataPoint.date).getTime()
    }));
  });
  
  // Find correlations
  const correlations = findCorrelations(healthMetrics);
  
  // Generate insights
  return await generateInsights(correlations, metricMapping);
}