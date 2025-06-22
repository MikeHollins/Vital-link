import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Calendar, BarChart3, Eye } from 'lucide-react';


interface MetricData {
  current: number;
  goal?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  trendPercentage: number;
}

interface DetailedView {
  period: 'today' | 'week' | 'month' | 'insights';
  title: string;
  data: any;
}

interface SwipeableMetricCardProps {
  title: string;
  icon: React.ReactNode;
  metric: MetricData;
  color: string;
  detailedViews: DetailedView[];
}

export const SwipeableMetricCard: React.FC<SwipeableMetricCardProps> = ({
  title,
  icon,
  metric,
  color,
  detailedViews
}) => {
  const [currentView, setCurrentView] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationDirection, setAnimationDirection] = useState<'left' | 'right' | null>(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [hasUserSwiped, setHasUserSwiped] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const views = [
    {
      period: 'current',
      title: 'Current',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{'rightNow'}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {metric.current.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{metric.unit}</div>
            </div>
          </div>
          
          {metric.goal && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Progress</span>
                <span className="text-gray-600 dark:text-gray-300">
                  {Math.round((metric.current / metric.goal) * 100)}%
                </span>
              </div>
              <Progress 
                value={(metric.current / metric.goal) * 100} 
                className="h-2"
              />
            </div>
          )}
          
          <div className="flex items-center gap-2">
            {metric.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : metric.trend === 'down' ? (
              <TrendingDown className="h-4 w-4 text-red-500" />
            ) : null}
            <span className={`text-sm font-medium ${
              metric.trend === 'up' ? 'text-green-600 dark:text-green-400' :
              metric.trend === 'down' ? 'text-red-600 dark:text-red-400' :
              'text-gray-600 dark:text-gray-400'
            }`}>
              {metric.trendPercentage > 0 ? '+' : ''}{metric.trendPercentage}% {'vsYesterday'}
            </span>
          </div>
        </div>
      )
    },
    ...detailedViews.map(view => ({
      ...view,
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
                {view.period === 'insights' ? <Eye className="h-5 w-5 text-white" /> :
                 view.period === 'week' ? <Calendar className="h-5 w-5 text-white" /> :
                 view.period === 'month' ? <BarChart3 className="h-5 w-5 text-white" /> :
                 icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{view.title}</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            {view.period === 'today' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{'peak'}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {(metric.current * 1.2).toFixed(0)} {metric.unit}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{'peakTime'}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{'average'}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {(metric.current * 0.85).toFixed(0)} {metric.unit}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{'today'}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  💡 {'peakAfternoonTip'.replace('{metric}', title.toLowerCase())}
                </div>
              </>
            )}
            
            {view.period === 'week' && (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{'thisWeek'}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {(metric.current * 7).toLocaleString()} {metric.unit}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{'lastWeek'}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {(metric.current * 6.3).toLocaleString()} {metric.unit}
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{'change'}</div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      +{metric.trendPercentage}%
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  📈 {'bestWeekYet'}
                </div>
              </>
            )}
            
            {view.period === 'month' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{'thisMonth'}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {(metric.current * 28).toLocaleString()} {metric.unit}
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">93% {'ofGoal'}</div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{'monthlyAvg'}</div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {(metric.current * 25).toLocaleString()} {metric.unit}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{'lastSixMonths'}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  🎯 {'aboveAverage'.replace('{percent}', '7')}
                </div>
              </>
            )}
            
            {view.period === 'insights' && (
              <>
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-500">
                    <div className="font-medium text-blue-900 dark:text-blue-100">{'trendAnalysis'}</div>
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      {'consistentImprovement'.replace('{metric}', title.toLowerCase())}
                    </div>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border-l-4 border-green-500">
                    <div className="font-medium text-green-900 dark:text-green-100">{'recommendation'}</div>
                    <div className="text-sm text-green-700 dark:text-green-300">
                      {'maintainRoutine'}
                    </div>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border-l-4 border-purple-500">
                    <div className="font-medium text-purple-900 dark:text-purple-100">{'patternDetection'}</div>
                    <div className="text-sm text-purple-700 dark:text-purple-300">
                      {'morningPerformance'}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )
    }))
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextView();
    }
    if (isRightSwipe) {
      prevView();
    }
    
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const nextView = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('left');
      setHasUserSwiped(true);
      setShowSwipeHint(false);
      
      // Deck animation: current card slides away, next card emerges from underneath
      setTimeout(() => {
        setCurrentView(currentView === views.length - 1 ? 0 : currentView + 1);
      }, 250);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setAnimationDirection(null);
      }, 600);
    }
  };

  const prevView = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setAnimationDirection('right');
      setHasUserSwiped(true);
      setShowSwipeHint(false);
      
      // Deck animation: current card slides away, previous card emerges from underneath
      setTimeout(() => {
        setCurrentView(currentView === 0 ? views.length - 1 : currentView - 1);
      }, 250);
      
      setTimeout(() => {
        setIsTransitioning(false);
        setAnimationDirection(null);
      }, 600);
    }
  };

  // Hide swipe hint after 5 seconds or after user interaction
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full">
      {/* Single clean card */}
      <Card 
        ref={cardRef}
        className="relative overflow-hidden cursor-pointer select-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl hover:shadow-2xl hover:translate-y-[-2px] transition-all duration-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          touchAction: 'pan-y'
        }}
      >
      <CardContent className="p-6">
        {views[currentView].content}
        
        {/* Navigation indicators */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex space-x-1">
            {views.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-all duration-100 ${
                  index === currentView 
                    ? 'bg-blue-500 w-6 scale-110' 
                    : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                }`}
                onClick={() => {
                  setCurrentView(index);
                  setHasUserSwiped(true);
                }}
                style={{ cursor: 'pointer' }}
              />
            ))}
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={prevView}
              className="p-1 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {currentView + 1}/{views.length}
            </span>
            <button
              onClick={nextView}
              className="p-1 rounded-full transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Animated First-Time Swipe Hint */}
        {showSwipeHint && !hasUserSwiped && currentView === 0 && (
          <div className="absolute bottom-4 left-4 z-20">
            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 px-3 py-2 rounded-full border border-blue-200 dark:border-blue-700 animate-bounce">
              <span className="font-medium">{'swipeToExplore'}</span>
              <div className="flex gap-1">
                <ChevronRight className="h-3 w-3 animate-pulse" />
                <ChevronRight className="h-3 w-3 animate-pulse delay-100" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
    </div>
  );
};

export default SwipeableMetricCard;