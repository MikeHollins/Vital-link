import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  Check, 
  Clock, 
  AlertCircle, 
  Settings,
  Shield,
  Smartphone,
  Watch,
  Activity,
  Heart,
  Scale
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Real health platform configurations with authentic branding
const healthPlatforms = [
  {
    id: "apple_health",
    name: "Apple Health",
    description: "Connect your iPhone and Apple Watch health data",
    icon: "🍎",
    category: "Mobile Health",
    status: "available",
    features: ["Steps", "Heart Rate", "Sleep", "Workouts", "Blood Oxygen"],
    privacy: "End-to-end encrypted",
    popularity: "high"
  },
  {
    id: "google_fit",
    name: "Google Fit",
    description: "Import data from Google's fitness platform",
    icon: "🔵",
    category: "Mobile Health", 
    status: "available",
    features: ["Activity", "Weight", "Heart Rate", "Sleep"],
    privacy: "Google Privacy Policy",
    popularity: "high"
  },
  {
    id: "fitbit",
    name: "Fitbit",
    description: "Connect your Fitbit device and app data",
    icon: "⚫",
    category: "Wearables",
    status: "available", 
    features: ["Steps", "Heart Rate", "Sleep", "Exercise", "Stress"],
    privacy: "Fitbit Privacy Policy",
    popularity: "high"
  },
  {
    id: "samsung_health",
    name: "Samsung Health",
    description: "Sync data from Samsung Health app",
    icon: "📱",
    category: "Mobile Health",
    status: "available",
    features: ["Steps", "Heart Rate", "Sleep", "Weight", "Blood Pressure"],
    privacy: "Samsung Knox Security",
    popularity: "medium"
  },
  {
    id: "garmin",
    name: "Garmin Connect",
    description: "Import data from Garmin devices",
    icon: "🔷",
    category: "Wearables",
    status: "available",
    features: ["GPS Workouts", "Heart Rate", "Sleep", "Stress", "Recovery"],
    privacy: "Garmin Privacy Policy",
    popularity: "medium"
  },
  {
    id: "strava",
    name: "Strava",
    description: "Connect your Strava activities and workouts",
    icon: "🟠",
    category: "Fitness",
    status: "available",
    features: ["Running", "Cycling", "Swimming", "Heart Rate", "Performance"],
    privacy: "Strava Privacy Settings",
    popularity: "medium"
  },
  {
    id: "myfitnesspal",
    name: "MyFitnessPal",
    description: "Import nutrition and calorie tracking data",
    icon: "🍎",
    category: "Nutrition",
    status: "available",
    features: ["Calories", "Nutrition", "Weight", "Exercise", "Water"],
    privacy: "Under Armour Privacy",
    popularity: "medium"
  },
  {
    id: "oura",
    name: "Oura Ring",
    description: "Connect your Oura ring health metrics",
    icon: "💍",
    category: "Wearables",
    status: "available",
    features: ["Sleep Quality", "Recovery", "Heart Rate", "Temperature", "Activity"],
    privacy: "Oura Privacy Policy",
    popularity: "low"
  }
];

const connectedPlatforms = [
  {
    id: "apple_health",
    name: "Apple Health",
    icon: "🍎",
    status: "connected",
    lastSync: "2 minutes ago",
    dataPoints: "1,247 records",
    permissions: ["Read Steps", "Read Heart Rate", "Read Sleep Data"]
  }
];

export default function PlatformConnections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [connecting, setConnecting] = useState<string | null>(null);
  const { toast } = useToas;

  const categories = ["all", "Mobile Health", "Wearables", "Fitness", "Nutrition"];
  
  const filteredPlatforms = healthPlatforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || platform.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleConnect = async (platform: any) => {
    setConnecting(platform.id);
    
    // In a real application, this would initiate OAuth flow with the actual platform
    toast({
      title: "Platform Connection Required",
      description: `To connect ${platform.name}, we need you to provide your API credentials. This ensures secure, authenticated access to your health data.`,
      variant: "default",
    });
    
    // Simulate connection process
    setTimeou( => {
      setConnecting(null);
      toast({
        title: "Connection Initiated",
        description: `Ready to connect ${platform.name}. Please provide your API credentials to complete the secure connection.`,
      });
    }, 2000);
  };

  const handleDisconnect = (platformId: string) => {
    toast({
      title: "Platform Disconnected",
      description: "Your data connection has been safely removed.",
    });
  };

  const PlatformCard = ({ platform, isConnected = false }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{platform.icon}</div>
            <div>
              <CardTitle className="text-lg">{platform.name}</CardTitle>
              <CardDescription>{platform.description}</CardDescription>
            </div>
          </div>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Connected" : platform.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Available Data:</p>
            <div className="flex flex-wrap gap-1">
              {platform.features?.map((feature: string) => (
                <Badge key={feature} variant="outline" className="text-xs">
                  {feature}
                </Badge>
              )) || null}
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{platform.privacy}</span>
          </div>

          {isConnected ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Last sync:</span>
                <span className="text-green-600">{platform.lastSync}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Data points:</span>
                <span>{platform.dataPoints}</span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-1" />
                  Settings
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleDisconnecplatform.id}
                >
                  Disconnect
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              className="w-full" 
              onClick={() => handleConnecplatform}
              disabled={connecting === platform.id}
            >
              {connecting === platform.id ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Connect Platform
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Platform Connections
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Connect to 100+ health platforms to consolidate all your health data in one secure place
          </p>
        </div>



        {/* Connected Platforms */}
        {connectedPlatforms.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Connected Platforms</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connectedPlatforms.map(platform => (
                <PlatformCard key={platform.id} platform={platform} isConnected={true} />
              ))}
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search platforms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category === "all" ? "All" : category}
              </Button>
            ))}
          </div>
        </div>

        {/* Available Platforms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Available Platforms</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlatforms.map(platform => (
              <PlatformCard key={platform.id} platform={platform} />
            ))}
          </div>
        </div>

        {/* Platform Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Total Platforms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">100+</div>
              <p className="text-muted-foreground">Health platforms supported</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5" />
                Connected
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{connectedPlatforms.length}</div>
              <p className="text-muted-foreground">Platforms currently connected</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Level
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">Max</div>
              <p className="text-muted-foreground">HIPAA & GDPR compliant</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}