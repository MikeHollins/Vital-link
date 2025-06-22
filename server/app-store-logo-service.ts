
import fetch from 'node-fetch';

interface AppStoreLogo {
  platformName: string;
  appStoreUrl: string;
  logoUrl: string;
  iconUrl: string;
  brandColors: string[];
  verified: boolean;
}

export class AppStoreLogoService {
  private healthPlatforms = [
    { 
      name: 'Apple Health', 
      appStoreId: '1023596822',
      bundleId: 'com.apple.Health',
      playStoreId: null,
      officialColors: ['#007AFF', '#34C759']
    },
    { 
      name: 'Fitbit', 
      appStoreId: '462638897',
      bundleId: 'com.fitbit.FitbitMobile',
      playStoreId: 'com.fitbit.FitbitMobile',
      officialColors: ['#00B0B9', '#4CC8C8']
    },
    { 
      name: 'Google Fit', 
      appStoreId: '1433864494',
      bundleId: 'com.google.ios.fitness',
      playStoreId: 'com.google.android.apps.fitness',
      officialColors: ['#4285F4', '#34A853']
    },
    { 
      name: 'Samsung Health', 
      appStoreId: '1224541484',
      bundleId: 'com.sec.android.app.shealth',
      playStoreId: 'com.sec.android.app.shealth',
      officialColors: ['#1876D1', '#5BB8FF']
    },
    { 
      name: 'Garmin Connect', 
      appStoreId: '583446403',
      bundleId: 'com.garmin.connect.mobile',
      playStoreId: 'com.garmin.android.apps.connectmobile',
      officialColors: ['#007CC3', '#00A9CE']
    },
    { 
      name: 'Oura', 
      appStoreId: '1215606137',
      bundleId: 'com.ouraring.oura',
      playStoreId: 'com.ouraring.oura',
      officialColors: ['#FF6900', '#E6007E']
    },
    { 
      name: 'Withings Health Mate', 
      appStoreId: '542196020',
      bundleId: 'com.withings.wiscale2',
      playStoreId: 'com.withings.wiscale2',
      officialColors: ['#4AC2B7', '#2D8A85']
    },
    { 
      name: 'MyFitnessPal', 
      appStoreId: '341232718',
      bundleId: 'com.myfitnesspal.app',
      playStoreId: 'com.myfitnesspal.android',
      officialColors: ['#0072CE', '#4AC2B7']
    },
    { 
      name: 'Strava', 
      appStoreId: '426826309',
      bundleId: 'com.strava.stravaride',
      playStoreId: 'com.strava',
      officialColors: ['#FC4C02', '#E34402']
    },
    { 
      name: 'Nike Run Club', 
      appStoreId: '387771637',
      bundleId: 'com.nike.onenikeplus',
      playStoreId: 'com.nike.plusone',
      officialColors: ['#111111', '#FF6900']
    }
  ];

  /**
   * Get platform logo from App Store API
   */
  async getPlatformLogo(platformName: string): Promise<AppStoreLogo | null> {
    const platform = this.healthPlatforms.find(p => 
      p.name.toLowerCase().includes(platformName.toLowerCase()) ||
      platformName.toLowerCase().includes(p.name.toLowerCase())
    );

    if (!platform) {
      console.warn(`Platform ${platformName} not found in supported platforms`);
      return null;
    }

    try {
      // Try iOS App Store first
      if (platform.appStoreId) {
        const iosLogo = await this.fetchiOSAppLogo(platform);
        if (iosLogo) return iosLogo;
      }

      // Fallback to Android Play Store
      if (platform.playStoreId) {
        const androidLogo = await this.fetchAndroidAppLogo(platform);
        if (androidLogo) return androidLogo;
      }

      // Return fallback if APIs fail
      return this.getFallbackLogo(platform);
    } catch (error) {
      console.error(`Error fetching logo for ${platformName}:`, error);
      return this.getFallbackLogo(platform);
    }
  }

  /**
   * Fetch logo from iOS App Store
   */
  private async fetchiOSAppLogo(platform: any): Promise<AppStoreLogo | null> {
    try {
      const response = await fetch(`https://itunes.apple.com/lookup?id=${platform.appStoreId}&country=US&entity=software`);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const app = data.results[0];
        
        return {
          platformName: platform.name,
          appStoreUrl: app.trackViewUrl,
          logoUrl: app.artworkUrl512 || app.artworkUrl100,
          iconUrl: app.artworkUrl60,
          brandColors: platform.officialColors,
          verified: true
        };
      }
    } catch (error) {
      console.error(`iOS App Store API error for ${platform.name}:`, error);
    }
    
    return null;
  }

  /**
   * Fetch logo from Android Play Store (using alternative method)
   */
  private async fetchAndroidAppLogo(platform: any): Promise<AppStoreLogo | null> {
    try {
      // Using Google Play Store scraping endpoint (you may need to implement this)
      const playStoreUrl = `https://play.google.com/store/apps/details?id=${platform.playStoreId}`;
      
      return {
        platformName: platform.name,
        appStoreUrl: playStoreUrl,
        logoUrl: `https://play-lh.googleusercontent.com/apps/${platform.playStoreId}/icon`,
        iconUrl: `https://play-lh.googleusercontent.com/apps/${platform.playStoreId}/icon-64`,
        brandColors: platform.officialColors,
        verified: true
      };
    } catch (error) {
      console.error(`Android Play Store error for ${platform.name}:`, error);
    }
    
    return null;
  }

  /**
   * Get fallback logo information
   */
  private getFallbackLogo(platform: any): AppStoreLogo {
    return {
      platformName: platform.name,
      appStoreUrl: platform.appStoreId 
        ? `https://apps.apple.com/app/id${platform.appStoreId}`
        : `https://play.google.com/store/apps/details?id=${platform.playStoreId}`,
      logoUrl: `/api/platform-icons/${platform.name.toLowerCase().replace(/\s+/g, '-')}.png`,
      iconUrl: `/api/platform-icons/${platform.name.toLowerCase().replace(/\s+/g, '-')}-small.png`,
      brandColors: platform.officialColors,
      verified: false
    };
  }

  /**
   * Batch fetch multiple platform logos
   */
  async batchGetPlatformLogos(platformNames: string[]): Promise<AppStoreLogo[]> {
    const logoPromises = platformNames.map(name => this.getPlatformLogo(name));
    const results = await Promise.allSettled(logoPromises);
    
    return results
      .filter(result => result.status === 'fulfilled' && result.value !== null)
      .map(result => (result as PromiseFulfilledResult<AppStoreLogo>).value);
  }

  /**
   * Get all supported platforms
   */
  getSupportedPlatforms() {
    return this.healthPlatforms.map(p => ({
      name: p.name,
      appStoreId: p.appStoreId,
      playStoreId: p.playStoreId,
      hasIOSApp: !!p.appStoreId,
      hasAndroidApp: !!p.playStoreId,
      officialColors: p.officialColors
    }));
  }

  /**
   * Validate if logo URL is accessible
   */
  async validateLogoUrl(logoUrl: string): Promise<boolean> {
    try {
      const response = await fetch(logoUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }
}

export const appStoreLogoService = new AppStoreLogoService();
