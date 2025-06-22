import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { Heart, Activity } from 'lucide-react';
import anatomicalHeartImage from '@assets/image_1747968153233.png';

const EnhancedHeartRateChart = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  const [currentHeartRate, setCurrentHeartRate] = useState(72);

  // Generate realistic heart rate data
  const heartRateData = [
    { time: '00:00', rate: 65, zone: 'resting' },
    { time: '06:00', rate: 68, zone: 'resting' },
    { time: '07:30', rate: 85, zone: 'light' },
    { time: '08:00', rate: 125, zone: 'moderate' },
    { time: '08:30', rate: 155, zone: 'vigorous' },
    { time: '09:00', rate: 145, zone: 'moderate' },
    { time: '09:30', rate: 95, zone: 'light' },
    { time: '10:00', rate: 75, zone: 'resting' },
    { time: '12:00', rate: 78, zone: 'resting' },
    { time: '14:00', rate: 82, zone: 'light' },
    { time: '16:00', rate: 76, zone: 'resting' },
    { time: '18:00', rate: 110, zone: 'moderate' },
    { time: '19:00', rate: 85, zone: 'light' },
    { time: '22:00', rate: 72, zone: 'resting' },
    { time: '23:59', rate: 62, zone: 'resting' },
  ];

  // Animate heart rate changes
  useEffec( => {
    const interval = setInterval(() => {
      const variation = Math.random() * 6 - 3; // ±3 BPM variation
      setCurrentHeartRate(prev => Math.max(60, Math.min(100, prev + variation)));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getZoneColor = (zone: string) => {
    switch (zone) {
      case 'resting': return '#10B981'; // green
      case 'light': return '#3B82F6'; // blue
      case 'moderate': return '#F59E0B'; // amber
      case 'vigorous': return '#EF4444'; // red
      default: return '#6B7280';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-3 shadow-xl">
          <p className="text-sm font-medium">{label}</p>
          <div className="flex items-center gap-2 mt-1">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getZoneColor(data.zone) }}
            />
            <span className="text-sm">{data.rate} BPM</span>
            <span className="text-xs text-muted-foreground capitalize">({data.zone})</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white/98 to-red-50/30 dark:from-gray-900/98 dark:to-red-950/30 border-0 shadow-2xl shadow-red-500/3">
      {/* Very subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/1 via-pink-500/2 to-orange-500/1 dark:from-red-600/2 dark:via-pink-600/3 dark:to-orange-600/2" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/2" />
      {/* Very subtle glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-red-500/5 via-pink-500/5 to-orange-500/5 rounded-lg blur-lg animate-pulse" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="relative">
              <img 
                src={anatomicalHeartImage}
                alt="Anatomical Heart"
                className="h-8 w-8 object-contain"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(220, 38, 38, 0.3)) brightness(1.1) contras1.1'
                }}
              />
            </div>
            <span className="bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Heart Rate
            </span>
          </CardTitle>
          
          {/* Live heart rate display with very subtle effect */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/5 to-pink-500/5 backdrop-blur-md rounded-full border border-red-300/10 shadow-lg shadow-red-500/5">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg shadow-red-500/20" />
              </div>
              <span className="text-sm font-bold text-red-700 dark:text-red-300 tracking-wide">
                {Math.round(currentHeartRate)} BPM
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/3 to-pink-500/3 rounded-full blur-md -z-10" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-2">
        {/* Heart rate zones legend */}
        <div className="flex flex-wrap gap-3 mb-4 text-xs">
          {[
            { zone: 'resting', label: 'Resting', color: '#10B981' },
            { zone: 'light', label: 'Light', color: '#3B82F6' },
            { zone: 'moderate', label: 'Moderate', color: '#F59E0B' },
            { zone: 'vigorous', label: 'Vigorous', color: '#EF4444' },
          ].map(({ zone, label, color }) => (
            <div key={zone} className="flex items-center gap-1">
              <div 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>

        {/* Main chart */}
        <div className="h-64 relative">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={heartRateData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <defs>
                <linearGradient id="heartRateGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <XAxis 
                dataKey="time" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6B7280' }}
              />
              <YAxis 
                domain={[50, 180]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6B7280' }}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {/* Main heart rate line with gradient fill */}
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#EF4444"
                strokeWidth={3}
                fill="url(#heartRateGradient)"
                dot={{ r: 4, fill: '#EF4444', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ 
                  r: 6, 
                  fill: '#EF4444', 
                  stroke: '#fff', 
                  strokeWidth: 3,
                  style: { filter: 'drop-shadow(0 0 6px rgba(239, 68, 68, 0.6))' }
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Hand-drawn style connection diagram overlay */}
          <div className="absolute top-4 right-4 opacity-20 pointer-events-none">
            <svg width="100" height="80" viewBox="0 0 100 80" className="text-red-300">
              {/* Casual hand-drawn style paths */}
              <path
                d="M10,40 Q30,20 50,40 T90,35"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray="3,2"
                className="animate-pulse"
              />
              <circle cx="50" cy="40" r="4" fill="currentColor" className="animate-ping" />
              <text x="55" y="45" className="text-xs fill-current">❤️</text>
            </svg>
          </div>
        </div>

        {/* Heart rate insights with 3D cards */}
        <div className="mt-6 grid grid-cols-3 gap-4 text-center">
          <div className="relative group">
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-4 border border-green-300/30 shadow-lg shadow-green-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30">
              <div className="text-xl font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">65</div>
              <div className="text-xs font-medium text-green-600 dark:text-green-400 tracking-wide">Resting HR</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
          </div>
          <div className="relative group">
            <div className="bg-gradient-to-br from-orange-400/20 to-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-orange-300/30 shadow-lg shadow-orange-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/30">
              <div className="text-xl font-bold bg-gradient-to-br from-orange-600 to-red-600 bg-clip-text text-transparent">155</div>
              <div className="text-xs font-medium text-orange-600 dark:text-orange-400 tracking-wide">Max Today</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
          </div>
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-400/20 to-cyan-500/20 backdrop-blur-sm rounded-xl p-4 border border-blue-300/30 shadow-lg shadow-blue-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30">
              <div className="text-xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">28m</div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 tracking-wide">Active Zone</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedHeartRateChart;