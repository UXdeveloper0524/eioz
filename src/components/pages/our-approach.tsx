"use client";
import { Link } from "@/components/site/Link";
import { ClipboardCheck, Factory, PencilRuler, Truck, Wrench } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SitePage } from "@/lib/strapi";
import { PageHero } from "@/components/site/Section";
import { CtaBanner } from "@/components/site/kit";
import { STAGES } from "@/components/home/JourneyOfLight";
import { cn } from "@/lib/utils";


const STEPS = [
  { t: "Design & Engineering", icon: PencilRuler, d: "Our process begins with creative lighting design and engineering that aligns with project requirements and customer needs. We combine innovative concepts with energy-efficient technologies to create lighting systems that enhance both functionality and visual appeal." },
  { t: "Procurement & Manufacturing", icon: Factory, d: "We manufacture and procure high-quality lighting products using advanced engineering processes and premium materials. Every product is developed with strict quality standards to ensure durability, safety, and reliable performance." },
  { t: "Supply", icon: Truck, d: "EIOZ Energy supplies a wide range of indoor and outdoor lighting products, including street lights, poles, high masts, explosion-proof lights, and architectural lighting systems. Our global manufacturing partnerships allow us to deliver dependable solutions tailored to each project." },
  { t: "Installation & Projects", icon: Wrench, d: "Our experienced team ensures precise and efficient installation, making sure every lighting system is properly positioned, safely integrated, and aligned with project specifications for commercial, industrial, and infrastructure developments." },
  { t: "Testing & Commissioning", icon: ClipboardCheck, d: "Before project completion, all lighting systems undergo comprehensive testing and commissioning to verify performance, safety, and compliance with project standards, ensuring optimal functionality and long-term reliability." },
];

function ApproachPage({ hero }: { hero: SitePage | null }) {
  const list = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = list.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.55;
      setProgress(Math.min(1, Math.max(0, (mid - r.top) / r.height)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const active = Math.min(4, Math.floor(progress * 5));

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? 'How we deliver'}
        title={hero?.title ?? 'Our'}
        highlight={hero?.highlight ?? 'Approach'}
        intro={hero?.intro ?? 'At EIOZ Energy, we follow a structured and efficient approach to deliver reliable and energy-efficient lighting solutions. From design and engineering to installation and final commissioning, every stage of our process focuses on quality, innovation, and long-term performance.'}
      />
      <section data-scene="approach-steps" className="section-pad">
        <div className="container-site">
          <ol ref={list} className="relative space-y-10 pl-12 md:pl-20">
            <div aria-hidden className="absolute bottom-0 left-4 top-0 w-px bg-dark-border md:left-8">
              <div className="w-full bg-primary shadow-glow transition-[height] duration-200" style={{ height: `${progress * 100}%` }} />
            </div>
            {STEPS.map((s, i) => (
              <li key={s.t} className="relative">
                <span
                  aria-hidden
                  className={cn(
                    "absolute -left-[2.6rem] top-8 h-5 w-5 rounded-full border-2 transition-all duration-300 md:-left-[3.6rem]",
                    i <= active ? "border-primary bg-primary shadow-glow" : "border-dark-border bg-dark",
                  )}
                />
                <article className={cn("glass-card grid gap-6 rounded-3xl p-8 md:grid-cols-[auto_1fr] lg:p-10", i === active && "border-primary/50")}>
                  <p className={cn("outline-num font-display text-7xl font-extrabold leading-none", i <= active && "opacity-100", i > active && "opacity-40")}>
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <s.icon className="h-8 w-8 text-primary" aria-hidden />
                    <h2 className="mt-4 text-2xl font-bold text-dark-foreground md:text-3xl">{s.t}</h2>
                    <p className="mt-3 leading-relaxed text-dark-muted">{s.d}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="pb-8">
        <div className="container-site">
          <div className="glass-card rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="eyebrow">On the Home page: our work in process</p>
              <Link to="/" hash="process" className="text-sm font-semibold text-primary hover:underline">
                See the Journey of Light
              </Link>
            </div>
            <ol className="mt-4 flex flex-wrap gap-2">
              {STAGES.map((s, i) => (
                <li key={s.title} className="rounded-full border border-dark-border px-3 py-1.5 text-sm text-dark-foreground">
                  <span className="text-primary">{String(i + 1).padStart(2, "0")}</span> {s.title}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}

export default ApproachPage;
