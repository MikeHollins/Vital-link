import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Utensils, 
  Brain, 
  Dumbbell, 
  Wind, 
  Cloud, 
  Thermometer,
  Leaf,
  Search,
  Plus,
  Settings,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  Zap
} from 'lucide-react';
import { SiStrava } from 'react-icons/si';

interface Platform {
  id: string;
  name: string;
  category: 'nutrition' | 'mental-health' | 'fitness' | 'environment' | 'lab-work';
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  lastSync?: string;
  dataTypes: string[];
  premium: boolean;
  syncFrequency: 'real-time' | 'hourly' | 'daily';
  dataQuality: number;
}

interface LabResult {
  id: string;
  testName: string;
  value: number;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  date: string;
  lab: string;
}

export const EnhancedPlatformConnections: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [platforms, setPlatforms] = useState<Platform[]>([
    // Nutrition Apps
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal',
      category: 'nutrition',
      icon: <Utensils className="h-6 w-6 text-blue-600" />,
      description: 'Track calories, macros, and nutrition data',
      connected: false,
      dataTypes: ['calories', 'macronutrients', 'meals', 'water_intake'],
      premium: false,
      syncFrequency: 'daily',
      dataQuality: 95
    },
    {
      id: 'cronometer',
      name: 'Cronometer',
      category: 'nutrition',
      icon: <Utensils className="h-6 w-6 text-green-600" />,
      description: 'Detailed micronutrient and vitamin tracking',
      connected: true,
      lastSync: '2 hours ago',
      dataTypes: ['micronutrients', 'vitamins', 'minerals', 'detailed_nutrition'],
      premium: true,
      syncFrequency: 'hourly',
      dataQuality: 98
    },
    
    // Mental Health Platforms
    {
      id: 'headspace',
      name: 'Headspace',
      category: 'mental-health',
      icon: <Brain className="h-6 w-6 text-orange-500" />,
      description: 'Meditation and mindfulness tracking',
      connected: true,
      lastSync: '1 hour ago',
      dataTypes: ['meditation_sessions', 'mood', 'stress_levels', 'mindfulness_minutes'],
      premium: true,
      syncFrequency: 'real-time',
      dataQuality: 92
    },
    {
      id: 'calm',
      name: 'Calm',
      category: 'mental-health',
      icon: <Brain className="h-6 w-6 text-blue-500" />,
      description: 'Sleep stories, meditation, and relaxation',
      connected: false,
      dataTypes: ['sleep_stories', 'meditation', 'breathing_exercises', 'relaxation_time'],
      premium: false,
      syncFrequency: 'daily',
      dataQuality: 90
    },
    
    // Fitness Equipment
    {
      id: 'peloton',
      name: 'Peloton',
      category: 'fitness',
      icon: <Dumbbell className="h-6 w-6 text-red-600" />,
      description: 'Cycling, running, and strength training data',
      connected: true,
      lastSync: '30 minutes ago',
      dataTypes: ['workout_intensity', 'calories_burned', 'heart_rate_zones', 'power_output'],
      premium: true,
      syncFrequency: 'real-time',
      dataQuality: 96
    },
    {
      id: 'strava',
      name: 'Strava',
      category: 'fitness',
      icon: <SiStrava className="h-6 w-6 text-orange-600" />,
      description: 'Running, cycling, and outdoor activity tracking',
      connected: false,
      dataTypes: ['gps_tracks', 'elevation', 'pace', 'social_activities'],
      premium: false,
      syncFrequency: 'hourly',
      dataQuality: 94
    },
    
    // Environmental Data
    {
      id: 'airvisual',
      name: 'AirVisual',
      category: 'environment',
      icon: <Wind className="h-6 w-6 text-gray-600" />,
      description: 'Air quality and pollution data',
      connected: true,
      lastSync: '15 minutes ago',
      dataTypes: ['air_quality_index', 'pm25', 'pm10', 'ozone', 'pollution_forecast'],
      premium: false,
      syncFrequency: 'hourly',
      dataQuality: 88
    },
    {
      id: 'weatherapi',
      name: 'Weather API',
      category: 'environment',
      icon: <Cloud className="h-6 w-6 text-blue-400" />,
      description: 'Weather conditions and health impact',
      connected: true,
      lastSync: '5 minutes ago',
      dataTypes: ['temperature', 'humidity', 'barometric_pressure', 'uv_index', 'pollen_count'],
      premium: true,
      syncFrequency: 'real-time',
      dataQuality: 97
    },
    
    // Lab Work Integration
    {
      id: 'labcorp',
      name: 'LabCorp',
      category: 'lab-work',
      icon: <Zap className="h-6 w-6 text-purple-600" />,
      description: 'Blood tests, biomarkers, and health panels',
      connected: true,
      lastSync: '1 day ago',
      dataTypes: ['blood_panels', 'biomarkers', 'cholesterol', 'glucose', 'hormones'],
      premium: true,
      syncFrequency: 'daily',
      dataQuality: 99
    },
    {
      id: 'quest',
      name: 'Quest Diagnostics',
      category: 'lab-work',
      icon: <Zap className="h-6 w-6 text-blue-700" />,
      description: 'Comprehensive lab testing and results',
      connected: false,
      dataTypes: ['comprehensive_panels', 'specialized_tests', 'genetic_testing'],
      premium: false,
      syncFrequency: 'daily',
      dataQuality: 98
    }
  ]);

  const [recentLabResults] = useState<LabResult[]>([
    {
      id: '1',
      testName: 'Total Cholesterol',
      value: 185,
      unit: 'mg/dL',
      referenceRange: '< 200',
      status: 'normal',
      date: '2024-05-20',
      lab: 'LabCorp'
    },
    {
      id: '2',
      testName: 'Vitamin D',
      value: 28,
      unit: 'ng/mL',
      referenceRange: '30-100',
      status: 'low',
      date: '2024-05-20',
      lab: 'LabCorp'
    },
    {
      id: '3',
      testName: 'HbA1c',
      value: 5.2,
      unit: '%',
      referenceRange: '< 5.7',
      status: 'normal',
      date: '2024-05-15',
      lab: 'Quest'
    }
  ]);

  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         platform.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || platform.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleConnection = async (platformId: string) => {
    setPlatforms(prev => prev.map(platform => 
      platform.id === platformId 
        ? { ...platform, connected: !platform.connected, lastSync: platform.connected ? undefined : 'Just now' }
        : platform
    ));
  };

  const categories = [
    { id: 'all', label: 'All Platforms', icon: <Settings className="h-4 w-4" /> },
    { id: 'nutrition', label: 'Nutrition', icon: <Utensils className="h-4 w-4" /> },
    { id: 'mental-health', label: 'Mental Health', icon: <Brain className="h-4 w-4" /> },
    { id: 'fitness', label: 'Fitness', icon: <Dumbbell className="h-4 w-4" /> },
    { id: 'environment', label: 'Environment', icon: <Wind className="h-4 w-4" /> },
    { id: 'lab-work', label: 'Lab Work', icon: <Zap className="h-4 w-4" /> }
  ];

  return (
    <div className="space-y-6">
      {/* Enhanced Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Connections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search platforms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1">
                  {category.icon}
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedCategory} className="mt-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredPlatforms.map(platform => (
                  <Card key={platform.id} className={`relative overflow-hidden ${
                    platform.connected ? 'border-green-200 bg-green-50/30 dark:bg-green-950/10' : ''
                  }`}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {platform.icon}
                          <div>
                            <h3 className="font-medium flex items-center gap-2">
                              {platform.name}
                              {platform.premium && (
                                <Badge variant="secondary" className="text-xs">Premium</Badge>
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">{platform.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={platform.connected}
                          onCheckedChange={() => toggleConnection(platform.id)}
                        />
                      </div>

                      {platform.connected && (
                        <div className="space-y-2 mb-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Last sync:</span>
                            <span className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3 text-green-600" />
                              {platform.lastSync}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Data quality:</span>
                            <div className="flex items-center gap-2">
                              <Progress value={platform.dataQuality} className="w-16 h-2" />
                              <span>{platform.dataQuality}%</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Sync frequency:</span>
                            <Badge variant="outline" className="text-xs">
                              {platform.syncFrequency}
                            </Badge>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Data types:</p>
                        <div className="flex flex-wrap gap-1">
                          {platform.dataTypes.slice(0, 3).map(type => (
                            <Badge key={type} variant="outline" className="text-xs">
                              {type.replace('_', ' ')}
                            </Badge>
                          ))}
                          {platform.dataTypes.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{platform.dataTypes.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {platform.connected && (
                        <Button variant="outline" size="sm" className="w-full mt-3">
                          <Sync className="h-3 w-3 mr-1" />
                          Sync Now
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Lab Results Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-600" />
            Recent Lab Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentLabResults.map(result => (
              <div key={result.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{result.testName}</h4>
                  <p className="text-sm text-muted-foreground">
                    {result.lab} • {result.date}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{result.value} {result.unit}</span>
                    {result.status === 'normal' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className={`h-4 w-4 ${
                        result.status === 'critical' ? 'text-red-600' : 'text-yellow-600'
                      }`} />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Range: {result.referenceRange}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};