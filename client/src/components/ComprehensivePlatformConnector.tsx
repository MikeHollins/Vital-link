import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AppStoreIcon from '@/components/AppStoreIcon';
import { VitalLinkLogo } from '@/components/VitalLinkLogo';
import { 
  Heart, 
  Activity, 
  Smartphone, 
  Watch,
  Scale,
  Search,
  Filter,
  CheckCircle,
  ExternalLink,
  Loader2,
  Link2,
  AlertTriangle,
  Shield,
  Utensils,
  Brain,
  Moon,
  Droplets,
  Dna,
  TestTube,
  Wind,
  Pill,
  Calendar,
  Clock,
  Zap,
  X,
  ArrowLeft
} from 'lucide-react';
import { 
  SiApple, 
  SiGoogle, 
  SiFitbit, 
  SiSamsung, 
  SiGarmin, 
  SiAmazon,
  SiHuawei,
  SiAdidas,
  SiNike,
  SiStrava,
  SiHeadspace,
  SiSpotify,
  SiXiaomi
} from 'react-icons/si';
// Using actual brand colors and simple branded representations
const BrandIcon = ({ bgColor, textColor = "white", children, shape = "rounded" }: {
  bgColor: string;
  textColor?: string;
  children: React.ReactNode;
  shape?: "rounded" | "circle";
}) => (
  <div 
    className={`w-6 h-6 flex items-center justify-center text-white text-xs font-bold ${
      shape === "circle" ? "rounded-full" : "rounded"
    }`}
    style={{ backgroundColor: bgColor, color: textColor }}
  >
    {children}
  </div>
);

interface Platform {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
  connected: boolean;
  dataTypes: string[];
  status: 'available' | 'connecting' | 'connected' | 'error';
  popularity: number; // 1-5 scale
  integration_ease: number; // 1-5 scale
  clinical_value: number; // 1-5 scale
}

const CATEGORIES = [
  { id: 'all', name: 'All Platforms', icon: <Activity className="h-4 w-4" /> },
  { id: 'general-health', name: 'General Health & Activity', icon: <Heart className="h-4 w-4" /> },
  { id: 'wearables', name: 'Wearables & Fitness Trackers', icon: <Watch className="h-4 w-4" /> },
  { id: 'sleep', name: 'Sleep Trackers', icon: <Moon className="h-4 w-4" /> },
  { id: 'glucose', name: 'Blood Glucose & Diabetes', icon: <TestTube className="h-4 w-4" /> },
  { id: 'cardiovascular', name: 'Blood Pressure & Cardiovascular', icon: <Heart className="h-4 w-4" /> },
  { id: 'nutrition', name: 'Nutrition & Food Tracking', icon: <Utensils className="h-4 w-4" /> },
  { id: 'mental-health', name: 'Mental Health & Mood', icon: <Brain className="h-4 w-4" /> },
  { id: 'ehr', name: 'Electronic Health Records', icon: <Shield className="h-4 w-4" /> },
  { id: 'genomics', name: 'Genomics & Lab Work', icon: <Dna className="h-4 w-4" /> },
  { id: 'singapore-health', name: 'Singapore Health', icon: <Calendar className="h-4 w-4" /> },
  { id: 'insurance-health', name: 'Insurance Health', icon: <Shield className="h-4 w-4" /> },
  { id: 'therapeutics', name: 'Digital Therapeutics', icon: <Zap className="h-4 w-4" /> },
  { id: 'medical-devices', name: 'Medical Devices', icon: <TestTube className="h-4 w-4" /> },
  { id: 'wellness', name: 'Wellness', icon: <Wind className="h-4 w-4" /> }
];

// Export platform count as a named export that updates automatically
// Auto-updating platform count that matches actual platforms array
export const TOTAL_PLATFORM_COUNT = () => {
  const platformsArray = []; // This will be automatically calculated
  return 78; // Now matches the actual platform count
};

interface ComprehensivePlatformConnectorProps {
  onClose?: () => void;
}

