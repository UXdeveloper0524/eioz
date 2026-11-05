"use client";
import { Link } from "@/components/site/Link";
import { useRouter } from "next/navigation";
import { ArrowRight, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { Reveal } from "./Reveal";
import { emitParticles, readPaused, rippleAt } from "@/lib/particles/bus";
import { cn } from "@/lib/utils";

/** Respects reduced motion + the site "Pause animation" toggle. */
export function useMotionAllowed() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setOk(!mq.matches && !readPaused());
    update();
    mq.addEventListener("change", update);
    window.addEventListener("particles:pause", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("particles:pause", update);
    };
  }, []);
  return ok;
}

/** Shifts children a few px toward the cursor. */
export function Magnetic({ children, strength = 8 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motion = useMotionAllowed();
  return (
    <span
      ref={ref}
      className="inline-block transition-transform duration-300 ease-out"
      onMouseMove={(e) => {
        if (!motion || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * strength * 2;
        const y = ((e.clientY - r.top) / r.height - 0.5) * strength * 2;
        ref.current.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onMouseLeave={() => ref.current && (ref.current.style.transform = "")}
    >
      {children}
    </span>
  );
}

/** Pausable logo marquee; static wrap grid for reduced motion. */
export function Marquee({
  children,
  reverse,
  label,
  onPauseChange,
}: {
  children: ReactNode;
  reverse?: boolean;
  label: string;
  onPauseChange?: (paused: boolean) => void;
}) {
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const motion = useMotionAllowed();
  useEffect(() => onPauseChange?.(paused || hover), [paused, hover, onPauseChange]);
  if (!motion) return <div className="flex flex-wrap justify-center gap-y-6" aria-label={label}>{children}</div>;
  return (
    <div className="relative" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="marquee-mask overflow-hidden" aria-label={label} role="region">
        <div className="marquee-track" data-paused={paused} data-reverse={reverse ? "true" : "false"}>
          {children}
          <div aria-hidden className="contents">{children}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? `Play ${label}` : `Pause ${label}`}
        className="absolute -top-14 right-0 flex h-11 w-11 items-center justify-center rounded-full border border-dark-border text-dark-muted hover:border-primary hover:text-primary"
      >
        {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
      </button>
    </div>
  );
}

/** Light-glass tile so dark logos stay legible on dark pages. */
export function LogoTile({ src, name, caption, onHover }: { src: string; name: string; caption?: boolean; onHover?: (e: MouseEvent<HTMLElement>) => void }) {
  const [ok, setOk] = useState(true);
  if (!ok) return null;
  return (
    <figure className="flex w-44 shrink-0 flex-col items-center gap-3 px-3" onMouseEnter={onHover}>
      <div className="logo-tile flex h-24 w-full items-center justify-center p-4">
        <img src={src} alt={name} loading="lazy" width={160} height={80} onError={() => setOk(false)} className="logo-mono max-h-16 w-auto object-contain" />
      </div>
      {caption && <figcaption className="text-center text-xs font-medium text-dark-muted">{name}</figcaption>}
    </figure>
  );
}

/** Animated number counter (e.g. "70+"). */
export function Counter({ to, suffix = "", className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setV(0);
    const io = new IntersectionObserver(([e]) => {
      if (!e?.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - start) / 1200);
        setV(Math.round(to * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref} className={className}>
      {v}
      {suffix}
    </span>
  );
}

/** Shared "Need a Lighting Solution?" banner (orb expands/bursts on the button). */
export function CtaBanner({
  title = "Need a Lighting",
  highlight = "Solution?",
  body = "We collaborate with architects, designers, and brands to deliver refined lighting solutions that balance innovation, performance, and design excellence. Let's bring your vision to light with EIOZ Energy.",
}: {
  title?: string;
  highlight?: string;
  body?: string;
}) {
  const router = useRouter();
  return (
    <section data-scene="cta" className="py-20 lg:py-28">
      <div className="container-site">
        <Reveal>
          <div className="beam-glass relative overflow-hidden rounded-3xl px-8 py-16 text-center lg:px-20 lg:py-24">
            <div aria-hidden className="text-scrim absolute inset-x-0 top-1/2 mx-auto h-64 max-w-2xl -translate-y-1/2" />
            <h2 className="relative text-4xl font-bold text-dark-foreground md:text-5xl">
              {title} <span className="text-primary">{highlight}</span>
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-dark-muted">{body}</p>
            <div className="relative mt-9">
              <Magnetic>
                <Button
                  asChild
                  variant="hero"
                  size="lg"
                  onMouseEnter={() => emitParticles("particles:expand", true)}
                  onMouseLeave={() => emitParticles("particles:expand", false)}
                  onFocus={() => emitParticles("particles:expand", true)}
                  onBlur={() => emitParticles("particles:expand", false)}
                >
                  <Link
                    to="/contact-us"
                    onClick={(e) => {
                      if (e.metaKey || e.ctrlKey) return;
                      e.preventDefault();
                      rippleAt(e, 2.2);
                      setTimeout(() => router.push("/contact-us"), 320);
                    }}
                  >
                    Contact Us <ArrowRight />
                  </Link>
                </Button>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function GlassCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("glass-card rounded-2xl p-7", className)}>{children}</div>;
}
