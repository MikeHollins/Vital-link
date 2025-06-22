import React, { useState, useCallback } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { 
  Heart, 
  Activity, 
  Moon, 
  Footprints, 
  Scale, 
  Thermometer,
  Zap,
  Brain,
  Target,
  TrendingUp,
  Plus,
  GripVertical,
  X,
  BarChart,
  LayoutGrid
} from 'lucide-react';
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

interface DragDropDashboardProps {
  userId?: string;
}

const getIconForMetric = (title: string) => {
  const iconMap: { [key: string]: React.ReactNode } = {
    'Heart Rate': <Heart className="h-4 w-4 text-red-500" />,
    'Steps': <Footprints className="h-4 w-4 text-blue-500" />,
    'Sleep': <Moon className="h-4 w-4 text-purple-500" />,
    'Weight': <Scale className="h-4 w-4 text-green-500" />,
    'Temperature': <Thermometer className="h-4 w-4 text-orange-500" />,
    'Energy': <Zap className="h-4 w-4 text-yellow-500" />,
    'Activity': <Activity className="h-4 w-4 text-indigo-500" />,
  };
  return iconMap[title] || <Activity className="h-4 w-4" />;
};

const availableWidgets = [
  { type: 'metric', title: 'Heart Rate', size: 'small', visible: true, data: { value: 72, unit: 'bpm', progress: 60 } },
  { type: 'metric', title: 'Steps', size: 'medium', visible: true, data: { value: 8234, unit: 'steps', progress: 82 } },
  { type: 'metric', title: 'Sleep', size: 'medium', visible: true, data: { value: 7.5, unit: 'hours', progress: 94 } },
  { type: 'metric', title: 'Weight', size: 'small', visible: true, data: { value: 155, unit: 'lbs', progress: 68 } },
  { type: 'metric', title: 'Energy', size: 'small', visible: true, data: { value: 85, unit: '%', progress: 85 } },
  { type: 'metric', title: 'Temperature', size: 'small', visible: true, data: { value: 98.6, unit: '°F', progress: 50 } },
  { type: 'insight', title: 'Health Insights', size: 'large', visible: true, data: { description: 'Your sleep quality has improved 15% this week. Your heart rate variability shows good recovery patterns.' } },
  { type: 'insight', title: 'Activity Insights', size: 'large', visible: true, data: { description: 'You\'ve been more active this week! Your step count increased by 23% compared to last week.' } },
  { type: 'chart', title: 'Weekly Trends', size: 'large', visible: true, data: { chartType: 'line' } },
  { type: 'chart', title: 'Monthly Overview', size: 'large', visible: true, data: { chartType: 'bar' } },
  { type: 'goal', title: 'Daily Goals', size: 'medium', visible: true, data: { progress: 82 } },
  { type: 'goal', title: 'Weekly Targets', size: 'medium', visible: true, data: { progress: 67 } },
];

