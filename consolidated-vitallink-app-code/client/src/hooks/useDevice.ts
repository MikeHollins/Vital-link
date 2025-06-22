import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface Device {
  id: number;
  type: string;
  name: string;
  status: string;
  lastSynced: string;
  permissions: Record<string, boolean>;
}

interface DeviceData {
  type: string;
  name: string;
  status: string;
  permissions: Record<string, boolean>;
}

export function useDevice() {
  const { toast } = useToas;
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  // Fetch all devices
  const { data: devices, isLoading, isError, error } = useQuery<Device[]>({
    queryKey: ['/api/devices'],
  });

  // Connect a new device
  const connectDeviceMutation = useMutation({
    mutationFn: async (deviceData: DeviceData) => {
      const res = await apiReques'POST', '/api/devices', deviceData;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: 'Device connected',
        description: 'The device has been successfully connected to your account.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to connect device',
        description: error.message || 'An error occurred while connecting the device.',
        variant: 'destructive',
      });
    },
  });

  // Update device
  const updateDeviceMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<DeviceData> }) => {
      const res = await apiReques'PATCH', `/api/devices/${id}`, data;
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: 'Device updated',
        description: 'The device settings have been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update device',
        description: error.message || 'An error occurred while updating the device.',
        variant: 'destructive',
      });
    },
  });

  // Disconnect a device
  const disconnectDeviceMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiReques'DELETE', `/api/devices/${id}`;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: 'Device disconnected',
        description: 'The device has been successfully disconnected from your account.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to disconnect device',
        description: error.message || 'An error occurred while disconnecting the device.',
        variant: 'destructive',
      });
    },
  });

  // Sync a device
  const syncDeviceMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('PATCH', `/api/devices/${id}`, {
        lastSynced: new Date().toISOString(),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: 'Device synced',
        description: 'The device has been successfully synced.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to sync device',
        description: error.message || 'An error occurred while syncing the device.',
        variant: 'destructive',
      });
    },
  });

  // Update device permissions
  const updatePermissionsMutation = useMutation({
    mutationFn: async ({ id, permissions }: { id: number, permissions: Record<string, boolean> }) => {
      const res = await apiReques'PATCH', `/api/devices/${id}`, { permissions };
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/devices'] });
      toast({
        title: 'Permissions updated',
        description: 'The device permissions have been successfully updated.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to update permissions',
        description: error.message || 'An error occurred while updating permissions.',
        variant: 'destructive',
      });
    },
  });

  return {
    devices,
    isLoading,
    isError,
    error,
    selectedDevice,
    setSelectedDevice,
    connectDevice: (data: DeviceData) => connectDeviceMutation.mutate(data),
    updateDevice: (id: number, data: Partial<DeviceData>) => updateDeviceMutation.mutate({ id, data }),
    disconnectDevice: (id: number) => disconnectDeviceMutation.mutate(id),
    syncDevice: (id: number) => syncDeviceMutation.mutate(id),
    updatePermissions: (id: number, permissions: Record<string, boolean>) => 
      updatePermissionsMutation.mutate({ id, permissions }),
    connectMutation: connectDeviceMutation,
    updateDeviceMutation,
    disconnectDeviceMutation,
    syncDeviceMutation,
    updatePermissionsMutation,
  };
}
