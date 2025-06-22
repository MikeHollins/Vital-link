import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Shield, Lock, Globe, Eye, Fingerprint, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';

const Privacy = () => {
  const { toast } = useToas;
  const { user } = useAuth();
  
  // Fetch privacy settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ['/api/privacy-settings'],
  });

  // Local state for settings
  const [localSettings, setLocalSettings] = useState({
    localFirstStorage: true,
    encryptedCloudSync: true,
    anonymizedResearchSharing: false,
    thirdPartyAppAccess: false,
    twoFactorAuth: false,
    biometricAuth: false,
    autoLogout: false
  });

  // Update state when data is loaded
  React.useEffec( => {
    if (settings) {
      setLocalSettings({
        localFirstStorage: settings.localFirstStorage || true,
        encryptedCloudSync: settings.encryptedCloudSync || true,
        anonymizedResearchSharing: settings.anonymizedResearchSharing || false,
        thirdPartyAppAccess: settings.thirdPartyAppAccess || false,
        twoFactorAuth: settings.twoFactorAuth || false,
        biometricAuth: settings.biometricAuth || false,
        autoLogout: settings.autoLogout || false
      });
    }
  }, [settings]);

  // Update privacy settings
  const updateSettingsMutation = useMutation({
    mutationFn: async (newSettings: any) => {
      const response = await fetch('/api/privacy-settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSettings),
      });
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/privacy-settings'] });
      toast({
        title: "Settings Updated",
        description: "Your privacy settings have been saved.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update privacy settings.",
        variant: "destructive",
      });
    },
  });

  const updateSetting = (key: string, value: boolean) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    updateSettingsMutation.mutate(updatedSettings);
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading privacy settings...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy & Security</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your data privacy and security preferences</p>
        </div>
      </div>

      {/* Data Storage & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Data Storage & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Local-First Storage</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Keep your data on your device first</p>
            </div>
            <Switch 
              checked={localSettings.localFirstStorage} 
              onCheckedChange={(checked) => updateSetting('localFirstStorage', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Encrypted Cloud Sync</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sync encrypted data to cloud</p>
            </div>
            <Switch 
              checked={localSettings.encryptedCloudSync} 
              onCheckedChange={(checked) => updateSetting('encryptedCloudSync', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Research Data Sharing</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Share anonymized data for research</p>
            </div>
            <Switch 
              checked={localSettings.anonymizedResearchSharing} 
              onCheckedChange={(checked) => updateSetting('anonymizedResearchSharing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Third-Party App Access</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Allow external apps to access your data</p>
            </div>
            <Switch 
              checked={localSettings.thirdPartyAppAccess} 
              onCheckedChange={(checked) => updateSetting('thirdPartyAppAccess', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Authentication & Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5" />
            Authentication & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Two-Factor Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add an extra layer of security</p>
            </div>
            <Switch 
              checked={localSettings.twoFactorAuth} 
              onCheckedChange={(checked) => updateSetting('twoFactorAuth', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Biometric Authentication</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Use fingerprint or face recognition</p>
            </div>
            <Switch 
              checked={localSettings.biometricAuth} 
              onCheckedChange={(checked) => updateSetting('biometricAuth', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Auto-Logout</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Automatically logout after inactivity</p>
            </div>
            <Switch 
              checked={localSettings.autoLogout} 
              onCheckedChange={(checked) => updateSetting('autoLogout', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Regulatory Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">PDPA Compliant (Singapore)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Zero-Knowledge Proofs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Zero-Knowledge Privacy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Your health data is verified using zero-knowledge proofs, ensuring privacy while maintaining trust.
          </p>
          <Button variant="outline" className="w-full">
            View Privacy Proofs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Privacy;