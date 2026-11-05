"use client";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { OFFICES, telHref } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useMotionAllowed } from "./kit";

/** Right-edge dots, one per data-scene section (desktop, Home only). */
export function SceneIndicator() {
  const pathname = usePathname();
  const [items, setItems] = useState<{ id: string; el: HTMLElement }[]>([]);
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (pathname !== "/") return setItems([]);
    const id = requestAnimationFrame(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("main [data-scene]"));
      setItems(els.map((el) => ({ id: el.dataset["scene"]!, el })));
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);
  useEffect(() => {
    if (!items.length) return;
    const onScroll = () => {
      const mid = window.innerHeight / 2;
      const fresh = Array.from(document.querySelectorAll<HTMLElement>("main [data-scene]"));
      const i = fresh.findIndex((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= mid && r.bottom >= mid;
      });
      if (i >= 0) setActive(i);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="Page sections" className="fixed right-1.5 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <ul className="flex flex-col gap-3">
        {items.map(({ id, el }, i) => (
          <li key={id}>
            <button
              type="button"
              aria-label={`Go to ${id} section`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => (document.querySelector(`main [data-scene="${id}"]`) ?? el).scrollIntoView({ behavior: "smooth", block: "start" })}
              className="group flex h-6 w-6 items-center justify-center"
            >
              <span className={cn("block rounded-full transition-all duration-300", i === active ? "h-3 w-3 bg-primary shadow-glow" : "h-1.5 w-1.5 bg-dark-muted group-hover:bg-primary")} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Glowing dot cursor (desktop only); native cursor stays visible. */
export function CustomCursor() {
  const motion = useMotionAllowed();
  const dot = useRef<HTMLDivElement>(null);
  const halo = useRef<HTMLDivElement>(null);
  const [fine, setFine] = useState(false);
  useEffect(() => setFine(window.matchMedia("(pointer: fine)").matches), []);
  useEffect(() => {
    if (!motion || !fine) return;
    let x = -100, y = -100, hx = -100, hy = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement;
      if (halo.current) halo.current.dataset["hot"] = String(!!t.closest("a,button,[role=tab]"));
      const field = !!t.closest("input,textarea,select");
      if (dot.current) dot.current.style.opacity = field ? "0" : "1";
      if (halo.current) halo.current.style.opacity = field ? "0" : "1";
    };
    const tick = () => {
      hx += (x - hx) * 0.18;
      hy += (y - hy) * 0.18;
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      if (halo.current) halo.current.style.transform = `translate(${hx}px, ${hy}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", move);
      cancelAnimationFrame(raf);
    };
  }, [motion, fine]);
  if (!motion || !fine) return null;
  return (
    <>
      <div ref={halo} className="cursor-halo" aria-hidden />
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  );
}

export function FloatingPhone() {
  const pathname = usePathname();
  if (pathname === "/contact-us") return null;
  const phone = OFFICES[0]!.phone;
  return (
    <a
      href={telHref(phone)}
      aria-label={`Call EIOZ Energy ${phone}`}
      className="fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-dark-border bg-dark/80 text-primary shadow-glow backdrop-blur-md transition-transform hover:scale-105"
    >
      <Phone className="h-5 w-5" />
    </a>
  );
}
