// Centralized device configurations for all platforms
export interface DeviceConfig {
  id: string;
  name: string;
  type: 'phone' | 'watch' | 'scale' | 'sensor' | 'monitor';
  model: string;
  connected: boolean;
  lastSync: string;
  syncEnabled: boolean;
  dataTypes: Array<{
    id: string;
    name: string;
    description: string;
    frequency: 'real-time' | 'hourly' | 'daily';
    enabled: boolean;
  }>;
}

export const PLATFORM_DEVICE_CONFIGS: Record<string, DeviceConfig[]> = {
  apple_health: [
    {
      id: 'apple_iphone',
      name: 'iPhone 14 Pro',
      type: 'phone',
      model: 'iPhone 14 Pro',
      connected: true,
      lastSync: '1 hour ago',
      syncEnabled: true,
      dataTypes: [
        { id: 'steps', name: 'Steps', description: 'Daily step count and walking activity', frequency: 'real-time', enabled: true },
        { id: 'distance', name: 'Distance', description: 'Walking and running distance', frequency: 'real-time', enabled: true },
        { id: 'workouts', name: 'Workouts', description: 'Exercise sessions logged in Health app', frequency: 'real-time', enabled: true }
      ]
    },
    {
      id: 'apple_watch',
      name: 'Apple Watch Series 9',
      type: 'watch',
      model: 'Apple Watch Series 9',
      connected: true,
      lastSync: '30 seconds ago',
      syncEnabled: true,
      dataTypes: [
        { id: 'heart_rate', name: 'Heart Rate', description: 'Continuous heart rate monitoring', frequency: 'real-time', enabled: true },
        { id: 'ecg', name: 'ECG', description: 'Electrocardiogram readings', frequency: 'real-time', enabled: true },
        { id: 'blood_oxygen', name: 'Blood Oxygen', description: 'SpO2 measurements', frequency: 'hourly', enabled: true },
        { id: 'sleep', name: 'Sleep', description: 'Sleep stages and quality tracking', frequency: 'daily', enabled: true }
      ]
    }
  ],

  google_fit: [
    {
      id: 'google_pixel',
      name: 'Pixel 8 Pro',
      type: 'phone',
      model: 'Google Pixel 8 Pro',
      connected: true,
      lastSync: '2 minutes ago',
      syncEnabled: true,
      dataTypes: [
        { id: 'steps', name: 'Steps', description: 'Step count from phone sensors', frequency: 'real-time', enabled: true },
        { id: 'calories', name: 'Calories', description: 'Estimated calorie burn', frequency: 'hourly', enabled: true },
        { id: 'distance', name: 'Distance', description: 'Walking and running distance', frequency: 'real-time', enabled: false },
        { id: 'active_minutes', name: 'Active Minutes', description: 'Time spent in physical activity', frequency: 'hourly', enabled: true }
      ]
    }
  ],

  fitbit: [
    {
      id: 'fitbit_versa',
      name: 'Fitbit Versa 4',
      type: 'watch',
      model: 'Fitbit Versa 4',
      connected: true,
      lastSync: '5 minutes ago',
      syncEnabled: true,
      dataTypes: [
        { id: 'steps', name: 'Steps', description: 'Daily step tracking', frequency: 'real-time', enabled: true },
        { id: 'heart_rate', name: 'Heart Rate', description: 'Heart rate monitoring', frequency: 'real-time', enabled: true },
        { id: 'sleep', name: 'Sleep', description: 'Sleep tracking and stages', frequency: 'daily', enabled: true },
        { id: 'exercise', name: 'Exercise', description: 'Workout and exercise tracking', frequency: 'real-time', enabled: false }
      ]
    }
  ],

  samsung_health: [
    {
      id: 'samsung_galaxy',
      name: 'Galaxy S24 Ultra',
      type: 'phone',
      model: 'Samsung Galaxy S24 Ultra',
      connected: true,
      lastSync: '10 minutes ago',
      syncEnabled: true,
      dataTypes: [
        { id: 'steps', name: 'Steps', description: 'Daily step count', frequency: 'real-time', enabled: true },
        { id: 'stress', name: 'Stress', description: 'Stress level monitoring', frequency: 'hourly', enabled: true },
        { id: 'heart_rate', name: 'Heart Rate', description: 'Heart rate tracking', frequency: 'real-time', enabled: false }
      ]
    }
  ],

  dexcom: [
    {
      id: 'dexcom_g7',
      name: 'Dexcom G7 Sensor',
      type: 'sensor',
      model: 'Dexcom G7 CGM',
      connected: true,
      lastSync: '1 minute ago',
      syncEnabled: true,
      dataTypes: [
        { id: 'glucose', name: 'Glucose', description: 'Real-time glucose readings', frequency: 'real-time', enabled: true },
        { id: 'glucose_trends', name: 'Glucose Trends', description: 'Glucose trend arrows and predictions', frequency: 'real-time', enabled: true },
        { id: 'alerts', name: 'Alerts', description: 'High/low glucose alerts', frequency: 'real-time', enabled: true }
      ]
    }
  ]
};

export const getDevicesForPlatform = (platformId: string): DeviceConfig[] => {
  return PLATFORM_DEVICE_CONFIGS[platformId] || [
    {
      id: `${platformId}_default`,
      name: `${platformId} App`,
      type: 'phone',
      model: `${platformId} Application`,
      connected: true,
      lastSync: '1 hour ago',
      syncEnabled: true,
      dataTypes: [
        { id: 'basic_data', name: 'Basic Data', description: 'Standard health metrics', frequency: 'hourly', enabled: true }
      ]
    }
  ];
};