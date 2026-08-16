import React from 'react';

interface MonkeyLogoProps {
  className?: string;
  size?: number;
}

export const MonkeyLogo: React.FC<MonkeyLogoProps> = ({ className = 'w-9 h-9', size = 36 }) => {
  return (
    <div className={`relative flex items-center justify-center shrink-0 ${className}`}>
      {/* SVG vector icon of a cool Monkey face with DJ Headphones */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
      >
        <defs>
          <linearGradient id="monkeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" />
            <stop offset="50%" stopColor="#ec4899" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="earGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <linearGradient id="hpGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>

        {/* Outer Glow Circle */}
        <circle cx="50" cy="50" r="46" fill="url(#monkeyGrad)" opacity="0.15" />

        {/* Headphones Headband */}
        <path
          d="M20 50 C20 22, 80 22, 80 50"
          stroke="url(#hpGrad)"
          strokeWidth="8"
          strokeLinecap="round"
        />

        {/* Monkey Head Base */}
        <circle cx="50" cy="52" r="28" fill="#2d1b4e" stroke="url(#monkeyGrad)" strokeWidth="2.5" />

        {/* Monkey Ears */}
        <circle cx="22" cy="52" r="10" fill="#2d1b4e" stroke="url(#earGrad)" strokeWidth="2" />
        <circle cx="22" cy="52" r="5" fill="#f472b6" opacity="0.8" />

        <circle cx="78" cy="52" r="10" fill="#2d1b4e" stroke="url(#earGrad)" strokeWidth="2" />
        <circle cx="78" cy="52" r="5" fill="#f472b6" opacity="0.8" />

        {/* Monkey Face Mask / Snout Area */}
        <ellipse cx="50" cy="58" rx="19" ry="15" fill="#fae8ff" opacity="0.9" />

        {/* Eyes & Glasses / Visor */}
        <ellipse cx="40" cy="46" rx="6" ry="7" fill="#1e1b4b" />
        <circle cx="38" cy="44" r="2.5" fill="#ffffff" />

        <ellipse cx="60" cy="46" rx="6" ry="7" fill="#1e1b4b" />
        <circle cx="58" cy="44" r="2.5" fill="#ffffff" />

        {/* Monkey Nose */}
        <ellipse cx="50" cy="55" rx="3.5" ry="2.5" fill="#581c87" />

        {/* Cool Smile */}
        <path
          d="M42 63 Q50 70 58 63"
          stroke="#581c87"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* DJ Headphones Ear Cups */}
        <rect x="10" y="40" width="12" height="24" rx="6" fill="url(#hpGrad)" />
        <rect x="13" y="44" width="6" height="16" rx="3" fill="#0f172a" />

        <rect x="78" y="40" width="12" height="24" rx="6" fill="url(#hpGrad)" />
        <rect x="81" y="44" width="6" height="16" rx="3" fill="#0f172a" />

        {/* Equalizer Wave / Neon Music Note Accent */}
        <path d="M47 30 L50 25 L53 30" stroke="#f472b6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
};
