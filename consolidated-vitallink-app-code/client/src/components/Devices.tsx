import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Heart, Activity, Smartphone, Watch, Scale, Wifi, Settings2, Clock, Plus } from "lucide-react";
import { SiApple, SiGoogle, SiFitbit, SiSamsung } from "react-icons/si";
import { ComprehensivePlatformConnector } from "./ComprehensivePlatformConnector";
import { PlatformDeviceSettings } from "@/components/PlatformDeviceSettings";
import { useToast } from "@/hooks/use-toast";
import { ConnectionSuccessAnimation } from "./ConnectionSuccessAnimation";

const Devices = () => {
  const { toast } = useToas;
  const [showPlatformConnector, setShowPlatformConnector] = useState(false);
  const [deviceSettingsOpen, setDeviceSettingsOpen] = useState(false);
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | undefined>();
  const [showConnectionAnimation, setShowConnectionAnimation] = useState(false);
  const [connectedPlatform, setConnectedPlatform] = useState<any>(null);

  // Connected platforms with brand-accurate gradients
  const connectedPlatforms = [
    {
      id: 'apple_health',
      name: 'Apple Health',
      status: 'connected',
      lastSynced: '2 hours ago',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Workouts'],
      icon: SiApple,
      color: 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      gradient: 'bg-gradient-to-br from-red-500 via-pink-500 to-orange-500',
      brandColors: ['#FF3B30', '#FF2D92', '#FF9500'] // Apple's vibrant health colors
    },
    {
      id: 'google_fit',
      name: 'Google Fit',
      status: 'connected',
      lastSynced: '1 hour ago',
      dataTypes: ['Steps', 'Calories', 'Distance'],
      icon: SiGoogle,
      color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
      gradient: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-green-500',
      brandColors: ['#4285F4', '#00BCD4', '#34A853'] // Google's material design colors
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      status: 'connected',
      lastSynced: '30 minutes ago',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Weight'],
      icon: SiFitbit,
      color: 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400',
      gradient: 'bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-500',
      brandColors: ['#00B0B9', '#00D4AA', '#4FC3F7'] // Fitbit's wellness blue-teal palette
    },
    {
      id: 'samsung_health',
      name: 'Samsung Health',
      status: 'disconnected',
      lastSynced: '2 days ago',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Stress'],
      icon: SiSamsung,
      color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
      gradient: 'bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700',
      brandColors: ['#7B68EE', '#1f4e79', '#6366F1'] // Samsung's sophisticated purple-blue
    }
  ];



  const handlePlatformConnect = (platform: any) => {
    // Show connection animation
    setConnectedPlatform(platform);
    setShowConnectionAnimation(true);
  };

  const handleAnimationComplete = () => {
    setShowConnectionAnimation(false);
    setConnectedPlatform(null);
    
    toast({
      title: "Platform Connected!",
      description: `Successfully connected to ${connectedPlatform?.name}`,
    });
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Linked Platforms</h1>
        <p className="text-muted-foreground">Manage your health data connections and sync settings</p>
      </div>

      {/* Featured Section - Centered */}
      <div className="text-center mb-12">
        <div className="inline-flex flex-col items-center space-y-4">
          <Button 
            onClick={() => {
              setShowPlatformConnector(true);
            }}
            className="bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 text-lg min-w-[200px]"
          >
            <Plus className="w-5 h-5 mr-3" />
            Link a Platform
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Add new health platforms to centralize your data
          </p>
        </div>
      </div>

      {/* Linked Platforms */}
      {connectedPlatforms.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-center">Your Linked Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedPlatforms.map((platform) => {
              const IconComponent = platform.icon;
              return (
                <Card key={platform.id} className={`relative overflow-hidden border-0 ${platform.gradient}`}>
                  <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm"></div>
                  <CardHeader className="pb-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-3 rounded-xl ${platform.gradient} shadow-lg`}>
                          <IconComponent className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-base truncate">{platform.name}</CardTitle>
                          <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <Wifi className="h-3 w-3 mr-1 text-green-500 flex-shrink-0" />
                            <span className="truncate">Connected</span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedPlatformId(platform.id);
                          setDeviceSettingsOpen(true);
                        }}
                      >
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 relative z-10">
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        Last sync: {platform.lastSynced}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {platform.dataTypes.map((type) => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}



      {/* Comprehensive Platform Connector Modal */}
      {showPlatformConnector && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
              <h2 className="text-xl font-semibold">Connect Health Platforms</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPlatformConnector(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] overscroll-contain">
              <div className="p-6 pb-8">
                <ComprehensivePlatformConnector />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Platform Device Settings Dialog */}
      <PlatformDeviceSettings
        platformId={selectedPlatformId}
        isOpen={deviceSettingsOpen}
        onClose={() => {
          setDeviceSettingsOpen(false);
          setSelectedPlatformId(undefined);
        }}
      />

      {/* Connection Success Animation */}
      <ConnectionSuccessAnimation
        isVisible={showConnectionAnimation}
        platformName={connectedPlatform?.name || ''}
        platformIcon={connectedPlatform?.icon}
        onComplete={handleAnimationComplete}
      />
    </div>
  );
};

export default Devices;