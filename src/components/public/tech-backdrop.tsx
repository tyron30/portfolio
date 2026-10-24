/** Hex grid, rotating HUD rings and glowing circuit traces. Pure SVG + CSS, no JavaScript. */
function Hud({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 800 800" fill="none" stroke="currentColor" className={className}>
      <g className="hud-spin-slow">
        <circle cx="400" cy="400" r="380" strokeWidth="1" strokeDasharray="6 10" />
        <circle cx="400" cy="400" r="350" strokeWidth="14" strokeDasharray="2 11" opacity="0.6" />
      </g>
      <g className="hud-spin-rev">
        <circle cx="400" cy="400" r="300" strokeWidth="2" strokeDasharray="120 40 12 40" />
        <circle cx="400" cy="400" r="270" strokeWidth="1" />
      </g>
      <g className="hud-spin-mid">
        <circle cx="400" cy="400" r="220" strokeWidth="6" strokeDasharray="60 160 20 160" />
        <circle cx="400" cy="400" r="190" strokeWidth="1" strokeDasharray="2 6" />
      </g>
      <circle cx="400" cy="400" r="130" strokeWidth="2" />
      <circle cx="400" cy="400" r="100" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="400" cy="400" r="6" fill="currentColor" />
      <path d="M400 20V120M400 680V780M20 400H120M680 400H780" strokeWidth="1.5" />
    </svg>
  );
}

const TRACES = [
  "M0 760 H180 L240 700 H520 L560 740 H760",
  "M0 830 H90 L150 770 H320",
  "M1600 140 H1380 L1320 200 H1100 L1060 160 H900",
  "M1600 250 H1500 L1450 300 H1280",
  "M0 190 H120 L170 240 H340",
];

export function TechBackdrop() {
  const fade = "linear-gradient(115deg,#000 0%,transparent 42%,transparent 58%,#000 100%)";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-blue-600 dark:text-cyan-300">
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.12] dark:opacity-[0.17]"
        style={{ WebkitMaskImage: fade, maskImage: fade }}
      >
        <defs>
          <pattern id="hexgrid" width="56" height="100" patternUnits="userSpaceOnUse" patternTransform="scale(1.15)">
            <path
              d="M28 66L0 50L0 16L28 0L56 16L56 50L28 66L28 100M28 0L28 34L0 50L0 84L28 100L56 84L56 50L28 34"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hexgrid)" />
      </svg>

      <Hud className="absolute -right-[24%] top-[4%] h-[min(105vh,900px)] w-[min(105vh,900px)] opacity-[0.16] dark:opacity-[0.5] max-md:opacity-[0.1]" />
      <Hud className="absolute -bottom-[26%] -left-[22%] h-[min(80vh,680px)] w-[min(80vh,680px)] opacity-[0.12] dark:opacity-[0.32] max-md:hidden" />

      <svg
        viewBox="0 0 1600 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="currentColor"
        className="absolute inset-0 h-full w-full opacity-[0.25] dark:opacity-[0.55] max-md:opacity-[0.15]"
      >
        {TRACES.map((d, i) => (
          <g key={i}>
            <path d={d} strokeWidth="1.2" opacity="0.35" />
            <path d={d} strokeWidth="2.2" className="trace-flow" style={{ animationDelay: `${i * -1.3}s` }} />
          </g>
        ))}
        <g fill="currentColor" stroke="none">
          <circle cx="760" cy="740" r="4" />
          <circle cx="320" cy="770" r="4" />
          <circle cx="900" cy="160" r="4" />
          <circle cx="1280" cy="300" r="4" />
          <circle cx="340" cy="240" r="4" />
        </g>
      </svg>
    </div>
  );
}
