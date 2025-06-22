import React from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Lightbulb,
  Info,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export interface CorrelationInsight {
  metrics: string[];
  correlation: number;
  insight: string;
  explanation: string;
  recommendedActions?: string[];
  impact: 'high' | 'medium' | 'low';
}

interface CorrelationInsightsProps {
  insights: CorrelationInsight[];
  isLoading?: boolean;
  className?: string;
  onRefresh?: () => void;
}

export const CorrelationInsights: React.FC<CorrelationInsightsProps> = ({
  insights,
  isLoading = false,
  className,
  onRefresh,
}) => {

  if (isLoading) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>AI Correlation Insights</span>
          </CardTitle>
          <CardDescription>
            Analyzing your health metrics for meaningful patterns...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-full mb-1"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!insights || insights.length === 0) {
    return (
      <Card className={cn('w-full', className)}>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            <span>AI Correlation Insights</span>
          </CardTitle>
          <CardDescription>
            Select multiple metrics in the chart above to discover correlations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-4 text-center text-muted-foreground">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">
              No significant correlations found between your selected metrics.
            </p>
            <p className="text-xs mt-1">
              Try selecting different metrics or date ranges for analysis.
            </p>
            {onRefresh && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRefresh}
                className="mt-3"
              >
                Refresh Analysis
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg flex items-center gap-2 min-w-0 flex-1">
            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0" />
            <span className="break-words">AI Correlation Insights</span>
          </CardTitle>
          {onRefresh && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onRefresh}
              className="h-8 flex-shrink-0"
            >
              Refresh
            </Button>
          )}
        </div>
        <CardDescription>
          Relationships between your health metrics discovered by our AI
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <InsightCard key={index} insight={insight} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface InsightCardProps {
  insight: CorrelationInsight;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const getCorrelationIcon = (correlation: number) => {
    const absCorrelation = Math.abs(correlation);
    
    if (absCorrelation < 0.1) return <ArrowRightLeft className="h-4 w-4 text-gray-500" />;
    if (correlation > 0) return <ArrowUpRight className="h-4 w-4 text-green-500" />;
    return <ArrowDownRight className="h-4 w-4 text-red-500" />;
  };

  const getCorrelationText = (correlation: number) => {
    const absCorrelation = Math.abs(correlation);
    let strength = "weak";
    
    if (absCorrelation > 0.7) strength = "strong";
    else if (absCorrelation > 0.4) strength = "moderate";
    
    const direction = correlation > 0 ? "positive" : "negative";
    return `${strength} ${direction}`;
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    }
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-lg overflow-hidden transition-all"
    >
      <div className="p-4">
        <div className="flex justify-between items-start gap-2">
          <div>
            <h3 className="font-medium text-base">{insight.insight}</h3>
            <div className="flex items-center mt-1 gap-1 text-sm text-muted-foreground flex-wrap">
              <span>Between</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="font-normal">
                      {insight.metrics[0]}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>First metric in the correlation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span>and</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="font-normal">
                      {insight.metrics[1]}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Second metric in the correlation</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    {getCorrelationIcon(insight.correlation)}
                    <span className="ml-1 text-sm">{insight.correlation.toFixed(2)}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Correlation coefficient: {getCorrelationTexinsight.correlation}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Badge className={cn("ml-2", getImpactColor(insight.impact))}>
              {insight.impact} impact
            </Badge>
            
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
      </div>
      
      <CollapsibleContent>
        <div className="px-4 pb-4 pt-1 border-t">
          <p className="text-sm mb-3">{insight.explanation}</p>
          
          {insight.recommendedActions && insight.recommendedActions.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-primary" />
                Recommended Actions
              </h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-muted-foreground">
                {insight.recommendedActions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
            </div>
          )}
          
          <div className="text-xs text-muted-foreground mt-2 flex items-center">
            <Info className="h-3 w-3 mr-1" />
            These insights are based on analysis of your personal health data
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};