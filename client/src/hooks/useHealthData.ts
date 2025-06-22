// Custom hook for health data management - reduces code duplication
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatters, validators, successMessages, errorMessages } from "@shared/utils";

export function useHealthData(userId: string, dataType?: string) {
  const { toast } = useToas;

  // Fetch health data with automatic formatting
  const healthDataQuery = useQuery({
    queryKey: ['/api/health-data', userId, dataType],
    queryFn: async () => {
      const endpoint = dataType 
        ? `/api/health-data/${dataType}` 
        : '/api/health-data';
      const response = await fetch(endpoint);
      if (!response.ok) throw new Error(errorMessages.DATA_NOT_FOUND);
      return response.json();
    },
    enabled: !!userId
  });

  // Add new health data with validation
  const addHealthDataMutation = useMutation({
    mutationFn: async (data: { type: string; value: number; timestamp: Date }) => {
      // Validate before sending
      if (!validators.isValidHealthValue(data.value, data.type)) {
        throw new Error(errorMessages.INVALID_INPUT);
      }
      
      const response = await apiRequest("POST", "/api/health-data", {
        ...data,
        userId,
        formattedValue: formatters.healthValue(data.value, data.type)
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['/api/health-data'] });
      toast({
        title: "Success",
        description: successMessages.DATA_SAVED,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || errorMessages.NETWORK_ERROR,
        variant: "destructive",
      });
    }
  });

  return {
    data: healthDataQuery.data,
    isLoading: healthDataQuery.isLoading,
    error: healthDataQuery.error,
    addHealthData: addHealthDataMutation.mutate,
    isAdding: addHealthDataMutation.isPending
  };
}