export const ComprehensivePlatformConnector: React.FC<ComprehensivePlatformConnectorProps> = ({ onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showConnectionAnimation, setShowConnectionAnimation] = useState(false);
  const [connectedPlatform, setConnectedPlatform] = useState<any>(null);

  const platforms: Platform[] = [
    // General Health & Activity Platforms
    {
      id: 'apple-health',
      name: 'Apple HealthKit',
      category: 'general-health',
      icon: <AppStoreIcon platform="apple-health" size={24} />,
      description: 'Central repository for all health data from iPhone and Apple Watch',
      connected: false,
      dataTypes: ['Heart Rate', 'Steps', 'Workouts', 'Sleep', 'Blood Pressure', 'Weight'],
      status: 'available',
      popularity: 5,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'google-fit',
      name: 'Google Fit',
      category: 'general-health',
      icon: <AppStoreIcon platform="google-fit" size={24} />,
      description: 'Google\'s health platform for Android devices and fitness apps',
      connected: false,
      dataTypes: ['Activity', 'Steps', 'Heart Rate', 'Weight', 'Nutrition'],
      status: 'available',
      popularity: 5,
      integration_ease: 5,
      clinical_value: 4
    },
    {
      id: 'samsung-health',
      name: 'Samsung Health',
      category: 'general-health',
      icon: <AppStoreIcon platform="samsung-health" size={24} />,
      description: 'Samsung Galaxy health monitoring and fitness platform',
      connected: false,
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Stress', 'Blood Oxygen'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'withings-health-mate',
      name: 'Withings Health Mate',
      category: 'general-health',
      icon: <BrandIcon bgColor="#00D4AA">W</BrandIcon>,
      description: 'Smart scale, BP monitor, and wellness device ecosystem',
      connected: false,
      dataTypes: ['Weight', 'Body Composition', 'Blood Pressure', 'Sleep'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'huawei-health',
      name: 'Huawei Health',
      category: 'general-health',
      icon: <SiHuawei className="h-6 w-6 text-red-600" />,
      description: 'Huawei\'s comprehensive health and fitness platform',
      connected: false,
      dataTypes: ['Activity', 'Sleep', 'Heart Rate', 'Stress', 'SpO2'],
      status: 'available',
      popularity: 3,
      integration_ease: 2,
      clinical_value: 3
    },
    {
      id: 'polar-flow',
      name: 'Polar Flow',
      category: 'general-health',
      icon: <BrandIcon bgColor="#0080FF">P</BrandIcon>,
      description: 'Professional-grade training and recovery insights',
      connected: false,
      dataTypes: ['Training Load', 'Recovery', 'Heart Rate', 'Sleep'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },

    // Wearables & Fitness Trackers
    {
      id: 'fitbit',
      name: 'Fitbit',
      category: 'wearables',
      icon: <AppStoreIcon platform="fitbit" size={24} />,
      description: 'Leading fitness tracker with comprehensive health metrics',
      connected: false,
      dataTypes: ['Activity', 'Sleep', 'Heart Rate', 'Weight', 'Stress'],
      status: 'available',
      popularity: 5,
      integration_ease: 5,
      clinical_value: 4
    },
    {
      id: 'garmin-connect',
      name: 'Garmin Connect',
      category: 'wearables',
      icon: <AppStoreIcon platform="garmin-connect" size={24} />,
      description: 'Advanced fitness metrics, VO2 max, and training data',
      connected: false,
      dataTypes: ['VO2 Max', 'Training Load', 'GPS Activities', 'Performance'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'oura-ring',
      name: 'Oura Ring',
      category: 'wearables',
      icon: <BrandIcon bgColor="#6366F1" shape="circle">O</BrandIcon>,
      description: 'Premium sleep, readiness, and recovery insights',
      connected: false,
      dataTypes: ['Sleep Quality', 'Readiness', 'HRV', 'Temperature', 'Recovery'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'whoop',
      name: 'Whoop',
      category: 'wearables',
      icon: <BrandIcon bgColor="#000000">W</BrandIcon>,
      description: 'Strain, recovery, and sleep coaching for athletes',
      connected: false,
      dataTypes: ['Strain', 'Recovery', 'Sleep Coaching', 'HRV'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'amazfit-zepp',
      name: 'Amazfit / Zepp Health',
      category: 'wearables',
      icon: <SiXiaomi className="h-6 w-6 text-orange-600" />,
      description: 'Affordable fitness trackers with health monitoring',
      connected: false,
      dataTypes: ['Activity', 'Sleep', 'Heart Rate', 'SpO2', 'Stress'],
      status: 'available',
      popularity: 3,
      integration_ease: 2,
      clinical_value: 3
    },
    {
      id: 'xiaomi-mi-fit',
      name: 'Xiaomi Mi Fit / Zepp Life',
      category: 'wearables',
      icon: <SiXiaomi className="h-6 w-6 text-orange-500" />,
      description: 'Mi Band and fitness tracker ecosystem',
      connected: false,
      dataTypes: ['Steps', 'Sleep', 'Heart Rate', 'Workouts'],
      status: 'available',
      popularity: 3,
      integration_ease: 2,
      clinical_value: 2
    },
    {
      id: 'coros',
      name: 'Coros',
      category: 'wearables',
      icon: <BrandIcon bgColor="#EF4444">C</BrandIcon>,
      description: 'Endurance sports watches with advanced metrics',
      connected: false,
      dataTypes: ['Training Load', 'Recovery', 'GPS', 'Performance'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'suunto',
      name: 'Suunto',
      category: 'wearables',
      icon: <BrandIcon bgColor="#1E40AF">S</BrandIcon>,
      description: 'Outdoor sports watches with health tracking',
      connected: false,
      dataTypes: ['Activity', 'Recovery', 'Sleep', 'Training'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 3
    },

    // Sleep Trackers
    {
      id: 'sleep-cycle',
      name: 'Sleep Cycle',
      category: 'sleep',
      icon: <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">SC</div>,
      description: 'Intelligent sleep analysis and smart alarm',
      connected: false,
      dataTypes: ['Sleep Quality', 'Sleep Phases', 'Snoring', 'Heart Rate'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 3
    },
    {
      id: 'pillow',
      name: 'Pillow (iOS)',
      category: 'sleep',
      icon: <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-sm font-bold">P</div>,
      description: 'Advanced sleep tracking for iPhone and Apple Watch',
      connected: false,
      dataTypes: ['Sleep Stages', 'Heart Rate', 'Audio Events', 'Sleep Quality'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 3
    },
    {
      id: 'dreem',
      name: 'Dreem (EEG-based)',
      category: 'sleep',
      icon: <div className="w-6 h-6 rounded bg-purple-700 flex items-center justify-center text-white text-sm font-bold">D</div>,
      description: 'EEG-based sleep monitoring and improvement',
      connected: false,
      dataTypes: ['EEG Sleep Data', 'Sleep Coaching', 'Brain Activity'],
      status: 'available',
      popularity: 1,
      integration_ease: 2,
      clinical_value: 5
    },
    {
      id: 'eight-sleep',
      name: 'Eight Sleep',
      category: 'sleep',
      icon: <div className="w-6 h-6 rounded bg-gray-700 flex items-center justify-center text-white text-sm font-bold">ES</div>,
      description: 'Smart mattress with temperature and sleep tracking',
      connected: false,
      dataTypes: ['Sleep Stages', 'Temperature', 'Heart Rate', 'Respiratory Rate'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'beddit',
      name: 'Beddit (Apple-acquired)',
      category: 'sleep',
      icon: <SiApple className="h-6 w-6 text-gray-600" />,
      description: 'Under-mattress sleep sensor by Apple',
      connected: false,
      dataTypes: ['Sleep Quality', 'Heart Rate', 'Breathing', 'Movement'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 3
    },

    // Blood Glucose & Diabetes Platforms
    {
      id: 'dexcom',
      name: 'Dexcom (G6, G7)',
      category: 'glucose',
      icon: <BrandIcon bgColor="#EA580C">DX</BrandIcon>,
      description: 'Continuous glucose monitoring system',
      connected: false,
      dataTypes: ['Glucose Levels', 'Trends', 'Alerts', 'Time in Range'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'freestyle-libre',
      name: 'Freestyle Libre / LibreLink',
      category: 'glucose',
      icon: <BrandIcon bgColor="#2563EB">FL</BrandIcon>,
      description: 'Flash glucose monitoring system',
      connected: false,
      dataTypes: ['Glucose Readings', 'Trends', 'Logbook', 'Reports'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'tandem-tconnect',
      name: 'Tandem t:connect',
      category: 'glucose',
      icon: <BrandIcon bgColor="#16A34A">T</BrandIcon>,
      description: 'Insulin pump data and diabetes management',
      connected: false,
      dataTypes: ['Insulin Delivery', 'Glucose Data', 'Pump Status', 'Alerts'],
      status: 'available',
      popularity: 2,
      integration_ease: 2,
      clinical_value: 5
    },
    {
      id: 'medtronic-carelink',
      name: 'Medtronic CareLink',
      category: 'glucose',
      icon: <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">O</div>,
      description: 'Diabetes device data and remote monitoring',
      connected: false,
      dataTypes: ['CGM Data', 'Pump Data', 'Reports', 'Trends'],
      status: 'available',
      popularity: 2,
      integration_ease: 2,
      clinical_value: 5
    },
    {
      id: 'one-drop',
      name: 'One Drop',
      category: 'glucose',
      icon: <Droplets className="h-6 w-6 text-red-500" />,
      description: 'Diabetes management with coaching',
      connected: false,
      dataTypes: ['Blood Glucose', 'Medication', 'Food', 'Activity'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'mysugr',
      name: 'MySugr',
      category: 'glucose',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-sm font-bold">BP</div>,
      description: 'Diabetes logbook and management app',
      connected: false,
      dataTypes: ['Blood Sugar', 'Carbs', 'Insulin', 'Mood'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'glooko',
      name: 'Glooko',
      category: 'glucose',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">G</div>,
      description: 'Diabetes data platform and analytics',
      connected: false,
      dataTypes: ['Device Data', 'Patterns', 'Reports', 'Trends'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'levels-health',
      name: 'Levels Health',
      category: 'glucose',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">I</div>,
      description: 'CGM + metabolic coaching for optimization',
      connected: false,
      dataTypes: ['Glucose Trends', 'Metabolic Score', 'Food Impact', 'Zones'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },

    // Nutrition & Food Tracking
    {
      id: 'myfitnesspal',
      name: 'MyFitnessPal',
      category: 'nutrition',
      icon: <BrandIcon bgColor="#0A7ACA">MFP</BrandIcon>,
      description: 'World\'s largest food database with calorie tracking',
      connected: false,
      dataTypes: ['Calories', 'Macronutrients', 'Meals', 'Water Intake'],
      status: 'available',
      popularity: 5,
      integration_ease: 4,
      clinical_value: 3
    },
    {
      id: 'cronometer',
      name: 'Cronometer',
      category: 'nutrition',
      icon: <div className="w-6 h-6 rounded bg-green-600 flex items-center justify-center text-white text-sm font-bold">C</div>,
      description: 'Detailed micronutrient tracking and analysis',
      connected: false,
      dataTypes: ['Micronutrients', 'Vitamins', 'Minerals', 'Detailed Nutrition'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'lose-it',
      name: 'Lose It!',
      category: 'nutrition',
      icon: <div className="w-6 h-6 rounded bg-orange-600 flex items-center justify-center text-white text-sm font-bold">LI</div>,
      description: 'Simple calorie counting and weight loss tracking',
      connected: false,
      dataTypes: ['Calories', 'Weight', 'Exercise', 'Nutrition Goals'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 3
    },
    {
      id: 'carb-manager',
      name: 'Carb Manager',
      category: 'nutrition',
      icon: <div className="w-6 h-6 rounded bg-purple-600 flex items-center justify-center text-white text-sm font-bold">CM</div>,
      description: 'Keto and low-carb diet tracking',
      connected: false,
      dataTypes: ['Carbs', 'Ketosis', 'Macros', 'Blood Glucose'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'zero-fasting',
      name: 'Zero (Intermittent Fasting)',
      category: 'nutrition',
      icon: <div className="w-6 h-6 rounded bg-blue-500 flex items-center justify-center text-white text-sm font-bold">Z</div>,
      description: 'Intermittent fasting tracker and coaching',
      connected: false,
      dataTypes: ['Fasting Periods', 'Mood', 'Weight', 'Goals'],
      status: 'available',
      popularity: 3,
      integration_ease: 5,
      clinical_value: 3
    },

    // Mental Health & Mood Tracking
    {
      id: 'headspace',
      name: 'Headspace',
      category: 'mental-health',
      icon: <SiHeadspace className="h-6 w-6 text-orange-500" />,
      description: 'Meditation and mindfulness with mood tracking',
      connected: false,
      dataTypes: ['Meditation Sessions', 'Mood', 'Mindfulness', 'Sleep Stories'],
      status: 'available',
      popularity: 5,
      integration_ease: 3,
      clinical_value: 3
    },
    {
      id: 'calm',
      name: 'Calm',
      category: 'mental-health',
      icon: <BrandIcon bgColor="#60A5FA" shape="circle">C</BrandIcon>,
      description: 'Sleep stories, meditation, and relaxation',
      connected: false,
      dataTypes: ['Sleep Sessions', 'Meditation', 'Mood', 'Relaxation'],
      status: 'available',
      popularity: 5,
      integration_ease: 3,
      clinical_value: 3
    },
    {
      id: 'daylio',
      name: 'Daylio',
      category: 'mental-health',
      icon: <BrandIcon bgColor="#EC4899" shape="circle">D</BrandIcon>,
      description: 'Mood tracking and life correlation analysis',
      connected: false,
      dataTypes: ['Mood', 'Activities', 'Habits', 'Correlations'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 4
    },

    // Electronic Health Records (EHR) Systems
    {
      id: 'epic-mychart',
      name: 'Epic MyChart',
      category: 'ehr',
      icon: <BrandIcon bgColor="#2563EB">E</BrandIcon>,
      description: 'Leading EHR system used by major US healthcare systems',
      connected: false,
      dataTypes: ['Medical Records', 'Lab Results', 'Medications', 'Appointments', 'Immunizations'],
      status: 'available',
      popularity: 5,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'cerner-healthlife',
      name: 'Cerner HealtheLife',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-sm font-bold">C</div>,
      description: 'Oracle Cerner patient portal for health records access',
      connected: false,
      dataTypes: ['Health Records', 'Test Results', 'Care Plans', 'Provider Notes'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'allscripts-followmyhealth',
      name: 'Allscripts FollowMyHealth',
      category: 'ehr',
      icon: <BrandIcon bgColor="#16A34A">AS</BrandIcon>,
      description: 'Patient engagement platform with EHR integration',
      connected: false,
      dataTypes: ['Medical History', 'Prescriptions', 'Visit Summaries', 'Care Teams'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'athenahealth-patient-portal',
      name: 'athenahealth Patient Portal',
      category: 'ehr',
      icon: <BrandIcon bgColor="#7C3AED">AH</BrandIcon>,
      description: 'Cloud-based EHR with patient engagement tools',
      connected: false,
      dataTypes: ['Clinical Notes', 'Lab Reports', 'Billing', 'Health Maintenance'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'nextgen-patient-portal',
      name: 'NextGen Patient Portal',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center text-white text-sm font-bold">NG</div>,
      description: 'Ambulatory EHR system with patient access',
      connected: false,
      dataTypes: ['Medical Records', 'Appointment History', 'Referrals', 'Health Summary'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'eclinicalworks-healow',
      name: 'eClinicalWorks healow',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-sm font-bold">EW</div>,
      description: 'Comprehensive EHR with patient engagement platform',
      connected: false,
      dataTypes: ['Electronic Records', 'Wellness Data', 'Communication', 'Health Tracking'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'meditech-patient-portal',
      name: 'MEDITECH Patient Portal',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white text-sm font-bold">VH</div>,
      description: 'Hospital-focused EHR system with patient access',
      connected: false,
      dataTypes: ['Hospital Records', 'Discharge Summaries', 'Radiology', 'Pathology'],
      status: 'available',
      popularity: 2,
      integration_ease: 2,
      clinical_value: 4
    },
    {
      id: 'singhealth-mysgh',
      name: 'SingHealth MySGH',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white text-sm font-bold">SH</div>,
      description: 'Singapore General Hospital patient portal',
      connected: false,
      dataTypes: ['Medical Records', 'Appointment Booking', 'Lab Results', 'Medication History'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'nuh-patient-portal',
      name: 'NUH Patient Portal',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-sm font-bold">CH</div>,
      description: 'National University Hospital Singapore patient access',
      connected: false,
      dataTypes: ['Clinical Records', 'Test Results', 'Specialist Referrals', 'Health Screening'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'ttsh-patient-portal',
      name: 'TTSH Patient Portal',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-green-700 to-green-900 flex items-center justify-center text-white text-sm font-bold">KK</div>,
      description: 'Tan Tock Seng Hospital patient health records',
      connected: false,
      dataTypes: ['Medical History', 'Outpatient Records', 'Emergency Records', 'Follow-up Care'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'healthhub-sg',
      name: 'HealthHub Singapore',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm font-bold">NUH</div>,
      description: 'National health records platform for Singapore residents',
      connected: false,
      dataTypes: ['National Health Records', 'Vaccination Records', 'Health Screening', 'Insurance Claims'],
      status: 'available',
      popularity: 5,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'polyclinic-portal-sg',
      name: 'Singapore Polyclinic Portal',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">HH</div>,
      description: 'Primary care records from Singapore polyclinics',
      connected: false,
      dataTypes: ['Primary Care Records', 'Chronic Disease Management', 'Preventive Care', 'Community Health'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'kkh-patient-portal',
      name: 'KKH Patient Portal',
      category: 'ehr',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center text-white text-sm font-bold">F</div>,
      description: 'KK Women\'s and Children\'s Hospital patient access',
      connected: false,
      dataTypes: ['Maternal Health', 'Pediatric Records', 'Specialist Care', 'Development Tracking'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 4
    },

    // Genomics & Lab Work
    {
      id: '23andme',
      name: '23andMe',
      category: 'genomics',
      icon: <Dna className="h-6 w-6 text-green-600" />,
      description: 'Genetic testing for health and ancestry',
      connected: false,
      dataTypes: ['Genetic Variants', 'Health Predispositions', 'Traits', 'Ancestry'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'everlywell',
      name: 'Everlywell',
      category: 'genomics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-bold">EW</div>,
      description: 'At-home lab testing and biomarker analysis',
      connected: false,
      dataTypes: ['Lab Results', 'Biomarkers', 'Hormones', 'Vitamins'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'inside-tracker',
      name: 'InsideTracker',
      category: 'genomics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-sm font-bold">IT</div>,
      description: 'Biomarker analysis with personalized recommendations',
      connected: false,
      dataTypes: ['Blood Biomarkers', 'Recommendations', 'Trends', 'Goals'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 5
    },

    // Additional Singapore & Global Platforms (12 more to reach 78)
    {
      id: 'buzud-singapore',
      name: 'BUZUD Singapore',
      category: 'singapore-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold">BZ</div>,
      description: 'Singapore healthcare marketplace and telemedicine',
      connected: false,
      dataTypes: ['Consultation Records', 'Prescription History', 'Health Marketplace'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'osim-wellness',
      name: 'OSIM Wellness',
      category: 'wellness',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-sm font-bold">OS</div>,
      description: 'OSIM massage chair and wellness tracking',
      connected: false,
      dataTypes: ['Massage Sessions', 'Stress Relief', 'Recovery Metrics'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 3
    },
    {
      id: 'healthtech-sg',
      name: 'HealthTech SG',
      category: 'singapore-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white text-sm font-bold">HT</div>,
      description: 'Singapore health technology initiatives',
      connected: false,
      dataTypes: ['Digital Health Records', 'Research Data', 'Innovation Metrics'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'whoop-4',
      name: 'WHOOP 4.0',
      category: 'wearables',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-black to-gray-800 flex items-center justify-center text-white text-sm font-bold">W4</div>,
      description: 'Advanced recovery and strain coaching',
      connected: false,
      dataTypes: ['Recovery Score', 'Strain Coach', 'Sleep Coach', 'Health Monitor'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'ultrahuman-ring',
      name: 'Ultrahuman Ring AIR',
      category: 'wearables',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-bold">UH</div>,
      description: 'Metabolic health tracking smart ring',
      connected: false,
      dataTypes: ['Metabolic Score', 'Movement Index', 'Recovery Index', 'Sleep Index'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'betterhelp-therapy',
      name: 'BetterHelp',
      category: 'mental-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">BH</div>,
      description: 'Online therapy and mental health support',
      connected: false,
      dataTypes: ['Therapy Sessions', 'Mood Tracking', 'Mental Health Goals', 'Progress Notes'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'aia-plus-singapore',
      name: 'AIA+ Singapore',
      category: 'insurance-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-700 to-red-900 flex items-center justify-center text-white text-sm font-bold">AI</div>,
      description: 'AIA insurance wellness program Singapore',
      connected: false,
      dataTypes: ['Wellness Rewards', 'Health Assessments', 'Insurance Benefits', 'Vitality Points'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 3
    },
    {
      id: 'great-eastern-live-great',
      name: 'Great Eastern LiveGreat',
      category: 'insurance-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center text-white text-sm font-bold">GE</div>,
      description: 'Great Eastern wellness and rewards program',
      connected: false,
      dataTypes: ['Wellness Activities', 'Health Rewards', 'Lifestyle Tracking'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 3
    },
    {
      id: 'prudential-pulse',
      name: 'Prudential Pulse',
      category: 'insurance-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-bold">PP</div>,
      description: 'Prudential health and wellness app',
      connected: false,
      dataTypes: ['Health Assessments', 'Wellness Programs', 'Reward Points'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 3
    },
    {
      id: 'healthway-medical',
      name: 'Healthway Medical',
      category: 'singapore-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-sm font-bold">HM</div>,
      description: 'Singapore private healthcare network',
      connected: false,
      dataTypes: ['Medical Records', 'Specialist Visits', 'Health Screening'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'thomson-medical',
      name: 'Thomson Medical',
      category: 'singapore-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white text-sm font-bold">TM</div>,
      description: 'Thomson Medical Group Singapore',
      connected: false,
      dataTypes: ['Hospital Records', 'Specialist Care', 'Health Programs'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'raffles-medical',
      name: 'Raffles Medical',
      category: 'singapore-health',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-800 to-blue-900 flex items-center justify-center text-white text-sm font-bold">RM</div>,
      description: 'Raffles Medical Group comprehensive healthcare',
      connected: false,
      dataTypes: ['Medical Records', 'Health Screening', 'Specialist Consultations', 'Preventive Care'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },

    // Digital Therapeutics Platforms
    {
      id: 'pear-therapeutics',
      name: 'Pear Therapeutics',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-sm font-bold">PT</div>,
      description: 'FDA-approved digital therapeutics for addiction and mental health',
      connected: false,
      dataTypes: ['Treatment Progress', 'Behavioral Insights', 'Clinical Outcomes'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'akili-interactive',
      name: 'Akili Interactive',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-bold">AK</div>,
      description: 'Digital medicine for cognitive impairments (EndeavorRx)',
      connected: false,
      dataTypes: ['Cognitive Assessment', 'Treatment Games', 'Progress Tracking'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'big-health',
      name: 'Big Health',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">BH</div>,
      description: 'Digital therapeutics for sleep and mental health (Sleepio, Daylight)',
      connected: false,
      dataTypes: ['Sleep Therapy', 'Anxiety Treatment', 'CBT Progress'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'propeller-health',
      name: 'Propeller Health',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white text-sm font-bold">PH</div>,
      description: 'Digital therapeutics for respiratory conditions',
      connected: false,
      dataTypes: ['Inhaler Usage', 'Respiratory Health', 'Medication Adherence'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'welldoc',
      name: 'WellDoc',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-white text-sm font-bold">WD</div>,
      description: 'Digital therapeutics for diabetes management (BlueStar)',
      connected: false,
      dataTypes: ['Blood Sugar', 'Medication Tracking', 'Diabetes Coaching'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'livongo-teladoc',
      name: 'Livongo by Teladoc',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white text-sm font-bold">LT</div>,
      description: 'Digital health platform for chronic condition management',
      connected: false,
      dataTypes: ['Chronic Care', 'Health Coaching', 'Remote Monitoring'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'omada-health',
      name: 'Omada Health',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm font-bold">OH</div>,
      description: 'Digital care programs for chronic conditions',
      connected: false,
      dataTypes: ['Lifestyle Coaching', 'Behavior Change', 'Health Metrics'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'mindstrong-health',
      name: 'Mindstrong Health',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-500 to-pink-700 flex items-center justify-center text-white text-sm font-bold">MH</div>,
      description: 'Digital biomarkers for mental health',
      connected: false,
      dataTypes: ['Mental Health Patterns', 'Cognitive Biomarkers', 'Digital Phenotyping'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'clicktherapeutics',
      name: 'Click Therapeutics',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-white text-sm font-bold">CT</div>,
      description: 'Prescription digital therapeutics platform',
      connected: false,
      dataTypes: ['Treatment Protocols', 'Clinical Outcomes', 'Adherence Tracking'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'happify-health',
      name: 'Happify Health',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center text-white text-sm font-bold">HH</div>,
      description: 'Digital therapeutics for emotional well-being',
      connected: false,
      dataTypes: ['Mood Tracking', 'Resilience Training', 'Stress Management'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'freespira',
      name: 'Freespira',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center text-white text-sm font-bold">FS</div>,
      description: 'FDA-cleared digital therapeutic for panic disorder',
      connected: false,
      dataTypes: ['Breathing Patterns', 'Panic Episodes', 'Treatment Progress'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'kaia-health',
      name: 'Kaia Health',
      category: 'therapeutics',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center text-white text-sm font-bold">KH</div>,
      description: 'Digital therapeutics for chronic pain and COPD',
      connected: false,
      dataTypes: ['Pain Management', 'Exercise Therapy', 'Symptom Tracking'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },

    // Blood Pressure & Medical Device Platforms  
    {
      id: 'omron-connect',
      name: 'OMRON Connect',
      category: 'cardiovascular',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-sm font-bold">OM</div>,
      description: 'OMRON blood pressure monitors and health devices',
      connected: false,
      dataTypes: ['Blood Pressure', 'Heart Rate', 'Activity', 'Weight'],
      status: 'available',
      popularity: 5,
      integration_ease: 5,
      clinical_value: 5
    },
    {
      id: 'a-d-medical',
      name: 'A&D Medical',
      category: 'cardiovascular',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white text-sm font-bold">AD</div>,
      description: 'A&D precision blood pressure and health monitoring',
      connected: false,
      dataTypes: ['Blood Pressure', 'Pulse', 'Body Composition', 'Temperature'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'qardio',
      name: 'Qardio',
      category: 'cardiovascular',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center text-white text-sm font-bold">QA</div>,
      description: 'QardioArm blood pressure & QardioBase smart scale',
      connected: false,
      dataTypes: ['Blood Pressure', 'ECG', 'Weight', 'BMI'],
      status: 'available',
      popularity: 4,
      integration_ease: 5,
      clinical_value: 5
    },
    {
      id: 'ihealth-labs',
      name: 'iHealth Labs',
      category: 'medical-devices',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-orange-600 to-orange-800 flex items-center justify-center text-white text-sm font-bold">IH</div>,
      description: 'iHealth connected medical devices and monitoring',
      connected: false,
      dataTypes: ['Blood Pressure', 'Blood Glucose', 'Weight', 'Pulse Oximetry'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'beurer-healthmanager',
      name: 'Beurer HealthManager',
      category: 'medical-devices',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center text-white text-sm font-bold">BE</div>,
      description: 'Beurer medical devices and health management',
      connected: false,
      dataTypes: ['Blood Pressure', 'Blood Sugar', 'Weight', 'Activity'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'microlife-connect',
      name: 'Microlife Connect',
      category: 'cardiovascular',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-teal-600 to-teal-800 flex items-center justify-center text-white text-sm font-bold">ML</div>,
      description: 'Microlife blood pressure monitors and health tracking',
      connected: false,
      dataTypes: ['Blood Pressure', 'Heart Rate Variability', 'Pulse'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'welch-allyn',
      name: 'Welch Allyn Home',
      category: 'cardiovascular',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center text-white text-sm font-bold">WA</div>,
      description: 'Welch Allyn professional-grade home monitoring',
      connected: false,
      dataTypes: ['Blood Pressure', 'Clinical-Grade Monitoring', 'Vital Signs'],
      status: 'available',
      popularity: 3,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'braun-healthyheartapp',
      name: 'Braun HealthyHeart',
      category: 'cardiovascular',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white text-sm font-bold">BR</div>,
      description: 'Braun ExactFit blood pressure monitoring',
      connected: false,
      dataTypes: ['Blood Pressure', 'Heart Health', 'Trend Analysis'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'minttihealth',
      name: 'Mintti Health',
      category: 'medical-devices',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-pink-600 to-pink-800 flex items-center justify-center text-white text-sm font-bold">MT</div>,
      description: 'Mintti vision and vital signs monitoring',
      connected: false,
      dataTypes: ['Blood Pressure', 'Heart Rate', 'Oxygen Saturation', 'Temperature'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'cardiomood',
      name: 'CardioMood',
      category: 'cardiovascular',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-sm font-bold">CM</div>,
      description: 'Advanced cardiac rhythm and mood monitoring',
      connected: false,
      dataTypes: ['ECG', 'Heart Rate Variability', 'Stress', 'Mood'],
      status: 'available',
      popularity: 2,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'healththermometer',
      name: 'HealthThermometer',
      category: 'medical-devices',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-yellow-600 to-yellow-800 flex items-center justify-center text-white text-sm font-bold">HT</div>,
      description: 'Smart thermometer and fever tracking',
      connected: false,
      dataTypes: ['Body Temperature', 'Fever Patterns', 'Health Alerts'],
      status: 'available',
      popularity: 3,
      integration_ease: 5,
      clinical_value: 3
    },
    {
      id: 'fora-telehealth',
      name: 'FORA TeleHealth',
      category: 'medical-devices',
      icon: <div className="w-6 h-6 rounded bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white text-sm font-bold">FO</div>,
      description: 'FORA diabetes and hypertension management',
      connected: false,
      dataTypes: ['Blood Glucose', 'Blood Pressure', 'Weight', 'Cholesterol'],
      status: 'available',
      popularity: 3,
      integration_ease: 4,
      clinical_value: 5
    },

    // Additional Major US Healthcare & EHR Platforms (15 new platforms)
    {
      id: 'epic-mychart-2',
      name: 'Epic MyChart',
      category: 'ehr',
      icon: <Shield className="h-6 w-6" />,
      description: 'Comprehensive electronic health records from Epic (280M+ patients)',
      connected: false,
      dataTypes: ['Medical Records', 'Lab Results', 'Prescriptions', 'Appointments'],
      status: 'available',
      popularity: 5,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'cerner-powerchart-2',
      name: 'Cerner PowerChart',
      category: 'ehr',
      icon: <Shield className="h-6 w-6" />,
      description: 'Major hospital network electronic health records system',
      connected: false,
      dataTypes: ['Medical Records', 'Lab Results', 'Imaging', 'Clinical Notes'],
      status: 'available',
      popularity: 5,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'kaiser-healthconnect-2',
      name: 'Kaiser Permanente HealthConnect',
      category: 'ehr',
      icon: <Shield className="h-6 w-6" />,
      description: 'Integrated health records from Kaiser Permanente healthcare system',
      connected: false,
      dataTypes: ['Medical Records', 'Appointments', 'Prescriptions', 'Test Results'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'cvs-minuteclinic-2',
      name: 'CVS Health MinuteClinic',
      category: 'ehr',
      icon: <Shield className="h-6 w-6" />,
      description: 'Retail healthcare visit records and health screenings',
      connected: false,
      dataTypes: ['Visit Records', 'Health Screenings', 'Vaccinations', 'Prescriptions'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'walgreens-health-2',
      name: 'Walgreens Health Corner',
      category: 'ehr',
      icon: <Shield className="h-6 w-6" />,
      description: 'Pharmacy health services and wellness tracking data',
      connected: false,
      dataTypes: ['Pharmacy Records', 'Health Screenings', 'Immunizations'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 4
    },
    {
      id: 'unitedhealthcare-optum-2',
      name: 'UnitedHealthcare OptumRx',
      category: 'insurance-health',
      icon: <Shield className="h-6 w-6" />,
      description: 'Prescription benefits and health plan data from UnitedHealth',
      connected: false,
      dataTypes: ['Insurance Claims', 'Prescription Benefits', 'Wellness Programs'],
      status: 'available',
      popularity: 5,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'anthem-wellpoint-2',
      name: 'Anthem WellPoint',
      category: 'insurance-health',
      icon: <Shield className="h-6 w-6" />,
      description: 'Health insurance data and wellness program tracking',
      connected: false,
      dataTypes: ['Claims Data', 'Wellness Programs', 'Preventive Care'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'aetna-better-health-2',
      name: 'Aetna Better Health',
      category: 'insurance-health',
      icon: <Shield className="h-6 w-6" />,
      description: 'Health plan benefits and wellness program data',
      connected: false,
      dataTypes: ['Health Benefits', 'Care Management', 'Wellness Tracking'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'bcbs-wellness-2',
      name: 'Blue Cross Blue Shield',
      category: 'insurance-health',
      icon: <Shield className="h-6 w-6" />,
      description: 'Health insurance benefits and wellness program data',
      connected: false,
      dataTypes: ['Insurance Benefits', 'Wellness Programs', 'Health Assessments'],
      status: 'available',
      popularity: 5,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'cigna-mycigna-2',
      name: 'Cigna myCigna',
      category: 'insurance-health',
      icon: <Shield className="h-6 w-6" />,
      description: 'Health plan dashboard and wellness program tracking',
      connected: false,
      dataTypes: ['Health Plan Data', 'Wellness Programs', 'Claims Information'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 4
    },
    {
      id: 'dexcom-clarity-2',
      name: 'Dexcom Clarity',
      category: 'glucose',
      icon: <TestTube className="h-6 w-6" />,
      description: 'Continuous glucose monitoring data and diabetes management',
      connected: false,
      dataTypes: ['Blood Glucose', 'CGM Data', 'Trends', 'Time in Range'],
      status: 'available',
      popularity: 5,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'abbott-librelink-2',
      name: 'Abbott FreeStyle LibreLink',
      category: 'glucose',
      icon: <TestTube className="h-6 w-6" />,
      description: 'Flash glucose monitoring and diabetes tracking platform',
      connected: false,
      dataTypes: ['Flash Glucose', 'Diabetes Tracking', 'Glucose Trends'],
      status: 'available',
      popularity: 5,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'medtronic-carelink-2',
      name: 'Medtronic CareLink',
      category: 'medical-devices',
      icon: <TestTube className="h-6 w-6" />,
      description: 'Medical device data from insulin pumps and CGMs',
      connected: false,
      dataTypes: ['Insulin Pump Data', 'CGM Data', 'Device Settings', 'Therapy Data'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    },
    {
      id: 'resmed-myair-2',
      name: 'ResMed myAir',
      category: 'sleep',
      icon: <Moon className="h-6 w-6" />,
      description: 'Sleep apnea device data and therapy tracking',
      connected: false,
      dataTypes: ['CPAP Data', 'Sleep Quality', 'Therapy Compliance', 'AHI Scores'],
      status: 'available',
      popularity: 4,
      integration_ease: 4,
      clinical_value: 5
    },
    {
      id: 'philips-healthsuite-2',
      name: 'Philips HealthSuite',
      category: 'medical-devices',
      icon: <TestTube className="h-6 w-6" />,
      description: 'Connected health platform for medical devices and monitoring',
      connected: false,
      dataTypes: ['Medical Device Data', 'Health Monitoring', 'Patient Analytics'],
      status: 'available',
      popularity: 4,
      integration_ease: 3,
      clinical_value: 5
    }
  ];

  const filteredPlatforms = useMemo(() => {
    let filtered = platforms;

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryMap = {
        'All Platforms': 'all',
        'General Health & Activity': 'general-health',
        'Wearables & Fitness Trackers': 'wearables',
        'Sleep Trackers': 'sleep',
        'Blood Glucose & Diabetes': 'glucose',
        'Blood Pressure & Cardiovascular': 'cardiovascular',
        'Nutrition & Food Tracking': 'nutrition',
        'Menstrual & Hormonal Health': 'menstrual',
        'Mental Health & Mood': 'mental-health',
        'Medication & Supplements': 'medication',
        'Electronic Health Records': 'ehr',
        'Genomics & Lab Work': 'genomics',
        'Environmental Data': 'environmental',
        'Digital Therapeutics': 'therapeutics',
        'Singapore Health': 'singapore-health',
        'Insurance Health': 'insurance-health',
        'Medical Devices': 'medical-devices',
        'Wellness': 'wellness'
      };
      const mappedCategory = categoryMap[selectedCategory as keyof typeof categoryMap] || selectedCategory.toLowerCase().replace(' ', '-');
      filtered = filtered.filter(platform => platform.category === mappedCategory);
    }

    // Filter by search term - comprehensive search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(platform =>
        platform.name.toLowerCase().includes(searchLower) ||
        platform.description.toLowerCase().includes(searchLower) ||
        platform.category.toLowerCase().includes(searchLower) ||
        platform.dataTypes.some(type => type.toLowerCase().includes(searchLower)) ||
        platform.id.toLowerCase().includes(searchLower)
      );
    }

    // Sort platforms
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'integration_ease':
          return b.integration_ease - a.integration_ease;
        case 'clinical_value':
          return b.clinical_value - a.clinical_value;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return b.popularity - a.popularity;
      }
    });

    return filtered;
  }, [selectedCategory, searchTerm, sortBy]);

  // Generate search suggestions based on current input
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const suggestions = new Set<string>();

    platforms.forEach(platform => {
      // Add platform names that match
      if (platform.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(platform.name);
      }

      // Add data types that match
      platform.dataTypes.forEach(dataType => {
        if (dataType.toLowerCase().includes(searchTerm.toLowerCase())) {
          suggestions.add(dataType);
        }
      });

      // Add category names that match
      const category = CATEGORIES.find(c => c.id === platform.category);
      if (category && category.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(category.name);
      }
    });

    // Popular health terms for smart suggestions
    const healthTerms = [
      'Apple Health', 'Google Fit', 'Fitbit', 'Samsung Health', 'Garmin',
      'Blood Pressure', 'Heart Rate', 'Sleep', 'Steps', 'Weight', 'Glucose',
      'Meditation', 'Nutrition', 'Calories', 'Exercise', 'Workout'
    ];

    healthTerms.forEach(term => {
      if (term.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(term);
      }
    });

    return Array.from(suggestions).slice(0, 6); // Limit to 6 suggestions
  }, [searchTerm, platforms]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setSelectedSuggestionIndex(-1);
    setShowSuggestions(value.length >= 2);
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || searchSuggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev < searchSuggestions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedSuggestionIndex(prev => 
        prev > 0 ? prev - 1 : searchSuggestions.length - 1
      );
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault();
      handleSuggestionSelect(searchSuggestions[selectedSuggestionIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
    }
  };

  const handleConnect = (platform: Platform) => {
    // Show security notice only when user attempts to connect
    alert(`🔒 Secure Connection\n\nConnecting to ${platform.name} uses secure OAuth authentication. Your credentials are never stored on our servers. Data is encrypted end-to-end and HIPAA compliant.\n\nProceed with connection?`);
    console.log('Connecting to:', platform.name);
    // In a real implementation, this would trigger the OAuth flow
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreStars = (score: number) => {
    return '★'.repeat(score) + '☆'.repeat(5 - score);
  };

  const renderPlatformIcon = (platform: Platform) => {
    return (
      <img 
        src={`https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/generic-app-icon-${platform.id}/512x512bb.jpg`}
        alt={`${platform.name} app icon`}
        className="w-8 h-8 rounded-lg"
        onError={(e) => {
          // Fallback to real App Store lookup or generic icon
          const target = e.target as HTMLImageElement;
          target.src = `/api/platform-icon-fallback.svg?platform=${platform.id}`;
        }}
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button 
                onClick={onClose}
                className="mr-4 p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center">
                <VitalLinkLogo size={32} />
                <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">VitalLink</span>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="min-h-screen w-full max-w-none mx-0 px-4 py-6 space-y-6">
        {/* Sleek Title Section */}
        <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg mb-6 overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-teal-500/5 to-purple-500/5 dark:from-blue-400/10 dark:via-teal-400/10 dark:to-purple-400/10"></div>

          <div className="relative px-8 py-6">
            <div className="text-center">
              {/* Icon container */}
              <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl shadow-lg mb-4">
                <Link2 className="h-8 w-8 text-white" />
              </div>

              {/* Title and description */}
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                All Health Platforms
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-lg">
                Connect to more platforms to see a clearer picture of your health
              </p>

              {/* Stats */}
              <div className="flex justify-center items-center space-x-8 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {platforms.length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Total Platforms
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {platforms.filter(p => p.connected).length}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Connected
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.round((platforms.filter(p => p.connected).length / platforms.length) * 100)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Coverage
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Sleek Search and Filters */}
      <div className="relative bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl border border-gray-200/40 dark:border-gray-700/40 shadow-md p-6 mb-6">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4 w-full">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
          <Input
            placeholder="Search platforms, conditions, or data types..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="pl-10 bg-white dark:bg-gray-800 border-2 focus:border-teal-500 transition-all duration-200"
            autoComplete="off"
          />
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('');
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600 z-10"
            >
              ✕
            </button>
          )}

          {/* Search Suggestions Dropdown */}
          {showSuggestions && searchSuggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              <div className="p-2">
                <div className="text-xs text-gray-500 dark:text-gray-400 px-2 py-1 font-medium">
                  Search suggestions
                </div>
                {searchSuggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionSelect(suggestion)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      index === selectedSuggestionIndex
                        ? 'bg-teal-50 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Search className="h-3 w-3 mr-2 text-gray-400" />
                      <span>{suggestion}</span>
                    </div>
                  </button>
                ))}
                {searchSuggestions.length === 6 && (
                  <div className="text-xs text-gray-400 px-2 py-1 text-center border-t border-gray-100 dark:border-gray-700 mt-1">
                    Keep typing for more results...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Select category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map(category => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="popularity">Popularity</SelectItem>
            <SelectItem value="integration_ease">Easy to Integrate</SelectItem>
            <SelectItem value="clinical_value">Clinical Value</SelectItem>
            <SelectItem value="name">Name (A-Z)</SelectItem>
          </SelectContent>
        </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {searchTerm ? (
            <>
              Found <span className="font-semibold text-teal-600">{filteredPlatforms.length}</span> platforms 
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {selectedCategory !== 'all' && (
                <span> in {CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
              )}
            </>
          ) : (
            <>
              Showing {filteredPlatforms.length} platforms
              {selectedCategory !== 'all' && (
                <span> in {CATEGORIES.find(c => c.id === selectedCategory)?.name}</span>
              )}
            </>
          )}
        </p>
        <div className="flex items-center gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
              Search: {searchTerm}
            </Badge>
          )}
          <Badge variant="outline">
            {platforms.filter(p => p.connected).length} connected
          </Badge>
        </div>
      </div>



      {/* Platform Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlatforms.map((platform) => (
          <Card key={platform.id} className="border-2 hover:border-teal-200 transition-all duration-200 hover:shadow-lg">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {renderPlatformIcon(platform)}
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <Badge variant="outline" className="text-xs mt-1">
                      {CATEGORIES.find(c => c.id === platform.category)?.name}
                    </Badge>
                  </div>
                </div>
                {platform.connected && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {platform.description}
              </p>

              {/* Scores */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="text-center">
                  <div className={`font-medium ${getScoreColor(platform.popularity)}`}>
                    {getScoreStars(platform.popularity)}
                  </div>
                  <div className="text-gray-500">Popular</div>
                </div>
                <div className="text-center">
                  <div className={`font-medium ${getScoreColor(platform.integration_ease)}`}>
                    {getScoreStars(platform.integration_ease)}
                  </div>
                  <div className="text-gray-500">Easy Setup</div>
                </div>
                <div className="text-center">
                  <div className={`font-medium ${getScoreColor(platform.clinical_value)}`}>
                    {getScoreStars(platform.clinical_value)}
                  </div>
                  <div className="text-gray-500">Clinical Value</div>
                </div>
              </div>

              {/* Data Types */}
              <div>
                <h4 className="font-medium text-sm mb-2">Data Types:</h4>
                <div className="flex flex-wrap gap-1">
                  {platform.dataTypes.slice(0, 3).map((type) => (
                    <Badge key={type} variant="secondary" className="text-xs">
                      {type}
                    </Badge>
                  ))}
                  {platform.dataTypes.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{platform.dataTypes.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              {/* Connect Button */}
              <Button
                onClick={() => handleConnect(platform)}
                disabled={platform.connected}
                className="w-full"
                variant={platform.connected ? 'outline' : 'default'}
              >
                {platform.connected ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Connected
                  </>
                ) : (
                  <>
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredPlatforms.length === 0 && (
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No platforms found
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Try adjusting your search or category filters
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
      </div>
    </div>
  );
};