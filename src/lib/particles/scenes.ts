/**
 * Particle scenes + per-page presets.
 * Tune the look here without touching the engine.
 */
export const PARTICLE_CONFIG = {
  counts: { desktop: 40000, tablet: 15000, phone: 6000 },
  maxDpr: 1.75,
  /** Per-frame damping for scroll & uniform smoothing (critically damped lerp). */
  ease: 0.08,
  /** Seconds a full morph between two scenes takes. */
  morphSeconds: 1.6,
  introSeconds: 1.5,
  mouseRadius: 1.6,
  mouseStrength: 0.6,
  /** CSS variable names read for colors (keeps palette in styles.css). */
  colorVars: { core: "--particle-core", edge: "--particle-edge", tint: "--particle-tint" },
  adaptive: { minFps: 45, windowSeconds: 2, step: 0.3, floor: 0.25 },
  baseSize: 34,
};

export type SceneKey =
  | "dust"
  | "luminaire"
  | "rings"
  | "helix"
  | "grid"
  | "starfield"
  | "orb"
  | "year"
  | "nebulae"
  | "column"
  | "ambient"
  | "embers"
  | "contactRing";

export interface SceneParams {
  size: number;
  opacity: number;
  /** 0..1 fraction of particles visible. */
  density: number;
  /** Upward drift speed (world units / s) — wraps vertically. */
  drift: number;
  rotSpeed: number;
  flicker: number;
  /** Object offset on desktop / mobile. */
  offset: [number, number, number];
  offsetMobile: [number, number, number];
  mouse: number;
}

const base: SceneParams = {
  size: 1,
  opacity: 0.9,
  density: 1,
  drift: 0,
  rotSpeed: 0.03,
  flicker: 0,
  offset: [0, 0, 0],
  offsetMobile: [0, 0, 0],
  mouse: 1,
};
const p = (o: Partial<SceneParams>): SceneParams => ({ ...base, ...o });

export const SCENE_PARAMS: Record<SceneKey, SceneParams> = {
  dust: p({ size: 0.8, opacity: 0.6, rotSpeed: 0.05 }),
  luminaire: p({ size: 1, flicker: 1, rotSpeed: 0.12, offset: [3.4, 0.6, 0], offsetMobile: [0, 2.2, 0] }),
  rings: p({ size: 0.65, opacity: 0.28, density: 0.45, rotSpeed: 0.06, mouse: 0.4, offset: [4.6, 0, -3], offsetMobile: [0, 3, -3] }),
  helix: p({ size: 0.65, opacity: 0.3, density: 0.4, rotSpeed: 0.08, mouse: 0.4, offset: [0, -0.4, -3], offsetMobile: [0, -0.4, -3] }),
  grid: p({ size: 0.85, opacity: 0.75, rotSpeed: 0 }),
  starfield: p({ size: 0.7, opacity: 0.35, rotSpeed: 0.01, mouse: 0.3 }),
  orb: p({ size: 1, opacity: 0.55, rotSpeed: 0.25, mouse: 0.5 }),
  year: p({ size: 0.9, opacity: 0.8, rotSpeed: 0, drift: 0, offset: [3, 0.3, 0], offsetMobile: [0, 1.6, 0] }),
  nebulae: p({ size: 0.9, opacity: 0.75, rotSpeed: 0.04 }),
  column: p({ size: 0.9, opacity: 0.85, rotSpeed: 0.1, offset: [4, 0, 0], offsetMobile: [2.2, 0, 0] }),
  ambient: p({ size: 0.7, opacity: 0.35, density: 0.25, rotSpeed: 0.01, mouse: 0.3 }),
  embers: p({ size: 0.8, opacity: 0.55, density: 0.35, drift: 0.35, rotSpeed: 0 }),
  contactRing: p({ size: 0.8, opacity: 0.55, rotSpeed: 0.05 }),
};

/** Per-route presets: data-scene → scene, with a default for unmapped areas. */
export interface PagePreset {
  default: SceneKey;
  sections: Record<string, SceneKey>;
}
export const PAGE_PRESETS: Record<string, PagePreset> = {
  "/": {
    default: "starfield",
    sections: {
      hero: "luminaire",
      mission: "rings",
      process: "helix",
      solutions: "grid",
      partners: "starfield",
      clients: "starfield",
      projects: "starfield",
      cta: "orb",
      footer: "embers",
    },
  },
  "/about": { default: "dust", sections: { "page-hero": "year" } },
  "/group": { default: "nebulae", sections: {} },
  "/our-approach": { default: "ambient", sections: { "approach-steps": "column", "page-hero": "column" } },
  "/our-expertise": { default: "ambient", sections: {} },
  "/projects": { default: "ambient", sections: {} },
  "/careers": { default: "embers", sections: {} },
  "/404": { default: "dust", sections: {} },
  "/contact-us": { default: "contactRing", sections: {} },
};
export const presetFor = (path: string): PagePreset =>
  PAGE_PRESETS[path.replace(/\/$/, "") || "/"] ?? { default: "ambient", sections: {} };

