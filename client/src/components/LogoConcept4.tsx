import React from 'react';

interface LogoConcept4Props {
  size?: number;
  className?: string;
}

// Concept 4: Biometric Chain Badge
export const LogoConcept4: React.FC<LogoConcept4Props> = ({ size = 80, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="badgeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#14B8A6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#1E40AF', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="chainGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#0EA5E9', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow4">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Outer circular badge */}
        <circle cx="50" cy="50" r="40" fill="url(#badgeGradient)" stroke="#1E40AF" strokeWidth="2" filter="url(#glow4)"/>
        
        {/* Inner circle for LV */}
        <circle cx="50" cy="50" r="22" fill="rgba(255,255,255,0.1)" stroke="#FFFFFF" strokeWidth="1"/>

        {/* Blockchain links ring (transitioning to heartbeat) */}
        <g transform="translate(50,50)">
          {/* Chain links around the circle */}
          <g stroke="url(#chainGradient4)" strokeWidth="2" fill="none">
            {/* Top section - chain links */}
            <ellipse cx="0" cy="-30" rx="4" ry="2" stroke="#06B6D4" strokeWidth="1.5"/>
            <ellipse cx="8" cy="-28" rx="4" ry="2" stroke="#0EA5E9" strokeWidth="1.5"/>
            <ellipse cx="15" cy="-25" rx="4" ry="2" stroke="#06B6D4" strokeWidth="1.5"/>
            <ellipse cx="21" cy="-20" rx="4" ry="2" stroke="#0EA5E9" strokeWidth="1.5"/>
            <ellipse cx="26" cy="-14" rx="4" ry="2" stroke="#06B6D4" strokeWidth="1.5"/>
            
            {/* Right section - transitioning to heartbeat */}
            <path d="M28,-8 L30,-5 L32,-12 L34,-2 L36,-15 L38,0 L40,-8" stroke="#FFFFFF" strokeWidth="2"/>
            
            {/* Bottom section - heartbeat pattern */}
            <path d="M28,8 L30,5 L32,12 L34,2 L36,15 L38,0 L40,8" stroke="#FFFFFF" strokeWidth="2"/>
            
            {/* Left section - back to chain */}
            <ellipse cx="-26" cy="-14" rx="4" ry="2" stroke="#06B6D4" strokeWidth="1.5"/>
            <ellipse cx="-21" cy="-20" rx="4" ry="2" stroke="#0EA5E9" strokeWidth="1.5"/>
            <ellipse cx="-15" cy="-25" rx="4" ry="2" stroke="#06B6D4" strokeWidth="1.5"/>
            <ellipse cx="-8" cy="-28" rx="4" ry="2" stroke="#0EA5E9" strokeWidth="1.5"/>
            
            {/* Left heartbeat transition */}
            <path d="M-28,-8 L-30,-5 L-32,-12 L-34,-2 L-36,-15 L-38,0 L-40,-8" stroke="#FFFFFF" strokeWidth="2"/>
            <path d="M-28,8 L-30,5 L-32,12 L-34,2 L-36,15 L-38,0 L-40,8" stroke="#FFFFFF" strokeWidth="2"/>
          </g>
        </g>

        {/* Central LV letters */}
        <g fill="#FFFFFF" fontSize="20" fontFamily="Arial, sans-serif" fontWeight="bold" textAnchor="middle">
          <text x="42" y="58" style={{ fontSize: '18px', fontWeight: 'bold' }}>L</text>
          <text x="58" y="58" style={{ fontSize: '18px', fontWeight: 'bold' }}>V</text>
        </g>

        {/* Small data points around the badge */}
        <g fill="#FFFFFF" opacity="0.8">
          <circle cx="20" cy="20" r="1"/>
          <circle cx="80" cy="20" r="1"/>
          <circle cx="20" cy="80" r="1"/>
          <circle cx="80" cy="80" r="1"/>
          <circle cx="50" cy="10" r="1"/>
          <circle cx="50" cy="90" r="1"/>
          <circle cx="10" cy="50" r="1"/>
          <circle cx="90" cy="50" r="1"/>
        </g>

        {/* Subtle pulse animation around the badge */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3">
          <animate attributeName="r" values="38;42;38" dur="2s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
};