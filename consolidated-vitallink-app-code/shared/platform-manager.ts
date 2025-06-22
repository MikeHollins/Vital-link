// Dynamic Platform Management System
// Allows for easy addition and updates of health platform integrations

import { Platform } from './types';

export interface PlatformUpdate {
  action: 'add' | 'update' | 'remove';
  platform: Partial<Platform> & { id: string };
  timestamp: Date;
  version: string;
}

export interface PlatformCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  platforms: Platform[];
  marketRelevance: {
    singapore: number; // 1-5 scale
    usa: number; // 1-5 scale
    global: number; // 1-5 scale
  };
}

export class PlatformManager {
  private static instance: PlatformManager;
  private platforms: Map<string, Platform> = new Map();
  private categories: Map<string, PlatformCategory> = new Map();
  private updateHistory: PlatformUpdate[] = [];

  public static getInstance(): PlatformManager {
    if (!PlatformManager.instance) {
      PlatformManager.instance = new PlatformManager();
    }
    return PlatformManager.instance;
  }

  // Dynamic Platform Operations
  public addPlatform(platform: Platform): boolean {
    try {
      this.platforms.set(platform.id, platform);
      this.logUpdate({
        action: 'add',
        platform,
        timestamp: new Date(),
        version: this.getVersion()
      });
      return true;
    } catch (error) {
      console.error('Failed to add platform:', error);
      return false;
    }
  }

  public updatePlatform(id: string, updates: Partial<Platform>): boolean {
    try {
      const existing = this.platforms.get(id);
      if (!existing) return false;

      const updated = { ...existing, ...updates };
      this.platforms.set(id, updated);
      
      this.logUpdate({
        action: 'update',
        platform: { id, ...updates },
        timestamp: new Date(),
        version: this.getVersion()
      });
      return true;
    } catch (error) {
      console.error('Failed to update platform:', error);
      return false;
    }
  }

  public removePlatform(id: string): boolean {
    try {
      const platform = this.platforms.get(id);
      if (!platform) return false;

      this.platforms.delete(id);
      this.logUpdate({
        action: 'remove',
        platform: { id },
        timestamp: new Date(),
        version: this.getVersion()
      });
      return true;
    } catch (error) {
      console.error('Failed to remove platform:', error);
      return false;
    }
  }

  // Bulk Operations
  public addMultiplePlatforms(platforms: Platform[]): { success: number; failed: string[] } {
    const results = { success: 0, failed: [] as string[] };
    
    platforms.forEach(platform => {
      if (this.addPlatform(platform)) {
        results.success++;
      } else {
        results.failed.push(platform.id);
      }
    });

    return results;
  }

  // Query Operations
  public getAllPlatforms(): Platform[] {
    return Array.from(this.platforms.values());
  }

  public getPlatformsByCategory(category: string): Platform[] {
    return this.getAllPlatforms().filter(p => p.category === category);
  }

  public getPlatformsByMarket(market: 'singapore' | 'usa' | 'global'): Platform[] {
    const marketKeywords = {
      singapore: ['singapore', 'sg', 'singhealth', 'moh', 'healthhub'],
      usa: ['usa', 'us', 'american', 'epic', 'cerner', 'kaiser'],
      global: [] // All platforms are global unless specifically regional
    };

    const keywords = marketKeywords[market];
    if (market === 'global') return this.getAllPlatforms();

    return this.getAllPlatforms().filter(platform => 
      keywords.some(keyword => 
        platform.name.toLowerCase().includes(keyword) ||
        platform.id.toLowerCase().includes(keyword) ||
        platform.description.toLowerCase().includes(keyword)
      )
    );
  }

  public searchPlatforms(query: string): Platform[] {
    const searchTerm = query.toLowerCase();
    return this.getAllPlatforms().filter(platform =>
      platform.name.toLowerCase().includes(searchTerm) ||
      platform.description.toLowerCase().includes(searchTerm) ||
      platform.category.toLowerCase().includes(searchTerm) ||
      platform.dataTypes.some(type => type.toLowerCase().includes(searchTerm))
    );
  }

  // Analytics & Insights
  public getPlatformStats(): {
    total: number;
    byCategory: Record<string, number>;
    byStatus: Record<string, number>;
    byMarket: { singapore: number; usa: number; global: number };
    popularityScore: number;
    clinicalValue: number;
  } {
    const platforms = this.getAllPlatforms();
    
    const byCategory = platforms.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byStatus = platforms.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const singaporePlatforms = this.getPlatformsByMarket('singapore').length;
    const usaPlatforms = this.getPlatformsByMarket('usa').length;

    return {
      total: platforms.length,
      byCategory,
      byStatus,
      byMarket: {
        singapore: singaporePlatforms,
        usa: usaPlatforms,
        global: platforms.length
      },
      popularityScore: platforms.reduce((sum, p) => sum + p.popularity, 0) / platforms.length,
      clinicalValue: platforms.reduce((sum, p) => sum + p.clinical_value, 0) / platforms.length
    };
  }

  // API Licensing Insights
  public getHighValuePlatforms(): Platform[] {
    return this.getAllPlatforms()
      .filter(p => p.clinical_value >= 4 && p.popularity >= 4)
      .sort((a, b) => (b.clinical_value + b.popularity) - (a.clinical_value + a.popularity));
  }

  public getEasyIntegrationPlatforms(): Platform[] {
    return this.getAllPlatforms()
      .filter(p => p.integration_ease >= 4)
      .sort((a, b) => b.integration_ease - a.integration_ease);
  }

  // Version Management
  private getVersion(): string {
    return `v${Date.now()}`;
  }

  private logUpdate(update: PlatformUpdate): void {
    this.updateHistory.push(update);
    // Keep only last 1000 updates
    if (this.updateHistory.length > 1000) {
      this.updateHistory = this.updateHistory.slice(-1000);
    }
  }

  public getUpdateHistory(): PlatformUpdate[] {
    return [...this.updateHistory];
  }

  public exportPlatformData(): {
    platforms: Platform[];
    categories: PlatformCategory[];
    stats: any;
    version: string;
    exported: Date;
  } {
    return {
      platforms: this.getAllPlatforms(),
      categories: Array.from(this.categories.values()),
      stats: this.getPlatformStats(),
      version: this.getVersion(),
      exported: new Date()
    };
  }

  // Auto-update capabilities
  public async checkForUpdates(): Promise<boolean> {
    // This would connect to an external service for platform updates
    // For now, returns false (no updates available)
    return false;
  }

  public async syncWithRemote(remoteEndpoint: string): Promise<boolean> {
    try {
      // This would sync with a remote platform database
      // Implementation would depend on the remote service
      console.log(`Syncing with remote endpoint: ${remoteEndpoint}`);
      return true;
    } catch (error) {
      console.error('Remote sync failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const platformManager = PlatformManager.getInstance();

// Helper functions for easy platform management
export const addPlatform = (platform: Platform) => platformManager.addPlatform(platform);
export const updatePlatform = (id: string, updates: Partial<Platform>) => platformManager.updatePlatform(id, updates);
export const removePlatform = (id: string) => platformManager.removePlatform(id);
export const getAllPlatforms = () => platformManager.getAllPlatforms();
export const getPlatformStats = () => platformManager.getPlatformStats();
export const searchPlatforms = (query: string) => platformManager.searchPlatforms(query);
export const getHighValuePlatforms = () => platformManager.getHighValuePlatforms();