/** Brand cluster centers for the Group page (camera moves toward them). */
export const NEBULA_CENTERS: [number, number, number][] = [
  [-4.5, 0.5, -1],
  [0, -0.8, -2],
  [4.5, 0.6, -1],
];

// ---------- generators (pure; Float32Array xyz + kind per particle) ----------
export interface SceneData {
  pos: Float32Array;
  /** 0 = default, 1 = flicker (light cone), 2 = hot core (bulb), 3+ = cluster id */
  kind: Float32Array;
}

type Rng = () => number;
function mulberry(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const gauss = (r: Rng) => {
  let u = 0;
  for (let i = 0; i < 4; i++) u += r();
  return (u - 2) / 2;
};

function make(n: number, fill: (i: number, r: Rng, out: [number, number, number]) => number, seed = 1): SceneData {
  const pos = new Float32Array(n * 3);
  const kind = new Float32Array(n);
  const r = mulberry(seed);
  const v: [number, number, number] = [0, 0, 0];
  for (let i = 0; i < n; i++) {
    kind[i] = fill(i, r, v);
    pos[i * 3] = v[0];
    pos[i * 3 + 1] = v[1];
    pos[i * 3 + 2] = v[2];
  }
  return { pos, kind };
}

function sphereShell(r: Rng, radius: number, o: [number, number, number]) {
  const u = r() * 2 - 1;
  const t = r() * Math.PI * 2;
  const s = Math.sqrt(1 - u * u);
  o[0] = radius * s * Math.cos(t);
  o[1] = radius * u;
  o[2] = radius * s * Math.sin(t);
}

const GEN: Record<SceneKey, (n: number) => SceneData> = {
  dust: (n) =>
    make(n, (_i, r, o) => {
      o[0] = gauss(r) * 9;
      o[1] = gauss(r) * 5;
      o[2] = gauss(r) * 4 - 1;
      return 0;
    }, 2),

  luminaire: (n) =>
    make(n, (_i, r, o) => {
      const x = r();
      if (x < 0.04) {
        // cord
        o[0] = gauss(r) * 0.01;
        o[1] = 1.7 + r() * 3;
        o[2] = gauss(r) * 0.01;
        return 0;
      }
      if (x < 0.3) {
        // shade (lathe profile: narrow top → wide rim)
        const t = r();
        const y = 1.7 - t * 1.05;
        const rad = 0.28 + Math.pow(t, 1.4) * 1.25;
        const a = r() * Math.PI * 2;
        o[0] = Math.cos(a) * rad;
        o[1] = y;
        o[2] = Math.sin(a) * rad;
        return 0;
      }
      if (x < 0.44) {
        // bulb
        sphereShell(r, 0.32 * Math.cbrt(r()), o);
        o[1] += 0.55;
        return 2;
      }
      // light cone falling downward, denser at the axis
      const t = Math.pow(r(), 0.8);
      const y = 0.45 - t * 4.2;
      const rad = (1.3 + t * 2.2) * Math.sqrt(r()) * (0.4 + 0.6 * r());
      const a = r() * Math.PI * 2;
      o[0] = Math.cos(a) * rad;
      o[1] = y;
      o[2] = Math.sin(a) * rad;
      return 1;
    }, 3),

  rings: (n) =>
    make(n, (i, r, o) => {
      const inner = i % 2 === 0;
      const R = inner ? 1.8 : 3;
      const a = r() * Math.PI * 2;
      const th = gauss(r) * (inner ? 0.06 : 0.09);
      const rr = R + th;
      const tilt = inner ? 0.9 : 1.15;
      const x = Math.cos(a) * rr;
      const z = Math.sin(a) * rr;
      o[0] = x;
      o[1] = z * Math.cos(tilt) + gauss(r) * 0.04;
      o[2] = z * Math.sin(tilt);
      return 0;
    }, 4),

  helix: (n) =>
    make(n, (i, r, o) => {
      // Flat "journey line" matching the section: six nodes on a thin horizontal filament.
      const x = r();
      if (x < 0.22) {
        // six node clusters, same spacing as the stage buttons (highlight tracks these)
        const step = i % 6;
        sphereShell(r, 0.3 * Math.cbrt(r()), o);
        o[0] += -6 + step * 2.4;
        o[1] += gauss(r) * 0.06;
        return 3 + step;
      }
      if (x < 0.8) {
        // the filament: a near-flat luminous thread with a gentle wave
        const t = r();
        o[0] = -7.5 + t * 15;
        o[1] = Math.sin(t * Math.PI * 3) * 0.14 + gauss(r) * 0.04;
        o[2] = gauss(r) * 0.12;
        return 0;
      }
      // sparse dust drifting around the path
      o[0] = (r() - 0.5) * 18;
      o[1] = gauss(r) * 2.2;
      o[2] = -1 + gauss(r) * 1.5;
      return 0;
    }, 5),

  grid: (n) =>
    make(n, (_i, r, o) => {
      // 4x2 constellation matching the 8 category cards
      const c = Math.floor(r() * 8);
      const cx = -4.5 + (c % 4) * 3;
      const cy = c < 4 ? 1.2 : -1.6;
      if (r() < 0.7) {
        o[0] = cx + gauss(r) * 0.7;
        o[1] = cy + gauss(r) * 0.85;
        o[2] = gauss(r) * 0.3;
        return 3 + c;
      }
      // faint grid lines connecting them
      if (r() < 0.5) {
        o[0] = -6 + r() * 12;
        o[1] = [2.6, -0.2, -3][Math.floor(r() * 3)]! + gauss(r) * 0.02;
      } else {
        o[0] = [-6, -3, 0, 3, 6][Math.floor(r() * 5)]! + gauss(r) * 0.02;
        o[1] = -3 + r() * 5.6;
      }
      o[2] = 0;
      return 0;
    }, 6),

  starfield: (n) =>
    make(n, (_i, r, o) => {
      o[0] = (r() - 0.5) * 30;
      o[1] = (r() - 0.5) * 18;
      o[2] = -12 + r() * 12;
      return 0;
    }, 7),

  orb: (n) =>
    make(n, (_i, r, o) => {
      sphereShell(r, 1.25 * Math.pow(r(), 0.6), o);
      return r() < 0.3 ? 2 : 0;
    }, 8),

  year: (n) => {
    const pts = sampleText("2010", n, 9);
    return pts;
  },

  nebulae: (n) =>
    make(n, (i, r, o) => {
      const c = i % 3;
      const center = NEBULA_CENTERS[c]!;
      const rad = Math.abs(gauss(r)) * 1.6;
      const a = r() * Math.PI * 2;
      o[0] = center[0] + Math.cos(a) * rad + gauss(r) * 0.3;
      o[1] = center[1] + Math.sin(a) * rad * 0.55 + gauss(r) * 0.3;
      o[2] = center[2] + gauss(r) * 0.6;
      return 3 + c;
    }, 10),

  column: (n) =>
    make(n, (_i, r, o) => {
      const rad = Math.abs(gauss(r)) * 0.45;
      const a = r() * Math.PI * 2;
      o[0] = Math.cos(a) * rad;
      o[1] = -5 + r() * 10;
      o[2] = Math.sin(a) * rad;
      return 0;
    }, 11),

  ambient: (n) => GEN.starfield(n),

  embers: (n) =>
    make(n, (_i, r, o) => {
      o[0] = (r() - 0.5) * 22;
      o[1] = (r() - 0.5) * 16;
      o[2] = -6 + r() * 6;
      return 1;
    }, 12),

  contactRing: (n) =>
    make(n, (_i, r, o) => {
      const a = r() * Math.PI * 2;
      const R = 5.2 + gauss(r) * 0.35;
      o[0] = Math.cos(a) * R * 1.25;
      o[1] = Math.sin(a) * R * 0.6;
      o[2] = -2 + gauss(r) * 0.4;
      return 0;
    }, 13),
};

/** Sparse point sample of text (browser only — uses a 2D canvas). */
function sampleText(text: string, n: number, seed: number): SceneData {
  const W = 512;
  const H = 200;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff";
  ctx.font = "800 170px Manrope, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const hits: number[] = [];
  for (let y = 0; y < H; y += 2) for (let x = 0; x < W; x += 2) if (data[(y * W + x) * 4 + 3]! > 128) hits.push(x, y);
  return make(n, (_i, r, o) => {
    if (hits.length && r() < 0.6) {
      const k = Math.floor(r() * (hits.length / 2)) * 2;
      o[0] = (hits[k]! / W - 0.5) * 6.4 + gauss(r) * 0.02;
      o[1] = -(hits[k + 1]! / H - 0.5) * 2.5 + gauss(r) * 0.02;
      o[2] = gauss(r) * 0.1;
      return 2;
    }
    o[0] = gauss(r) * 9;
    o[1] = gauss(r) * 5;
    o[2] = gauss(r) * 3 - 2;
    return 0;
  }, seed);
}

const cache = new Map<string, SceneData>();
export function getScene(key: SceneKey, n: number): SceneData {
  const id = `${key}:${n}`;
  let s = cache.get(id);
  if (!s) {
    s = GEN[key](n);
    cache.set(id, s);
  }
  return s;
}
export function clearSceneCache() {
  cache.clear();
}
