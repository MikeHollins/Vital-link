import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smile, Frown, Meh, Heart, Brain, Plus } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState } from "react";

const MoodTracker = () => {
  const [currentMood, setCurrentMood] = useState(4);
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  const moodData = [
    { day: "Mon", mood: 4, energy: 3, stress: 2 },
    { day: "Tue", mood: 5, energy: 4, stress: 1 },
    { day: "Wed", mood: 3, energy: 2, stress: 4 },
    { day: "Thu", mood: 4, energy: 4, stress: 2 },
    { day: "Fri", mood: 5, energy: 5, stress: 1 },
    { day: "Sat", mood: 5, energy: 4, stress: 1 },
    { day: "Sun", mood: 4, energy: 3, stress: 2 },
  ];

  const moodEmojis = [
    { value: 1, emoji: "😢", label: "Very Low", color: "text-red-500", bgColor: "bg-red-50 dark:bg-red-950" },
    { value: 2, emoji: "😞", label: "Low", color: "text-orange-500", bgColor: "bg-orange-50 dark:bg-orange-950" },
    { value: 3, emoji: "😐", label: "Neutral", color: "text-yellow-500", bgColor: "bg-yellow-50 dark:bg-yellow-950" },
    { value: 4, emoji: "😊", label: "Good", color: "text-blue-500", bgColor: "bg-blue-50 dark:bg-blue-950" },
    { value: 5, emoji: "😁", label: "Excellent", color: "text-green-500", bgColor: "bg-green-50 dark:bg-green-950" },
  ];

  const getCurrentMoodInfo = () => {
    return moodEmojis.find(m => m.value === currentMood) || moodEmojis[2];
  };

  // Haptic feedback simulation
  const triggerHaptic = (intensity = 50) => {
    if (navigator.vibrate) {
      navigator.vibrate(intensity);
    }
    setIsInteracting(true);
    setTimeou( => setIsInteracting(false), 200);
  };

  const handleMoodSelect = (mood: number) => {
    triggerHaptic(mood * 20); // Variable intensity based on mood level
    setSelectedMood(mood);
    setTimeou( => {
      setCurrentMood(mood);
      setSelectedMood(null);
    }, 300);
  };

  const moodInfo = getCurrentMoodInfo();

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-xl shadow-lg transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Mood Tracker
            </span>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-normal">Mental wellness</p>
          </div>
          <Badge className="ml-auto bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
            {moodInfo.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Interactive 3D mood display */}
        <div className="relative">
          <div className={`${moodInfo.bgColor} rounded-2xl p-6 shadow-inner border border-gray-200 dark:border-gray-700 transition-all duration-500 transform ${
            isInteracting ? 'scale-105' : ''
          }`}>
            <div className="text-center">
              <div 
                className={`text-6xl mb-2 transform transition-all duration-500 cursor-pointer ${
                  selectedMood === currentMood ? 'scale-125 rotate-12' : 'hover:scale-110'
                }`}
                onMouseDown={() => triggerHaptic()}
                onTouchStart={() => triggerHaptic()}
              >
                {moodInfo.emoji}
              </div>
              <div className={`text-lg font-semibold ${moodInfo.color} transition-all duration-300`}>
                {moodInfo.label}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Today's Mood</p>
            </div>
          </div>
        </div>

        {/* Interactive mood selector with 3D effects */}
        <div className="grid grid-cols-5 gap-2">
          {moodEmojis.map((mood) => (
            <button
              key={mood.value}
              onClick={() => handleMoodSelecmood.value}
              className={`p-3 rounded-xl border-2 transition-all duration-300 transform hover:scale-110 active:scale-95 flex flex-col items-center justify-center ${
                currentMood === mood.value
                  ? "border-purple-400 bg-purple-50 dark:bg-purple-900 shadow-lg scale-105 animate-pulse"
                  : selectedMood === mood.value
                  ? "border-purple-300 bg-purple-25 dark:bg-purple-925 scale-110"
                  : "border-gray-200 dark:border-gray-700 hover:border-purple-300 hover:shadow-md"
              }`}
              style={{
                boxShadow: currentMood === mood.value ? '0 0 20px rgba(147, 51, 234, 0.3)' : '',
                animation: selectedMood === mood.value ? 'bounce 0.3s ease-in-out' : ''
              }}
            >
              <div className={`text-2xl transition-all duration-200 flex items-center justify-center ${
                selectedMood === mood.value ? 'animate-bounce' : ''
              }`}>
                {mood.emoji}
              </div>
              <div className="text-xs mt-1 font-medium text-center">{mood.value}</div>
            </button>
          ))}
        </div>

        {/* Weekly mood trend with interactive chart */}
        <div className="h-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moodData}>
              <defs>
                <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="mood"
                stroke="#a855f7"
                strokeWidth={3}
                fill="url(#moodGradient)"
                dot={{ 
                  fill: "#a855f7", 
                  strokeWidth: 2, 
                  r: 4,
                  className: "cursor-pointer hover:scale-125 transition-transform duration-200"
                }}
                activeDot={{ 
                  r: 6, 
                  fill: "#8b5cf6", 
                  stroke: "#ffffff", 
                  strokeWidth: 2,
                  className: "animate-pulse"
                }}
              />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
              <YAxis hide domain={[1, 5]} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Interactive mood insights */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-xl border border-blue-200 dark:border-blue-800 cursor-pointer transform hover:scale-105 transition-all duration-200"
            onMouseDown={() => triggerHaptic(30)}
            onTouchStart={() => triggerHaptic(30)}
          >
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Energy</span>
            </div>
            <div className="text-lg font-bold text-blue-800 dark:text-blue-200 mt-1">
              {moodData[moodData.length - 1]?.energy || 3}/5
            </div>
          </div>
          <div 
            className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-xl border border-orange-200 dark:border-orange-800 cursor-pointer transform hover:scale-105 transition-all duration-200"
            onMouseDown={() => triggerHaptic(30)}
            onTouchStart={() => triggerHaptic(30)}
          >
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-orange-600" />
              <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Stress</span>
            </div>
            <div className="text-lg font-bold text-orange-800 dark:text-orange-200 mt-1">
              {moodData[moodData.length - 1]?.stress || 2}/5
            </div>
          </div>
        </div>

        {/* Interactive quick actions */}
        <div className="flex gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
            onMouseDown={() => triggerHaptic(100)}
            onTouchStart={() => triggerHaptic(100)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Log Mood
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950 transform hover:scale-105 active:scale-95 transition-all duration-200"
            onMouseDown={() => triggerHaptic(50)}
            onTouchStart={() => triggerHaptic(50)}
          >
            Journal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodTracker;