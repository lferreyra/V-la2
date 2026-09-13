import React from 'react';

interface BrandWordmarkProps {
  compact?: boolean;
  className?: string;
  showTagline?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'hero';
}

export const BrandWordmark: React.FC<BrandWordmarkProps> = ({
  compact = false,
  className = '',
  showTagline = true,
  size = 'md',
}) => {
  // Determine dimensions based on size/compact
  let width = 170;
  let height = 48;

  if (compact || size === 'sm') {
    width = 140;
    height = 38;
  } else if (size === 'lg') {
    width = 240;
    height = 68;
  } else if (size === 'hero') {
    width = 340;
    height = 96;
  }

  return (
    <div
      className={`inline-flex items-center select-none group ${className}`}
      id="brand-wordmark-container"
    >
      {/* Authentic Vector Logo mirroring exact artwork from the image */}
      <svg
        viewBox="0 0 340 96"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: `${width}px`, height: `${height}px` }}
        className="shrink-0 transition-transform duration-300 group-hover:scale-[1.02] filter drop-shadow-[0_2px_12px_rgba(0,204,242,0.25)]"
        aria-label="V-LA TALLER MECÁNICO"
      >
        <defs>
          {/* Cyan Glow & Gradient for Left V & Speed Lines */}
          <linearGradient id="vla-cyan-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0099B8" />
            <stop offset="40%" stopColor="#00CCF2" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>

          {/* Connector Hyphen Gradient (Cyan to Orange) */}
          <linearGradient id="vla-hyphen-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00CCF2" />
            <stop offset="50%" stopColor="#0080A8" />
            <stop offset="80%" stopColor="#D94B14" />
            <stop offset="100%" stopColor="#F27D16" />
          </linearGradient>

          {/* LA Bold Letters Gradient (Red -> Fiery Orange -> Vibrant Amber) */}
          <linearGradient id="vla-la-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#F21616" />
            <stop offset="30%" stopColor="#F25116" />
            <stop offset="70%" stopColor="#F27D16" />
            <stop offset="100%" stopColor="#FFA028" />
          </linearGradient>

          {/* Subtitle / Underline Linear Gradient spanning the full width */}
          <linearGradient id="vla-sub-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00CCF2" />
            <stop offset="35%" stopColor="#00CCF2" />
            <stop offset="65%" stopColor="#F27D16" />
            <stop offset="100%" stopColor="#F21616" />
          </linearGradient>

          {/* Glow filter for high performance dynamic styling */}
          <filter id="vla-glow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#00CCF2" floodOpacity="0.3" />
          </filter>
        </defs>

        {/* 1. HORIZONTAL SPEED STREAKS (Leading into "V" on the left) */}
        <g fill="url(#vla-cyan-grad)">
          {/* Top streak */}
          <path d="M12 24 H62 L67 30 H14 Z" opacity="0.95" />
          {/* Streak 2 */}
          <path d="M18 33 H74 L79 39 H20 Z" opacity="0.9" />
          {/* Streak 3 (long middle streak) */}
          <path d="M26 42 H85 L90 48 H29 Z" opacity="0.85" />
          {/* Streak 4 */}
          <path d="M38 51 H97 L102 57 H41 Z" opacity="0.8" />
          {/* Streak 5 */}
          <path d="M48 60 H109 L114 66 H51 Z" opacity="0.75" />
        </g>

        {/* 2. LETTER "V" (Italic, dynamic sports mechanic styling) */}
        <path
          d="M66 22 L98 68 H118 L142 22 H120 L108 51 L86 22 H66 Z"
          fill="url(#vla-cyan-grad)"
          filter="url(#vla-glow)"
        />

        {/* 3. CONNECTOR HYPHEN "-" (Middle bar connecting V and LA) */}
        <rect
          x="138"
          y="42"
          width="44"
          height="12"
          rx="2"
          transform="skewX(-15)"
          fill="url(#vla-hyphen-grad)"
        />

        {/* 4. LETTERS "LA" (Bold joined sports lettering in #F21616 -> #F25116 -> #F27D16) */}
        <g fill="url(#vla-la-grad)">
          {/* Letter L */}
          <path d="M188 22 H208 L200 52 C199 56 201 58 206 58 H240 L237 68 H194 C184 68 180 62 182 52 L188 22 Z" />
          {/* Letter A (slanted, sports geometry) */}
          <path d="M236 68 L264 22 H288 L304 68 H282 L278 54 H254 L250 68 H236 Z M260 44 H275 L270 28 Z" />
        </g>

        {/* 5. SUBTITLE: "TALLER MECÁNICO" */}
        <text
          x="170"
          y="85"
          textAnchor="middle"
          fill="url(#vla-sub-grad)"
          style={{
            fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
            fontWeight: 800,
            fontSize: '14px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
          }}
        >
          TALLER MECÁNICO
        </text>

        {/* 6. BOTTOM UNDERLINE WITH DUAL GRADIENT */}
        <line
          x1="90"
          y1="90"
          x2="250"
          y2="90"
          stroke="url(#vla-sub-grad)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};
