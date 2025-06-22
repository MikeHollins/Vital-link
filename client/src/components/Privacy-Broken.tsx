import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Shield,
  Lock,
  Share2,
  ExternalLink,
  Fingerprint,
  Timer,
  Download,
  Trash2,
  Info
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const Privacy = () => {
  const { toast } = useToas;
  const { user } = useAuth();
  
  // Fetch privacy settings
  const { data: settings = {
    localFirstStorage: true,
    encryptedCloudSync: true,
    anonymizedResearchSharing: false,
    thirdPartyAppAccess: false,
    twoFactorAuth: false,
    biometricAuth: false,
    autoLogout: false
  }, isLoading } = useQuery({
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
    mutationFn: async (settings: any) => {
      const response = await fetch('/api/privacy-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update privacy settings');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/privacy-settings'] });
      toast({
        title: 'settingsSavedSuccess',
        description: 'privacySettingsUpdated',
      });
    },
    onError: (error) => {
      toast({
        title: 'errorSavingSettings',
        description: 'problemUpdatingSettings',
        variant: "destructive",
      });
    }
  });

  // Handle toggle change
  const handleToggleChange = (setting: string, value: boolean) => {
    setLocalSettings({
      ...localSettings,
      [setting]: value
    });
  };

  // Save all settings
  const saveSettings = () => {
    if (user) {
      updateSettingsMutation.mutate({
        userId: user.id,
        ...localSettings
      });
    }
  };

  // Handle data export
  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data export has been initiated. You'll receive a download link shortly.",
    });
  };

  // Handle data deletion
  const handleDeleteData = () => {
    toast({
      title: "Data deletion requested",
      description: "Your request to delete your data has been submitted. This process may take up to 30 days.",
      variant: "destructive",
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Privacy & Security</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your data privacy and security settings</p>
      </div>
      
      {/* Data Privacy Settings */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Data Privacy Settings</h3>
          
          <div className="space-y-4">
            {/* Local storage setting */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <div className="font-medium">Local-First Storage</div>
                  <div className="text-sm text-muted-foreground">Store health data on your device first, sync to cloud as needed</div>
                </div>
              </div>
              <Switch 
                checked={localSettings.localFirstStorage} 
                onCheckedChange={(value) => handleToggleChange('localFirstStorage', value)} 
              />
            </div>
            
            {/* Encrypted sync */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Lock className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <div className="font-medium">Encrypted Cloud Sync</div>
                  <div className="text-sm text-muted-foreground">End-to-end encryption for your health data in the cloud</div>
                </div>
              </div>
              <Switch 
                checked={localSettings.encryptedCloudSync} 
                onCheckedChange={(value) => handleToggleChange('encryptedCloudSync', value)} 
              />
            </div>
            
            {/* Research data sharing */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Share2 className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <div className="font-medium">Anonymized Research Sharing</div>
                  <div className="text-sm text-muted-foreground">Share anonymized data to help improve health research</div>
                </div>
              </div>
              <Switch 
                checked={localSettings.anonymizedResearchSharing} 
                onCheckedChange={(value) => handleToggleChange('anonymizedResearchSharing', value)} 
              />
            </div>
            
            {/* Third-party access */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <ExternalLink className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <div className="font-medium">Third-Party App Access</div>
                  <div className="text-sm text-muted-foreground">Allow other apps to access your health data</div>
                </div>
              </div>
              <Switch 
                checked={localSettings.thirdPartyAppAccess} 
                onCheckedChange={(value) => handleToggleChange('thirdPartyAppAccess', value)} 
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Security Settings */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Security Settings</h3>
          
          <div className="space-y-4">
            {/* Two-factor authentication */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Shield className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <div className="font-medium">Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Add an extra layer of security to your account</div>
                </div>
              </div>
              <Switch 
                checked={localSettings.twoFactorAuth} 
                onCheckedChange={(value) => handleToggleChange('twoFactorAuth', value)} 
              />
            </div>
            
            {/* Biometric authentication */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Fingerprint className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <div className="font-medium">Biometric Authentication</div>
                  <div className="text-sm text-muted-foreground">Use Face ID or fingerprint to unlock the app</div>
                </div>
              </div>
              <Switch 
                checked={localSettings.biometricAuth} 
                onCheckedChange={(value) => handleToggleChange('biometricAuth', value)} 
              />
            </div>
            
            {/* Auto-logout */}
            <div className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center">
                <Timer className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <div className="font-medium">Auto-Logout</div>
                  <div className="text-sm text-muted-foreground">Automatically log out after 30 minutes of inactivity</div>
                </div>
              </div>
              <Switch 
                checked={localSettings.autoLogout} 
                onCheckedChange={(value) => handleToggleChange('autoLogout', value)}
              />
            </div>
          </div>
          
          <div className="mt-6">
            <Button 
              className="w-full" 
              onClick={saveSettings}
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? 'Saving...' : 'Save Security Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Data Management */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Data Management</h3>
          
          <div className="space-y-4">
            {/* Export data */}
            <button 
              className="flex items-center justify-between w-full p-3 border border-border rounded-lg hover:bg-accent"
              onClick={() => {
                toast({
                  title: "Data Export",
                  description: "Your data export will be ready for download in a few minutes.",
                });
              }}
            >
              <div className="flex items-center">
                <Download className="h-5 w-5 text-primary-500 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Export Your Data</div>
                  <div className="text-sm text-muted-foreground">Download all your health data in CSV or JSON format</div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
            
            {/* Delete data */}
            <button 
              className="flex items-center justify-between w-full p-3 border border-border rounded-lg hover:bg-accent"
              onClick={() => {
                toast({
                  title: "Data Deletion",
                  description: "This will permanently delete all your health data. Contact support to proceed.",
                  variant: "destructive",
                });
              }}
            >
              <div className="flex items-center">
                <Trash2 className="h-5 w-5 text-destructive mr-3" />
                <div className="text-left">
                  <div className="font-medium">Delete Your Data</div>
                  <div className="text-sm text-muted-foreground">Permanently remove all your health data from our servers</div>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          
          <div className="mt-6 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <Info className="h-5 w-5 text-primary-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-primary-800 dark:text-primary-300">Privacy Commitment</h3>
                <div className="mt-2 text-xs text-primary-700 dark:text-primary-400">
                  <p>We take your privacy seriously. All data is encrypted and we will never share your personal information without your explicit consent. Review our <a href="#" className="font-medium underline">Privacy Policy</a> and <a href="#" className="font-medium underline">Terms of Service</a> for more details.</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Singapore PDPA Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            PDPA Compliance (Singapore)
          </CardTitle>
          <CardDescription>
            Manage your data protection consent under Singapore's Personal Data Protection Act
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setShowPDPAConsentrue} variant="outline" className="w-full">
            Review Data Consent Settings
          </Button>
        </CardContent>
      </Card>

      {/* Data Export */}
      <DataExport />

      {/* Two-Factor Authentication */}
      <TwoFactorAuth 
        isEnabled={twoFactorEnabled}
        onToggle={setTwoFactorEnabled}
      />

      {/* Enhanced Security Features */}
      <EnhancedSecurity />

      {/* Blockchain Security */}
      <WalletConnect />

      {/* PDPA Consent Dialog */}
      <PDPAConsent 
        isOpen={showPDPAConsent}
        onClose={() => setShowPDPAConsenfalse}
        onAccept={(consents) => {
          console.log('PDPA consents updated:', consents);
          toast({
            title: "Consent Updated",
            description: "Your data protection preferences have been saved",
          });
        }}
      />
    </div>
  );
};

export default Privacy;
