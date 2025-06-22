import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Shield, Search, Heart, Activity, Smartphone, Watch, Scale, X, ArrowLeft, Zap, Clock } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  dataTypes: string[];
  oauthUrl: string;
  privacyLevel: 'high' | 'medium' | 'standard';
}

interface PlatformConnectionDialogProps {
  platform: Platform | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: Platform) => void;
}

export const PlatformConnectionDialog: React.FC<PlatformConnectionDialogProps> = ({
  platform,
  isOpen,
  onClose,
  onConnect
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Platform categories for easier browsing
  const categories = [
    { id: 'fitness', name: 'Fitness Trackers', icon: <Activity className="h-5 w-5" />, description: 'Wearables and fitness apps' },
    { id: 'health', name: 'Health Apps', icon: <Heart className="h-5 w-5" />, description: 'Mobile health platforms' },
    { id: 'smart_devices', name: 'Smart Devices', icon: <Smartphone className="h-5 w-5" />, description: 'Connected health devices' },
    { id: 'wellness', name: 'Wellness', icon: <Zap className="h-5 w-5" />, description: 'Sleep and recovery tracking' }
  ];

  // Available platforms to choose from
  const availablePlatforms = [
    {
      id: 'apple_health',
      name: 'Apple Health',
      icon: <Heart className="h-5 w-5" />,
      description: 'Connect your Apple Health data from iPhone and Apple Watch',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Workouts', 'Blood Pressure'],
      oauthUrl: '/auth/apple-health',
      privacyLevel: 'high' as const,
      category: 'health'
    },
    {
      id: 'google_fit',
      name: 'Google Fit',
      icon: <Activity className="h-5 w-5" />,
      description: 'Sync your Google Fit activity and health tracking data',
      dataTypes: ['Steps', 'Calories', 'Distance', 'Activity'],
      oauthUrl: '/auth/google-fit',
      privacyLevel: 'high' as const,
      category: 'health'
    },
    {
      id: 'fitbit',
      name: 'Fitbit',
      icon: <Watch className="h-5 w-5" />,
      description: 'Connect your Fitbit device data and fitness metrics',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Weight', 'Exercise'],
      oauthUrl: '/auth/fitbit',
      privacyLevel: 'high' as const,
      category: 'fitness'
    },
    {
      id: 'samsung_health',
      name: 'Samsung Health',
      icon: <Smartphone className="h-5 w-5" />,
      description: 'Connect your Samsung Health data and fitness tracking',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Nutrition'],
      oauthUrl: '/auth/samsung',
      privacyLevel: 'high' as const,
      category: 'health'
    },
    {
      id: 'garmin_connect',
      name: 'Garmin Connect',
      icon: <Watch className="h-5 w-5" />,
      description: 'Sync your Garmin device data and training metrics',
      dataTypes: ['GPS Workouts', 'Heart Rate', 'Sleep', 'Stress'],
      oauthUrl: '/auth/garmin',
      privacyLevel: 'high' as const,
      category: 'fitness'
    },
    {
      id: 'withings',
      name: 'Withings',
      icon: <Scale className="h-5 w-5" />,
      description: 'Connect your smart scales and health monitoring devices',
      dataTypes: ['Weight', 'Body Composition', 'Blood Pressure'],
      oauthUrl: '/auth/withings',
      privacyLevel: 'medium' as const,
      category: 'smart_devices'
    },
    {
      id: 'oura',
      name: 'Oura Ring',
      icon: <Heart className="h-5 w-5" />,
      description: 'Advanced sleep and recovery insights from your Oura Ring',
      dataTypes: ['Sleep', 'Recovery', 'Readiness', 'Temperature'],
      oauthUrl: '/auth/oura',
      privacyLevel: 'high' as const,
      category: 'wellness'
    }
  ];

  const filteredPlatforms = availablePlatforms.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.dataTypes.some(type => type.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === null || p.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getPrivacyColor = (level: string) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const handleConnect = async () => {
    if (!platform) return;
    
    setIsConnecting(true);
    try {
      // Simulate connection success
      onConnecplatform;
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  // If a specific platform is selected, show its details
  if (platform) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {platform.icon}
              Connect {platform.name}
            </DialogTitle>
            <DialogDescription>
              {platform.description}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Data Types</h4>
              <div className="flex flex-wrap gap-1">
                {platform.dataTypes.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            <Alert className={`border ${getPrivacyColor(platform.privacyLevel)}`}>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Privacy Level: {platform.privacyLevel.charA0.toUpperCase() + platform.privacyLevel.slice(1)}
                - Your data will be encrypted and securely stored.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="flex-1"
              >
                {isConnecting ? 'Connecting...' : 'Connect'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Show platform selection dialog - Full screen mobile-friendly
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 rounded-none border-0 bg-background">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-background border-b border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {selectedCategory ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="p-1 h-8 w-8"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              ) : null}
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {selectedCategory ? 
                    categories.find(c => c.id === selectedCategory)?.name || 'Platforms' : 
                    'Connect a Platform'
                  }
                </DialogTitle>
                {!selectedCategory && (
                  <DialogDescription className="text-sm text-muted-foreground">
                    Choose a health platform to sync your data
                  </DialogDescription>
                )}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 py-3 border-b border-border bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={selectedCategory ? "Search platforms..." : "Search platforms or categories..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
          {!selectedCategory ? (
            // Show categories first
            <div className="p-4 space-y-4 pb-safe">
              <div className="text-sm font-medium text-muted-foreground mb-3">Browse by Category</div>
              <div className="grid gap-3 min-h-0">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border rounded-xl p-4 hover:bg-muted/30 cursor-pointer transition-all duration-200 active:scale-[0.98]"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        {category.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-muted-foreground">{category.description}</p>
                        <div className="mt-2 text-xs text-primary font-medium">
                          {availablePlatforms.filter(p => p.category === category.id).length} platforms available
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Quick access to all platforms */}
              <div className="pt-4 border-t border-border">
                <div className="text-sm font-medium text-muted-foreground mb-3">All Platforms</div>
                <div className="grid gap-3 min-h-0">
                  {filteredPlatforms.slice(0, 3).map((p) => (
                    <div
                      key={p.id}
                      className="border rounded-xl p-4 hover:bg-muted/30 cursor-pointer transition-all duration-200 active:scale-[0.98]"
                      onClick={() => onConnecp}
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-muted">
                          {p.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium">{p.name}</h4>
                          <p className="text-sm text-muted-foreground">{p.description}</p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {p.dataTypes.slice(0, 2).map((type) => (
                              <Badge key={type} variant="outline" className="text-xs">
                                {type}
                              </Badge>
                            ))}
                            {p.dataTypes.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{p.dataTypes.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {availablePlatforms.length > 3 && (
                    <div
                      className="border border-dashed rounded-xl p-4 hover:bg-muted/30 cursor-pointer transition-all duration-200 text-center text-muted-foreground"
                      onClick={() => setSelectedCategory('all')}
                    >
                      <div className="text-sm">View all {availablePlatforms.length} platforms</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Show platforms in selected category
            <div className="p-4 pb-safe">
              <div className="grid gap-3 min-h-0">
                {filteredPlatforms.map((p) => (
                  <div
                    key={p.id}
                    className="border rounded-xl p-4 hover:bg-muted/30 cursor-pointer transition-all duration-200 active:scale-[0.98]"
                    onClick={() => onConnecp}
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-muted">
                        {p.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium">{p.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getPrivacyColor(p.privacyLevel)}`}
                          >
                            {p.privacyLevel}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {p.dataTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPlatforms.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p>No platforms found matching your search.</p>
                    <Button 
                      variant="ghost" 
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory(null);
                      }}
                      className="mt-2"
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Footer with privacy notice - fixed positioning */}
        <div className="mt-4 px-4 py-3 bg-muted/20 border-t border-border">
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span className="break-words">All connections are encrypted and HIPAA compliant</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};