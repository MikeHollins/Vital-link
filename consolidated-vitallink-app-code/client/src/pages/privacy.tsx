import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

import { ZeroKnowledgeProofs } from '@/components/ZeroKnowledgeProofs';
import { 
  Shield, 
  Lock, 
  Eye, 
  Download, 
  Trash2,
  CheckCircle,
  Database,
  FileText
} from 'lucide-react';

export default function PrivacyPage() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToas;
  const [activeTab, setActiveTab] = useState<'settings' | 'zk-proofs'>('settings');

  const tabs = [
    { id: 'settings', label: 'privacySettings', icon: Shield },
    { id: 'zk-proofs', label: 'zeroKnowledgeProofs', icon: Lock },
  ];

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center space-y-4">
            <Shield className="w-16 h-16 mx-auto text-gray-400" />
            <h2 className="text-2xl font-bold">{'authenticationRequired'}</h2>
            <p className="text-gray-600 dark:text-gray-400">{'pleaseLogInManagePrivacy'}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'settings':
        return <PrivacySettings />;
      case 'zk-proofs':
        return (
          <div className="space-y-6">
            {/* ZKP Security Notice */}
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="font-semibold text-blue-900 dark:text-blue-100">
                      {'dataSecuredWithZKP'}
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-200">
                      {'verifyWithoutSeeing'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Security Notice */}
            <Card className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div>
                    <p className="font-semibold text-green-900 dark:text-green-100">
                      {'secureAPIConnections'}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-200">
                      {'apiCredentialsNotice'}
                    </p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-green-100 text-green-800 text-xs">{'hipaaCompliant'}</Badge>
                      <Badge className="bg-green-100 text-green-800 text-xs">{'gdprCompliant'}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <ZeroKnowledgeProofs />
          </div>
        );
      default:
        return <PrivacySettings />;
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pb-24 space-y-6">
        {/* Sleek Header */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-8 overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 dark:from-green-400/10 dark:via-blue-400/10 dark:to-purple-400/10"></div>
          
          <div className="relative px-8 py-6">
            <div className="text-center">
              {/* Icon container */}
              <div className="inline-flex p-3 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              
              {/* Title and description */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                {'privacySecurity'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                {'controlHealthDataUsage'}
              </p>
              
              {/* Compliance badges */}
              <div className="flex justify-center items-center space-x-8 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center">
                  <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 mb-2">
                    <Shield className="h-3 w-3" />
                    {'hipaaCompliant'}
                  </Badge>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {'healthDataProtected'}
                  </div>
                </div>
                <div className="text-center">
                  <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-2">
                    <Shield className="h-3 w-3" />
                    {'gdprCompliant'}
                  </Badge>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {'privacyRightsRespected'}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    256-bit
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    {'encryption'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center">
          <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex items-center gap-2 text-xs md:text-sm px-3 md:px-4"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.id === 'settings' ? Settings : 'zkProofs'}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        {renderConten}
      </div>
    </Layout>
  );
}

const PrivacySettings = () => {
  const { toast } = useToas;
  const [settings, setSettings] = useState({
    dataSharing: {
      analytics: false,
      research: false,
      marketing: false,
      thirdParty: false,
    },
    visibility: {
      publicProfile: false,
      achievementSharing: true,
      healthMetrics: false,
      platformConnections: false,
    },
    security: {
      twoFactorAuth: true,
      biometricAuth: true,
    },
  });

  const updateSettings = (category: string, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    
    toast({
      title: 'settingsUpdated',
      description: 'privacyPreferencesSaved',
    });
  };

  const handleDataExport = () => {
    toast({
      title: 'dataExportInitiated',
      description: 'dataExportEmailNotice',
    });
  };

  const handleDataDeletion = () => {
    toast({
      title: 'dataDeletionRequestSubmitted',
      description: 'dataDeletionNotice',
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-8">
      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            {'securitySettings'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'twoFactorAuthentication'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'twoFactorDescription'}
              </div>
            </div>
            <Switch
              checked={settings.security.twoFactorAuth}
              onCheckedChange={(checked) => updateSettings('security', 'twoFactorAuth', checked)}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'biometricAuthentication'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'biometricDescription'}
              </div>
            </div>
            <Switch
              checked={settings.security.biometricAuth}
              onCheckedChange={(checked) => updateSettings('security', 'biometricAuth', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Sharing Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            {'dataSharingPreferences'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'analyticsPerformance'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'analyticsDescription'}
              </div>
            </div>
            <Switch
              checked={settings.dataSharing.analytics}
              onCheckedChange={(checked) => updateSettings('dataSharing', 'analytics', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'healthResearch'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'researchDescription'}
              </div>
            </div>
            <Switch
              checked={settings.dataSharing.research}
              onCheckedChange={(checked) => updateSettings('dataSharing', 'research', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'marketingCommunications'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'marketingDescription'}
              </div>
            </div>
            <Switch
              checked={settings.dataSharing.marketing}
              onCheckedChange={(checked) => updateSettings('dataSharing', 'marketing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'thirdPartyIntegrations'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'thirdPartyDescription'}
              </div>
            </div>
            <Switch
              checked={settings.dataSharing.thirdParty}
              onCheckedChange={(checked) => updateSettings('dataSharing', 'thirdParty', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Visibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {'profileVisibility'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'publicProfile'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'publicProfileDescription'}
              </div>
            </div>
            <Switch
              checked={settings.visibility.publicProfile}
              onCheckedChange={(checked) => updateSettings('visibility', 'publicProfile', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'achievementSharing'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'achievementSharingDescription'}
              </div>
            </div>
            <Switch
              checked={settings.visibility.achievementSharing}
              onCheckedChange={(checked) => updateSettings('visibility', 'achievementSharing', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">{'healthMetrics'}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {'healthMetricsDescription'}
              </div>
            </div>
            <Switch
              checked={settings.visibility.healthMetrics}
              onCheckedChange={(checked) => updateSettings('visibility', 'healthMetrics', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
{'dataManagement'}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button onClick={handleDataExport} variant="outline" className="flex-1 justify-start">
              <Download className="w-4 h-4 mr-2" />
{'exportMyData'}
            </Button>
            <Button onClick={handleDataDeletion} variant="destructive" className="flex-1 justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
{'deleteAllData'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Information */}
      <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
        <CardHeader>
          <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
{'complianceProtection'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">{'hipaaCompliance'}</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {'hipaaComplianceDescription'}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{'pdpaCompliance'}</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {'pdpaComplianceDescription'}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{'dataEncryption'}</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {'dataEncryptionDescription'}
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">{'regularAudits'}</h4>
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {'regularAuditsDescription'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};