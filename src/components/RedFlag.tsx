export function RedFlag({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 170 80"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--red-flag)" />
          <stop offset="100%" stopColor="oklch(0.45 0.22 20)" />
        </linearGradient>
        <filter id="flagShadow">
          <feDropShadow dx="2" dy="3" stdDeviation="3" floodOpacity="0.3" />
        </filter>
      </defs>

      <rect x="35" y="0" width="3" height="80" fill="var(--carbon)" rx="1.5" />

      <g filter="url(#flagShadow)">
        <path
          d="M0,0 L0,60 C15,55 30,65 45,58 C60,51 75,63 90,57 C105,51 120,61 135,55 L135,0 Z"
          fill="url(#flagGrad)"
          style={{ animation: "flag-wave 3s ease-in-out infinite" }}
        />

        <polygon
          points="68,12 71,22 82,22 73,28 76,38 68,32 60,38 63,28 54,22 65,22"
          fill="var(--yellow-star)"
        />
      </g>
    </svg>
  )
}
