import React from 'react';

interface AnimatedDotsToXProps {
  onClick: () => void;
  isOpen?: boolean;
  color?: string;
}

const AnimatedDotsToX: React.FC<AnimatedDotsToXProps> = ({
  onClick,
  isOpen = false,
  color = 'currentColor',
}) => {

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      onClick={handleClick}
      className="flex justify-center items-center w-8 h-8 rounded-full cursor-pointer hover:bg-white/10 transition-colors duration-200"
      aria-label="Show more links"
    >
      <div className="relative w-5 h-5 flex items-center justify-center">
        {/* First dot/line */}
        <div
          className={`absolute transition-all duration-800 ease-in-out bg-current ${
            isOpen ? "h-0.5 w-4 rotate-45 scale-105" : "h-1 w-1 rounded-full"
          }`}
          style={{
            backgroundColor: color,
            left: isOpen ? "2px" : "0px",
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        
        {/* Second dot */}
        <div
          className={`absolute transition-all duration-300 ease-in-out h-1 w-1 rounded-full ${
            isOpen ? "opacity-0 scale-50" : "opacity-100 scale-100"
          }`}
          style={{
            backgroundColor: color,
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
        
        {/* Third dot/line */}
        <div
          className={`absolute transition-all duration-300 ease-in-out bg-current ${
            isOpen ? "h-0.5 w-4 -rotate-45 scale-105" : "h-1 w-1 rounded-full"
          }`}
          style={{
            backgroundColor: color,
            right: isOpen ? "2px" : "0px",
            transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedDotsToX;