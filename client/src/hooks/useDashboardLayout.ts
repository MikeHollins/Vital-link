import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Widget {
  id: string;
  type: 'metric' | 'insight' | 'chart' | 'goal';
  title: string;
  size: 'small' | 'medium' | 'large';
  position: number;
  visible: boolean;
  data?: any;
}

interface DashboardLayout {
  widgets: Widget[];
  lastUpdated: Date;
}

function getDefaultWidgets(): Widget[] {
  return [
    {
      id: '1',
      type: 'metric',
      title: 'Heart Rate',
      size: 'small',
      position: 0,
      visible: true,
      data: { value: 72, unit: 'bpm', progress: 60 }
    },
    {
      id: '2',
      type: 'metric',
      title: 'Steps',
      size: 'medium',
      position: 1,
      visible: true,
      data: { value: 8234, unit: 'steps', progress: 82 }
    },
    {
      id: '3',
      type: 'metric',
      title: 'Sleep',
      size: 'medium',
      position: 2,
      visible: true,
      data: { value: 7.5, unit: 'hours', progress: 94 }
    },
    {
      id: '4',
      type: 'insight',
      title: 'Health Insights',
      size: 'large',
      position: 3,
      visible: true,
      data: { description: 'Your sleep quality has improved 15% this week. Keep up the good work!' }
    }
  ];
}

export function useDashboardLayout() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved layout on component mount
  useEffect(() => {
    if (user) {
      loadDashboardLayout();
    }
  }, [user]);

  const loadDashboardLayout = async () => {
    try {
      setIsLoading(true);
      
      // Try to load from server first
      const response = await fetch('/api/dashboard-layout', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const layout = await response.json();
        setWidgets(layout.widgets || getDefaultWidgets());
      } else {
        // Fallback to localStorage
        const savedLayout = localStorage.getItem(`dashboard-layout-${user?.id || 'default'}`);
        if (savedLayout) {
          const layout: DashboardLayout = JSON.parse(savedLayout);
          setWidgets(layout.widgets);
        } else {
          setWidgets(getDefaultWidgets());
        }
      }
    } catch (error) {
      console.error('Failed to load dashboard layout:', error);
      setWidgets(getDefaultWidgets());
    } finally {
      setIsLoading(false);
    }
  };

  const saveDashboardLayout = async (newWidgets: Widget[]) => {
    const layout: DashboardLayout = {
      widgets: newWidgets,
      lastUpdated: new Date()
    };

    try {
      // Save to server
      const response = await fetch('/api/dashboard-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(layout)
      });

      if (!response.ok) {
        throw new Error('Failed to save to server');
      }

      // Also save to localStorage as backup
      if (user?.claims?.sub) {
        localStorage.setItem(`dashboard-layout-${user.claims.sub}`, JSON.stringify(layout));
      }

      setWidgets(newWidgets);
    } catch (error) {
      console.error('Failed to save dashboard layout:', error);
      
      // Fallback to localStorage only
      if (user?.claims?.sub) {
        localStorage.setItem(`dashboard-layout-${user.claims.sub}`, JSON.stringify(layout));
        setWidgets(newWidgets);
        toast({
          title: "Layout Saved Locally",
          description: "Dashboard layout saved to your device",
        });
      }
    }
  };

  const addWidget = useCallback((widgetConfig: Omit<Widget, 'id' | 'position'>) => {
    const newWidget: Widget = {
      ...widgetConfig,
      id: Date.now().toString(),
      position: widgets.length,
    };
    const newWidgets = [...widgets, newWidget];
    saveDashboardLayout(newWidgets);
  }, [widgets]);

  const removeWidget = useCallback((widgetId: string) => {
    const newWidgets = widgets.filter(w => w.id !== widgetId);
    saveDashboardLayout(newWidgets);
  }, [widgets]);

  const updateWidgetOrder = useCallback((newWidgets: Widget[]) => {
    const reorderedWidgets = newWidgets.map((widget, index) => ({
      ...widget,
      position: index
    }));
    saveDashboardLayout(reorderedWidgets);
  }, []);

  const resetToDefault = useCallback(() => {
    saveDashboardLayout(getDefaultWidgets());
    toast({
      title: "Dashboard Reset",
      description: "Dashboard layout has been reset to default",
    });
  }, [toast]);

  return {
    widgets,
    isLoading,
    addWidget,
    removeWidget,
    updateWidgetOrder,
    resetToDefault,
    saveDashboardLayout
  };
}