import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";

export interface NftAchievement {
  id: number;
  userId: string;
  title: string;
  description: string;
  category: string;
  rarity: string;
  imageUrl?: string;
  thresholdMetric: string;
  thresholdValue: number;
  isMinted: boolean;
  isShared: boolean;
  mintedAt?: string;
  blockchainId?: string;
  tokenId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNftAchievementData {
  title: string;
  description: string;
  category: string;
  rarity: string;
  imageUrl?: string;
  thresholdMetric: string;
  thresholdValue: number;
}

export interface MintNftData {
  blockchainId: string;
  tokenId: string;
}

export function useNftAchievements() {
  // Get all NFT achievements for the current user
  const {
    data: achievements = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['/api/nft/achievements'],
    retry: 1,
  });

  // Get a single NFT achievement by ID
  const getAchievement = (id: number) => {
    return useQuery({
      queryKey: ['/api/nft/achievements', id],
      queryFn: () => apiReques`/api/nft/achievements/${id}`,
      enabled: !!id,
    });
  };

  // Create a new NFT achievement
  const createAchievementMutation = useMutation({
    mutationFn: async (data: CreateNftAchievementData) => {
      return apiRequest('/api/nft/achievements', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nft/achievements'] });
    },
  });

  // Mint an NFT achievement
  const mintAchievementMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: MintNftData }) => {
      return apiRequest(`/api/nft/achievements/${id}/mint`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/nft/achievements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/nft/achievements', variables.id] });
    },
  });

  // Update NFT achievement sharing status
  const updateSharingMutation = useMutation({
    mutationFn: async ({ id, isShared }: { id: number; isShared: boolean }) => {
      return apiRequest(`/api/nft/achievements/${id}/share`, {
        method: 'PATCH',
        body: JSON.stringify({ isShared }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['/api/nft/achievements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/nft/achievements', variables.id] });
    },
  });

  // Delete an NFT achievement
  const deleteAchievementMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/nft/achievements/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/nft/achievements'] });
    },
  });

  // Get HIPAA compliance status for NFT operations
  const getComplianceStatus = () => {
    return useQuery({
      queryKey: ['/api/compliance/status/TECHNICAL_SAFEGUARDS'],
      queryFn: () => apiReques'/api/compliance/status/TECHNICAL_SAFEGUARDS',
    });
  };

  return {
    achievements,
    isLoading,
    isError,
    error,
    refetch,
    getAchievement,
    createAchievement: (data: CreateNftAchievementData) => createAchievementMutation.mutate(data),
    mintAchievement: (id: number, data: MintNftData) => mintAchievementMutation.mutate({ id, data }),
    updateSharing: (id: number, isShared: boolean) => updateSharingMutation.mutate({ id, isShared }),
    deleteAchievement: (id: number) => deleteAchievementMutation.mutate(id),
    getComplianceStatus,
    isCreating: createAchievementMutation.isPending,
    isMinting: mintAchievementMutation.isPending,
    isUpdatingSharing: updateSharingMutation.isPending,
    isDeleting: deleteAchievementMutation.isPending,
  };
}