import React from 'react';

/**
 * TalkWave Brand Icon & Wordmark
 * Talk: rounded speech bubble
 * Wave: fluid dynamic audio frequency wave inside the bubble
 */
export const TalkWaveIcon = ({ className = 'w-6 h-6', ...props }) => (
  <svg
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <defs>
      <linearGradient id="twIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fca639" />
        <stop offset="50%" stopColor="#f47858" />
        <stop offset="100%" stopColor="#ea5575" />
      </linearGradient>
    </defs>
    {/* Base Gradient Pill Badge */}
    <rect width="64" height="64" rx="20" fill="url(#twIconGrad)" />

    {/* Top Sheen */}
    <path
      d="M 6 22 C 6 13 13 6 22 6 L 42 6 C 51 6 58 13 58 22 C 58 15 51 9 42 9 L 22 9 C 13 9 6 15 6 22 Z"
      fill="#ffffff"
      opacity="0.32"
    />

    {/* Speech Bubble Contour */}
    <path
      d="M 18 22 C 18 17.5 21 14.5 25 14.5 L 39 14.5 C 43 14.5 46 17.5 46 22 L 46 34 C 46 38.5 43 41.5 39 41.5 L 29 41.5 L 21 48 L 22.5 41 C 19.5 40 18 37 18 34 Z"
      fill="#ffffff"
      fillOpacity="0.22"
      stroke="#ffffff"
      strokeWidth="2.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Dynamic Sound/Fluid Wave Path */}
    <path
      d="M 24 28 C 26.5 22.5 29.5 33.5 32 28 C 34.5 22.5 37.5 33.5 40 28"
      stroke="#ffffff"
      strokeWidth="3.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    />

    {/* Real-time Presence Sync Dot */}
    <circle cx="41.5" cy="19.5" r="2.75" fill="#ffffff" />
  </svg>
);

export const TalkWaveLogo = ({
  size = 'md',
  showText = true,
  className = '',
  textClassName = '',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <TalkWaveIcon className={`${iconSizes[size] || 'w-9 h-9'} shrink-0 shadow-md shadow-orange-500/25`} />
      {showText && (
        <span
          className={`font-extrabold tracking-tight text-[#1e293b] flex items-center leading-none ${
            textSizes[size] || 'text-lg'
          } ${textClassName}`}
        >
          <span>Talk</span>
          <span className="bg-gradient-to-r from-[#f47858] to-[#ea5575] bg-clip-text text-transparent">
            Wave
          </span>
        </span>
      )}
    </div>
  );
};

export default TalkWaveLogo;

