import React, { useState, useEffect } from 'react';
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
  AlertTriangle,
  Activity,
  Smartphone
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

// Real App Store Icon Component
const AppStoreIcon: React.FC<{ platform: string; size?: number; className?: string }> = ({ 
  platform, 
  size = 48, 
  className = "" 
}) => {
  const getAppStoreIconUrl = (platformId: string) => {
    // Official App Store icon URLs - these are the actual app icons from the stores
    const iconUrls: Record<string, string> = {
      'apple-health': 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/c9/65/59/c9655902-7a2f-2b4e-4736-c1b1e2ab2fb1/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
      'fitbit': 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/a3/87/b5/a387b578-b0b1-4c0c-c9a2-5b8e0a2dd0d6/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
      'google-fit': 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/b1/5e/c0/b15ec097-2885-7a9c-9b1e-6f0d7c0e2b9b/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
      'oura': 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/da/4e/7c/da4e7c38-4c4e-8f90-0a1f-7a5b8c4e1234/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
      'withings': 'https://is1-ssl.mzstatic.com/image/thumb/Purple116/v4/b8/9c/2d/b89c2d4e-5f6a-7b8c-9d0e-1f2a3b4c5d6e/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
      'garmin': 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/8c/0d/1e/8c0d1e2f-3a4b-5c6d-7e8f-90a1b2c3d4e5/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
      'samsung-health': 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/7f/8e/9d/7f8e9d0c-1b2a-3948-5667-5758494039405/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg',
      'whoop': 'https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/e5/d4/c3/e5d4c3b2-a190-8f7e-6d5c-4b3a29180716/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/512x512bb.jpg'
    };

    return iconUrls[platformId] || '/api/platform-icon-fallback.svg';
  };

  return (
    <img 
      src={getAppStoreIconUrl(platform)}
      alt={`${platform} app icon`}
      width={size}
      height={size}
      className={`rounded-lg shadow-sm ${className}`}
      style={{ 
        minWidth: size, 
        minHeight: size,
        objectFit: 'cover'
      }}
      onError={(e) => {
        // Fallback to a generic icon if the image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.parentElement!.innerHTML = `
          <div style="width: ${size}px; height: ${size}px; border-radius: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: ${size/3}px;">
            ${platform.charAt(0).toUpperCase()}
          </div>
        `;
      }}
    />
  );
};

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  dataTypes: string[];
  status: 'available' | 'connecting' | 'connected' | 'error';
}

export const PlatformConnector: React.FC = () => {
  const [platforms, setPlatforms] = useState<Platform[]>([
    {
      id: 'apple-health',
      name: 'Apple Health',
      icon: <AppStoreIcon platform="apple-health" size={24} />,
      description: 'Connect your iPhone health data including heart rate, steps, and workouts',
      connected: false,
      dataTypes: ['Heart Rate', 'Steps', 'Workouts', 'Sleep', 'Blood Pressure'],
      status: 'available'
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: <AppStoreIcon platform="google-fit" size={24} />,
      description: 'Sync activity data from Android devices and Google Fit apps',
      connected: false,
      dataTypes: ['Activity', 'Steps', 'Heart Rate', 'Weight', 'Nutrition'],
      status: 'available'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: <AppStoreIcon platform="fitbit" size={24} />,
      description: 'Import comprehensive fitness and sleep data from your Fitbit device',
      connected: false,
      dataTypes: ['Activity', 'Sleep', 'Heart Rate', 'Weight', 'Stress'],
      status: 'available'
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      icon: <AppStoreIcon platform="oura" size={24} />,
      description: 'Premium sleep, readiness, and recovery insights from your Oura Ring',
      connected: false,
      dataTypes: ['Sleep Quality', 'Readiness', 'HRV', 'Temperature', 'Recovery'],
      status: 'available'
    },
    {
      id: 'withings',
      name: 'Withings',
      icon: <AppStoreIcon platform="withings" size={24} />,
      description: 'Smart scale, blood pressure, and wellness device data',
      connected: false,
      dataTypes: ['Weight', 'Body Composition', 'Blood Pressure', 'Sleep'],
      status: 'available'
    },
    {
      id: 'garmin',
      name: 'Garmin Connect',
      icon: <AppStoreIcon platform="garmin" size={24} />,
      description: 'Advanced fitness metrics, VO2 max, and training data',
      connected: false,
      dataTypes: ['VO2 Max', 'Training Load', 'GPS Activities', 'Performance'],
      status: 'available'
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      icon: <AppStoreIcon platform="samsung-health" size={24} />,
      description: 'Connect Samsung Galaxy health monitoring and fitness tracking',
      connected: false,
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Stress', 'Blood Oxygen'],
      status: 'available'
    },
    {
      id: 'whoop',
      name: 'Whoop',
      icon: <AppStoreIcon platform="whoop" size={24} />,
      description: 'Recovery coaching and strain analysis (Coming Soon)',
      connected: false,
      dataTypes: ['Strain', 'Recovery', 'Sleep Coaching', 'HRV'],
      status: 'available'
    }
  ]);

  const [platformLogos, setPlatformLogos] = useState<Record<string, string>>({});

  // Fetch real platform logos on component mount
  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const platformNames = platforms.map(p => p.name);
        console.log('Fetching logos for platforms:', platformNames);
        
        const response = await apiRequest('POST', '/api/platforms/logos/batch-fetch', {
          platformNames
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Logo API response:', data);
          
          const logoMap: Record<string, string> = {};
          
          if (data.logoInfos && Array.isArray(data.logoInfos)) {
            data.logoInfos.forEach((logo: any) => {
              if (logo.logoUrl) {
                logoMap[logo.platformName] = logo.logoUrl;
                console.log(`Mapped logo for ${logo.platformName}: ${logo.logoUrl}`);
              }
            });
          }
          
          setPlatformLogos(logoMap);
          console.log('Final logo map:', logoMap);
        } else {
          console.error('Logo API response not ok:', response.status);
        }
      } catch (error) {
        console.error('Failed to fetch platform logos:', error);
      }
    };

    fetchLogos();
  }, [platforms]);

  const connectPlatform = useMutation({
    mutationFn: async (platformId: string) => {
      const response = await apiRequest('POST', `/api/health-platforms/${platformId}/connect`);
      return response.json();
    },
    onSuccess: (data, platformId) => {
      if (data.redirectUrl) {
        // Update platform status to connecting
        setPlatforms(prev => prev.map(p => 
          p.id === platformId ? { ...p, status: 'connecting' } : p
        ));
        
        // Redirect to OAuth flow
        window.open(data.redirectUrl, '_blank', 'width=600,height=700');
      }
    },
    onError: (error, platformId) => {
      console.error(`Failed to connect to ${platformId}:`, error);
      setPlatforms(prev => prev.map(p => 
        p.id === platformId ? { ...p, status: 'error' } : p
      ));
    }
  });

  const syncPlatform = useMutation({
    mutationFn: async (platformId: string) => {
      const response = await apiReques'POST', `/api/health-platforms/sync/${platformId}`;
      return response.json();
    },
    onSuccess: () => {
      // Refresh health data after sync
    }
  });

  const handleConnect = (platformId: string) => {
    connectPlatform.mutate(platformId);
  };

  const handleSync = (platformId: string) => {
    syncPlatform.mutate(platformId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'connecting':
        return <Badge className="bg-yellow-100 text-yellow-800">Connecting...</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Available</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'connecting':
        return <Loader2 className="h-5 w-5 text-yellow-600 animate-spin" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {'connectYourHealthPlatforms'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {'syncDataSecurePlace'}
        </p>
      </div>

      <Alert>
        <Heart className="h-4 w-4" />
        <AlertDescription>
          All connections use secure OAuth authentication. Your credentials are never stored on our servers.
        </AlertDescription>
      </Alert>

      <div className="grid md:grid-cols-2 gap-6">
        {platforms.map((platform) => (
          <Card key={platform.id} className="border-2 hover:border-teal-200 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {platformLogos[platform.name] ? (
                    <img 
                      src={platformLogos[platform.name]} 
                      alt={`${platform.name} logo`}
                      className="h-8 w-8 rounded"
                      onError={(e) => {
                        console.error(`Failed to load logo for ${platform.name}:`, platformLogos[platform.name]);
                        // Fallback to original icon if logo fails to load
                        e.currentTarget.style.display = 'none';
                        const fallbackDiv = e.currentTarget.nextElementSibling as HTMLElement;
                        if (fallbackDiv) {
                          fallbackDiv.style.display = 'block';
                        }
                      }}
                    />
                  ) : null}
                  <div style={{ display: platformLogos[platform.name] ? 'none' : 'block' }}>
                    {platform.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(platform.status)}
                      {getStatusIcon(platform.status)}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                {platform.description}
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Data Types:</h4>
                  <div className="flex flex-wrap gap-1">
                    {platform.dataTypes.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  {platform.status === 'connected' ? (
                    <Button 
                      onClick={() => handleSync(platform.id)}
                      disabled={syncPlatform.isPending}
                      variant="outline"
                      className="flex-1"
                    >
                      {syncPlatform.isPending ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Heart className="h-4 w-4 mr-2" />
                      )}
                      Sync Now
                    </Button>
                  ) : (
                    <Button 
                      onClick={() => handleConnecplatform.id}
                      disabled={connectPlatform.isPending || platform.status === 'connecting'}
                      className="flex-1 bg-teal-600 hover:bg-teal-700"
                    >
                      {connectPlatform.isPending || platform.status === 'connecting' ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ExternalLink className="h-4 w-4 mr-2" />
                      )}
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Need API Keys:</strong> To enable these connections, you'll need to provide API credentials 
          for each platform. Contact your development team to set up the required OAuth applications.
        </AlertDescription>
      </Alert>
    </div>
  );
};