const SortableWidget: React.FC<{ widget: Widget; onRemove: (id: string) => void }> = ({ widget, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
  };

  const renderWidgetContent = () => {
    switch (widget.type) {
      case 'metric':
        return (
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-md bg-primary/10">
                {getIconForMetric(widget.title)}
              </div>
              <div className="ml-3">
                <div className="flex items-baseline">
                  <p className="text-2xl font-semibold">{widget.data?.value || '0'}</p>
                  <p className="ml-2 text-sm text-muted-foreground">{widget.data?.unit || ''}</p>
                </div>
              </div>
            </div>
            {widget.data?.progress !== undefined && (
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${widget.data.progress}%` }}
                />
              </div>
            )}
          </div>
        );
      case 'insight':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <Brain className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Health Insight</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {widget.data?.description || 'No insights available'}
            </p>
          </div>
        );
      case 'chart':
        return (
          <div className="h-24 bg-muted rounded flex items-center justify-center text-sm text-muted-foreground">
            <BarChart className="h-6 w-6 mr-2" />
            Chart Visualization
          </div>
        );
      case 'goal':
        return (
          <div className="space-y-2">
            <div className="flex items-center">
              <Target className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Progress</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Completion</span>
              <span>{widget.data?.progress || 0}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all" 
                style={{ width: `${widget.data?.progress || 0}%` }}
              />
            </div>
          </div>
        );
      default:
        return <div className="text-sm text-muted-foreground">Widget Content</div>;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} className={`${widget.size === 'large' ? 'col-span-2' : ''}`}>
      <Card className={`relative group transition-all duration-200 hover:shadow-md ${isDragging ? 'shadow-xl ring-2 ring-primary scale-105' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center">
              {getIconForMetric(widget.title)}
              <span className="ml-2">{widget.title}</span>
              <Badge variant="outline" className="ml-2 text-xs">
                {widget.size}
              </Badge>
            </CardTitle>
            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 cursor-grab active:cursor-grabbing hover:bg-muted"
                {...listeners}
              >
                <GripVertical className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onRemove(widget.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {renderWidgetContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export const DragDropDashboard: React.FC<DragDropDashboardProps> = ({ userId }) => {
  const { widgets, isLoading, addWidget, removeWidget, updateWidgetOrder, resetToDefault } = useDashboardLayout();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showAddWidget, setShowAddWidget] = useState(false);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = widgets.findIndex(item => item.id === active.id);
      const newIndex = widgets.findIndex(item => item.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(widgets, oldIndex, newIndex);
        updateWidgetOrder(newItems);
        toast({
          title: "Layout Updated",
          description: "Widget moved successfully",
        });
      }
    }

    setActiveId(null);
  }, [widgets, updateWidgetOrder, toast]);

  const handleRemoveWidget = useCallback((widgetId: string) => {
    removeWidget(widgetId);
    toast({
      title: "Widget Removed",
      description: "Widget has been removed from dashboard",
    });
  }, [removeWidget, toast]);

  const handleAddWidget = useCallback((widgetConfig: any) => {
    addWidget(widgetConfig);
    setShowAddWidget(false);
    toast({
      title: "Widget Added",
      description: `${widgetConfig.title} has been added to dashboard`,
    });
  }, [addWidget, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {'customDashboard'}
          </h1>
          <p className="text-muted-foreground">{'dragAndDropInstructions'}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={resetToDefault}
            className="flex items-center gap-2"
          >
            Reset
          </Button>
          <Button onClick={() => setShowAddWidget(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Widget
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map((widget) => (
              <SortableWidget
                key={widget.id}
                widget={widget}
                onRemove={handleRemoveWidget}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {widgets.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <LayoutGrid className="h-8 w-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">No widgets added yet</h3>
            <p className="text-muted-foreground mb-4">Start building your personalized dashboard</p>
          </div>
          <Button onClick={() => setShowAddWidget(true)} variant="outline" size="lg">
            <Plus className="h-4 w-4 mr-2" />
            Add Your First Widget
          </Button>
        </div>
      )}

      <Dialog open={showAddWidget} onOpenChange={setShowAddWidget}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Widget to Dashboard</DialogTitle>
            <DialogDescription>
              Choose from available health metrics and tools to customize your dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {availableWidgets
              .filter(widget => !widgets.some(w => w.title === widget.title))
              .map((widget, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:bg-muted/50 hover:shadow-md transition-all duration-200 active:scale-95 border-2 hover:border-primary/20"
                onClick={() => handleAddWidget(widget)}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center justify-between">
                    <span className="flex items-center">
                      {getIconForMetric(widget.title)}
                      <span className="ml-2">{widget.title}</span>
                    </span>
                    <Badge variant="outline" className="text-xs capitalize">
                      {widget.size}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    {widget.type === 'metric' && 'Track and monitor health metrics'}
                    {widget.type === 'insight' && 'AI-powered health insights and recommendations'}
                    {widget.type === 'chart' && 'Visual data analysis and trends'}
                    {widget.type === 'goal' && 'Progress tracking and goal management'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground flex items-center">
                    <span className="capitalize">{widget.type}</span>
                    <span className="mx-1">•</span>
                    <span>{widget.size} widget</span>
                  </div>
                </CardContent>
              </Card>
            ))}
            {availableWidgets.filter(widget => !widgets.some(w => w.title === widget.title)).length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground">
                All available widgets have been added to your dashboard
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DragDropDashboard;