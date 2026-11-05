"use client";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { readPaused } from "@/lib/particles/bus";
import type { ParticleEngine } from "@/lib/particles/engine";

/** Fixed, site-wide particle layer. Engine is lazy-loaded after first paint. */
export function ParticleField() {
  const ref = useRef<HTMLDivElement>(null);
  const engine = useRef<ParticleEngine | null>(null);
  const [mode, setMode] = useState<"pending" | "webgl" | "fallback">("pending");
  const pathname = usePathname();

  useEffect(() => {
    let disposed = false;
    const idle =
      (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 200));
    idle(
      () => {
        import("@/lib/particles/engine").then(({ ParticleEngine, canUseParticles }) => {
          if (disposed || !ref.current) return;
          if (!canUseParticles()) return setMode("fallback");
          try {
            const e = new ParticleEngine(ref.current);
            engine.current = e;
            e.setPage(window.location.pathname);
            e.start();
            if (readPaused()) e.setPaused(true);
            setMode("webgl");
            (window as Window & { __particles?: ParticleEngine }).__particles = e;
          } catch {
            setMode("fallback");
          }
        });
      },
      { timeout: 1500 },
    );
    const onPause = (ev: Event) => engine.current?.setPaused((ev as CustomEvent<boolean>).detail);
    window.addEventListener("particles:pause", onPause);
    return () => {
      disposed = true;
      window.removeEventListener("particles:pause", onPause);
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => engine.current?.setPage(pathname));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div aria-hidden className="particle-layer" data-mode={mode}>
      <div ref={ref} className="particle-canvas" />
      {mode === "fallback" && (
        <div className="particle-fallback">
          {Array.from({ length: 9 }, (_, i) => (
            <span key={i} style={{ ["--i" as string]: i }} />
          ))}
        </div>
      )}
      <div className="particle-vignette" />
    </div>
  );
}
