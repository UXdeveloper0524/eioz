import * as THREE from "three";
import {
  NEBULA_CENTERS,
  PARTICLE_CONFIG as CFG,
  SCENE_PARAMS,
  getScene,
  presetFor,
  type SceneKey,
} from "./scenes";

/** Browser-only particle engine. One renderer for the whole site. */

const vertex = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aRand;
attribute float aKind;
uniform float uMix, uTime, uSize, uPixelRatio, uIgnite, uFlicker, uDrift, uDensity;
uniform float uHighlightX, uHighlight, uExpand, uMouseStr, uAttractStr, uFlash, uPulse;
uniform float uFlowX, uStretch, uRippleAge, uRippleAmp, uFill, uRingBoost;
uniform vec3 uRipple;
uniform vec3 uMouse, uAttract;
varying float vAlpha;
varying float vHeat;
varying float vTint;
void main() {
  float m = smoothstep(0.0, 1.0, clamp(uMix * 1.35 - aRand * 0.35, 0.0, 1.0));
  vec3 p = mix(aFrom, aTo, m);
  if (uDrift > 0.0) p.y = mod(p.y + 8.0 + uTime * uDrift * (0.4 + aRand), 16.0) - 8.0;
  p.x = uFlowX != 0.0 ? mod(p.x + 15.0 + uFlowX * (0.6 + aRand * 0.8), 30.0) - 15.0 : p.x;
  p.x *= 1.0 + uStretch * (0.4 + aRand);
  p *= 1.0 + uExpand * 0.55 + uPulse * 0.035 * sin(uTime * 2.2);
  p += 0.035 * vec3(sin(uTime * 0.7 + aRand * 40.0), cos(uTime * 0.6 + aRand * 30.0), sin(uTime * 0.5 + aRand * 20.0));

  vec4 world = modelMatrix * vec4(p, 1.0);
  vec2 d = world.xy - uMouse.xy;
  float md = length(d);
  float mf = uMouseStr * (1.0 - smoothstep(0.0, ${CFG.mouseRadius.toFixed(2)}, md));
  world.xy += normalize(d + 1e-4) * mf * ${CFG.mouseStrength.toFixed(2)};
  vec2 rd = world.xy - uRipple.xy;
  float rl = length(rd);
  float wave = sin(rl * 3.5 - uRippleAge * 9.0) * exp(-uRippleAge * 1.6) * (1.0 - smoothstep(uRippleAge * 4.0 - 1.0, uRippleAge * 4.0 + 1.0, rl));
  world.xy += normalize(rd + 1e-4) * wave * uRippleAmp * 0.35;
  vec2 a = uAttract.xy - world.xy;
  float af = uAttractStr * (1.0 - smoothstep(0.0, 3.5, length(a)));
  world.xy += a * af * 0.3;

  vec4 mv = viewMatrix * world;
  gl_Position = projectionMatrix * mv;

  // Intro: ignite outward from the bulb.
  float ign = 1.0 - smoothstep(uIgnite * 7.0 - 1.5, uIgnite * 7.0, length(aTo - vec3(0.0, 0.55, 0.0)));
  float heat = mf * 1.2 + uHighlight * 0.4 * (1.0 - smoothstep(0.0, 0.9, abs(aKind - 3.0 - uHighlightX))) * step(2.5, aKind) * step(aKind, 8.5);
  heat += (aKind > 1.5 && aKind < 2.5) ? 0.35 + uFlash * 2.0 : 0.0;
  heat += abs(wave) * uRippleAmp * 0.8 + af * 0.9;
  heat += uFill > 0.0 ? step(p.y, mix(-5.0, 5.0, uFill)) * 0.5 : 0.0;
  heat += uRingBoost * step(1.5, aKind) * step(aKind, 2.5) * 0.6;
  float tw = 0.7 + 0.3 * sin(uTime * 1.6 + aRand * 100.0);
  float fl = (aKind > 0.5 && aKind < 1.5) ? mix(1.0, 0.65 + 0.35 * sin(uTime * 7.0 + aRand * 60.0) * sin(uTime * 2.3 + aRand * 13.0), uFlicker) : 1.0;
  float visible = step(aRand, uDensity);
  vAlpha = tw * fl * visible * mix(0.25, 1.0, ign);
  vHeat = heat;
  vTint = aKind > 2.5 ? fract(aKind * 0.37) : aRand;
  gl_PointSize = uSize * uPixelRatio * (0.6 + aRand * 0.8) * (1.0 + heat * 0.6) / -mv.z * visible;
}
`;

const fragment = /* glsl */ `
uniform vec3 uCore, uEdge, uTintC;
uniform float uOpacity;
varying float vAlpha;
varying float vHeat;
varying float vTint;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = 1.0 - smoothstep(0.0, 0.5, d);
  vec3 edge = mix(uEdge, uTintC, smoothstep(0.6, 1.0, vTint) * 0.6);
  vec3 col = mix(edge, uCore, clamp((1.0 - smoothstep(0.0, 0.3, d)) * 0.55 + vHeat * 0.5, 0.0, 1.0));
  col = mix(col, vec3(1.0), clamp(vHeat - 1.0, 0.0, 1.0));
  gl_FragColor = vec4(col, a * a * vAlpha * uOpacity);
}
`;

function cssColor(name: string, fallback: string): THREE.Color {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = raw;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return new THREE.Color(r! / 255, g! / 255, b! / 255).convertSRGBToLinear();
}

export function particleCount() {
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  if (w < 480 || cores <= 2) return CFG.counts.phone;
  if (w < 1024 || cores <= 4) return CFG.counts.tablet;
  return CFG.counts.desktop;
}

export class ParticleEngine {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private geo = new THREE.BufferGeometry();
  private mat: THREE.ShaderMaterial;
  private points: THREE.Points;
  private n: number;
  private drawn: number;
  private aFrom: THREE.BufferAttribute;
  private aTo: THREE.BufferAttribute;
  private aKind: THREE.BufferAttribute;
  private current: SceneKey | null = null;
  private mixT = 1;
  private raf = 0;
  private frame = 0;
  private last = 0;
  private time = 0;
  private paused = false;
  private path = "/";
  private visibleEls = new Set<Element>();
  private sceneEls: Element[] = [];
  private io: IntersectionObserver;
  private mouseTarget = new THREE.Vector3(0, 0, 100);
  private mouse = new THREE.Vector3(0, 0, 100);
  private attractTarget = { pos: new THREE.Vector3(), str: 0 };
  private expandTarget = 0;
  private cameraTarget = new THREE.Vector3(0, 0, 10);
  private highlightXTarget = 0;
  private highlightTarget = 0;
  private progressOverride: number | null = null;
  private flowSpeed = 0;
  private flowOffset = 0;
  private stretchTarget = 0;
  private ringBoost = 0;
  private fillTarget = 0;
  private fpsFrames: number[] = [];
  private introStart = -1;
  private cleanups: (() => void)[] = [];
  private isTouch = window.matchMedia("(pointer: coarse)").matches;
  private target = { ...SCENE_PARAMS.dust, offset: [0, 0, 0] as [number, number, number] };

  constructor(private host: HTMLElement) {
    this.n = particleCount();
    this.drawn = this.n;
    this.renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, CFG.maxDpr));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const canvas = this.renderer.domElement;
    canvas.id = "bg-particles";
    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("role", "presentation");
    host.appendChild(canvas);

    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.set(0, 0, 10);

    const start = getScene("dust", this.n);
    this.aFrom = new THREE.BufferAttribute(new Float32Array(start.pos), 3);
    this.aTo = new THREE.BufferAttribute(new Float32Array(start.pos), 3);
    this.aKind = new THREE.BufferAttribute(new Float32Array(start.kind), 1);
    const rand = new Float32Array(this.n);
    for (let i = 0; i < this.n; i++) rand[i] = Math.random();
    this.geo.setAttribute("position", this.aTo); // bounds only
    this.geo.setAttribute("aFrom", this.aFrom);
    this.geo.setAttribute("aTo", this.aTo);
    this.geo.setAttribute("aKind", this.aKind);
    this.geo.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));

    this.mat = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uMix: { value: 1 },
        uTime: { value: 0 },
        uSize: { value: CFG.baseSize },
        uPixelRatio: { value: this.renderer.getPixelRatio() },
        uIgnite: { value: 0 },
        uFlicker: { value: 0 },
        uDrift: { value: 0 },
        uDensity: { value: 1 },
        uHighlightX: { value: 0 },
        uHighlight: { value: 0 },
        uExpand: { value: 0 },
        uPulse: { value: 0 },
        uMouseStr: { value: 0 },
        uAttractStr: { value: 0 },
        uFlash: { value: 0 },
        uFlowX: { value: 0 },
        uStretch: { value: 0 },
        uRippleAge: { value: 99 },
        uRippleAmp: { value: 0 },
        uRipple: { value: new THREE.Vector3() },
        uFill: { value: 0 },
        uRingBoost: { value: 0 },
        uMouse: { value: this.mouse },
        uAttract: { value: new THREE.Vector3() },
        uOpacity: { value: 0.6 },
        uCore: { value: cssColor(CFG.colorVars.core, "#fff4e0") },
        uEdge: { value: cssColor(CFG.colorVars.edge, "#00aeef") },
        uTintC: { value: cssColor(CFG.colorVars.tint, "#7fd6ff") },
      },
    });
    this.points = new THREE.Points(this.geo, this.mat);
    this.points.frustumCulled = false;
    this.scene.add(this.points);

    this.io = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? this.visibleEls.add(e.target) : this.visibleEls.delete(e.target))),
      { threshold: 0 },
    );
    this.bindEvents();
  }

  start() {
    this.last = performance.now();
    this.introStart = this.time;
    this.loop();
  }

  setPaused(p: boolean) {
    this.paused = p;
    if (p) cancelAnimationFrame(this.raf);
    else {
      this.last = performance.now();
      this.loop();
    }
  }

  /** Call after route DOM has rendered. Tweens to the new page's preset. */
  setPage(path: string) {
    this.path = path;
    this.io.disconnect();
    this.visibleEls.clear();
    this.sceneEls = Array.from(document.querySelectorAll("[data-scene]"));
    this.sceneEls.forEach((el) => this.io.observe(el));
    this.expandTarget = 0;
    this.attractTarget.str = 0;
    this.updateActive(true);
  }

  private morphTo(key: SceneKey) {
    if (key === this.current) return;
    // Snapshot the currently displayed (mixed) positions as the new "from".
    const from = this.aFrom.array as Float32Array;
    const to = this.aTo.array as Float32Array;
    const m = this.mixT;
    for (let i = 0; i < from.length; i++) from[i] = from[i]! + (to[i]! - from[i]!) * m;
    const next = getScene(key, this.n);
    to.set(next.pos);
    (this.aKind.array as Float32Array).set(next.kind);
    this.aFrom.needsUpdate = this.aTo.needsUpdate = this.aKind.needsUpdate = true;
    this.mixT = 0;
    this.current = key;
    const prm = SCENE_PARAMS[key];
    const mobile = window.innerWidth < 1024;
    this.target = { ...prm, offset: mobile ? prm.offsetMobile : prm.offset };
  }

  private updateActive(force = false) {
    const preset = presetFor(this.path);
    const mid = window.innerHeight * 0.5;
    let key: SceneKey = preset.default;
    let progress = 0;
    // Fresh query: hydration/route swaps can replace observed nodes.
    const els = this.visibleEls.size >= 1 && [...this.visibleEls].every((e) => e.isConnected) ? [...this.visibleEls] : Array.from(document.querySelectorAll("[data-scene]"));
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top <= mid && r.bottom >= mid) {
        const name = (el as HTMLElement).dataset["scene"] ?? "";
        const mapped = preset.sections[name];
        if (mapped) key = mapped;
        progress = Math.min(1, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
        break;
      }
    }
    if (force || key !== this.current) this.morphTo(key);
    // Scene-specific scroll couplings
    const pr = this.progressOverride ?? progress;
    this.highlightTarget = key === "helix" ? 1 : 0;
    this.highlightXTarget = Math.min(5, Math.floor(pr * 6));
    this.fillTarget = key === "column" ? Math.max(0.02, pr) : 0;
    if (key !== "starfield") this.flowSpeed = 0;
    if (key !== "rings") this.ringBoost = 0;
  }

  private bindEvents() {
    const on = <K extends keyof WindowEventMap>(t: K, f: (e: WindowEventMap[K]) => void, o?: AddEventListenerOptions) => {
      window.addEventListener(t, f, o);
      this.cleanups.push(() => window.removeEventListener(t, f));
    };
    on("scroll", () => this.updateActive(), { passive: true });
    let rt = 0;
    on("resize", () => {
      clearTimeout(rt);
      rt = window.setTimeout(() => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        const k = this.current;
        this.current = null;
        if (k) this.morphTo(k);
      }, 150);
    });
    on("pointermove", (e) => {
      if (e.pointerType !== "mouse") return;
      this.mouseTarget.copy(this.screenToWorld(e.clientX, e.clientY));
    }, { passive: true });
    on("pointerleave" as keyof WindowEventMap, () => this.mouseTarget.set(0, 0, 100));
    const vis = () => (document.hidden ? cancelAnimationFrame(this.raf) : !this.paused && ((this.last = performance.now()), this.loop()));
    document.addEventListener("visibilitychange", vis);
    this.cleanups.push(() => document.removeEventListener("visibilitychange", vis));

    // Interaction bus (dispatched by page components)
    const attract = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number } | null>).detail;
      if (!d) this.attractTarget.str = 0;
      else {
        this.attractTarget.pos.copy(this.screenToWorld(d.x, d.y));
        this.attractTarget.str = 1;
      }
    };
    const expand = (e: Event) => (this.expandTarget = (e as CustomEvent<boolean>).detail ? 1 : 0);
    const focus = (e: Event) => {
      const i = (e as CustomEvent<number | null>).detail;
      const c = i == null ? null : NEBULA_CENTERS[i];
      this.cameraTarget.set(c ? c[0] * 0.6 : 0, c ? c[1] * 0.6 : 0, c ? 7 : 10);
    };
    const ripple = (e: Event) => {
      const d = (e as CustomEvent<{ x: number; y: number; amp?: number }>).detail;
      (this.mat.uniforms["uRipple"]!.value as THREE.Vector3).copy(this.screenToWorld(d.x, d.y));
      this.mat.uniforms["uRippleAge"]!.value = 0;
      this.mat.uniforms["uRippleAmp"]!.value = d.amp ?? 1;
    };
    const num = (fn: (v: number) => void) => (e: Event) => fn(Number((e as CustomEvent<number>).detail) || 0);
    const flow = num((v) => (this.flowSpeed = v));
    const stretch = num((v) => (this.stretchTarget = Math.max(-0.6, Math.min(0.6, v))));
    const ring = num((v) => (this.ringBoost = v));
    const progress = (e: Event) => (this.progressOverride = (e as CustomEvent<number | null>).detail);
    const pairs: [string, (e: Event) => void][] = [
      ["particles:ripple", ripple],
      ["particles:flow", flow],
      ["particles:stretch", stretch],
      ["particles:ring", ring],
      ["particles:progress", progress],
    ];
    pairs.forEach(([t, f]) => window.addEventListener(t, f));
    this.cleanups.push(() => pairs.forEach(([t, f]) => window.removeEventListener(t, f)));
    window.addEventListener("particles:attract", attract);
    window.addEventListener("particles:expand", expand);
    window.addEventListener("particles:focus", focus);
    this.cleanups.push(() => {
      window.removeEventListener("particles:attract", attract);
      window.removeEventListener("particles:expand", expand);
      window.removeEventListener("particles:focus", focus);
    });
  }

  /** Journey scene: pin the six node clusters onto the on-page stage markers ([data-stage-anchor]). */
  private anchorStages(k: number) {
    if (this.current !== "helix") return false;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-stage-anchor]")).filter((e) => e.offsetParent !== null);
    if (els.length !== 6) return false;
    const c = els.map((e) => {
      const r = e.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    });
    // Active stage: explicit marker (pinned desktop) or the marker nearest the viewport centre (mobile).
    let active = els.findIndex((e) => e.dataset["stageCurrent"] === "true");
    if (active < 0) {
      const mid = window.innerHeight * 0.5;
      let best = Infinity;
      c.forEach((p, i) => {
        const d = Math.abs(p.y - mid);
        if (d < best) {
          best = d;
          active = i;
        }
      });
    }
    this.highlightXTarget = active;
    // Map with the camera's resting pose so the fit doesn't depend on mid-lerp camera state.
    const a = this.screenToWorld(c[0]!.x, c[0]!.y);
    const b = this.screenToWorld(c[5]!.x, c[5]!.y);
    const dx = b.x - a.x, dy = b.y - a.y;
    const len = Math.hypot(dx, dy);
    if (len < 0.1) return false;
    const P = this.points;
    // Cluster x runs -6..6 (12 units) in local space.
    P.position.x += ((a.x + b.x) / 2 - P.position.x) * k * 2;
    P.position.y += ((a.y + b.y) / 2 - P.position.y) * k * 2;
    P.position.z += (0 - P.position.z) * k;
    P.scale.x += (len / 12 - P.scale.x) * k * 2;
    P.rotation.set(0, 0, P.rotation.z + (Math.atan2(dy, dx) - P.rotation.z) * k * 2);
    return true;
  }

  private screenToWorld(x: number, y: number) {
    const v = new THREE.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5).unproject(this.camera);
    const dir = v.sub(this.camera.position).normalize();
    const t = -this.camera.position.z / dir.z;
    return this.camera.position.clone().add(dir.multiplyScalar(t));
  }

  private adapt(dt: number) {
    this.fpsFrames.push(dt);
    const need = Math.round(60 * CFG.adaptive.windowSeconds);
    if (this.fpsFrames.length < need) return;
    const avg = this.fpsFrames.reduce((a, b) => a + b, 0) / this.fpsFrames.length;
    this.fpsFrames.length = 0;
    if (1 / avg < CFG.adaptive.minFps && this.drawn > this.n * CFG.adaptive.floor) {
      this.drawn = Math.max(Math.floor(this.n * CFG.adaptive.floor), Math.floor(this.drawn * (1 - CFG.adaptive.step)));
      this.geo.setDrawRange(0, this.drawn);
    }
  }

  /** Debug snapshot (read by tests / console). */
  stats() {
    return { count: this.n, drawn: this.drawn, scene: this.current, path: this.path };
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const now = performance.now();
    const dt = Math.min((now - this.last) / 1000, 0.05);
    this.last = now;
    this.time += dt;
    if ((this.frame = (this.frame + 1) % 12) === 0) this.updateActive();
    this.adapt(dt);

    const u = this.mat.uniforms as Record<string, THREE.IUniform>;
    const k = 1 - Math.pow(1 - CFG.ease, dt * 60);
    const L = (name: string, to: number) => (u[name]!.value += (to - u[name]!.value) * k);

    this.mixT = Math.min(1, this.mixT + dt / CFG.morphSeconds);
    u["uMix"]!.value = this.mixT;
    u["uTime"]!.value = this.time;

    // intro: ignite + flash once, on first hero
    const it = (this.time - this.introStart) / CFG.introSeconds;
    u["uIgnite"]!.value = Math.min(1, Math.max(0, it));
    u["uFlash"]!.value = it < 1 ? 0 : Math.max(0, 1 - (it - 1) * 2);

    const t = this.target;
    L("uSize", CFG.baseSize * t.size);
    L("uOpacity", t.opacity);
    L("uDensity", t.density);
    L("uFlicker", t.flicker);
    u["uDrift"]!.value = t.drift;
    L("uHighlight", this.highlightTarget);
    L("uHighlightX", this.highlightXTarget);
    L("uExpand", this.expandTarget);
    L("uPulse", this.current === "orb" ? 1 : 0);
    L("uAttractStr", this.attractTarget.str);
    L("uFill", this.fillTarget);
    L("uRingBoost", this.ringBoost);
    this.stretchTarget *= Math.exp(-3 * dt);
    L("uStretch", this.stretchTarget);
    this.flowOffset += this.flowSpeed * dt;
    u["uFlowX"]!.value = this.flowOffset === 0 ? 0 : this.flowOffset + 1e-3;
    u["uRippleAge"]!.value += dt;
    this.points.rotation.z += (this.ringBoost * 0.6 - 0) * dt * (this.current === "rings" ? 1 : 0);
    (u["uAttract"]!.value as THREE.Vector3).lerp(this.attractTarget.pos, k);

    if (this.isTouch) this.mouseTarget.set(Math.sin(this.time * 0.2) * 3, Math.cos(this.time * 0.15) * 1.5, 0);
    this.mouse.lerp(this.mouseTarget, k);
    L("uMouseStr", this.mouseTarget.z > 50 ? 0 : (this.isTouch ? 0.4 : 1) * t.mouse);

    if (!this.anchorStages(k)) {
      this.points.position.x += (t.offset[0] - this.points.position.x) * k;
      this.points.position.y += (t.offset[1] - this.points.position.y) * k;
      this.points.position.z += (0 - this.points.position.z) * k;
      this.points.scale.x += (1 - this.points.scale.x) * k;
      if (this.current !== "rings") this.points.rotation.z += (0 - this.points.rotation.z) * k;
      this.points.rotation.y += t.rotSpeed * (1 + this.ringBoost * 2) * dt;
      const scrollP = window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      this.points.rotation.x += (scrollP * 0.3 - this.points.rotation.x) * k;
    }
    this.camera.position.lerp(this.cameraTarget, k * 0.5);
    this.camera.lookAt(this.cameraTarget.x, this.cameraTarget.y, 0);

    this.renderer.render(this.scene, this.camera);
    if (!this.host.dataset["sceneReady"]) this.host.dataset["sceneReady"] = "true";
  };

  dispose() {
    cancelAnimationFrame(this.raf);
    this.io.disconnect();
    this.cleanups.forEach((f) => f());
    this.geo.dispose();
    this.mat.dispose();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }
}

export function canUseParticles() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return false;
  const c = document.createElement("canvas");
  const gl = c.getContext("webgl2") || c.getContext("webgl");
  gl?.getExtension("WEBGL_lose_context")?.loseContext();
  return !!gl;
}
