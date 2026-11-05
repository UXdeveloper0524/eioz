"use client";
/** Decorative SVG scenes for the Journey of Light (aria-hidden). Animations are CSS, keyed off [data-active]. */
const S = { stroke: "currentColor", fill: "none", strokeWidth: 1.5 } as const;

function Spec() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full">
      {Array.from({ length: 9 }, (_, i) => (
        <line key={`v${i}`} data-draw style={{ ["--d" as string]: i }} x1={20 + i * 35} y1={10} x2={20 + i * 35} y2={210} {...S} strokeWidth={0.5} opacity={0.4} />
      ))}
      {Array.from({ length: 6 }, (_, i) => (
        <line key={`h${i}`} data-draw style={{ ["--d" as string]: i }} x1={10} y1={20 + i * 38} x2={310} y2={20 + i * 38} {...S} strokeWidth={0.5} opacity={0.4} />
      ))}
      <rect data-draw x={70} y={50} width={180} height={120} {...S} strokeWidth={2} className="text-primary" style={{ ["--d" as string]: 4 }} />
      <line data-draw x1={70} y1={185} x2={250} y2={185} {...S} style={{ ["--d" as string]: 6 }} />
      <text data-fade x={160} y={200} textAnchor="middle" fontSize={10} fill="currentColor">18.40 m</text>
      <g data-blink className="text-primary">
        <line x1={150} y1={110} x2={170} y2={110} {...S} />
        <line x1={160} y1={100} x2={160} y2={120} {...S} />
      </g>
    </svg>
  );
}

function Design() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full">
      <defs>
        <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--particle-core)" stopOpacity="0.7" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line data-draw x1={160} y1={0} x2={160} y2={50} {...S} />
      <g data-spin>
        <path data-draw d="M130 80 L145 50 L175 50 L190 80 Z" {...S} strokeWidth={2} className="text-primary" />
        <ellipse data-draw cx={160} cy={80} rx={30} ry={6} {...S} />
      </g>
      <path data-fade d="M130 82 L80 210 L240 210 L190 82 Z" fill="url(#cone)" />
      <g data-fade style={{ ["--d" as string]: 2 }} fontSize={10} fill="currentColor">
        <line x1={195} y1={65} x2={250} y2={40} {...S} strokeWidth={0.75} />
        <text x={254} y={42}>Atmosphere</text>
        <line x1={120} y1={140} x2={60} y2={120} {...S} strokeWidth={0.75} />
        <text x={14} y={118}>Efficiency</text>
      </g>
    </svg>
  );
}

function Value() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" fontSize={11} fill="currentColor">
      <text x={30} y={60}>Cost</text>
      <rect data-shrink x={90} y={48} width={120} height={16} rx={8} className="text-dark-muted" fill="currentColor" opacity={0.6} />
      <text x={30} y={110}>Efficiency</text>
      <rect x={90} y={98} width={190} height={16} rx={8} fill="currentColor" opacity={0.12} />
      <rect data-grow x={90} y={98} width={180} height={16} rx={8} className="text-primary" fill="currentColor" style={{ transformOrigin: "left", transformBox: "fill-box" }} />
      <g data-fade style={{ ["--d" as string]: 3 }}>
        <line x1={110} y1={180} x2={210} y2={180} stroke="currentColor" strokeWidth={2} />
        <line x1={160} y1={180} x2={160} y2={200} stroke="currentColor" strokeWidth={2} />
        <circle cx={110} cy={170} r={8} className="text-primary" fill="currentColor" />
        <circle cx={210} cy={170} r={8} className="text-primary" fill="currentColor" />
        <text x={230} y={185} className="text-primary">Optimized</text>
      </g>
    </svg>
  );
}

function Procure() {
  // Rough dotted world silhouette (Europe, Turkey, India, China, USA → Gulf).
  const dots: [number, number][] = [];
  for (let x = 10; x < 310; x += 9)
    for (let y = 30; y < 180; y += 9) {
      const na = x < 110 && y < 110 && y > 40 + (x - 10) * 0.1;
      const eu = x > 140 && x < 190 && y < 90 && y > 40;
      const as = x > 185 && x < 290 && y < 130 && y > 45;
      const af = x > 145 && x < 195 && y >= 90 && y < 170;
      if (na || eu || as || af) dots.push([x, y]);
    }
  const gulf = { x: 205, y: 100 };
  const src = [
    { x: 160, y: 60 },
    { x: 185, y: 75 },
    { x: 230, y: 105 },
    { x: 260, y: 75 },
    { x: 60, y: 75 },
  ];
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full">
      {dots.map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.4} fill="currentColor" opacity={0.35} />
      ))}
      {src.map((p, i) => (
        <path
          key={i}
          data-draw
          style={{ ["--d" as string]: i }}
          d={`M${p.x} ${p.y} Q ${(p.x + gulf.x) / 2} ${Math.min(p.y, gulf.y) - 40} ${gulf.x} ${gulf.y}`}
          {...S}
          className="text-primary"
        />
      ))}
      <circle data-fade cx={gulf.x} cy={gulf.y} r={6} className="text-primary node-active" fill="currentColor" style={{ ["--d" as string]: 5 }} />
    </svg>
  );
}

function Install() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full">
      <line x1={20} y1={205} x2={300} y2={205} {...S} opacity={0.5} />
      <g data-grow>
        <rect x={155} y={60} width={10} height={145} fill="currentColor" opacity={0.7} />
        <path d="M160 62 Q 160 40 200 40" {...S} strokeWidth={4} />
      </g>
      <g data-fade style={{ ["--d" as string]: 3 }}>
        <rect x={190} y={36} width={40} height={10} rx={3} className="text-primary" fill="currentColor" />
        <circle cx={150} cy={190} r={2} fill="currentColor" />
        <circle cx={170} cy={190} r={2} fill="currentColor" />
      </g>
      <g data-fade style={{ ["--d" as string]: 5 }} className="text-primary">
        <circle cx={250} cy={150} r={16} {...S} />
        <path d="M242 150 l6 6 l12 -12" {...S} strokeWidth={2.5} />
      </g>
    </svg>
  );
}

function Test() {
  return (
    <svg viewBox="0 0 320 220" className="h-full w-full" fontSize={11} fill="currentColor">
      <path d="M40 120 A60 60 0 0 1 160 120" {...S} strokeWidth={3} opacity={0.4} />
      <line data-needle x1={100} y1={120} x2={100} y2={70} stroke="currentColor" strokeWidth={3} className="text-primary" />
      {["Performance", "Safety", "Compliance"].map((t, i) => (
        <g key={t} data-fade style={{ ["--d" as string]: i + 1 }}>
          <path d={`M190 ${62 + i * 32} l5 5 l10 -10`} {...S} strokeWidth={2.5} className="text-primary" />
          <text x={214} y={66 + i * 32}>{t}</text>
        </g>
      ))}
      {[60, 130, 200, 270].map((x) => (
        <circle key={x} data-light cx={x} cy={190} r={8} fill="var(--particle-core)" />
      ))}
    </svg>
  );
}

export const SCENES = { spec: Spec, design: Design, value: Value, procure: Procure, install: Install, test: Test };
export type SceneId = keyof typeof SCENES;
