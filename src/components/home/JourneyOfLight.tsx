"use client";
import { Link } from "@/components/site/Link";
import { ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/Section";
import { emitParticles, rippleFromEl } from "@/lib/particles/bus";
import { cn } from "@/lib/utils";
import { SCENES, type SceneId } from "./journey-scenes";

export const STAGES: { title: string; line: string; scene: SceneId }[] = [
  { title: "Specification Analysis", line: "We study the brief, the space and the standards before a single fixture is chosen.", scene: "spec" },
  { title: "Design", line: "Lighting concepts shaped around function, atmosphere and energy efficiency.", scene: "design" },
  { title: "Value Engineering", line: "The right performance at the right cost, without compromising quality.", scene: "value" },
  { title: "Procurement and Sourcing", line: "Premium fixtures sourced through our global manufacturing partnerships.", scene: "procure" },
  { title: "Installation", line: "Precise, safe installation aligned with project specifications.", scene: "install" },
  { title: "Testing and Commissioning", line: "Every system tested for performance, safety and compliance before handover.", scene: "test" },
];

const pad = (n: number) => String(n).padStart(2, "0");

export function JourneyOfLight() {
  const wrap = useRef<HTMLElement>(null);
  const nodes = useRef<(HTMLButtonElement | null)[]>([]);
  const [mode, setMode] = useState<"stepper" | "pinned" | "static">("stepper");
  const [progress, setProgress] = useState(0);
  const [announce, setAnnounce] = useState("");
  const active = Math.min(5, Math.floor(progress * 6));

  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const rm = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMode(rm.matches ? "static" : lg.matches ? "pinned" : "stepper");
    update();
    lg.addEventListener("change", update);
    rm.addEventListener("change", update);
    return () => {
      lg.removeEventListener("change", update);
      rm.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (mode !== "pinned") return;
    let raf = 0;
    let cur = 0;
    const tick = () => {
      const el = wrap.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const target = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
        cur += (target - cur) * 0.12;
        if (Math.abs(target - cur) < 0.0005) cur = target;
        setProgress(cur);
        const inView = r.top < window.innerHeight && r.bottom > 0;
        emitParticles("particles:progress", inView ? cur : null);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      emitParticles("particles:progress", null);
    };
  }, [mode]);

  const goTo = useCallback((i: number, viaKeyboard = false) => {
    const el = wrap.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + span * ((i + 0.5) / 6), behavior: "smooth" });
    const n = nodes.current[i];
    if (n) rippleFromEl(n, 1.2);
    if (viaKeyboard) setAnnounce(`Stage ${i + 1} of 6: ${STAGES[i]!.title}`);
  }, []);

  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = Math.max(0, Math.min(5, i + d));
    nodes.current[n]?.focus();
    goTo(n, true);
  };

  const header = (
    <div className="flex flex-wrap items-end justify-between gap-6">
      <SectionHeading id="process-title" tone="dark" eyebrow="Journey of Light" title="our work in" highlight="process" />
      <Button asChild variant="outline-dark">
        <Link to="/our-approach">
          See our approach <ArrowRight />
        </Link>
      </Button>
    </div>
  );

  if (mode !== "pinned") {
    return (
      <section id="process" data-scene="process" aria-labelledby="process-title" className="section-pad scroll-mt-20">
        <div className="container-site">
          {header}
          <ol className="relative mt-14 space-y-8 border-l border-primary/40 pl-8">
            {STAGES.map((s, i) => (
              <StepperItem key={s.title} i={i} stage={s} staticScene={mode === "static"} />
            ))}
          </ol>
        </div>
      </section>
    );
  }

  const Scene = SCENES[STAGES[active]!.scene];
  const finale = progress > 0.97;
  return (
    <>
      <a href="#after-process" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground">
        Skip process section
      </a>
      <section id="process" data-scene="process" aria-labelledby="process-title" ref={wrap} className="relative" style={{ height: "600vh" }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden pt-20">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: 0.25 + progress * 0.6 + (finale ? 0.4 : 0),
              background: `radial-gradient(60% 60% at 50% 60%, color-mix(in oklab, var(--particle-core) ${8 + progress * 14}%, transparent), transparent 70%)`,
            }}
          />
          <div className="container-site relative">
            {header}
            <div className="mt-6 grid h-[36vh] grid-cols-[1fr_1.4fr] items-center gap-10">
              <div>
                <p className="outline-num font-display text-[9rem] font-extrabold leading-none" aria-hidden>
                  {pad(active + 1)}
                </p>
                <h3 className="mt-2 text-3xl font-bold text-dark-foreground">{STAGES[active]!.title}</h3>
                <p className="mt-3 max-w-md text-lg text-dark-muted">{STAGES[active]!.line}</p>
              </div>
              <div key={active} aria-hidden className="jol-scene page-fade h-full text-dark-foreground" data-active="true">
                <Scene />
              </div>
            </div>
            {/* Filament */}
            <div className="relative mt-14">
              <div className="h-px w-full bg-dark-border" />
              <div className="absolute left-0 top-0 h-px shadow-glow" style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg, oklch(0.7 0.12 70), var(--particle-core))" }} />
              <ol className="absolute inset-x-0 -top-5 flex justify-between">
                {STAGES.map((s, i) => (
                  <li key={s.title} className="group relative">
                    <button
                      ref={(el) => {
                        nodes.current[i] = el;
                      }}
                      type="button"
                      onClick={() => goTo(i)}
                      onKeyDown={(e) => onKey(e, i)}
                      aria-label={`Stage ${i + 1}: ${s.title}`}
                      aria-current={i === active ? "step" : undefined}
                      data-stage-anchor={i}
                      data-stage-current={i === active}
                      className={cn(
                        "flex h-11 w-11 items-center justify-center rounded-full border font-display text-xs font-bold transition-all duration-300",
                        i < active && "border-primary bg-primary/20 text-primary",
                        i === active && "node-active scale-110 border-primary bg-primary text-primary-foreground",
                        i > active && "border-dark-border bg-dark text-dark-muted hover:border-primary hover:text-primary",
                      )}
                    >
                      {pad(i + 1)}
                    </button>
                    <span className="pointer-events-none absolute left-1/2 top-14 w-max -translate-x-1/2 rounded-md bg-dark-elevated px-2 py-1 text-xs text-dark-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      {s.title}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <p className="mt-16 text-right font-display text-sm tracking-widest text-dark-muted">
              <span className="text-primary">{pad(active + 1)}</span> / 06
            </p>
          </div>
        </div>
        {/* All text present for SEO / screen readers */}
        <ol className="sr-only">
          {STAGES.map((s, i) => (
            <li key={s.title}>
              {pad(i + 1)} {s.title}: {s.line}
            </li>
          ))}
        </ol>
        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </section>
      <div id="after-process" />
    </>
  );
}

function StepperItem({ i, stage, staticScene }: { i: number; stage: (typeof STAGES)[number]; staticScene: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e?.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Scene = SCENES[stage.scene];
  return (
    <li ref={ref} className="relative">
        <span data-stage-anchor={i} className={cn("absolute -left-[3.05rem] top-2 flex h-9 w-9 items-center justify-center rounded-full border border-primary bg-dark font-display text-xs font-bold text-primary", on && "shadow-[0_0_12px_-4px_color-mix(in_oklab,var(--primary)_45%,transparent)]")}>
        {pad(i + 1)}
      </span>
      <div className="glass-card rounded-2xl p-5">
        <div aria-hidden className="jol-scene mb-4 h-40 text-dark-foreground" data-active={on} data-static={staticScene}>
          <Scene />
        </div>
        <h3 className="text-xl font-bold text-dark-foreground">{stage.title}</h3>
        <p className="mt-2 text-dark-muted">{stage.line}</p>
      </div>
    </li>
  );
}
