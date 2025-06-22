import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { 
  Heart, 
  Watch,
  CheckCircle,
  ExternalLink,
  Loader2,
  Shield,
  Zap,
  ArrowRight,
  Clock,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  SiApple, 
  SiGoogle, 
  SiFitbit, 
  SiSamsung
} from 'react-icons/si';

interface QuickConnectPlatform {
  id: string;
  name: string;
  icon: React.ReactNode;
  descriptionKey: string;
  dataCategories: string[];
  popularity: number;
  authType: 'oauth' | 'token' | 'quick';
  connected: boolean;
  status: 'available' | 'connecting' | 'connected';
}

// Function to detect platforms available on user's device
const getDetectedPlatforms = (): QuickConnectPlatform[] => {
  const detectedPlatforms: QuickConnectPlatform[] = [];
  
  // Check for Apple Health (iOS devices)
  if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
    detectedPlatforms.push({
      id: 'apple_health',
      name: 'Apple Health',
      icon: <SiApple className="w-5 h-5" />,
      descriptionKey: 'appleHealthDesc',
      dataCategories: ['steps', 'heartRate', 'sleep'],
      popularity: 5,
      authType: 'quick',
      connected: false,
      status: 'available'
    });
  }
  
  // Check for Google Fit (Android devices)
  if (navigator.userAgent.includes('Android')) {
    detectedPlatforms.push({
      id: 'google_fit',
      name: 'Google Fit',
      icon: <SiGoogle className="w-5 h-5" />,
      descriptionKey: 'googleFitDesc',
      dataCategories: ['activity', 'steps', 'heartRate'],
      popularity: 5,
      authType: 'oauth',
      connected: false,
      status: 'available'
    });
  }
  
  // Check for Samsung Health (Samsung devices)
  if (navigator.userAgent.includes('Samsung') || navigator.userAgent.includes('SM-')) {
    detectedPlatforms.push({
      id: 'samsung_health',
      name: 'Samsung Health',
      icon: <SiSamsung className="w-5 h-5" />,
      descriptionKey: 'samsungHealthDesc',
      dataCategories: ['steps', 'heartRate', 'sleep'],
      popularity: 4,
      authType: 'oauth',
      connected: false,
      status: 'available'
    });
  }
  
  // Always show Fitbit as it's a separate device/app
  detectedPlatforms.push({
    id: 'fitbit',
    name: 'Fitbit',
    icon: <SiFitbit className="w-5 h-5" />,
    descriptionKey: 'fitbitDesc',
    dataCategories: ['heartRate', 'sleep', 'steps'],
    popularity: 4,
    authType: 'oauth',
    connected: false,
    status: 'available'
  });
  
  return detectedPlatforms;
};

interface OneClickConnectorProps {
  onViewAllPlatforms?: () => void;
  onPlatformConnect?: (platformId: string, platformName: string, dataTypes: string[]) => void;
}

