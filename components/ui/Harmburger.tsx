import React from 'react';

interface AnimatedHamburgerProps {
  onClick: () => void;
  isOpen?: boolean;
  color?: string;
  size?: number;
  lineHeight?: number;
  className?: string;
}

const AnimatedHamburger: React.FC<AnimatedHamburgerProps> = ({
  onClick,
  isOpen = false,
  color = 'currentColor',
  size = 32,
  lineHeight = 2,
  className = '',
}) => {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  
  const lineWidth = size * 0.75;
  const gap = size * 0.22; 

  return (
    <div
      onClick={handleClick}
      className={`flex justify-center items-center rounded-full cursor-pointer  transition-colors duration-200 scrollbar-hidden ${className}`}
      style={{ width: size, height: size }}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Top line */}
        <div
          className="absolute transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: color,
            height: `${lineHeight}px`,
            width: `${lineWidth}px`,
            transform: isOpen
              ? `translateY(0) rotate(45deg)`
              : `translateY(-${gap}px)`,
            transformOrigin: 'center',
            borderRadius: lineHeight,
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        
        {/* Middle line */}
        <div
          className="absolute transition-all duration-200 ease-in-out"
          style={{
            backgroundColor: color,
            height: `${lineHeight}px`,
            width: `${lineWidth}px`,
            opacity: isOpen ? 0 : 1,
            transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
            borderRadius: lineHeight,
          }}
        />
        
        {/* Bottom line */}
        <div
          className="absolute transition-all duration-300 ease-in-out"
          style={{
            backgroundColor: color,
            height: `${lineHeight}px`,
            width: `${lineWidth}px`,
            transform: isOpen
              ? `translateY(0) rotate(-45deg)`
              : `translateY(${gap}px)`,
            transformOrigin: 'center',
            borderRadius: lineHeight,
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedHamburger;