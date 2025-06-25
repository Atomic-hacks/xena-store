import React from "react";

interface FancyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  icon?: React.ReactNode;
  className?: string;
}

const FancyButton: React.FC<FancyButtonProps> = ({
  title,
  icon,
  className = "",
  onClick,
  ...rest
}) => {
  return (
    <button
      onClick={onClick}
      className={`group relative px-6 py-3 backdrop-blur-xl border bg-neutral-300/10 border-neutral-500/20 text-white text-center rounded-full overflow-hidden transition-all duration-300 hover:scale-105 ${className}`}
      {...rest}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-neutral-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-800 ease-out" />
      <span className="relative z-10 flex items-center gap-2">
        {icon && <span className="inline-block">{icon}</span>}
        {title}
      </span>
      <div className="absolute inset-x-0 h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-neutral-200 to-transparent" />
    </button>
  );
};

export default FancyButton;
