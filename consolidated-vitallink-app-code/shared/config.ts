// Centralized configuration for easier maintenance
export const APP_CONFIG = {
  // UI Settings
  UI: {
    SIDEBAR_WIDTH: 64,
    MOBILE_BREAKPOINT: 768,
    CARD_HEIGHTS: {
      METRIC: 'h-11',
      SUMMARY: 'h-24'
    },
    ANIMATIONS: {
      SIDEBAR_DURATION: 300,
      SWIPE_SENSITIVITY: 0.3,
      CARD_TRANSITION: 'transform 0.3s ease-in-out'
    }
  },

  // Platform Integration
  PLATFORMS: {
    HEALTH_DATA_TYPES: [
      'heart_rate', 'steps', 'sleep', 'weight', 'blood_pressure',
      'calories', 'distance', 'exercise_minutes', 'blood_glucose'
    ],
    SYNC_INTERVALS: {
      REAL_TIME: 'real-time',
      HOURLY: 'hourly', 
      DAILY: 'daily'
    }
  },

  // Language Support
  LANGUAGES: {
    SUPPORTED: ['en', 'zh', 'ms', 'ta', 'ru', 'de'],
    DEFAULT: 'en',
    STORAGE_KEY: 'vitallink-language'
  },

  // Privacy & Security
  PRIVACY: {
    DATA_RETENTION_DAYS: 365,
    SESSION_TIMEOUT_HOURS: 24,
    ENCRYPTION_ALGORITHM: 'AES-256-GCM'
  },

  // API Configuration
  API: {
    ENDPOINTS: {
      AUTH: '/api/auth',
      DEVICES: '/api/devices',
      HEALTH_DATA: '/api/health-data',
      INSIGHTS: '/api/insights',
      PRIVACY: '/api/privacy-settings'
    },
    RATE_LIMITS: {
      DEFAULT: 100,
      AUTH: 10,
      DATA_EXPORT: 5
    }
  }
};

// Type-safe configuration access
export type ConfigPath = 
  | 'UI.SIDEBAR_WIDTH'
  | 'UI.ANIMATIONS.SIDEBAR_DURATION'
  | 'LANGUAGES.DEFAULT'
  | 'API.ENDPOINTS.AUTH';

export function getConfig(path: ConfigPath): any {
  return path.split('.').reduce((obj, key) => obj[key], APP_CONFIG);
}