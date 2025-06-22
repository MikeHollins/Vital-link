// Improved type definitions for better maintainability
export interface HealthMetric {
  id: string;
  type: string;
  value: number;
  formattedValue: string;
  timestamp: Date;
  source: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  profileImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivacySettings {
  dataSharing: {
    analytics: boolean;
    research: boolean;
    marketing: boolean;
    thirdParty: boolean;
  };
  visibility: {
    publicProfile: boolean;
    achievementSharing: boolean;
    healthMetrics: boolean;
    platformConnections: boolean;
  };
  security: {
    twoFactorAuth: boolean;
    biometricAuth: boolean;
    sessionTimeout: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PlatformConnection {
  id: string;
  name: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync?: Date;
  dataTypes: string[];
}

// Type-safe settings update function
export type SettingsKey = keyof PrivacySettings;
export type SettingsValue<K extends SettingsKey> = PrivacySettings[K];