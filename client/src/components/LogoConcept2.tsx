import React from 'react';

interface LogoConcept2Props {
  size?: number;
  className?: string;
}

// Concept 2: Digital Heart Lock
export const LogoConcept2: React.FC<LogoConcept2Props> = ({ size = 80, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#1E40AF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#14B8A6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="lockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#C0C0C0', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow2">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Heart shape made of hexagonal blockchain pattern */}
        <g>
          {/* Left heart curve with hexagons */}
          <g fill="url(#heartGradient)" stroke="#1E40AF" strokeWidth="0.5">
            <polygon points="20,35 25,32 30,35 30,41 25,44 20,41" opacity="0.9"/>
            <polygon points="15,42 20,39 25,42 25,48 20,51 15,48" opacity="0.8"/>
            <polygon points="20,49 25,46 30,49 30,55 25,58 20,55" opacity="0.9"/>
            <polygon points="25,56 30,53 35,56 35,62 30,65 25,62" opacity="0.8"/>
            <polygon points="30,63 35,60 40,63 40,69 35,72 30,69" opacity="0.9"/>
            <polygon points="35,70 40,67 45,70 45,76 40,79 35,76" opacity="0.8"/>
          </g>
          
          {/* Right heart curve with hexagons */}
          <g fill="url(#heartGradient)" stroke="#1E40AF" strokeWidth="0.5">
            <polygon points="70,35 75,32 80,35 80,41 75,44 70,41" opacity="0.9"/>
            <polygon points="75,42 80,39 85,42 85,48 80,51 75,48" opacity="0.8"/>
            <polygon points="70,49 75,46 80,49 80,55 75,58 70,55" opacity="0.9"/>
            <polygon points="65,56 70,53 75,56 75,62 70,65 65,62" opacity="0.8"/>
            <polygon points="60,63 65,60 70,63 70,69 65,72 60,69" opacity="0.9"/>
            <polygon points="55,70 60,67 65,70 65,76 60,79 55,76" opacity="0.8"/>
          </g>
          
          {/* Center connecting hexagons */}
          <g fill="url(#heartGradient)" stroke="#1E40AF" strokeWidth="0.5">
            <polygon points="40,35 45,32 50,35 50,41 45,44 40,41" opacity="0.9"/>
            <polygon points="50,35 55,32 60,35 60,41 55,44 50,41" opacity="0.9"/>
            <polygon points="45,42 50,39 55,42 55,48 50,51 45,48" opacity="0.8"/>
            <polygon points="40,49 45,46 50,49 50,55 45,58 40,55" opacity="0.9"/>
            <polygon points="50,49 55,46 60,49 60,55 55,58 50,55" opacity="0.9"/>
          </g>
        </g>

        {/* Central lock mechanism */}
        <g transform="translate(50,50)">
          {/* Lock body */}
          <rect x="-8" y="-5" width="16" height="12" rx="2" fill="url(#lockGradient)" stroke="#1E40AF" strokeWidth="1"/>
          
          {/* Lock shackle */}
          <path d="M-6,-12 C-6,-16 -3,-18 0,-18 C3,-18 6,-16 6,-12 L6,-8" 
                fill="none" stroke="url(#lockGradient)" strokeWidth="2" strokeLinecap="round"/>
          
          {/* Keyhole */}
          <circle cx="0" cy="-1" r="2" fill="#1E40AF"/>
          <rect x="-0.5" y="0" width="1" height="3" fill="#1E40AF"/>
        </g>

        {/* LV Letters */}
        <g fill="#FFFFFF" fontSize="12" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">
          <text x="35" y="85" style={{ fontSize: '11px', fontWeight: 'bold' }}>L</text>
          <text x="65" y="85" style={{ fontSize: '11px', fontWeight: 'bold' }}>V</text>
        </g>
      </svg>
    </div>
  );
};