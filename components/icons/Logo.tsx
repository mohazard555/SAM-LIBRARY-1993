
import React from 'react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 100 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="مكتبة الحكايات logo"
  >
    <defs>
      <radialGradient id="moonGlow" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="white" />
        <stop offset="70%" stopColor="rgba(255, 249, 229, 0.8)" />
        <stop offset="100%" stopColor="rgba(255, 221, 133, 0)" />
      </radialGradient>
    </defs>
    <path
      d="M50 75C20 75 10 65 10 35C10 5 20 5 50 5V75Z"
      fill="currentColor"
      className="text-blue-400"
    />
    <path
      d="M50 75C80 75 90 65 90 35C90 5 80 5 50 5V75Z"
      fill="currentColor"
      className="text-blue-500"
    />
    <circle cx="50" cy="38" r="18" fill="url(#moonGlow)" />
    <circle cx="50" cy="38" r="15" fill="#FFF9E5" />
  </svg>
);

export default Logo;
