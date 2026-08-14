interface RotatingBadgeProps {
  text: string;
  size?: number;
  className?: string;
}

/**
 * A continuously-rotating circular badge with text curved around its
 * circumference — think a certification seal or stamp. This is the
 * signature visual element of the redesign: rather than decoration, it
 * literally displays the owner's credentials (e.g. "CERTIFIED IT SPECIALIST
 * • NETWORK & SYSTEMS •"), so it's tied directly to real content instead of
 * being generic flourish.
 */
export function RotatingBadge({ text, size = 110, className }: RotatingBadgeProps) {
  const radius = size / 2 - 14;
  const pathId = "badge-circle-path";

  return (
    <div
      className={className}
      style={{ width: size, height: size, animation: "spin-slow 16s linear infinite" }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <defs>
          <path
            id={pathId}
            d={`M ${size / 2}, ${size / 2} m -${radius}, 0 a ${radius},${radius} 0 1,1 ${
              radius * 2
            },0 a ${radius},${radius} 0 1,1 -${radius * 2},0`}
          />
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 2}
          fill="none"
          stroke="hsl(var(--primary) / 0.35)"
          strokeWidth="1"
        />
        <text fill="hsl(var(--primary))" fontSize="8.5" letterSpacing="2" fontWeight="600">
          <textPath href={`#${pathId}`} startOffset="0%">
            {text}
          </textPath>
        </text>
        <circle cx={size / 2} cy={size / 2} r={radius - 18} fill="hsl(var(--primary) / 0.08)" />
      </svg>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
