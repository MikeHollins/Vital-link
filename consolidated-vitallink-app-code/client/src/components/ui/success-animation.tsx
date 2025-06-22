import React, { useEffect, useState } from 'react';
import { Check, Heart, Sparkles, Zap } from 'lucide-react';

interface SuccessAnimationProps {
  isVisible: boolean;
  platformName: string;
  onComplete?: () => void;
  type?: 'connection' | 'sync' | 'achievement';
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  isVisible,
  platformName,
  onComplete,
  type = 'connection'
}) => {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffec( => {
    if (isVisible) {
      setAnimationPhase(1);
      
      const timers = [
        setTimeou( => setAnimationPhase(2), 300),
        setTimeou( => setAnimationPhase(3), 800),
        setTimeou( => setAnimationPhase(4), 1200),
        setTimeou( => {
          setAnimationPhase(0);
          onComplete?.();
        }, 2500)
      ];
      
      return () => timers.forEach(clearTimeout);
    }
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="relative">
        {/* Main celebration container */}
        <div className={`
          relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl border border-green-200 dark:border-green-800
          transition-all duration-500 ease-out
          ${animationPhase >= 1 ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}
          ${animationPhase >= 3 ? 'animate-pulse' : ''}
        `}>
          {/* Sparkle effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <Sparkles
                key={i}
                className={`
                  absolute w-4 h-4 text-yellow-400
                  transition-all duration-1000 ease-out
                  ${animationPhase >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}
                `}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  left: `${10 + Math.random() * 80}%`,
                  animationDelay: `${i * 100}ms`,
                  animation: animationPhase >= 2 ? 'twinkle 1.5s ease-in-out infinite' : undefined,
                }}
              />
            ))}
          </div>

          {/* Success icon with animation */}
          <div className="text-center mb-6">
            <div className={`
              relative inline-flex items-center justify-center w-20 h-20 mx-auto mb-4
              bg-gradient-to-br from-green-400 to-emerald-500 rounded-full
              transition-all duration-700 ease-out
              ${animationPhase >= 1 ? 'scale-100 rotate-0' : 'scale-0 rotate-180'}
              ${animationPhase >= 2 ? 'shadow-lg shadow-green-400/50' : ''}
            `}>
              <Check className={`
                w-10 h-10 text-white
                transition-all duration-500 ease-out delay-300
                ${animationPhase >= 2 ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}
              `} />
              
              {/* Ripple effect */}
              <div className={`
                absolute inset-0 rounded-full border-4 border-green-400
                transition-all duration-1000 ease-out
                ${animationPhase >= 2 ? 'scale-150 opacity-0' : 'scale-100 opacity-50'}
              `} />
            </div>

            {/* Success message */}
            <div className={`
              transition-all duration-500 ease-out delay-500
              ${animationPhase >= 2 ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
            `}>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Successfully Connected!
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-green-600 dark:text-green-400">
                  {platformName}
                </span> is now syncing your health data
              </p>
            </div>
          </div>

          {/* Feature highlights */}
          <div className={`
            grid grid-cols-3 gap-4 mt-6
            transition-all duration-700 ease-out delay-700
            ${animationPhase >= 3 ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}
          `}>
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Real-time Sync</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Heart className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Health Insights</p>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">Secure & Private</p>
            </div>
          </div>
        </div>

        {/* Confetti particles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-2 h-2 rounded-full
                transition-all duration-2000 ease-out
                ${animationPhase >= 2 ? 'opacity-100' : 'opacity-0'}
              `}
              style={{
                backgroundColor: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'][i % 6],
                top: '50%',
                left: '50%',
                transform: animationPhase >= 2 
                  ? `translate(${(Math.cos(i * 30) * 200)}px, ${(Math.sin(i * 30) * 200)}px) scale(0)`
                  : 'translate(-50%, -50%) scale(1)',
                animationDelay: `${i * 50}ms`,
              }}
            />
          ))}
        </div>
      </div>


    </div>
  );
};