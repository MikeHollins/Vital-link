import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, TrendingUp, Activity, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState } from "react";

const BloodPressureMonitor = () => {
  const [currentSystolic, setCurrentSystolic] = useState(118);
  const [currentDiastolic, setCurrentDiastolic] = useState(76);
  const [isPressed, setIsPressed] = useState(false);

  const readings = [
    { time: "Mon", systolic: 120, diastolic: 80 },
    { time: "Tue", systolic: 118, diastolic: 78 },
    { time: "Wed", systolic: 122, diastolic: 82 },
    { time: "Thu", systolic: 116, diastolic: 74 },
    { time: "Fri", systolic: 118, diastolic: 76 },
  ];

  const getBloodPressureCategory = (systolic: number, diastolic: number) => {
    if (systolic < 90 || diastolic < 60) return { category: "Low", color: "blue" };
    if (systolic < 120 && diastolic < 80) return { category: "Normal", color: "green" };
    if (systolic < 130 && diastolic < 80) return { category: "Elevated", color: "yellow" };
    if (systolic < 140 || diastolic < 90) return { category: "Stage 1", color: "orange" };
    return { category: "Stage 2", color: "red" };
  };

  const status = getBloodPressureCategory(currentSystolic, currentDiastolic);

  // Simulate haptic feedback
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // Short haptic pulse
    }
    setIsPressed(true);
    setTimeou( => setIsPressed(false), 150);
  };

  return (
    <Card className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950 dark:to-pink-950 border-red-200 dark:border-red-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-red-500 rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-transform duration-300">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              Blood Pressure
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">Cardiovascular health</p>
          </div>
          <Badge 
            className={`ml-auto ${
              status.color === "green" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                : status.color === "yellow"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : status.color === "orange"
                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                : status.color === "red"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            }`}
          >
            {status.category}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interactive 3D dual reading display */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-inner border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 transform ${
              isPressed ? 'scale-95 shadow-sm' : 'hover:scale-105 hover:shadow-lg'
            }`}
            onMouseDown={triggerHaptic}
            onTouchStart={triggerHaptic}
          >
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-br from-red-600 via-pink-600 to-rose-600 bg-clip-text text-transparent">
                {currentSystolic}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Systolic</p>
            </div>
          </div>
          <div 
            className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-4 shadow-inner border border-gray-200 dark:border-gray-700 cursor-pointer transition-all duration-200 transform ${
              isPressed ? 'scale-95 shadow-sm' : 'hover:scale-105 hover:shadow-lg'
            }`}
            onMouseDown={triggerHaptic}
            onTouchStart={triggerHaptic}
          >
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-br from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                {currentDiastolic}
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Diastolic</p>
            </div>
          </div>
        </div>

        {/* Interactive pressure visualization */}
        <div className="relative">
          <div className="bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 to-red-400 h-4 rounded-full shadow-inner"></div>
          <div 
            className="absolute top-0 h-4 w-1 bg-white border-2 border-red-500 rounded-full shadow-lg transform transition-all duration-500 cursor-pointer hover:scale-110"
            style={{ left: `${Math.min(Math.max((currentSystolic - 80) / 100 * 100, 0), 100)}%` }}
            onMouseDown={triggerHaptic}
            onTouchStart={triggerHaptic}
          >
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>80</span>
            <span>120 (Normal)</span>
            <span>180</span>
          </div>
        </div>

        {/* Trend chart with interactive elements */}
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={readings}>
              <defs>
                <linearGradient id="systolicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="diastolicGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="systolic"
                stroke="#ef4444"
                strokeWidth={2}
                fill="url(#systolicGradient)"
              />
              <Area
                type="monotone"
                dataKey="diastolic"
                stroke="#ec4899"
                strokeWidth={2}
                fill="url(#diastolicGradient)"
              />
              <ReferenceLine y={120} stroke="#10b981" strokeDasharray="3 3" />
              <ReferenceLine y={80} stroke="#10b981" strokeDasharray="3 3" />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide domain={[60, 140]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive quick actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            onMouseDown={triggerHaptic}
            onTouchStart={triggerHaptic}
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Reading
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950 transform hover:scale-105 active:scale-95 transition-all duration-200"
            onMouseDown={triggerHaptic}
            onTouchStart={triggerHaptic}
          >
            History
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodPressureMonitor;