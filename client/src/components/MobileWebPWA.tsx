import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  RotateCcw, 
  Battery,
  Signal,
  Globe,
  Monitor,
  Tablet,
  Watch,
  CheckCircle,
  AlertTriangle,
  Settings,
  Zap,
  Cloud,
  HardDrive
} from 'lucide-react';

interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop' | 'watch';
  name: string;
  os: string;
  browser: string;
  online: boolean;
  lastSync: string;
  dataSize: string;
  batteryLevel?: number;
}

interface OfflineCapability {
  feature: string;
  available: boolean;
  description: string;
}

export const MobileWebPWA: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  // Device detection
  const getDeviceType = (): 'mobile' | 'tablet' | 'desktop' => {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  };

  const [currentDevice] = useState<DeviceInfo>({
    type: getDeviceType(),
    name: 'Current Device',
    os: navigator.platform,
    browser: navigator.userAgent.spli' '.pop() || 'Unknown',
    online: navigator.onLine,
    lastSync: 'Just now',
    dataSize: '2.3 MB',
    batteryLevel: 85
  });

  const [offlineCapabilities] = useState<OfflineCapability[]>([
    {
      feature: 'View Health Data',
      available: true,
      description: 'Access your last synced health metrics offline'
    },
    {
      feature: 'Record Manual Data',
      available: true,
      description: 'Log symptoms, notes, and manual measurements'
    },
    {
      feature: 'View Insights',
      available: true,
      description: 'Access previously generated health insights'
    },
    {
      feature: 'Export Data',
      available: false,
      description: 'Requires internet connection for secure export'
    },
    {
      feature: 'Sync with Devices',
      available: false,
      description: 'Real-time sync requires internet connection'
    }
  ]);

  // PWA Installation
  useEffec( => {
    const handler = (e: any) => {
      e.preventDefaul;
      setInstallPrompe;
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Online/Offline detection
  useEffec( => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!installPrompt) return;

    const result = await installPrompt.promp;
    if (result.outcome === 'accepted') {
      setIsInstalled(true);
      setInstallPrompnull;
    }
  };

  const handleSync = async () => {
    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsSyncing(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return <Smartphone className="h-5 w-5" />;
      case 'tablet': return <Tablet className="h-5 w-5" />;
      case 'desktop': return <Monitor className="h-5 w-5" />;
      case 'watch': return <Watch className="h-5 w-5" />;
      default: return <Smartphone className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* PWA Installation Card */}
      {!isInstalled && installPrompt && (
        <Card className="border-blue-200 bg-blue-50/30 dark:bg-blue-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <Download className="h-5 w-5" />
              Install VitalLink App
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm mb-2">
                  Install VitalLink as a native app for faster access and offline capabilities.
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Works offline</li>
                  <li>• Faster loading</li>
                  <li>• Native notifications</li>
                  <li>• Home screen icon</li>
                </ul>
              </div>
              <Button onClick={handleInstallPWA} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Install
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {isOnline 
                    ? 'All features available' 
                    : 'Limited features available offline'
                  }
                </p>
              </div>
              <Badge variant={isOnline ? 'default' : 'destructive'}>
                {isOnline ? 'Connected' : 'Disconnected'}
              </Badge>
            </div>

            {!isOnline && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  You're currently offline. Your data will sync when connection is restored.
                </AlertDescription>
              </Alert>
            )}

            {isOnline && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Last sync</span>
                  <span className="text-sm font-medium">{currentDevice.lastSync}</span>
                </div>
                
                {isSyncing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Syncing data...</span>
                      <span>{syncProgress}%</span>
                    </div>
                    <Progress value={syncProgress} className="h-2" />
                  </div>
                )}

                <Button 
                  onClick={handleSync} 
                  disabled={isSyncing}
                  variant="outline" 
                  className="w-full"
                >
                  <RotateCcw className={`h-4 w-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Device Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {getDeviceIcon(currentDevice.type)}
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium">Device Type</h4>
                <p className="text-sm text-muted-foreground capitalize">{currentDevice.type}</p>
              </div>
              <div>
                <h4 className="font-medium">Operating System</h4>
                <p className="text-sm text-muted-foreground">{currentDevice.os}</p>
              </div>
              <div>
                <h4 className="font-medium">Browser</h4>
                <p className="text-sm text-muted-foreground">{currentDevice.browser}</p>
              </div>
              <div>
                <h4 className="font-medium">Cached Data</h4>
                <p className="text-sm text-muted-foreground">{currentDevice.dataSize}</p>
              </div>
            </div>

            {currentDevice.batteryLevel && (
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Battery Level</span>
                  <span>{currentDevice.batteryLevel}%</span>
                </div>
                <Progress value={currentDevice.batteryLevel} className="h-2" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Offline Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Offline Capabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {offlineCapabilities.map((capability, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium flex items-center gap-2">
                    {capability.feature}
                    {capability.available ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </h4>
                  <p className="text-sm text-muted-foreground">{capability.description}</p>
                </div>
                <Badge variant={capability.available ? 'default' : 'secondary'}>
                  {capability.available ? 'Available' : 'Online Only'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Optimization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">98%</div>
                <div className="text-sm text-muted-foreground">Performance Score</div>
              </div>
              <div className="p-3 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">1.2s</div>
                <div className="text-sm text-muted-foreground">Load Time</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Cache Efficiency</span>
                <span>92%</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Data Compression</span>
                <span>78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>

            <Alert>
              <Cloud className="h-4 w-4" />
              <AlertDescription>
                Your app is optimized for fast loading and minimal data usage.
              </AlertDescription>
            </Alert>
          </div>
        </CardContent>
      </Card>

      {/* Cross-Platform Sync */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Cross-Platform Sync
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Alert>
              <Globe className="h-4 w-4" />
              <AlertDescription>
                Your health data stays in sync across all your devices automatically.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auto-sync frequency</span>
                <Badge variant="outline">Every 15 minutes</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Background sync</span>
                <Badge variant="default">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Conflict resolution</span>
                <Badge variant="outline">Latest timestamp wins</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};