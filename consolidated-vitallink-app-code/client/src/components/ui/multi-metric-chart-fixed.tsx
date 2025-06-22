import React, { useState, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';
import { Check, X, PlusCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { CorrelationInsights } from '@/components/ui/correlation-insights';
import { useCorrelationInsights } from '@/hooks/useCorrelationInsights';

export type MetricOption = {
  id: string;
  label: string;
  color: string;
  unit: string;
  dataKey: string;
  category: string;
  axis?: 'left' | 'right';
};

export type MetricData = {
  timestamp: string | number;
  date?: string;
  [key: string]: any;
};

interface MultiMetricChartProps {
  data: MetricData[];
  availableMetrics: MetricOption[];
  title?: string;
  description?: string;
  className?: string;
  dateKey?: string;
  height?: number;
}

export const MultiMetricChart: React.FC<MultiMetricChartProps> = ({
  data,
  availableMetrics,
  title = "Health Metrics Comparison",
  description = "Compare multiple health metrics to identify patterns and correlations",
  className,
  dateKey = "timestamp",
  height = 400
}) => {
  const [selectedMetrics, setSelectedMetrics] = useState<MetricOption[]>([]);
  const [showMetricSelector, setShowMetricSelector] = useState(false);
  const [normalizeData, setNormalizeData] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [correlationInsights, setCorrelationInsights] = useState<any[]>([]);
  
  // Get correlation insights hook
  const { getCorrelationInsights, isLoading: insightsLoading } = useCorrelationInsights();
  
  // Categories for grouping metrics in the selector
  const categories = Array.from(new SeavailableMetrics.map(m => m.category));
  
  // When no metrics are selected, default to the first two
  useEffec( => {
    if (selectedMetrics.length === 0 && availableMetrics.length > 0) {
      setSelectedMetrics([
        availableMetrics[0],
        availableMetrics.length > 1 ? availableMetrics[1] : availableMetrics[0]
      ]);
    }
  }, [availableMetrics]);
  
  // Generate AI insights when selected metrics change
  useEffec( => {
    if (selectedMetrics.length >= 2 && data.length >= 5 && showInsights) {
      fetchCorrelationInsights();
    } else {
      setCorrelationInsights([]);
    }
  }, [selectedMetrics, data, showInsights]);
  
  // Fetch correlation insights
  const fetchCorrelationInsights = async () => {
    if (selectedMetrics.length < 2 || data.length < 5) return;
    
    // Create a mapping of metric dataKeys to their labels
    const metricLabels: Record<string, string> = {};
    selectedMetrics.forEach(metric => {
      metricLabels[metric.dataKey] = metric.label;
    });
    
    try {
      const insights = await getCorrelationInsights(data, metricLabels);
      setCorrelationInsights(insights);
    } catch (error) {
      console.error("Failed to fetch correlation insights:", error);
    }
  };
  
  const toggleMetric = (metric: MetricOption) => {
    if (selectedMetrics.some(m => m.id === metric.id)) {
      setSelectedMetrics(selectedMetrics.filter(m => m.id !== metric.id));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };
  
  // Normalize data to show percentages for better comparison
  const normalizedData = React.useMemo(() => {
    if (!normalizeData) return data;
    
    // Find min/max for each selected metric
    const ranges: Record<string, { min: number, max: number }> = {};
    
    selectedMetrics.forEach(metric => {
      const values = data.map(d => Number(d[metric.dataKey])).filter(v => !isNaN(v));
      if (values.length > 0) {
        ranges[metric.dataKey] = {
          min: Math.min(...values),
          max: Math.max(...values)
        };
      }
    });
    
    // Normalize data to 0-100 scale
    return data.map(item => {
      const normalized = { ...item };
      
      selectedMetrics.forEach(metric => {
        const range = ranges[metric.dataKey];
        if (range && typeof item[metric.dataKey] === 'number') {
          const value = item[metric.dataKey];
          const normalizedValue = ((Number(value) - range.min) / (range.max - range.min)) * 100;
          normalized[`${metric.dataKey}_normalized`] = normalizedValue;
        }
      });
      
      return normalized;
    });
  }, [data, selectedMetrics, normalizeData]);
  
  // Get min/max values for YAxis domain
  const getAxisDomain = (axis: 'left' | 'right'): [number, number] => {
    if (normalizeData) return [0, 100];
    
    const axisMetrics = selectedMetrics.filter(m => (m.axis || 'left') === axis);
    
    if (axisMetrics.length === 0) return [0, 'auto' as any];
    
    const allValues = axisMetrics.flatMap(metric => 
      data.map(d => Number(d[metric.dataKey])).filter(v => !isNaN(v))
    );
    
    if (allValues.length === 0) return [0, 100];
    
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    
    // Add some padding to the min/max
    const padding = (max - min) * 0.1;
    return [Math.max(0, min - padding), max + padding];
  };
  
  return (
    <div className="space-y-6">
      <Card className={cn("w-full", className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-xl font-semibold">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <Switch 
                checked={normalizeData} 
                onCheckedChange={setNormalizeData} 
                id="normalize-data"
              />
              <Label htmlFor="normalize-data" className="text-sm">Normalize</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch 
                checked={showInsights} 
                onCheckedChange={setShowInsights} 
                id="show-insights"
              />
              <Label htmlFor="show-insights" className="text-sm flex items-center">
                <Lightbulb className="h-3.5 w-3.5 mr-1 text-yellow-500" />
                AI Insights
              </Label>
            </div>
            
            <Popover open={showMetricSelector} onOpenChange={setShowMetricSelector}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span>Metrics</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="p-4 border-b">
                  <h4 className="font-medium">Select Metrics to Compare</h4>
                  <p className="text-sm text-muted-foreground">
                    Choose up to 5 metrics to visualize together
                  </p>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {categories.map(category => (
                    <div key={category} className="border-b last:border-b-0">
                      <div className="px-4 py-2 bg-muted/50 text-sm font-medium">
                        {category}
                      </div>
                      <div className="p-1">
                        {availableMetrics
                          .filter(m => m.category === category)
                          .map(metric => {
                            const isSelected = selectedMetrics.some(m => m.id === metric.id);
                            return (
                              <button
                                key={metric.id}
                                className={cn(
                                  "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between",
                                  isSelected ? "bg-primary/10" : "hover:bg-muted"
                                )}
                                onClick={() => toggleMetric(metric)}
                                disabled={!isSelected && selectedMetrics.length >= 5}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-3 h-3 rounded-full" 
                                    style={{ backgroundColor: metric.color }}
                                  />
                                  <span>{metric.label}</span>
                                  <span className="text-xs text-muted-foreground">
                                    ({metric.unit})
                                  </span>
                                </div>
                                <div>
                                  {isSelected ? (
                                    <Check className="h-4 w-4 text-primary" />
                                  ) : (
                                    selectedMetrics.length >= 5 && (
                                      <span className="text-xs text-muted-foreground">
                                        Max 5
                                      </span>
                                    )
                                  )}
                                </div>
                              </button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t flex justify-between">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowMetricSelector(false)}
                  >
                    Close
                  </Button>
                  {selectedMetrics.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedMetrics([])}
                      className="text-destructive hover:text-destructive"
                    >
                      Clear All
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-2 flex flex-wrap gap-2">
            {selectedMetrics.map(metric => (
              <Badge 
                key={metric.id} 
                variant="outline" 
                className="flex items-center gap-1.5 pl-1"
              >
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: metric.color }}
                />
                <span>{metric.label}</span>
                <button 
                  className="ml-1 rounded-full hover:bg-muted p-0.5"
                  onClick={() => toggleMetric(metric)}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {selectedMetrics.length === 0 && (
              <p className="text-sm text-muted-foreground italic">
                Select metrics to visualize
              </p>
            )}
          </div>
          
          <div className="h-[350px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={normalizedData}
                margin={{ top: 20, right: 30, left: 15, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey={dateKey} 
                  padding={{ left: 20, right: 20 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  yAxisId="left"
                  orientation="left"
                  domain={getAxisDomain('left')}
                  tick={{ fontSize: 12 }}
                  label={{ 
                    value: normalizeData ? "% of Range" : undefined, 
                    angle: -90, 
                    position: 'insideLeft',
                    style: { textAnchor: 'middle', fontSize: 12 }
                  }}
                />
                {selectedMetrics.some(m => m.axis === 'right') && (
                  <YAxis 
                    yAxisId="right"
                    orientation="right"
                    domain={getAxisDomain('right')}
                    tick={{ fontSize: 12 }}
                  />
                )}
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'var(--background)', 
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: '12px'
                  }}
                  formatter={(value, name, props) => {
                    const metric = selectedMetrics.find(m => 
                      normalizeData 
                        ? `${m.dataKey}_normalized` === name
                        : m.dataKey === name
                    );
                    if (!metric) return [value, name];
                    
                    const formattedValue = normalizeData
                      ? `${typeof value === 'number' ? value.toFixed(0) : value}%`
                      : `${value} ${metric.unit}`;
                      
                    return [formattedValue, metric.label];
                  }}
                  labelFormatter={(label) => {
                    return new Date(label).toLocaleString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric'
                    });
                  }}
                />
                <Legend 
                  verticalAlign="top" 
                  height={36}
                  formatter={(value, entry) => {
                    const metric = selectedMetrics.find(m => 
                      normalizeData 
                        ? `${m.dataKey}_normalized` === entry.dataKey
                        : m.dataKey === entry.dataKey
                    );
                    return metric?.label || value;
                  }}
                />
                
                {selectedMetrics.map(metric => (
                  <Line
                    key={metric.id}
                    type="monotone"
                    dataKey={normalizeData ? `${metric.dataKey}_normalized` : metric.dataKey}
                    name={metric.label}
                    stroke={metric.color}
                    strokeWidth={2}
                    yAxisId={metric.axis || 'left'}
                    dot={{ r: 3, fill: metric.color }}
                    activeDot={{ r: 5, strokeWidth: 1, stroke: '#fff' }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      {/* AI-powered correlation insights */}
      {showInsights && selectedMetrics.length >= 2 && (
        <CorrelationInsights
          insights={correlationInsights}
          isLoading={insightsLoading}
          onRefresh={fetchCorrelationInsights}
        />
      )}
    </div>
  );
};