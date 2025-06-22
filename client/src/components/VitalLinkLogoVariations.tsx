import React from 'react';

interface VitalLinkLogoVariationProps {
  size?: number;
  className?: string;
  variation: 1 | 2 | 3 | 4 | 5;
  title: string;
}

export const VitalLinkLogoVariation: React.FC<VitalLinkLogoVariationProps> = ({ 
  size = 120, 
  className = "", 
  variation,
  title
}) => {
  const shieldSize = size;

  // Enhanced heartbeat wave patterns for each variation
  const getHeartbeatPath = (variation: number) => {
    switch (variation) {
      case 1:
        return "M25 60 L35 60 L40 45 L45 75 L50 30 L55 85 L60 60 L70 60 L75 50 L80 70 L85 55 L95 60";
      case 2:
        return "M25 60 L33 60 L38 40 L43 80 L48 25 L53 90 L58 35 L63 75 L68 60 L75 48 L80 72 L85 52 L95 60";
      case 3:
        return "M25 60 L32 60 L36 48 L41 72 L46 32 L51 88 L56 28 L61 82 L66 45 L71 65 L76 50 L81 70 L86 55 L95 60";
      case 4:
        return "M25 60 L34 60 L39 42 L44 78 L49 28 L54 92 L59 25 L64 85 L69 40 L74 70 L79 45 L84 75 L89 50 L95 60";
      case 5:
        return "M25 60 L31 60 L35 45 L40 75 L45 30 L50 90 L55 20 L60 95 L65 35 L70 80 L75 40 L80 85 L85 45 L90 75 L95 60";
      default:
        return "M25 60 L35 60 L40 45 L45 75 L50 30 L55 85 L60 60 L70 60 L75 50 L80 70 L85 55 L95 60";
    }
  };

  // Enhanced circuit patterns with blockchain blocks
  const getCircuitPattern = (variation: number) => {
    const basePattern = (
      <g stroke="#7DD3FC" strokeWidth="0.8" fill="none" opacity="0.7">
        {/* Main circuit lines */}
        <line x1="25" y1="35" x2="40" y2="35" />
        <line x1="45" y1="40" x2="65" y2="40" />
        <line x1="70" y1="35" x2="95" y2="35" />
        <line x1="30" y1="50" x2="50" y2="50" />
        <line x1="70" y1="50" x2="90" y2="50" />
        <line x1="25" y1="65" x2="45" y2="65" />
        <line x1="75" y1="65" x2="95" y2="65" />
        <line x1="30" y1="80" x2="55" y2="80" />
        <line x1="65" y1="80" x2="90" y2="80" />
        
        {/* Vertical connections */}
        <line x1="35" y1="25" x2="35" y2="45" />
        <line x1="85" y1="25" x2="85" y2="45" />
        <line x1="40" y1="60" x2="40" y2="85" />
        <line x1="80" y1="60" x2="80" y2="85" />
      </g>
    );

    // Add blockchain blocks based on variation
    const blockElements = [];
    const blockPositions = [
      { x: 32, y: 35, size: 3 },
      { x: 53, y: 40, size: 2.5 },
      { x: 83, y: 35, size: 3 },
      { x: 37, y: 50, size: 2.5 },
      { x: 78, y: 50, size: 3 },
      { x: 35, y: 65, size: 2.5 },
      { x: 85, y: 65, size: 3 },
      { x: 42, y: 80, size: 2.5 },
      { x: 75, y: 80, size: 3 },
    ];

    // Vary the number and style of blocks per variation
    const numBlocks = Math.min(4 + variation, blockPositions.length);
    
    for (let i = 0; i < numBlocks; i++) {
      const pos = blockPositions[i];
      blockElements.push(
        <rect 
          key={i}
          x={pos.x - pos.size/2} 
          y={pos.y - pos.size/2} 
          width={pos.size} 
          height={pos.size}
          fill="#06B6D4"
          opacity="0.8"
          rx="0.5"
        />
      );
      
      // Add connecting lines for blockchain effect
      if (i > 0) {
        const prevPos = blockPositions[i-1];
        blockElements.push(
          <line 
            key={`connect-${i}`}
            x1={prevPos.x} 
            y1={prevPos.y} 
            x2={pos.x} 
            y2={pos.y}
            stroke="#22D3EE"
            strokeWidth="0.5"
            opacity="0.6"
            strokeDasharray="1,1"
          />
        );
      }
    }

    return (
      <>
        {basePattern}
        <g>{blockElements}</g>
      </>
    );
  };

  return (
    <div className={`flex flex-col items-center p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300 mb-4">{title}</h3>
      <div className="relative flex items-center justify-center">
        <svg
          width={shieldSize}
          height={shieldSize}
          viewBox="0 0 120 120"
          className="drop-shadow-xl"
        >
          <defs>
            <linearGradient id={`shieldGradient${variation}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="50%" stopColor="#0891B2" />
              <stop offset="100%" stopColor="#155E75" />
            </linearGradient>
            <linearGradient id={`innerShield${variation}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0E7490" />
            </linearGradient>
            <linearGradient id={`heartbeatGradient${variation}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22D3EE" />
              <stop offset="50%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#0891B2" />
            </linearGradient>
          </defs>
          
          {/* Outer Shield */}
          <path
            d="M60 10 C45 10, 15 20, 15 35 C15 65, 45 105, 60 110 C75 105, 105 65, 105 35 C105 20, 75 10, 60 10 Z"
            fill={`url(#shieldGradient${variation})`}
            stroke="#0F766E"
            strokeWidth="1"
          />
          
          {/* Inner Shield */}
          <path
            d="M60 18 C48 18, 22 26, 22 38 C22 62, 48 95, 60 100 C72 95, 98 62, 98 38 C98 26, 72 18, 60 18 Z"
            fill={`url(#innerShield${variation})`}
            opacity="0.9"
          />
          
          {/* Enhanced Heartbeat Wave */}
          <path
            d={getHeartbeatPath(variation)}
            stroke={`url(#heartbeatGradient${variation})`}
            strokeWidth="2"
            fill="none"
            opacity="0.9"
            className="drop-shadow-sm"
          />
          
          {/* Circuit Pattern with Blockchain Blocks */}
          {getCircuitPattern(variation)}
          
          {/* Circuit dots/nodes */}
          <g fill="#E0F7FA" opacity="0.9">
            <circle cx="35" cy="35" r="1.5" />
            <circle cx="85" cy="35" r="1.5" />
            <circle cx="40" cy="50" r="1.5" />
            <circle cx="80" cy="50" r="1.5" />
            <circle cx="35" cy="65" r="1.5" />
            <circle cx="85" cy="65" r="1.5" />
            <circle cx="45" cy="80" r="1.5" />
            <circle cx="75" cy="80" r="1.5" />
          </g>
        </svg>
        
        {/* VL Text Overlay */}
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: shieldSize * 0.35 }}
        >
          <span 
            className="font-bold text-white drop-shadow-lg tracking-wider"
            style={{ 
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textShadow: '0 3px 6px rgba(0,0,0,0.4)'
            }}
          >
            VL
          </span>
        </div>
      </div>
      
      {/* VITAL LINK Text */}
      <div 
        className="font-bold text-teal-700 dark:text-teal-300 tracking-wider mt-3"
        style={{ 
          fontSize: size * 0.15,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          letterSpacing: '0.1em'
        }}
      >
        VITAL LINK
      </div>
    </div>
  );
};

