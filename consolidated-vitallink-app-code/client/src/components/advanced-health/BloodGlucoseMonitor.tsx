import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Droplets, TrendingUp, TrendingDown, AlertTriangle, Plus } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";
import { useState } from "react";

const BloodGlucoseMonitor = () => {
  const [currentReading, setCurrentReading] = useState(95);
  const [readings, setReadings] = useState([
    { time: "6AM", value: 88, status: "normal" },
    { time: "8AM", value: 142, status: "high" },
    { time: "12PM", value: 105, status: "normal" },
    { time: "3PM", value: 118, status: "normal" },
    { time: "6PM", value: 95, status: "normal" },
  ]);

  const getStatusColor = (value: number) => {
    if (value < 70) return "red";
    if (value > 140) return "red";
    if (value > 100) return "yellow";
    return "green";
  };

  const getStatusText = (value: number) => {
    if (value < 70) return "Low";
    if (value > 140) return "High";
    if (value > 100) return "Elevated";
    return "Normal";
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950 dark:to-teal-950 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-xl shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <Droplets className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Blood Glucose
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">Real-time monitoring</p>
          </div>
          <Badge 
            className={`ml-auto ${
              getStatusColor(currentReading) === "green" 
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                : getStatusColor(currentReading) === "yellow"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
            }`}
          >
            {getStatusTexcurrentReading}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 3D-style current reading display */}
        <div className="relative">
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 shadow-inner border border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <div className="flex flex-col items-center space-y-1">
                <div className="text-4xl font-bold bg-gradient-to-br from-blue-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  {currentReading}
                </div>
                <div className="text-sm font-medium text-gray-500">mg/dL</div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Current Level</p>
            </div>
          </div>
        </div>

        {/* Target range visualization */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Target Range</span>
            <span>70-100 mg/dL</span>
          </div>
          <div className="relative h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-green-400 to-red-400 rounded-full"></div>
            <div 
              className="absolute top-0 w-1 h-full bg-white border-2 border-blue-500 rounded-full shadow-lg transform transition-all duration-500"
              style={{ left: `${Math.min(Math.max((currentReading - 50) / 150 * 100, 0), 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>50</span>
            <span>100</span>
            <span>200</span>
          </div>
        </div>

        {/* Trend chart */}
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={readings}>
              <defs>
                <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#0ea5e9"
                strokeWidth={3}
                fill="url(#glucoseGradient)"
              />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Reading
          </Button>
          <Button variant="outline" size="sm" className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950">
            Trends
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BloodGlucoseMonitor;