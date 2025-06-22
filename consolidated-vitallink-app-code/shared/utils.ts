// Shared utilities to reduce code duplication and improve maintainability

export const formatters = {
  // Health data formatting
  healthValue: (value: number, type: string): string => {
    const formats: Record<string, { suffix: string; decimals: number }> = {
      steps: { suffix: ' steps', decimals: 0 },
      heart_rate: { suffix: ' bpm', decimals: 0 },
      weight: { suffix: ' kg', decimals: 1 },
      sleep: { suffix: ' hrs', decimals: 1 },
      calories: { suffix: ' cal', decimals: 0 },
      distance: { suffix: ' km', decimals: 2 }
    };
    
    const format = formats[type] || { suffix: '', decimals: 0 };
    return value.toFixed(format.decimals) + format.suffix;
  },

  // Date formatting
  dateRange: (startDate: Date, endDate: Date): string => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric' 
    };
    return `${startDate.toLocaleDateString('en-US', options)} - ${endDate.toLocaleDateString('en-US', options)}`;
  },

  // Progress percentage
  progress: (current: number, target: number): number => {
    return Math.min(100, Math.round((current / target) * 100));
  }
};

export const validators = {
  // Health data validation
  isValidHealthValue: (value: number, type: string): boolean => {
    const ranges: Record<string, { min: number; max: number }> = {
      heart_rate: { min: 30, max: 220 },
      weight: { min: 20, max: 300 },
      sleep: { min: 0, max: 24 },
      steps: { min: 0, max: 100000 }
    };
    
    const range = ranges[type];
    return range ? value >= range.min && value <= range.max : true;
  },

  // Email validation
  email: (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
};

export const generators = {
  // Generate consistent IDs
  healthDataId: (userId: string, type: string, timestamp: Date): string => {
    return `${userId}_${type}_${timestamp.getTime()}`;
  },

  // Generate color based on value
  progressColor: (percentage: number): string => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  },

  // Generate platform gradient
  platformGradient: (platformId: string): string => {
    const gradients: Record<string, string> = {
      apple_health: 'from-gray-500 to-black',
      google_fit: 'from-blue-500 to-green-500',
      fitbit: 'from-teal-400 to-blue-600',
      samsung_health: 'from-blue-600 to-purple-600'
    };
    return gradients[platformId] || 'from-gray-400 to-gray-600';
  }
};

// Translation keys for error messages
export const errorMessageKeys = {
  NETWORK_ERROR: 'networkError',
  AUTH_REQUIRED: 'authRequired',
  DATA_NOT_FOUND: 'dataNotFound',
  INVALID_INPUT: 'invalidInput',
  RATE_LIMITED: 'rateLimited'
};

// Translation keys for success messages
export const successMessageKeys = {
  DATA_SAVED: 'dataSaved',
  DEVICE_CONNECTED: 'deviceConnected',
  SETTINGS_UPDATED: 'settingsUpdated',
  DATA_EXPORTED: 'dataExported'
};