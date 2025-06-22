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
  AlertTriangle
} from 'lucide-react';
import { 
  SiApple, 
  SiGoogle, 
  SiFitbit
} from 'react-icons/si';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

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
      icon: <SiApple className="h-6 w-6 text-gray-800" />,
      description: 'Connect your iPhone health data including heart rate, steps, and workouts',
      connected: false,
      dataTypes: ['Heart Rate', 'Steps', 'Workouts', 'Sleep', 'Blood Pressure'],
      status: 'available'
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      icon: <SiGoogle className="h-6 w-6 text-blue-600" />,
      description: 'Sync activity data from Android devices and Google Fit apps',
      connected: false,
      dataTypes: ['Activity', 'Steps', 'Heart Rate', 'Weight', 'Nutrition'],
      status: 'available'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: <SiFitbit className="h-6 w-6 text-teal-600" />,
      description: 'Import comprehensive fitness and sleep data from your Fitbit device',
      connected: false,
      dataTypes: ['Activity', 'Sleep', 'Heart Rate', 'Weight', 'Stress'],
      status: 'available'
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      icon: <Heart className="h-6 w-6 text-purple-600" />,
      description: 'Premium sleep, readiness, and recovery insights from your Oura Ring',
      connected: false,
      dataTypes: ['Sleep Quality', 'Readiness', 'HRV', 'Temperature', 'Recovery'],
      status: 'available'
    },
    {
      id: 'withings',
      name: 'Withings',
      icon: <Heart className="h-6 w-6 text-blue-500" />,
      description: 'Smart scale, blood pressure, and wellness device data',
      connected: false,
      dataTypes: ['Weight', 'Body Composition', 'Blood Pressure', 'Sleep'],
      status: 'available'
    },
    {
      id: 'garmin',
      name: 'Garmin Connect',
      icon: <Activity className="h-6 w-6 text-red-600" />,
      description: 'Advanced fitness metrics, VO2 max, and training data',
      connected: false,
      dataTypes: ['VO2 Max', 'Training Load', 'GPS Activities', 'Performance'],
      status: 'available'
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      icon: <Smartphone className="h-6 w-6 text-blue-700" />,
      description: 'Connect Samsung Galaxy health monitoring and fitness tracking',
      connected: false,
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Stress', 'Blood Oxygen'],
      status: 'available'
    },
    {
      id: 'whoop',
      name: 'Whoop',
      icon: <Activity className="h-6 w-6 text-black" />,
      description: 'Recovery coaching and strain analysis (Coming Soon)',
      connected: false,
      dataTypes: ['Strain', 'Recovery', 'Sleep Coaching', 'HRV'],
      status: 'available'
    }
  ]);

  const connectPlatform = useMutation({
    mutationFn: async (platformId: string) => {
      const response = await apiReques'POST', `/api/health-platforms/${platformId}/connect`;
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
                  {platform.icon}
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