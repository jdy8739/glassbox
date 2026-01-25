export function GlassboxIcon() {
  return (
    <svg
      viewBox="0 0 128 128"
      width="128"
      height="128"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        {/* Gradient for the glass prism */}
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#0891b2" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#0e7490" stopOpacity="0.9" />
        </linearGradient>

        {/* Lighter gradient for highlights */}
        <linearGradient id="glassHighlight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>

        {/* Gradient for portfolio lines */}
        <linearGradient id="portfolioGradient" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>

        {/* Shadow filter */}
        <filter id="glassboxShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Background circle (subtle) */}
      <circle cx="64" cy="64" r="62" fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.3" />

      {/* Main glass prism - geometric diamond/cube shape */}
      <g filter="url(#glassboxShadow)">
        {/* Left face of prism */}
        <polygon
          points="64,24 40,64 64,88 88,64"
          fill="url(#glassGradient)"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.95"
        />

        {/* Right face highlight */}
        <polygon
          points="64,24 88,64 64,88"
          fill="url(#glassHighlight)"
          stroke="none"
        />

        {/* Front face with subtle lines */}
        <polygon
          points="40,64 64,88 88,64 64,40"
          fill="url(#glassGradient)"
          stroke="#ffffff"
          strokeWidth="1.5"
          opacity="0.85"
        />
      </g>

      {/* Portfolio chart inside - three ascending bars */}
      <g opacity="0.9">
        {/* Bar 1 - Left */}
        <rect x="44" y="68" width="6" height="12" fill="url(#portfolioGradient)" rx="1" />

        {/* Bar 2 - Middle */}
        <rect x="61" y="60" width="6" height="20" fill="url(#portfolioGradient)" rx="1" />

        {/* Bar 3 - Right */}
        <rect x="78" y="52" width="6" height="28" fill="url(#portfolioGradient)" rx="1" />
      </g>

      {/* Glass shine effect - top left corner */}
      <ellipse cx="48" cy="36" rx="12" ry="10" fill="#ffffff" opacity="0.3" />

      {/* Decorative transparency line - emphasizes glass concept */}
      <line
        x1="52"
        y1="52"
        x2="76"
        y2="76"
        stroke="#ffffff"
        strokeWidth="1"
        opacity="0.4"
        strokeDasharray="2,2"
      />
    </svg>
  );
}
