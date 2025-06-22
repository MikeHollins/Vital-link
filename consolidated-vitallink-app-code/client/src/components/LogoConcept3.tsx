import React from 'react';

interface LogoConcept3Props {
  size?: number;
  className?: string;
}

// Concept 3: Data Pulse Network
export const LogoConcept3: React.FC<LogoConcept3Props> = ({ size = 80, className = "" }) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 100 100" 
        className="drop-shadow-lg"
      >
        <defs>
          <linearGradient id="networkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#10B981', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id="pulseGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#FFFFFF', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow3">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Letter L formed by connected data nodes */}
        <g>
          {/* L - Vertical line nodes */}
          <circle cx="25" cy="25" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="25" cy="35" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="25" cy="45" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="25" cy="55" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="25" cy="65" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          
          {/* L - Horizontal line nodes */}
          <circle cx="35" cy="65" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="45" cy="65" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          
          {/* Connections for L */}
          <line x1="25" y1="25" x2="25" y2="35" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="25" y1="35" x2="25" y2="45" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="25" y1="45" x2="25" y2="55" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="25" y1="55" x2="25" y2="65" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="25" y1="65" x2="35" y2="65" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="35" y1="65" x2="45" y2="65" stroke="url(#pulseGradient)" strokeWidth="2"/>
        </g>

        {/* Letter V formed by connected data nodes with checkmark element */}
        <g>
          {/* V - Left diagonal nodes */}
          <circle cx="55" cy="25" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="60" cy="35" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="65" cy="45" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="70" cy="55" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          
          {/* V - Right diagonal nodes */}
          <circle cx="85" cy="25" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="80" cy="35" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          <circle cx="75" cy="45" r="3" fill="url(#networkGradient)" filter="url(#glow3)"/>
          
          {/* V - Bottom point (with checkmark styling) */}
          <circle cx="70" cy="65" r="4" fill="#10B981" stroke="#FFFFFF" strokeWidth="1" filter="url(#glow3)"/>
          
          {/* Connections for V */}
          <line x1="55" y1="25" x2="60" y2="35" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="60" y1="35" x2="65" y2="45" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="65" y1="45" x2="70" y2="55" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="70" y1="55" x2="70" y2="65" stroke="url(#pulseGradient)" strokeWidth="2"/>
          
          <line x1="85" y1="25" x2="80" y2="35" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="80" y1="35" x2="75" y2="45" stroke="url(#pulseGradient)" strokeWidth="2"/>
          <line x1="75" y1="45" x2="70" y2="55" stroke="url(#pulseGradient)" strokeWidth="2"/>
          
          {/* Checkmark inside V bottom */}
          <path d="M67,63 L69,65 L73,61" stroke="#FFFFFF" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        </g>

        {/* Pulse lines flowing between letters */}
        <g stroke="#06B6D4" strokeWidth="1.5" fill="none" opacity="0.7">
          <path d="M45 40 Q50 35 55 40" strokeDasharray="2,2">
            <animate attributeName="stroke-dashoffset" values="0;4" dur="1s" repeatCount="indefinite"/>
          </path>
          <path d="M45 50 Q50 55 55 50" strokeDasharray="2,2">
            <animate attributeName="stroke-dashoffset" values="0;4" dur="1.2s" repeatCount="indefinite"/>
          </path>
        </g>

        {/* Additional network nodes around the letters */}
        <circle cx="15" cy="15" r="1.5" fill="#10B981" opacity="0.6"/>
        <circle cx="90" cy="15" r="1.5" fill="#3B82F6" opacity="0.6"/>
        <circle cx="15" cy="85" r="1.5" fill="#10B981" opacity="0.6"/>
        <circle cx="90" cy="85" r="1.5" fill="#3B82F6" opacity="0.6"/>
        <circle cx="50" cy="15" r="1.5" fill="#06B6D4" opacity="0.6"/>
        <circle cx="50" cy="85" r="1.5" fill="#06B6D4" opacity="0.6"/>
      </svg>
    </div>
  );
};