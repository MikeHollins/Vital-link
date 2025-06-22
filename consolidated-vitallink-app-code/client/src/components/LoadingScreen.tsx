import React, { useEffect, useState } from 'react';
import logoImage from '@assets/IMG_2097.png';

interface LoadingScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onComplete, 
  duration = 2500 
}) => {
  const [progress, setProgress] = useState(0);
  const [logoVisible, setLogoVisible] = useState(false);
  const [pulseActive, setPulseActive] = useState(false);

  useEffec( => {
    // Logo fade in
    const logoTimer = setTimeou( => {
      setLogoVisible(true);
    }, 200);

    // Start pulse effect
    const pulseTimer = setTimeou( => {
      setPulseActive(true);
    }, 600);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (duration / 50);
        const newProgress = prev + increment;
        
        if (newProgress >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return newProgress;
      });
    }, 50);

    // Complete loading
    const completeTimer = setTimeou( => {
      onComplete();
    }, duration);

    return () => {
      clearTimeoulogoTimer;
      clearTimeoupulseTimer;
      clearTimeoucompleteTimer;
      clearInterval(progressInterval);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center z-50">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradiencircle at 25% 25%, #14b8a6 0%, transparent 50%, 
                           radial-gradiencircle at 75% 75%, #06b6d4 0%, transparent 50%`,
          backgroundSize: '100px 100px'
        }} />
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center">
        {/* Logo container with animations */}
        <div className="relative mb-8">
          {/* Outer glow ring */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              pulseActive ? 'animate-ping' : ''
            }`}
            style={{
              background: 'radial-gradiencircle, rgba(20, 184, 166, 0.3 0%, transparent 70%)',
              width: '200px',
              height: '200px',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%'
            }}
          />

          {/* Middle glow ring */}
          <div 
            className={`absolute inset-0 rounded-full transition-all duration-700 delay-200 ${
              pulseActive ? 'animate-pulse' : ''
            }`}
            style={{
              background: 'radial-gradiencircle, rgba(6, 182, 212, 0.2 0%, transparent 60%)',
              width: '160px',
              height: '160px',
              transform: 'translate(-50%, -50%)',
              left: '50%',
              top: '50%'
            }}
          />

          {/* Logo with loading effect - centered */}
          <div 
            className={`relative z-10 transition-all duration-800 ease-out transform ${
              logoVisible 
                ? 'opacity-100 scale-100 rotate-0' 
                : 'opacity-0 scale-75 rotate-12'
            }`}
            style={{ width: '100px', height: '100px' }}
          >
            <img 
              src={logoImage}
              alt="VitalLink"
              className="w-full h-full object-contain drop-shadow-2xl relative z-20"
              style={{
                filter: `brightness(${0.8 + (progress / 100) * 0.4}) saturate(${0.6 + (progress / 100) * 0.6})`
              }}
            />
            
            {/* Loading shimmer effect */}
            <div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent z-10"
              style={{
                transform: `translateX(${(progress / 100) * 200 - 100}%)`,
                transition: 'transform 0.1s ease-out'
              }}
            />
          </div>
        </div>

        {/* Circular progress indicator - separate container below logo */}
        <div className="relative mb-4">
          <svg 
            className="w-32 h-32 transform -rotate-90" 
            viewBox="0 0 100 100"
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
              className="text-gray-200/50 dark:text-gray-700/50"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#progressGradient)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              style={{
                strokeDasharray: `${2 * Math.PI * 45}`,
                strokeDashoffset: `${2 * Math.PI * 45 * (1 - progress / 100)}`,
                transition: 'stroke-dashoffset 0.1s ease-out'
              }}
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          
          {/* Progress percentage text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-medium text-teal-600 dark:text-teal-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Loading text */}
        <div className="text-center space-y-2">
          <h2 className={`text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent transition-all duration-1000 ${
            logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            VitalLink
          </h2>
          <p className={`text-sm text-muted-foreground transition-all duration-1000 delay-300 ${
            logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            Connecting your health data securely
          </p>
        </div>

        {/* Progress dots */}
        <div className={`flex space-x-2 mt-6 transition-all duration-1000 delay-500 ${
          logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                progress > (i * 33.33) 
                  ? 'bg-gradient-to-r from-teal-500 to-blue-500 scale-110' 
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
              style={{ 
                transitionDelay: `${i * 100}ms` 
              }}
            />
          ))}
        </div>

        {/* Completion effect */}
        {progress >= 100 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-green-500 rounded-full animate-ping" />
          </div>
        )}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-teal-400/30 rounded-full transition-all duration-1000 delay-${i * 200} ${
              pulseActive ? 'animate-bounce' : ''
            }`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${2 + i * 0.5}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoadingScreen;