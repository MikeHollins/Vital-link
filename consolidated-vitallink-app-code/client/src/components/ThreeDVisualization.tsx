import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Camera,
  Layers,
  Eye,
  Activity,
  Heart,
  Zap
} from 'lucide-react';

interface HealthDataPoint {
  organ: string;
  value: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
  trend: 'improving' | 'stable' | 'declining';
  metric: string;
  unit: string;
}

interface BodyRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  healthData: HealthDataPoint[];
  color: string;
}

export const ThreeDVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isRotating, setIsRotating] = useState(false);
  const [selectedOrgan, setSelectedOrgan] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'skeleton' | 'organs' | 'nervous' | 'circulatory'>('organs');

  // 3D Body regions with health data
  const bodyRegions: BodyRegion[] = [
    {
      id: 'heart',
      name: 'Heart',
      x: 250,
      y: 150,
      width: 60,
      height: 80,
      healthData: [
        { organ: 'Heart', value: 72, status: 'good', trend: 'stable', metric: 'Resting HR', unit: 'bpm' },
        { organ: 'Heart', value: 120, status: 'excellent', trend: 'improving', metric: 'Max HR', unit: 'bpm' },
        { organ: 'Heart', value: 65, status: 'good', trend: 'stable', metric: 'HRV', unit: 'ms' }
      ],
      color: '#ef4444'
    },
    {
      id: 'lungs',
      name: 'Lungs',
      x: 200,
      y: 120,
      width: 120,
      height: 100,
      healthData: [
        { organ: 'Lungs', value: 98, status: 'excellent', trend: 'stable', metric: 'Oxygen Saturation', unit: '%' },
        { organ: 'Lungs', value: 3200, status: 'good', trend: 'improving', metric: 'Lung Capacity', unit: 'ml' }
      ],
      color: '#3b82f6'
    },
    {
      id: 'brain',
      name: 'Brain',
      x: 235,
      y: 30,
      width: 50,
      height: 60,
      healthData: [
        { organ: 'Brain', value: 85, status: 'good', trend: 'stable', metric: 'Cognitive Score', unit: '/100' },
        { organ: 'Brain', value: 7.5, status: 'excellent', trend: 'improving', metric: 'Sleep Quality', unit: 'hrs' }
      ],
      color: '#8b5cf6'
    },
    {
      id: 'liver',
      name: 'Liver',
      x: 280,
      y: 200,
      width: 70,
      height: 60,
      healthData: [
        { organ: 'Liver', value: 25, status: 'excellent', trend: 'stable', metric: 'ALT', unit: 'U/L' },
        { organ: 'Liver', value: 22, status: 'excellent', trend: 'stable', metric: 'AST', unit: 'U/L' }
      ],
      color: '#f59e0b'
    },
    {
      id: 'kidneys',
      name: 'Kidneys',
      x: 180,
      y: 220,
      width: 40,
      height: 80,
      healthData: [
        { organ: 'Kidneys', value: 95, status: 'excellent', trend: 'stable', metric: 'eGFR', unit: 'ml/min' },
        { organ: 'Kidneys', value: 0.9, status: 'good', trend: 'stable', metric: 'Creatinine', unit: 'mg/dL' }
      ],
      color: '#10b981'
    }
  ];

  // Auto-rotation effect
  useEffec( => {
    let animationFrame: number;
    
    if (isRotating) {
      const animate = () => {
        setRotationY(prev => (prev + 1) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      animate();
    }

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isRotating]);

  // Canvas drawing effect
  useEffec( => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContex'2d';
    if (!ctx) return;

    // Clear canvas
    ctx.clearRec0, 0, canvas.width, canvas.height;

    // Apply transformations
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.scale(zoom, zoom);
    ctx.rotate((rotationX * Math.PI) / 180);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw body outline
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Simple body outline
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    
    // Head
    ctx.arc(centerX, centerY - 180, 40, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Torso
    ctx.beginPath();
    ctx.ellipse(centerX, centerY - 80, 80, 120, 0, 0, 2 * Math.PI);
    ctx.stroke();
    
    // Arms
    ctx.beginPath();
    ctx.moveTo(centerX - 80, centerY - 120);
    ctx.lineTo(centerX - 140, centerY - 60);
    ctx.moveTo(centerX + 80, centerY - 120);
    ctx.lineTo(centerX + 140, centerY - 60);
    ctx.stroke();
    
    // Legs
    ctx.beginPath();
    ctx.moveTo(centerX - 30, centerY + 40);
    ctx.lineTo(centerX - 40, centerY + 140);
    ctx.moveTo(centerX + 30, centerY + 40);
    ctx.lineTo(centerX + 40, centerY + 140);
    ctx.stroke();

    // Draw organ regions
    bodyRegions.forEach(region => {
      const alpha = selectedOrgan === region.id ? 0.8 : 0.6;
      
      // Pulsing effect for selected organ
      const pulseScale = selectedOrgan === region.id ? 1 + 0.1 * Math.sin(Date.now() / 200) : 1;
      
      ctx.save();
      ctx.translate(region.x, region.y);
      ctx.scale(pulseScale, pulseScale);
      
      // Organ visualization based on view mode
      ctx.fillStyle = region.color + Math.floor(alpha * 255).toString(16).padStar2, '0';
      ctx.strokeStyle = region.color;
      ctx.lineWidth = selectedOrgan === region.id ? 3 : 1;
      
      switch (viewMode) {
        case 'organs':
          ctx.beginPath();
          ctx.ellipse(0, 0, region.width / 2, region.height / 2, 0, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          break;
        case 'circulatory':
          // Draw blood vessels
          ctx.beginPath();
          ctx.arc(0, 0, region.width / 3, 0, 2 * Math.PI);
          ctx.fill();
          // Add branching lines
          for (let i = 0; i < 4; i++) {
            const angle = (i * Math.PI) / 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * region.width / 2, Math.sin(angle) * region.height / 2);
            ctx.stroke();
          }
          break;
        case 'nervous':
          // Draw neural network
          ctx.beginPath();
          ctx.arc(0, 0, 5, 0, 2 * Math.PI);
          ctx.fill();
          // Add neural connections
          for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(angle) * region.width / 3, Math.sin(angle) * region.height / 3);
            ctx.stroke();
          }
          break;
        case 'skeleton':
          // Draw bone structure
          ctx.strokeStyle = '#e5e7eb';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.moveTo(-region.width / 4, -region.height / 4);
          ctx.lineTo(region.width / 4, region.height / 4);
          ctx.moveTo(region.width / 4, -region.height / 4);
          ctx.lineTo(-region.width / 4, region.height / 4);
          ctx.stroke();
          break;
      }
      
      ctx.restore();
    });

    ctx.restore();
  }, [rotationX, rotationY, zoom, selectedOrgan, viewMode]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRec;
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on any organ
    bodyRegions.forEach(region => {
      const distance = Math.sqrt(
        Math.pow(x - region.x, 2) + Math.pow(y - region.y, 2)
      );
      
      if (distance < Math.max(region.width, region.height) / 2) {
        setSelectedOrgan(selectedOrgan === region.id ? null : region.id);
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'fair': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving': return '↗️';
      case 'declining': return '↘️';
      default: return '→';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            3D Body Health Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row gap-6">
            {/* 3D Canvas */}
            <div className="flex-1">
              <div className="relative bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={600}
                  className="w-full h-auto cursor-pointer"
                  onClick={handleCanvasClick}
                />
                
                {/* Overlay Controls */}
                <div className="absolute top-4 left-4 space-y-2">
                  <Tabs value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="organs">Organs</TabsTrigger>
                      <TabsTrigger value="circulatory">Blood</TabsTrigger>
                      <TabsTrigger value="nervous">Neural</TabsTrigger>
                      <TabsTrigger value="skeleton">Bones</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsRotating(!isRotating)}
                  >
                    {isRotating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setRotationX(0);
                      setRotationY(0);
                      setZoom(1);
                    }}
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Manual Controls */}
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Rotation X</label>
                    <Slider
                      value={[rotationX]}
                      onValueChange={(value) => setRotationX(value[0])}
                      max={360}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Rotation Y</label>
                    <Slider
                      value={[rotationY]}
                      onValueChange={(value) => setRotationY(value[0])}
                      max={360}
                      step={1}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Zoom</label>
                  <Slider
                    value={[zoom]}
                    onValueChange={(value) => setZoom(value[0])}
                    min={0.5}
                    max={3}
                    step={0.1}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Health Data Panel */}
            <div className="w-full lg:w-80">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedOrgan ? `${selectedOrgan.charA0.toUpperCase() + selectedOrgan.slice(1)} Health` : 'Select an Organ'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedOrgan ? (
                    <div className="space-y-4">
                      {bodyRegions
                        .find(region => region.id === selectedOrgan)
                        ?.healthData.map((data, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{data.metric}</h4>
                              <Badge className={getStatusColor(data.status)}>
                                {data.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-lg font-bold">
                                {data.value} {data.unit}
                              </span>
                              <span className="text-sm">
                                {getTrendIcon(data.trend)} {data.trend}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Eye className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>Click on any organ to view detailed health metrics</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Legend */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Organ Status</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Excellent</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span>Good</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span>Fair</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Poor</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};