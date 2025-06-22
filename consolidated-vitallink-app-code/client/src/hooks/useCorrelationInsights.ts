import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CorrelationInsight } from "@/components/ui/correlation-insights";

export function useCorrelationInsights() {
  // Mutation for fetching correlation insights
  const correlationMutation = useMutation({
    mutationFn: async (data: {
      metrics: any[];
      metricLabels: Record<string, string>;
    }) => {
      const response = await fetch("/api/insights/correlations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      
      return response.json();
    },
  });

  const getCorrelationInsights = async (
    metrics: any[],
    metricLabels: Record<string, string> = {}
  ): Promise<CorrelationInsight[]> => {
    try {
      const result = await correlationMutation.mutateAsync({
        metrics,
        metricLabels,
      });

      return result.insights || [];
    } catch (error) {
      console.error("Error fetching correlation insights:", error);
      return [];
    }
  };

  return {
    getCorrelationInsights,
    isLoading: correlationMutation.isPending,
    error: correlationMutation.error,
  };
}