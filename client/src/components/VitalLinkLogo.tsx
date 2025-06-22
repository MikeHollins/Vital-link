import React from 'react';
import logoImage from '@assets/IMG_2097.png';

interface VitalLinkLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  variant?: 'full' | 'icon-only';
}

export const VitalLinkLogo: React.FC<VitalLinkLogoProps> = ({ 
  size = 100, 
  className = "", 
  showText = false,
  variant = 'full'
}) => {
  return (
    <div className={`flex ${variant === 'full' ? 'flex-col' : 'flex-row'} items-center ${className}`}>
      <img 
        src={logoImage}
        alt="VitalLink Logo"
        className="object-contain"
        style={{ 
          width: size,
          height: size
        }}
      />
    </div>
  );
};

export default VitalLinkLogo;