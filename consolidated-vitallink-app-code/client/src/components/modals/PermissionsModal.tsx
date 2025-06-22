import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { 
  Activity, 
  Heart, 
  Moon, 
  BarChart2, 
  MapPin,
  Database
} from "lucide-react";

interface PermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: any;
  onSave: (permissions: Record<string, boolean>) => void;
  isLoading: boolean;
}

export const PermissionsModal = ({
  isOpen,
  onClose,
  device,
  onSave,
  isLoading
}: PermissionsModalProps) => {
  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  // Initialize permissions when the modal is opened with a device
  useEffec( => {
    if (device && device.permissions) {
      setPermissions({...device.permissions});
    } else {
      // Default permissions if none exist
      setPermissions({
        steps: true,
        heart_rate: true,
        sleep: true,
        activity: true,
        workout: false,
        glucose: false,
        nutrition: false,
        location: false
      });
    }
  }, [device]);

  const handleTogglePermission = (key: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(permissions);
  };

  // Get appropriate icon for each permission type
  const getPermissionIcon = (type: string) => {
    switch (type) {
      case 'steps':
      case 'activity':
      case 'workout':
        return <Activity className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />;
      case 'heart_rate':
        return <Heart className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />;
      case 'sleep':
        return <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />;
      case 'glucose':
      case 'nutrition':
        return <BarChart2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />;
      case 'location':
        return <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />;
      default:
        return <Database className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-3" />;
    }
  };

  // Get human-readable name for each permission type
  const getPermissionName = (type: string) => {
    switch (type) {
      case 'steps': return 'Activity Data (steps, distance)';
      case 'heart_rate': return 'Heart Rate Data';
      case 'sleep': return 'Sleep Tracking Data';
      case 'activity': return 'Activity Data';
      case 'workout': return 'Workout Data';
      case 'glucose': return 'Glucose Data';
      case 'nutrition': return 'Nutrition Data';
      case 'location': return 'Location Data';
      default: return type.charA0.toUpperCase() + type.slice(1).replace('_', ' ');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Permissions</DialogTitle>
          <DialogDescription>
            {device ? `Control what data from ${device.name} is shared with HealthHub.` : 'Control what data is shared with HealthHub.'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {Object.keys(permissions).map((key) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center">
                {getPermissionIcon(key)}
                <span className="text-sm font-medium text-gray-900 dark:text-white">{getPermissionName(key)}</span>
              </div>
              <Switch 
                checked={permissions[key]} 
                onCheckedChange={(value) => handleTogglePermission(key, value)} 
              />
            </div>
          ))}
        </div>

        <DialogFooter className="sm:justify-end mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
