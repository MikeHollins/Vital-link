import { Button } from "@/components/ui/button";
import { Activity, Heart, Shield, RefreshCw, Smartphone, Watch, Settings, BarChart2, Check } from "lucide-react";

interface DeviceCardProps {
  device: {
    id: number;
    type: string;
    name: string;
    status: string;
    lastSynced: string;
    permissions: Record<string, boolean>;
  };
  onManage: () => void;
  onSync: () => void;
}

export const DeviceCard = ({ device, onManage, onSync }: DeviceCardProps) => {
  const getProviderIcon = (type: string) => {
    switch (type) {
      case 'apple_health':
        return (
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 dark:bg-opacity-20 flex items-center justify-center">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
        );
      case 'fitbit':
        return (
          <div className="h-12 w-12 rounded-full bg-teal-100 dark:bg-teal-900 dark:bg-opacity-20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-teal-500" />
          </div>
        );
      case 'google_fit':
        return (
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-blue-500" />
          </div>
        );
      case 'samsung_health':
        return (
          <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900 dark:bg-opacity-20 flex items-center justify-center">
            <Smartphone className="h-6 w-6 text-indigo-500" />
          </div>
        );
      case 'garmin':
        return (
          <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 dark:bg-opacity-20 flex items-center justify-center">
            <Watch className="h-6 w-6 text-green-500" />
          </div>
        );
      case 'withings':
        return (
          <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 dark:bg-opacity-20 flex items-center justify-center">
            <Settings className="h-6 w-6 text-purple-500" />
          </div>
        );
      case 'oura':
        return (
          <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 flex items-center justify-center">
            <Watch className="h-6 w-6 text-yellow-500" />
          </div>
        );
      case 'whoop':
        return (
          <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 dark:bg-opacity-20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-red-500" />
          </div>
        );
      case 'eight_sleep':
        return (
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 dark:bg-opacity-20 flex items-center justify-center">
            <BarChart2 className="h-6 w-6 text-blue-500" />
          </div>
        );
      default:
        return (
          <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20 flex items-center justify-center">
            <Activity className="h-6 w-6 text-gray-500" />
          </div>
        );
    }
  };

  // Format last synced date
  const formatLastSynced = (dateStr: string) => {
    if (!dateStr) return 'Never synced';
    
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  };
  
  // Get permission items to display
  const getPermissionItems = () => {
    const permissionTypes = {
      'steps': 'Steps',
      'heart_rate': 'Heart Rate',
      'sleep': 'Sleep',
      'activity': 'Activity',
      'workout': 'Workout',
      'glucose': 'Glucose',
      'nutrition': 'Nutrition',
      'location': 'Location',
      'weight': 'Weight',
      'blood_pressure': 'Blood Pressure',
      'oxygen': 'Oxygen',
      'temperature': 'Temperature'
    };
    
    // Connected devices count (would come from the backend in a real implementation)
    const connectedDevicesCount = Math.floor(Math.random() * 5) + 1;
    
    return (
      <>
        <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Shield className="h-4 w-4 text-primary mr-1.5" />
              <span className="text-sm font-medium">Data Access</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {connectedDevicesCount} {connectedDevicesCount === 1 ? 'device' : 'devices'} connected
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(device.permissions).map(([key, enabled]) => {
              if (permissionTypes[key as keyof typeof permissionTypes]) {
                return (
                  <div 
                    key={key} 
                    className={`px-2 py-1 text-xs rounded-md flex items-center ${
                      enabled 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {enabled && <Check className="h-3 w-3 mr-1" />}
                    {permissionTypes[key as keyof typeof permissionTypes]}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 hover:border-primary hover:shadow-sm transition-all duration-200 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {getProviderIcon(device.type)}
          <div className="ml-4">
            <div className="font-medium text-gray-900 dark:text-white">{device.name}</div>
            <div className="text-sm text-muted-foreground flex items-center mt-1">
              <div className={`h-2 w-2 rounded-full mr-2 ${
                device.status === 'connected' 
                  ? 'bg-green-500' 
                  : device.status === 'disconnected' 
                    ? 'bg-red-500' 
                    : 'bg-yellow-500'
              }`}></div>
              <span className="capitalize">{device.status}</span>
              <span className="mx-1.5">•</span>
              <span>Last synced: {formatLastSynced(device.lastSynced)}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display permissions */}
      {device.permissions && Object.keys(device.permissions).length > 0 && getPermissionItems()}
      
      {/* Action buttons */}
      <div className="mt-5 flex justify-end space-x-3">
        <Button
          variant="outline"
          size="sm"
          onClick={onManage}
          className="flex items-center"
        >
          <Settings className="h-4 w-4 mr-1.5" />
          Manage
        </Button>
        <Button
          size="sm"
          onClick={onSync}
          className="flex items-center bg-primary hover:bg-primary/90"
        >
          <RefreshCw className="h-4 w-4 mr-1.5" />
          Sync Now
        </Button>
      </div>
    </div>
  );
};
