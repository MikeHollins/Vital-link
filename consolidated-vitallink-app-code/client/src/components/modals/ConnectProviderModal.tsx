import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SuccessAnimation } from "@/components/ui/success-animation";
import { 
  PlusCircle, 
  Activity, 
  Heart, 
  BarChart2, 
  Droplets, 
  Watch, 
  Smartphone, 
  Shield, 
  Search, 
  Moon, 
  Utensils, 
  LineChart, 
  Activity as ActivityIcon, 
  Dna, 
  CloudSun, 
  PillIcon,
  CalendarDays
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ConnectPlatformModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platformData: any) => void;
  isLoading: boolean;
  initialCategory?: string | null;
}

type Platform = {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  category: string;
};

export const ConnectProviderModal = ({
  isOpen,
  onClose,
  onConnect,
  isLoading,
  initialCategory
}: ConnectPlatformModalProps) => {

  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('popular');

  // Set initial tab based on category
  React.useEffec( => {
    if (initialCategory && isOpen) {
      // Map category names to tab values
      const categoryMapping: Record<string, string> = {
        'General Health': 'general_health',
        'Wearables': 'wearables',
        'Nutrition': 'nutrition',
        'Specialized': 'genomics', // Map specialized to genomics or create new tab
      };
      
      const mappedCategory = categoryMapping[initialCategory];
      if (mappedCategory) {
        setActiveTab(mappedCategory);
      }
    }
  }, [initialCategory, isOpen]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([]);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [connectedPlatformName, setConnectedPlatformName] = useState('');
  
  // Full list of health platforms organized by category
  const allPlatforms: Platform[] = [
    // General Health & Activity Platforms
    { 
      id: 'apple_healthkit', 
      name: 'Apple HealthKit', 
      icon: <Heart className="h-6 w-6 text-red-500" />,
      description: 'Connect to Apple HealthKit for comprehensive health data',
      category: 'General Health'
    },
    { 
      id: 'google_fit', 
      name: 'Google Fit', 
      icon: <Activity className="h-6 w-6 text-blue-500" />,
      description: 'Access your Google Fit workout and activity data',
      category: 'General Health'
    },
    { 
      id: 'samsung_health', 
      name: 'Samsung Health', 
      icon: <Smartphone className="h-6 w-6 text-indigo-500" />,
      description: 'Connect to Samsung Health on your Galaxy device',
      category: 'General Health'
    },
    { 
      id: 'withings_health', 
      name: 'Withings Health Mate', 
      icon: <Droplets className="h-6 w-6 text-purple-500" />,
      description: 'Connect your Withings smart scales, watches and devices',
      category: 'General Health'
    },
    { 
      id: 'huawei_health', 
      name: 'Huawei Health', 
      icon: <Smartphone className="h-6 w-6 text-red-500" />,
      description: 'Access health data from your Huawei device',
      category: 'General Health'
    },
    { 
      id: 'polar_flow', 
      name: 'Polar Flow', 
      icon: <ActivityIcon className="h-6 w-6 text-blue-600" />,
      description: 'Connect to Polar Flow for workout and recovery data',
      category: 'General Health'
    },
    
    // Wearables & Fitness Trackers
    { 
      id: 'fitbit', 
      name: 'Fitbit', 
      icon: <Activity className="h-6 w-6 text-teal-500" />,
      description: 'Sync your Fitbit activity, sleep, and heart data',
      category: 'Wearables'
    },
    { 
      id: 'garmin', 
      name: 'Garmin Connect', 
      icon: <Watch className="h-6 w-6 text-green-500" />,
      description: 'Import data from your Garmin wearable devices',
      category: 'Wearables'
    },
    { 
      id: 'oura', 
      name: 'Oura Ring', 
      icon: <Watch className="h-6 w-6 text-yellow-500" />,
      description: 'Import sleep and readiness scores from your Oura Ring',
      category: 'Wearables'
    },
    { 
      id: 'whoop', 
      name: 'WHOOP', 
      icon: <Activity className="h-6 w-6 text-red-500" />,
      description: 'Access your WHOOP recovery and strain metrics',
      category: 'Wearables'
    },
    { 
      id: 'amazfit', 
      name: 'Amazfit / Zepp', 
      icon: <Watch className="h-6 w-6 text-blue-400" />,
      description: 'Connect your Amazfit watch and Zepp app data',
      category: 'Wearables'
    },
    { 
      id: 'xiaomi', 
      name: 'Xiaomi Mi Fit / Zepp Life', 
      icon: <Watch className="h-6 w-6 text-orange-500" />,
      description: 'Import data from Xiaomi fitness devices',
      category: 'Wearables'
    },
    { 
      id: 'coros', 
      name: 'Coros', 
      icon: <Watch className="h-6 w-6 text-yellow-600" />,
      description: 'Connect with your Coros sports watch data',
      category: 'Wearables'
    },
    { 
      id: 'suunto', 
      name: 'Suunto', 
      icon: <Watch className="h-6 w-6 text-blue-700" />,
      description: 'Import data from your Suunto sports watches',
      category: 'Wearables'
    },
    
    // Sleep Trackers
    { 
      id: 'sleep_cycle', 
      name: 'Sleep Cycle', 
      icon: <Moon className="h-6 w-6 text-indigo-400" />,
      description: 'Track sleep patterns and quality with Sleep Cycle',
      category: 'Sleep'
    },
    { 
      id: 'pillow', 
      name: 'Pillow', 
      icon: <Moon className="h-6 w-6 text-purple-400" />,
      description: 'Connect Pillow app for advanced sleep analysis (iOS)',
      category: 'Sleep'
    },
    { 
      id: 'eight_sleep', 
      name: 'Eight Sleep', 
      icon: <Moon className="h-6 w-6 text-blue-500" />,
      description: 'Connect your Eight Sleep smart mattress data',
      category: 'Sleep'
    },
    { 
      id: 'dreem', 
      name: 'Dreem', 
      icon: <Moon className="h-6 w-6 text-cyan-500" />,
      description: 'Import EEG-based sleep data from Dreem headband',
      category: 'Sleep'
    },
    { 
      id: 'beddit', 
      name: 'Beddit', 
      icon: <Moon className="h-6 w-6 text-gray-500" />,
      description: 'Connect with Apple-acquired Beddit sleep monitor',
      category: 'Sleep'
    },
    
    // Blood Glucose & Diabetes Platforms
    { 
      id: 'dexcom', 
      name: 'Dexcom (G6, G7)', 
      icon: <BarChart2 className="h-6 w-6 text-blue-600" />,
      description: 'Connect your Dexcom continuous glucose monitor',
      category: 'Glucose'
    },
    { 
      id: 'freestyle_libre', 
      name: 'Freestyle Libre', 
      icon: <BarChart2 className="h-6 w-6 text-orange-500" />,
      description: 'Access data from Freestyle Libre glucose monitors',
      category: 'Glucose'
    },
    { 
      id: 'tandem', 
      name: 'Tandem t:connect', 
      icon: <BarChart2 className="h-6 w-6 text-blue-400" />,
      description: 'Connect with your Tandem insulin pump data',
      category: 'Glucose'
    },
    { 
      id: 'medtronic', 
      name: 'Medtronic CareLink', 
      icon: <BarChart2 className="h-6 w-6 text-blue-800" />,
      description: 'Import data from your Medtronic diabetes devices',
      category: 'Glucose'
    },
    { 
      id: 'one_drop', 
      name: 'One Drop', 
      icon: <Droplets className="h-6 w-6 text-red-600" />,
      description: 'Connect with One Drop diabetes management platform',
      category: 'Glucose'
    },
    { 
      id: 'mysugr', 
      name: 'MySugr', 
      icon: <BarChart2 className="h-6 w-6 text-green-500" />,
      description: 'Track glucose levels with MySugr app',
      category: 'Glucose'
    },
    { 
      id: 'glooko', 
      name: 'Glooko', 
      icon: <BarChart2 className="h-6 w-6 text-cyan-600" />,
      description: 'Centralize diabetes data with Glooko platform',
      category: 'Glucose'
    },
    { 
      id: 'contour', 
      name: 'Ascensia Contour', 
      icon: <BarChart2 className="h-6 w-6 text-amber-500" />,
      description: 'Connect Contour blood glucose meters',
      category: 'Glucose'
    },
    { 
      id: 'levels', 
      name: 'Levels Health', 
      icon: <BarChart2 className="h-6 w-6 text-purple-600" />,
      description: 'Import metabolic data from Levels Health CGM platform',
      category: 'Glucose'
    },
    
    // Blood Pressure & Cardiovascular Monitoring
    { 
      id: 'withings_bpm', 
      name: 'Withings BPM', 
      icon: <LineChart className="h-6 w-6 text-blue-600" />,
      description: 'Connect Withings blood pressure monitors',
      category: 'Cardiovascular'
    },
    { 
      id: 'qardio', 
      name: 'QardioArm', 
      icon: <LineChart className="h-6 w-6 text-red-500" />,
      description: 'Import data from QardioArm blood pressure monitor',
      category: 'Cardiovascular'
    },
    { 
      id: 'omron', 
      name: 'Omron Connect', 
      icon: <LineChart className="h-6 w-6 text-blue-800" />,
      description: 'Connect Omron blood pressure devices',
      category: 'Cardiovascular'
    },
    { 
      id: 'ihealth', 
      name: 'iHealth', 
      icon: <LineChart className="h-6 w-6 text-cyan-500" />,
      description: 'Import blood pressure data from iHealth devices',
      category: 'Cardiovascular'
    },
    { 
      id: 'kardia', 
      name: 'AliveCor Kardia', 
      icon: <LineChart className="h-6 w-6 text-purple-600" />,
      description: 'Connect Kardia ECG devices for heart monitoring',
      category: 'Cardiovascular'
    },
    
    // Nutrition & Food Tracking
    { 
      id: 'myfitnesspal', 
      name: 'MyFitnessPal', 
      icon: <Utensils className="h-6 w-6 text-blue-500" />,
      description: 'Import nutrition data from MyFitnessPal',
      category: 'Nutrition'
    },
    { 
      id: 'cronometer', 
      name: 'Cronometer', 
      icon: <Utensils className="h-6 w-6 text-green-600" />,
      description: 'Connect with detailed nutrition tracking from Cronometer',
      category: 'Nutrition'
    },
    { 
      id: 'loseit', 
      name: 'Lose It!', 
      icon: <Utensils className="h-6 w-6 text-orange-500" />,
      description: 'Import nutrition and diet data from Lose It app',
      category: 'Nutrition'
    },
    { 
      id: 'carb_manager', 
      name: 'Carb Manager', 
      icon: <Utensils className="h-6 w-6 text-green-500" />,
      description: 'Connect keto/low-carb nutrition tracking',
      category: 'Nutrition'
    },
    { 
      id: 'noom', 
      name: 'Noom', 
      icon: <Utensils className="h-6 w-6 text-amber-500" />,
      description: 'Import nutrition data from Noom weight loss app',
      category: 'Nutrition'
    },
    { 
      id: 'yazio', 
      name: 'Yazio', 
      icon: <Utensils className="h-6 w-6 text-yellow-600" />,
      description: 'Connect with Yazio nutrition tracking',
      category: 'Nutrition'
    },
    { 
      id: 'zero', 
      name: 'Zero (Fasting)', 
      icon: <Utensils className="h-6 w-6 text-indigo-500" />,
      description: 'Import intermittent fasting data from Zero app',
      category: 'Nutrition'
    },
    
    // Menstrual & Hormonal Health
    { 
      id: 'clue', 
      name: 'Clue', 
      icon: <CalendarDays className="h-6 w-6 text-pink-500" />,
      description: 'Connect cycle tracking data from Clue app',
      category: 'Hormonal Health'
    },
    { 
      id: 'flo', 
      name: 'Flo', 
      icon: <CalendarDays className="h-6 w-6 text-pink-600" />,
      description: 'Import menstrual cycle data from Flo app',
      category: 'Hormonal Health'
    },
    { 
      id: 'natural_cycles', 
      name: 'Natural Cycles', 
      icon: <CalendarDays className="h-6 w-6 text-teal-500" />,
      description: 'Connect with Natural Cycles fertility app',
      category: 'Hormonal Health'
    },
    { 
      id: 'kindara', 
      name: 'Kindara', 
      icon: <CalendarDays className="h-6 w-6 text-blue-400" />,
      description: 'Track fertility data from Kindara app',
      category: 'Hormonal Health'
    },
    { 
      id: 'ovia', 
      name: 'Ovia Health', 
      icon: <CalendarDays className="h-6 w-6 text-purple-500" />,
      description: 'Connect with Ovia cycle, fertility, and pregnancy app',
      category: 'Hormonal Health'
    },
    { 
      id: 'glow', 
      name: 'Glow', 
      icon: <CalendarDays className="h-6 w-6 text-pink-400" />,
      description: 'Import menstrual and fertility data from Glow',
      category: 'Hormonal Health'
    },
    
    // Medication & Supplement Tracking
    { 
      id: 'medisafe', 
      name: 'Medisafe', 
      icon: <PillIcon className="h-6 w-6 text-blue-500" />,
      description: 'Connect medication tracking from Medisafe app',
      category: 'Medication'
    },
    { 
      id: 'carezone', 
      name: 'CareZone', 
      icon: <PillIcon className="h-6 w-6 text-teal-600" />,
      description: 'Import medication data from CareZone',
      category: 'Medication'
    },
    { 
      id: 'mytherapy', 
      name: 'MyTherapy', 
      icon: <PillIcon className="h-6 w-6 text-green-500" />,
      description: 'Connect with MyTherapy medication reminder app',
      category: 'Medication'
    },
    { 
      id: 'pill_reminder', 
      name: 'Pill Reminder - Meds Alarm', 
      icon: <PillIcon className="h-6 w-6 text-red-500" />,
      description: 'Import data from Pill Reminder app',
      category: 'Medication'
    },
    { 
      id: 'zoe', 
      name: 'Zoe', 
      icon: <PillIcon className="h-6 w-6 text-purple-600" />,
      description: 'Connect personalized nutrition and supplement data',
      category: 'Medication'
    },
    
    // Genomics, Labs, & Biomarkers
    { 
      id: '23andme', 
      name: '23andMe', 
      icon: <Dna className="h-6 w-6 text-indigo-600" />,
      description: 'Import genetic data from 23andMe',
      category: 'Genomics'
    },
    { 
      id: 'ancestry', 
      name: 'AncestryDNA', 
      icon: <Dna className="h-6 w-6 text-green-600" />,
      description: 'Connect genetic information from AncestryDNA',
      category: 'Genomics'
    },
    { 
      id: 'helix', 
      name: 'Helix', 
      icon: <Dna className="h-6 w-6 text-blue-600" />,
      description: 'Import genomic data from Helix',
      category: 'Genomics'
    },
    { 
      id: 'everlywell', 
      name: 'Everlywell', 
      icon: <Dna className="h-6 w-6 text-teal-500" />,
      description: 'Connect at-home lab tests from Everlywell',
      category: 'Genomics'
    },
    { 
      id: 'thorne', 
      name: 'Thorne', 
      icon: <Dna className="h-6 w-6 text-gray-600" />,
      description: 'Import biomarker test results from Thorne',
      category: 'Genomics'
    },
    { 
      id: 'insidetracker', 
      name: 'InsideTracker', 
      icon: <Dna className="h-6 w-6 text-orange-500" />,
      description: 'Connect blood biomarker data from InsideTracker',
      category: 'Genomics'
    },
    { 
      id: 'labcorp', 
      name: 'Labcorp', 
      icon: <Dna className="h-6 w-6 text-blue-800" />,
      description: 'Import lab test results from Labcorp portal',
      category: 'Genomics'
    },
    { 
      id: 'quest', 
      name: 'Quest Diagnostics', 
      icon: <Dna className="h-6 w-6 text-green-700" />,
      description: 'Connect lab tests from Quest Diagnostics portal',
      category: 'Genomics'
    },
    { 
      id: 'circle_dna', 
      name: 'Circle DNA', 
      icon: <Dna className="h-6 w-6 text-purple-500" />,
      description: 'Import genetic data from Circle DNA tests',
      category: 'Genomics'
    },
    
    // Environmental Data
    { 
      id: 'airvisual', 
      name: 'AirVisual / IQAir', 
      icon: <CloudSun className="h-6 w-6 text-blue-400" />,
      description: 'Connect air quality data from AirVisual/IQAir',
      category: 'Environmental'
    },
    { 
      id: 'allergycast', 
      name: 'Allergycast / Pollen.com', 
      icon: <CloudSun className="h-6 w-6 text-green-500" />,
      description: 'Import pollen and allergy data',
      category: 'Environmental'
    },
    { 
      id: 'accuweather', 
      name: 'AccuWeather', 
      icon: <CloudSun className="h-6 w-6 text-amber-500" />,
      description: 'Connect local weather data to contextualize symptoms',
      category: 'Environmental'
    },
  ];

  // Most popular platforms for featured display
  const popularPlatforms = allPlatforms.filter(p => 
    ['apple_healthkit', 'google_fit', 'fitbit', 'samsung_health', 'withings_health', 'oura'].includes(p.id)
  );
  
  // Platform categories for organization
  const categories = [
    'General Health',
    'Wearables',
    'Sleep',
    'Glucose',
    'Cardiovascular',
    'Nutrition',
    'Hormonal Health',
    'Medication',
    'Genomics',
    'Environmental'
  ];
  
  // Filter platforms based on search and active tab
  useEffec( => {
    if (searchTerm) {
      // Search across all platforms
      const results = allPlatforms.filter(platform => 
        platform.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        platform.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPlatforms(results);
    } else if (activeTab === 'popular') {
      setFilteredPlatforms(popularPlatforms);
    } else if (activeTab === 'all') {
      setFilteredPlatforms(allPlatforms);
    } else {
      // Category tab
      setFilteredPlatforms(allPlatforms.filter(p => p.category === activeTab));
    }
  }, [searchTerm, activeTab]);

  const handleConnect = () => {
    if (!selectedPlatform) return;
    
    const platform = allPlatforms.find(option => option.id === selectedPlatform);
    
    if (platform) {
      onConnect({
        type: platform.id,
        name: platform.name,
        status: 'connected',
        lastSynced: new Date().toISOString(),
        permissions: {
          steps: true,
          heart_rate: true,
          sleep: true,
          activity: true,
          workout: true,
          nutrition: platform.category === 'Nutrition',
          glucose: platform.category === 'Glucose',
          weight: true,
          blood_pressure: platform.category === 'Cardiovascular'
        }
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[96vw] max-w-5xl h-[85vh] max-h-[85vh] overflow-hidden p-3 sm:p-4">
        <DialogHeader className="pb-2 sm:pb-3">
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg font-semibold">
            <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-teal-600" />
            Connect to Health Platform
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight">
            VitalLink connects to platforms that already collect your health data, allowing unified access to all your metrics in one secure place.
          </DialogDescription>
        </DialogHeader>

        {/* Search input */}
        <div className="relative mb-3">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
          <Input
            placeholder="Search platforms by name or category..."
            className="pl-8 sm:pl-10 h-8 sm:h-9 text-sm bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-teal-400 transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          <div className="overflow-x-auto mb-2 sm:mb-3">
            <TabsList className="flex w-max min-w-full sm:grid sm:w-full sm:grid-cols-5 lg:grid-cols-9 bg-gray-100 dark:bg-gray-800 p-0.5 rounded-md h-8 sm:h-9">
              <TabsTrigger value="popular" className="text-xs px-2 py-1 whitespace-nowrap transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">Popular</TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2 py-1 whitespace-nowrap transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">All</TabsTrigger>
              {categories.map(category => (
                <TabsTrigger 
                  key={category} 
                  value={category} 
                  className="text-xs px-2 py-1 whitespace-nowrap transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            {searchTerm && (
              <p className="text-xs text-muted-foreground mb-2">
                {filteredPlatforms.length} results for "{searchTerm}"
              </p>
            )}
            
            {filteredPlatforms.length > 0 ? (
              <div className="flex-1 space-y-2 overflow-y-auto pr-1 smooth-scroll">
                {filteredPlatforms.map((platform, index) => (
                  <div
                    key={platform.id}
                    className={`p-2.5 sm:p-3 border transition-all duration-300 ease-out cursor-pointer transform-gpu ${
                      selectedPlatform === platform.id 
                        ? 'border-teal-400 border-2 bg-teal-50 dark:bg-teal-950 shadow-md scale-[1.02] ring-1 ring-teal-200 dark:ring-teal-800' 
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-400 hover:shadow-sm hover:scale-[1.01]'
                    } rounded-lg`}
                    style={{
                      animationDelay: `${index * 30}ms`,
                      animation: 'fadeInUp 0.3s ease-out forwards'
                    }}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-2.5 sm:mr-3 flex-shrink-0 transition-transform duration-200">
                        {platform.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm sm:text-base truncate">{platform.name}</h4>
                          <span className="px-1.5 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded text-gray-600 dark:text-gray-400 hidden sm:inline">
                            {platform.category}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 line-clamp-1">{platform.description}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0">
                        {selectedPlatform === platform.id && (
                          <div className="h-5 w-5 sm:h-6 sm:w-6 rounded-full bg-teal-500 text-white flex items-center justify-center transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3 sm:w-4 sm:h-4">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center text-muted-foreground">
                <div>
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    {searchTerm ? `No platforms match "${searchTerm}"` : "No platforms in this category"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Tabs>
        
        <div className="mt-2 flex items-center text-xs text-muted-foreground border-t border-gray-100 dark:border-gray-700 pt-2">
          <Shield className="h-3 w-3 mr-1.5 flex-shrink-0" />
          <span>OAuth secure access</span>
        </div>

        <DialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto h-9 text-sm transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConnect}
            disabled={!selectedPlatform || isLoading}
            className={`w-full sm:w-auto h-9 text-sm transition-all duration-300 transform ${selectedPlatform ? 'bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 shadow-lg hover:shadow-xl hover:scale-105' : 'opacity-50 cursor-not-allowed'}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Connecting
              </div>
            ) : (
              "Connect Platform"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