export const VitalLinkLogoShowcase: React.FC = () => {
  const variations = [
    { id: 1, title: "Variation 1: Classic Pulse", description: "Clean heartbeat with subtle blockchain elements" },
    { id: 2, title: "Variation 2: Dynamic Wave", description: "More active pulse with enhanced circuit blocks" },
    { id: 3, title: "Variation 3: Intense Activity", description: "High-energy heartbeat with dense blockchain pattern" },
    { id: 4, title: "Variation 4: Power Surge", description: "Strong pulse waves with interconnected blocks" },
    { id: 5, title: "Variation 5: Maximum Energy", description: "Peak activity with full blockchain network" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-teal-700 dark:text-teal-300 mb-4">
            VitalLink Logo Variations
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            Five subtle variations featuring enhanced heartbeat waves and blockchain-inspired circuit elements.
            Each variation adds more dynamic activity while maintaining the core brand identity.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {variations.map((variant) => (
            <div key={variant.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <VitalLinkLogoVariation
                size={140}
                variation={variant.id as 1 | 2 | 3 | 4 | 5}
                title={variant.title}
              />
              <div className="p-4 pt-0">
                <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
                  {variant.description}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            Each variation maintains the signature teal gradient shield while adding unique heartbeat patterns and blockchain elements
          </p>
        </div>
      </div>
    </div>
  );
};

export default VitalLinkLogoVariation;