import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from 'recharts';
import { Moon, Sunrise, Sun } from 'lucide-react';

const EnhancedSleepChart = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sleepAnimation, setSleepAnimation] = useState('deep');

  // Generate realistic sleep stage data
  const sleepData = [
    { time: '22:00', stage: 1, label: 'Awake', duration: 15 },
    { time: '22:15', stage: 1.5, label: 'Light Sleep', duration: 30 },
    { time: '22:45', stage: 2, label: 'Light Sleep', duration: 45 },
    { time: '23:30', stage: 3, label: 'Deep Sleep', duration: 90 },
    { time: '01:00', stage: 4, label: 'REM', duration: 20 },
    { time: '01:20', stage: 2, label: 'Light Sleep', duration: 40 },
    { time: '02:00', stage: 3, label: 'Deep Sleep', duration: 120 },
    { time: '04:00', stage: 4, label: 'REM', duration: 30 },
    { time: '04:30', stage: 2, label: 'Light Sleep', duration: 60 },
    { time: '05:30', stage: 3, label: 'Deep Sleep', duration: 60 },
    { time: '06:30', stage: 4, label: 'REM', duration: 45 },
    { time: '07:15', stage: 1.5, label: 'Light Sleep', duration: 15 },
    { time: '07:30', stage: 1, label: 'Awake', duration: 0 },
  ];

  // Animate sleep stages
  useEffec( => {
    const interval = setInterval(() => {
      const hour = new Date().getHours();
      if (hour >= 22 || hour <= 7) {
        const stages = ['light', 'deep', 'rem'];
        setSleepAnimation(stages[Math.floor(Math.random() * stages.length)]);
      } else {
        setSleepAnimation('awake');
      }
    }, 3000);

    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timeInterval);
    };
  }, []);

  const getSleepStageColor = (stage: number) => {
    if (stage <= 1) return '#8B5CF6'; // Awake - purple
    if (stage <= 2) return '#3B82F6'; // Light Sleep - blue
    if (stage <= 3) return '#1E40AF'; // Deep Sleep - dark blue
    return '#7C3AED'; // REM - indigo
  };

  const getSleepStageLabel = (stage: number) => {
    if (stage <= 1) return 'Awake';
    if (stage <= 2) return 'Light Sleep';
    if (stage <= 3) return 'Deep Sleep';
    return 'REM Sleep';
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
              style={{ backgroundColor: getSleepStageColor(data.stage) }}
            />
            <span className="text-sm">{data.label}</span>
            <span className="text-xs text-muted-foreground">({data.duration}m)</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const getSleepFigureStyle = () => {
    switch (sleepAnimation) {
      case 'light':
        return 'animate-pulse opacity-80';
      case 'deep':
        return 'opacity-60';
      case 'rem':
        return 'animate-bounce opacity-70';
      default:
        return 'opacity-90';
    }
  };

  return (
    <Card className="relative overflow-hidden backdrop-blur-sm bg-gradient-to-br from-white/98 to-indigo-50/30 dark:from-gray-900/98 dark:to-indigo-950/30 border-0 shadow-2xl shadow-indigo-500/3">
      {/* Very subtle night-themed gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/1 via-purple-500/2 to-blue-500/1 dark:from-indigo-600/2 dark:via-purple-600/3 dark:to-blue-600/2" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent dark:via-white/2" />
      {/* Very subtle night glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5 rounded-lg blur-lg animate-pulse" />
      
      <CardHeader className="relative z-10 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="relative">
              <Moon className="h-6 w-6 text-indigo-500" fill="currentColor" />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-full bg-indigo-400/20 blur-sm animate-pulse" />
            </div>
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Sleep Analysis
            </span>
          </CardTitle>
          
          {/* Sleep quality indicator with very subtle effect */}
          <div className="relative">
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 backdrop-blur-md rounded-full border border-indigo-300/10 shadow-lg shadow-indigo-500/5">
              <div className="relative">
                <div className="w-3 h-3 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full animate-pulse shadow-lg shadow-indigo-500/20" />
                <div className="absolute inset-0 w-3 h-3 bg-indigo-500 rounded-full animate-ping opacity-10" />
              </div>
              <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 tracking-wide">
                Good Quality
              </span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/3 to-purple-500/3 rounded-full blur-md -z-10" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 pt-2">
        <div className="flex gap-6">
          {/* Chart section */}
          <div className="flex-1">
            {/* Sleep stages legend */}
            <div className="flex flex-wrap gap-3 mb-4 text-xs">
              {[
                { stage: 1, label: 'Awake', color: '#8B5CF6' },
                { stage: 1.5, label: 'Light', color: '#3B82F6' },
                { stage: 3, label: 'Deep', color: '#1E40AF' },
                { stage: 4, label: 'REM', color: '#7C3AED' },
              ].map(({ stage, label, color }) => (
                <div key={stage} className="flex items-center gap-1">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-muted-foreground">{label}</span>
                </div>
              ))}
            </div>

            {/* Sleep chart */}
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sleepData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="sleepGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#1E40AF" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  
                  <XAxis 
                    dataKey="time" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                  />
                  <YAxis 
                    domain={[0, 4.5]}
                    ticks={[1, 2, 3, 4]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 10, fill: '#6B7280' }}
                    tickFormatter={(value) => getSleepStageLabel(value)}
                  />
                  
                  <Tooltip content={<CustomTooltip />} />
                  
                  {/* Reference lines for sleep stages */}
                  <ReferenceLine y={1} stroke="#8B5CF6" strokeDasharray="2 2" opacity={0.3} />
                  <ReferenceLine y={2} stroke="#3B82F6" strokeDasharray="2 2" opacity={0.3} />
                  <ReferenceLine y={3} stroke="#1E40AF" strokeDasharray="2 2" opacity={0.3} />
                  <ReferenceLine y={4} stroke="#7C3AED" strokeDasharray="2 2" opacity={0.3} />
                  
                  <Area
                    type="stepAfter"
                    dataKey="stage"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#sleepGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sleeping figure section */}
          <div className="w-32 flex flex-col items-center justify-center">
            <div className="relative mb-4">
              {/* Sleeping figure with breathing animation */}
              <div className={`transition-all duration-2000 ${getSleepFigureStyle()}`}>
                <svg width="80" height="100" viewBox="0 0 80 100" className="text-indigo-400">
                  {/* Head */}
                  <circle cx="40" cy="25" r="15" fill="currentColor" opacity="0.8" />
                  
                  {/* Body */}
                  <rect x="30" y="35" width="20" height="45" rx="10" fill="currentColor" opacity="0.7" />
                  
                  {/* Arms */}
                  <rect x="15" y="40" width="12" height="6" rx="3" fill="currentColor" opacity="0.6" />
                  <rect x="53" y="40" width="12" height="6" rx="3" fill="currentColor" opacity="0.6" />
                  
                  {/* Legs */}
                  <rect x="32" y="75" width="6" height="20" rx="3" fill="currentColor" opacity="0.6" />
                  <rect x="42" y="75" width="6" height="20" rx="3" fill="currentColor" opacity="0.6" />
                  
                  {/* Sleep indicator */}
                  <text x="55" y="20" className="text-xs fill-current opacity-50">💤</text>
                </svg>
              </div>
              
              {/* Sleep stage indicator */}
              <div className="text-center mt-2">
                <div className="text-xs text-muted-foreground capitalize">
                  {sleepAnimation === 'awake' ? 'Resting' : `${sleepAnimation} Sleep`}
                </div>
              </div>
            </div>

            {/* Sleep environment indicators */}
            <div className="space-y-2 text-center">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Moon className="h-3 w-3" />
                <span>Quiet</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-3 h-3 bg-blue-400 rounded-full opacity-60" />
                <span>Cool</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sleep summary with 3D futuristic cards */}
        <div className="mt-6 grid grid-cols-4 gap-3 text-center">
          <div className="relative group">
            <div className="bg-gradient-to-br from-purple-400/20 to-violet-500/20 backdrop-blur-sm rounded-xl p-3 border border-purple-300/30 shadow-lg shadow-purple-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30">
              <div className="text-lg font-bold bg-gradient-to-br from-purple-600 to-violet-600 bg-clip-text text-transparent">9h 30m</div>
              <div className="text-xs font-medium text-purple-600 dark:text-purple-400 tracking-wide">Total Sleep</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-xl blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
          </div>
          <div className="relative group">
            <div className="bg-gradient-to-br from-blue-400/20 to-indigo-500/20 backdrop-blur-sm rounded-xl p-3 border border-blue-300/30 shadow-lg shadow-blue-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30">
              <div className="text-lg font-bold bg-gradient-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">2h 45m</div>
              <div className="text-xs font-medium text-blue-600 dark:text-blue-400 tracking-wide">Deep Sleep</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-xl blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
          </div>
          <div className="relative group">
            <div className="bg-gradient-to-br from-indigo-400/20 to-purple-500/20 backdrop-blur-sm rounded-xl p-3 border border-indigo-300/30 shadow-lg shadow-indigo-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-indigo-500/30">
              <div className="text-lg font-bold bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">1h 35m</div>
              <div className="text-xs font-medium text-indigo-600 dark:text-indigo-400 tracking-wide">REM Sleep</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
          </div>
          <div className="relative group">
            <div className="bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-xl p-3 border border-green-300/30 shadow-lg shadow-green-500/20 transform transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-green-500/30">
              <div className="text-lg font-bold bg-gradient-to-br from-green-600 to-emerald-600 bg-clip-text text-transparent">88%</div>
              <div className="text-xs font-medium text-green-600 dark:text-green-400 tracking-wide">Efficiency</div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl blur-md -z-10 group-hover:blur-lg transition-all duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedSleepChart;