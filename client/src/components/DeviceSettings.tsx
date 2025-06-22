import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Clock, 
  Trash2,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Battery,
  Heart,
  Activity,
  Moon,
  Scale
} from 'lucide-react';

interface Device {
  id: string;
  name: string;
  type: string;
  connected: boolean;
  lastSynced: string;
  syncFrequency: string;
  dataTypes: string[];
  batteryLevel?: number;
}

interface DeviceSettingsProps {
  deviceId?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceSettings: React.FC<DeviceSettingsProps> = ({ deviceId, isOpen, onClose }) => {
  const { toast } = useToas;
  const [devices, setDevices] = useState<Device[]>([
    {
      id: 'apple_health_1',
      name: 'iPhone 14 Pro',
      type: 'Apple Health',
      connected: true,
      lastSynced: '2 minutes ago',
      syncFrequency: 'realtime',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Workouts'],
      batteryLevel: 85
    },
    {
      id: 'apple_health_2',
      name: 'Apple Watch Series 9',
      type: 'Apple Health',
      connected: true,
      lastSynced: '1 minute ago',
      syncFrequency: 'realtime',
      dataTypes: ['Heart Rate', 'Workouts', 'ECG', 'Blood Oxygen'],
      batteryLevel: 42
    },
    {
      id: 'google_fit_1',
      name: 'Pixel 8 Pro',
      type: 'Google Fit',
      connected: true,
      lastSynced: '5 minutes ago',
      syncFrequency: '15min',
      dataTypes: ['Steps', 'Calories', 'Distance', 'Activity'],
      batteryLevel: 67
    },
    {
      id: 'fitbit_1',
      name: 'Fitbit Charge 6',
      type: 'Fitbit',
      connected: false,
      lastSynced: '2 hours ago',
      syncFrequency: '30min',
      dataTypes: ['Steps', 'Heart Rate', 'Sleep', 'Stress'],
      batteryLevel: 15
    }
  ]);

  const [selectedPlatform, setSelectedPlatform] = useState('all');
  
  const platforms = [
    { id: 'all', name: 'All Platforms' },
    { id: 'Apple Health', name: 'Apple Health' },
    { id: 'Google Fit', name: 'Google Fit' },
    { id: 'Fitbit', name: 'Fitbit' }
  ];

  const syncFrequencies = [
    { value: 'realtime', label: 'Real-time' },
    { value: '5min', label: 'Every 5 minutes' },
    { value: '15min', label: 'Every 15 minutes' },
    { value: '30min', label: 'Every 30 minutes' },
    { value: '1hour', label: 'Every hour' },
    { value: 'manual', label: 'Manual only' }
  ];

  const getDataTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'heart rate':
      case 'ecg':
      case 'blood oxygen':
        return <Heart className="h-3 w-3 text-red-500" />;
      case 'steps':
      case 'distance':
      case 'calories':
      case 'activity':
      case 'workouts':
        return <Activity className="h-3 w-3 text-green-500" />;
      case 'sleep':
        return <Moon className="h-3 w-3 text-blue-500" />;
      case 'weight':
      case 'stress':
        return <Scale className="h-3 w-3 text-purple-500" />;
      default:
        return <Smartphone className="h-3 w-3 text-gray-500" />;
    }
  };

  const handleConnect = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: true, lastSynced: 'Just now' }
        : device
    ));
    
    toast({
      title: "Device Connected",
      description: "Successfully connected and syncing data",
    });
  };

  const handleDisconnect = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, connected: false }
        : device
    ));
    
    toast({
      title: "Device Disconnected",
      description: "Device has been disconnected from VitalLink",
      variant: "destructive"
    });
  };

  const handleSyncFrequencyChange = (deviceId: string, frequency: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, syncFrequency: frequency }
        : device
    ));
    
    toast({
      title: "Sync Frequency Updated",
      description: `Sync frequency changed to ${syncFrequencies.find(f => f.value === frequency)?.label}`,
    });
  };

  const handleSync = (deviceId: string) => {
    setDevices(prev => prev.map(device => 
      device.id === deviceId 
        ? { ...device, lastSynced: 'Just now' }
        : device
    ));
    
    toast({
      title: "Sync Complete",
      description: "Latest data has been synced successfully",
    });
  };

  const filteredDevices = selectedPlatform === 'all' 
    ? devices 
    : devices.filter(device => device.type === selectedPlatform);

  const getBatteryColor = (level?: number) => {
    if (!level) return 'text-gray-400';
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getPlatformStats = () => {
    const connected = devices.filter(d => d.connected).length;
    const total = devices.length;
    const lastSync = devices
      .filter(d => d.connected)
      .sor(a, b => new Date(b.lastSynced).getTime() - new Date(a.lastSynced).getTime())[0]?.lastSynced || 'Never';
    
    return { connected, total, lastSync };
  };

  const stats = getPlatformStats();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-primary" />
            Device Settings
          </DialogTitle>
          <DialogDescription>
            Manage your connected health devices and sync preferences
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col h-full max-h-[70vh]">
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6 flex-shrink-0">
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-green-500" />
                <div>
                  <div className="font-semibold">{stats.connected}/{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Connected</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-500" />
                <div>
                  <div className="font-semibold text-sm">{stats.lastSync}</div>
                  <div className="text-xs text-muted-foreground">Last Sync</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-purple-500" />
                <div>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger className="h-6 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map(platform => (
                        <SelectItem key={platform.id} value={platform.id}>
                          {platform.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Device List */}
          <div className="flex-1 overflow-y-auto pr-2">
            <div className="space-y-4">
              {filteredDevices.map((device) => (
                <Card key={device.id} className={`transition-colors ${device.connected ? '' : 'opacity-75'}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${device.connected ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                          <Smartphone className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{device.name}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            {device.type}
                            {device.batteryLevel && (
                              <span className={`flex items-center gap-1 text-xs ${getBatteryColor(device.batteryLevel)}`}>
                                <Battery className="h-3 w-3" />
                                {device.batteryLevel}%
                              </span>
                            )}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={device.connected ? "default" : "secondary"} className="flex items-center gap-1">
                          {device.connected ? <CheckCircle className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                          {device.connected ? 'Connected' : 'Disconnected'}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Data Types */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Data Types</label>
                      <div className="flex flex-wrap gap-2">
                        {device.dataTypes.map((type, index) => (
                          <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs">
                            {getDataTypeIcon(type)}
                            {type}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sync Settings */}
                    {device.connected && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Sync Frequency</label>
                          <Select 
                            value={device.syncFrequency} 
                            onValueChange={(value) => handleSyncFrequencyChange(device.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {syncFrequencies.map(freq => (
                                <SelectItem key={freq.value} value={freq.value}>
                                  {freq.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium mb-2 block">Last Synced</label>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {device.lastSynced}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      {device.connected ? (
                        <>
                          <Button variant="outline" size="sm" onClick={() => handleSync(device.id)}>
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Sync Now
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDisconnecdevice.id} className="text-red-600 hover:text-red-700">
                            <WifiOff className="h-3 w-3 mr-1" />
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button variant="default" size="sm" onClick={() => handleConnecdevice.id}>
                          <Wifi className="h-3 w-3 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>

                    {!device.connected && (
                      <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                          <p className="font-medium text-yellow-800 dark:text-yellow-200">Device Disconnected</p>
                          <p className="text-yellow-700 dark:text-yellow-300 text-xs">
                            This device is not syncing data. Reconnect to continue tracking your health metrics.
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between items-center pt-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => {
                devices.filter(d => d.connected).forEach(d => handleSync(d.id));
              }}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};