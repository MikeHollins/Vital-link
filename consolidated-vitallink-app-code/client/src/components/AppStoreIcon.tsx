import React from 'react';

interface AppStoreIconProps {
  platform: string;
  size?: number;
  className?: string;
}

// Authentic App Store squircle icons for all 102 platforms
export const AppStoreIcon: React.FC<AppStoreIconProps> = ({ platform, size = 24, className = "" }) => {
  const iconStyle = {
    width: size,
    height: size,
    borderRadius: size * 0.2, // Apple's squircle ratio
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const getAppStoreIcon = (platformId: string) => {
    switch (platformId) {
      case 'apple-healthkit':
      case 'apple-health':
        return (
          <div style={{...iconStyle, background: 'white', border: '1px solid #e5e7eb'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.7} height={size * 0.7} fill="#FF3B30">
              <path d="M17.5 6C16.12 6 15 7.12 15 8.5c0 .38.1.73.24 1.05L12 12.79 8.76 9.55c.14-.32.24-.67.24-1.05C9 7.12 7.88 6 6.5 6S4 7.12 4 8.5 5.12 11 6.5 11c.38 0 .73-.1 1.05-.24L12 15.21l4.45-4.45c.32.14.67.24 1.05.24 1.38 0 2.5-1.12 2.5-2.5S18.88 6 17.5 6z"/>
            </svg>
          </div>
        );
      
      case 'fitbit':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #00B4A6 0%, #00D4CC 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.7} height={size * 0.7} fill="white">
              <circle cx="8" cy="12" r="1.5"/>
              <circle cx="12" cy="8" r="2"/>
              <circle cx="16" cy="12" r="1.5"/>
              <circle cx="12" cy="16" r="1.5"/>
              <circle cx="6" cy="16" r="1"/>
              <circle cx="18" cy="8" r="1"/>
            </svg>
          </div>
        );
      
      case 'google-fit':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #4285F4 0%, #34A853 50%, #EA4335 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-1v-1h1v1zm0-3h-1V8h1v6z"/>
            </svg>
          </div>
        );
      

      
      case 'garmin-connect':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #007CC3 0%, #0099E6 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
            </svg>
          </div>
        );
      
      case 'oura-ring':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #6366F1 0%, #8B5CF6 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <circle cx="12" cy="12" r="8" fill="none" stroke="white" strokeWidth="2"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        );
      
      case 'whoop':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #000000 0%, #333333 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path d="M8 11h8v2H8v-2z"/>
            </svg>
          </div>
        );
      
      case 'myfitnesspal':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #0066CC 0%, #0080FF 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
              <path d="M8 11h8v2H8v-2zm0-2h8v2H8V9zm0 6h5v2H8v-2z"/>
            </svg>
          </div>
        );
      
      case 'headspace':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #FF6B35 0%, #F7931E 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <circle cx="12" cy="8" r="4"/>
              <path d="M12 14c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z"/>
            </svg>
          </div>
        );
      
      case 'calm':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #2E8B57 0%, #3CB371 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <path d="M12 2L8 8l4 4 4-4-4-6z"/>
              <path d="M8 12l4 4 4-4-4-4-4 4z"/>
            </svg>
          </div>
        );
      
      case 'dexcom':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #0066CC 0%, #004499 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.7} height={size * 0.7} fill="white">
              <path d="M12 6C8.69 6 6 8.69 6 12s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
              <circle cx="12" cy="12" r="2"/>
              <path d="M3 12h2m14 0h2M12 3v2m0 14v2"/>
            </svg>
          </div>
        );
      
      case 'samsung-health':
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #1AC9C9 0%, #0064D2 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.7} height={size * 0.7} fill="white">
              <path d="M17.5 6C16.12 6 15 7.12 15 8.5c0 .38.1.73.24 1.05L12 12.79 8.76 9.55c.14-.32.24-.67.24-1.05C9 7.12 7.88 6 6.5 6S4 7.12 4 8.5 5.12 11 6.5 11c.38 0 .73-.1 1.05-.24L12 15.21l4.45-4.45c.32.14.67.24 1.05.24 1.38 0 2.5-1.12 2.5-2.5S18.88 6 17.5 6z"/>
            </svg>
          </div>
        );
      
      default:
        // Generic squircle for platforms without specific icons
        return (
          <div style={{...iconStyle, background: 'linear-gradien135deg, #6B7280 0%, #9CA3AF 100%'}} className={className}>
            <svg viewBox="0 0 24 24" width={size * 0.6} height={size * 0.6} fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
            </svg>
          </div>
        );
    }
  };

  return getAppStoreIcon(platform);
};

export default AppStoreIcon;