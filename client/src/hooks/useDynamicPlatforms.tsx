import { useState, useEffect } from 'react';

interface ConnectedPlatform {
  id: string;
  name: string;
  dataTypes: string[];
  isConnected: boolean;
  lastSync?: Date;
  data?: Record<string, any>;
}

interface PlatformData {
  platformId: string;
  platformName: string;
  dataType: string;
  currentValue: number;
  unit: string;
  goal?: number;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  lastSyncTime: Date;
}

export const useDynamicPlatforms = () => {
  const [connectedPlatforms, setConnectedPlatforms] = useState<ConnectedPlatform[]>([]);
  const [platformWidgets, setPlatformWidgets] = useState<PlatformData[]>([]);

  // Simulate platform connection
  const connectPlatform = (platformId: string, platformName: string, dataTypes: string[]) => {
    const newPlatform: ConnectedPlatform = {
      id: platformId,
      name: platformName,
      dataTypes,
      isConnected: true,
      lastSync: new Date(),
      data: generateMockData(dataTypes)
    };

    setConnectedPlatforms(prev => [...prev, newPlatform]);
    
    // Create widgets for each data type
    const newWidgets = dataTypes.map(dataType => 
      createPlatformWidgeplatformId, platformName, dataType, newPlatform.data?.[dataType]
    );
    
    setPlatformWidgets(prev => [...prev, ...newWidgets]);
  };

  // Generate realistic mock data for demonstration
  const generateMockData = (dataTypes: string[]) => {
    const data: Record<string, any> = {};
    
    dataTypes.forEach(type => {
      switch (type.toLowerCase()) {
        case 'steps':
          data[type] = {
            current: Math.floor(Math.random() * 5000) + 5000, // 5000-10000 steps
            goal: 10000,
            trend: Math.random() > 0.5 ? 'up' : 'down',
            trendPercentage: Math.floor(Math.random() * 30) + 5
          };
          break;
        case 'heart_rate':
          data[type] = {
            current: Math.floor(Math.random() * 30) + 60, // 60-90 BPM
            trend: Math.random() > 0.5 ? 'up' : 'stable',
            trendPercentage: Math.floor(Math.random() * 10) + 1
          };
          break;
        case 'calories':
          data[type] = {
            current: Math.floor(Math.random() * 1000) + 1500, // 1500-2500 calories
            goal: 2000,
            trend: Math.random() > 0.5 ? 'up' : 'down',
            trendPercentage: Math.floor(Math.random() * 20) + 5
          };
          break;
        case 'sleep':
          data[type] = {
            current: Math.floor(Math.random() * 200) + 400, // 6.5-9.5 hours (in minutes)
            goal: 480, // 8 hours
            trend: Math.random() > 0.5 ? 'up' : 'stable',
            trendPercentage: Math.floor(Math.random() * 15) + 2
          };
          break;
        default:
          data[type] = {
            current: Math.floor(Math.random() * 100) + 50,
            trend: 'stable',
            trendPercentage: 0
          };
      }
    });
    
    return data;
  };

  // Create a widget data object for a specific platform and data type
  const createPlatformWidget = (
    platformId: string, 
    platformName: string, 
    dataType: string, 
    data: any
  ): PlatformData => {
    const getUnit = (type: string) => {
      switch (type.toLowerCase()) {
        case 'steps': return 'steps';
        case 'heart_rate': return 'BPM';
        case 'calories': return 'kcal';
        case 'sleep': return 'hours';
        case 'weight': return 'lbs';
        case 'hydration': return 'oz';
        default: return 'units';
      }
    };

    const getValue = (type: string, rawValue: number) => {
      if (type.toLowerCase() === 'sleep') {
        return Math.round((rawValue / 60) * 10) / 10; // Convert minutes to hours
      }
      return rawValue;
    };

    return {
      platformId,
      platformName,
      dataType,
      currentValue: getValue(dataType, data?.current || 0),
      unit: getUnidataType,
      goal: data?.goal ? getValue(dataType, data.goal) : undefined,
      trend: data?.trend || 'stable',
      trendPercentage: data?.trendPercentage || 0,
      lastSyncTime: new Date()
    };
  };

  // Disconnect platform and remove its widgets
  const disconnectPlatform = (platformId: string) => {
    setConnectedPlatforms(prev => prev.filter(p => p.id !== platformId));
    setPlatformWidgets(prev => prev.filter(w => w.platformId !== platformId));
  };

  // Sync platform data (simulate data refresh)
  const syncPlatformData = (platformId: string) => {
    setConnectedPlatforms(prev => prev.map(platform => {
      if (platform.id === platformId) {
        const newData = generateMockData(platform.dataTypes);
        return {
          ...platform,
          lastSync: new Date(),
          data: newData
        };
      }
      return platform;
    }));

    // Update widgets with new data
    setPlatformWidgets(prev => prev.map(widget => {
      if (widget.platformId === platformId) {
        const platform = connectedPlatforms.find(p => p.id === platformId);
        if (platform?.data?.[widget.dataType]) {
          return createPlatformWidget(
            platformId, 
            widget.platformName, 
            widget.dataType, 
            platform.data[widget.dataType]
          );
        }
      }
      return widget;
    }));
  };

  return {
    connectedPlatforms,
    platformWidgets,
    connectPlatform,
    disconnectPlatform,
    syncPlatformData
  };
};