// Security Notice Component
const SecurityNotice = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6">
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 gap-1"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Shield className="w-3 h-3" />
        Security & Privacy Info
        {isOpen ? (
          <ChevronUp className="w-3 h-3" />
        ) : (
          <ChevronDown className="w-3 h-3" />
        )}
      </Button>
      
      {isOpen && (
        <div className="mt-2 text-xs text-gray-600 dark:text-gray-400 max-w-md mx-auto p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <div className="flex items-start gap-2">
            <Shield className="w-3 h-3 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-green-900 dark:text-green-100 mb-1">
                Secure & Private
              </div>
              <div className="text-green-800 dark:text-green-200">
                All connections use industry-standard encryption and only access the health data you explicitly authorize.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const OneClickConnector: React.FC<OneClickConnectorProps> = ({ onViewAllPlatforms, onPlatformConnect }) => {
  const [platforms, setPlatforms] = useState<QuickConnectPlatform[]>(getDetectedPlatforms());
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleQuickConnect = async (platform: QuickConnectPlatform) => {
    setConnecting(platform.id);
    
    // Update platform status to connecting
    setPlatforms(prev => prev.map(p => 
      p.id === platform.id 
        ? { ...p, status: 'connecting' as const }
        : p
    ));

    try {
      // Simulate quick authentication process
      await simulateQuickAuth(platform);
      
      // Update to connected status
      setPlatforms(prev => prev.map(p => 
        p.id === platform.id 
          ? { ...p, status: 'connected' as const, connected: true }
          : p
      ));

      // Show success feedback
      triggerSuccessAnimation(platform.name);
      
      // Create dashboard widget
      if (onPlatformConnect) {
        // Map dataCategories to appropriate data types
        const dataTypes = platform.dataCategories.map(cat => {
          switch (cat) {
            case 'Activity': return 'steps';
            case 'Steps': return 'steps';
            case 'Heart Rate': return 'heart_rate';
            case 'Sleep': return 'sleep';
            case 'Weight': return 'weight';
            case 'Exercise': return 'calories';
            case 'Stress': return 'stress';
            case 'SpO2': return 'oxygen';
            case 'Cycling': return 'cycling';
            default: return cat.toLowerCase().replace(' ', '_');
          }
        });
        onPlatformConnect(platform.id, platform.name, dataTypes);
      }
      
    } catch (error) {
      // Revert to available status on error
      setPlatforms(prev => prev.map(p => 
        p.id === platform.id 
          ? { ...p, status: 'available' as const }
          : p
      ));
      
      console.error(`Failed to connect ${platform.name}:`, error);
    } finally {
      setConnecting(null);
    }
  };

  const simulateQuickAuth = async (platform: QuickConnectPlatform): Promise<void> => {
    // Different connection flows based on platform type
    switch (platform.authType) {
      case 'quick':
        // Apple Health uses HealthKit - direct device access
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
      case 'oauth':
        // OAuth flow simulation
        await new Promise(resolve => setTimeout(resolve, 3000));
        break;
      case 'token':
        // Token-based auth
        await new Promise(resolve => setTimeout(resolve, 1500));
        break;
    }
  };

  const triggerSuccessAnimation = (platformName: string) => {
    // Trigger haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100]);
    }
    
    // Could trigger a toast notification or success modal here
    console.log(`Successfully connected to ${platformName}!`);
  };

  const handleViewAllPlatforms = () => {
    if (onViewAllPlatforms) {
      onViewAllPlatforms();
    } else {
      // Default behavior - could open a new modal or navigate to full platform list
      console.log('Opening full platform connector...');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-600 bg-green-50 dark:bg-green-950';
      case 'connecting': return 'text-blue-600 bg-blue-50 dark:bg-blue-950';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-950';
    }
  };

  // Show message if no platforms detected
  if (platforms.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <Watch className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No health platforms detected on this device</p>
        </div>
        <Button 
          onClick={handleViewAllPlatforms}
          className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-medium px-6 py-2 rounded-lg"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Browse All Platforms
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Platforms detected on your device
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center min-w-[24px] h-6 px-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white text-xs font-semibold rounded-full">
            {platforms.length}
          </div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
            detected
          </span>
        </div>
      </div>

      <div className="grid gap-3">
        {platforms.map((platform) => (
          <div 
            key={platform.id} 
            className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-200 hover:shadow-md ${
              platform.connected ? 'ring-1 ring-green-500 bg-green-50 dark:bg-green-950' : 'hover:border-blue-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-1.5 rounded-md ${
                platform.connected 
                  ? 'bg-green-100 text-green-600 dark:bg-green-900' 
                  : 'bg-blue-100 text-blue-600 dark:bg-blue-900'
              }`}>
                {platform.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">{platform.name}</p>
                  {platform.connected && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{platform.name === 'Apple Health' ? 'appleHealthDesc' : platform.name === 'Google Fit' ? 'googleFitDesc' : platform.name === 'Fitbit' ? 'fitbitDesc' : platform.name === 'Samsung Health' ? 'samsungHealthDesc' : platform.name === 'MyFitnessPal' ? 'myFitnessPalDesc' : platform.name === 'Strava' ? 'stravaDesc' : platform.name}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {platform.dataCategories.slice(0, 3).map((category, i) => (
                    <Badge key={i} variant="outline" className="text-xs px-2 py-1 whitespace-nowrap">
                      {category === 'Steps' || category === 'steps' ? 'steps' : category === 'Heart Rate' || category === 'heartRate' ? 'heartRate' : category === 'Sleep' || category === 'sleep' ? 'sleep' : category}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleQuickConnect(platform)}
              disabled={connecting === platform.id || platform.connected}
              size="sm"
              className={`min-w-[90px] ${
                platform.connected 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700'
              } text-white font-medium`}
            >
              {connecting === platform.id ? (
                <div className="flex items-center">
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  <span className="text-xs">{'connecting'}</span>
                </div>
              ) : platform.connected ? (
                <div className="flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  <span className="text-xs">{'connected'}</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Zap className="w-3 h-3 mr-1" />
                  <span className="text-xs">Connect</span>
                </div>
              )}
            </Button>
          </div>
        ))}
      </div>

      <div className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          onClick={handleViewAllPlatforms}
          variant="outline"
          className="w-full text-sm"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          {'browseAllPlatforms'}
        </Button>
      </div>
    </div>
  );
};

export default OneClickConnector;