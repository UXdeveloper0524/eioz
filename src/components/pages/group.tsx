"use client";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import type { SitePage } from "@/lib/strapi";
import { PageHero, SectionHeading } from "@/components/site/Section";
import { CtaBanner } from "@/components/site/kit";
import { emitParticles } from "@/lib/particles/bus";
import { LOGO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

const UP = "https://eiozenergy.com/wp-content/uploads/2026/05";
const LV = "https://eioz8037.live-website.com/wp-content/uploads/2026/05";


const BRANDS = [
  {
    id: "insight-lighting",
    name: "Insight Lighting",
    logo: `${LV}/insight_lightings_logo.png`,
    img: `${UP}/Gemini_Generated_Image_tlrp1wtlrp1wtlrp.png`,
    text: "Insight Lighting is a leading provider of architectural and commercial lighting solutions in Qatar, offering high-quality indoor and outdoor lighting products. The company specializes in lighting design, supply, and installation for residential, commercial, and industrial projects. With advanced technology and energy-efficient solutions, Insight Lighting delivers customized lighting systems that enhance functionality, safety, and aesthetics for modern spaces.",
    tags: ["Architectural", "Commercial", "Design and Supply", "Installation"],
  },
  {
    id: "roveoz",
    name: "Roveoz",
    logo: `${UP}/Roveoz-Logo_Transparent-BG-01-300x200.png`,
    img: `${UP}/Gemini_Generated_Image_17rsab17rsab17rs.png`,
    text: "Roveoz focuses on innovative and sustainable LED lighting solutions designed for modern homes, commercial environments, and industrial spaces. The brand manufactures high-performance lighting products that combine advanced technology, energy efficiency, and contemporary design. With a strong commitment to sustainability, Roveoz helps clients reduce energy consumption while creating well-lit and comfortable environments.",
    tags: ["LED", "Residential", "Commercial", "Industrial"],
  },
  {
    id: "glandro",
    name: "Glandro",
    logo: `${LV}/0007_Glantro_Logo_File_40_x_60mm-2025.pdf_-_Page_1_of_1-removebg-preview-300x150.png`,
    img: `${UP}/Gemini_Generated_Image_uu9u0puu9u0puu9u.png`,
    text: "Glandro is a specialized brand under EIOZ Energy focused on street lighting poles and outdoor lighting infrastructure. The company provides durable and high-quality lighting poles designed for roads, highways, public spaces, and urban developments. Glandro aims to support smart city development by delivering reliable, long-lasting, and sustainable street lighting solutions.",
    tags: ["Street Lighting Poles", "Roads and Highways", "Smart Cities"],
  },
];

function GroupPage({ hero }: { hero: SitePage | null }) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const els = BRANDS.map((b) => document.getElementById(b.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(els.indexOf(e.target as HTMLElement))),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      emitParticles("particles:focus", null);
    };
  }, []);
  useEffect(() => emitParticles("particles:focus", active), [active]);

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? 'Our group'}
        before
        highlight={hero?.highlight ?? 'EIOZ ENERGY'}
        title={hero?.title ?? 'GROUP'}
        intro={hero?.intro ?? 'EIOZ Energy is a growing global lighting solutions company with a group of specialized brands delivering innovative and energy-efficient lighting products. Through our portfolio of companies, we provide complete lighting solutions ranging from architectural lighting to street lighting infrastructure. Our group companies focus on quality, sustainability, and advanced lighting technologies to serve residential, commercial, and industrial projects worldwide.'}
      />

      <nav aria-label="Group brands" className="sticky top-[72px] z-30 border-y border-dark-border bg-dark/70 backdrop-blur-md">
        <ul className="container-site flex gap-2 overflow-x-auto py-3">
          {BRANDS.map((b, i) => (
            <li key={b.id}>
              <a
                href={`#${b.id}`}
                onClick={() => setActive(i)}
                aria-current={active === i ? "true" : undefined}
                className={cn(
                  "inline-flex h-11 items-center rounded-full border px-5 text-sm font-semibold whitespace-nowrap transition-colors",
                  active === i ? "border-primary bg-primary text-primary-foreground" : "border-dark-border text-dark-foreground hover:border-primary",
                )}
              >
                {b.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {BRANDS.map((b, i) => (
        <section key={b.id} id={b.id} data-scene="brand" className="section-pad scroll-mt-36">
          <div className={cn("container-site grid items-center gap-12 lg:grid-cols-2", i % 2 && "lg:[&>*:first-child]:order-2")}>
            <Reveal>
              <img src={b.img} alt={`${b.name} lighting`} width={720} height={540} loading="lazy" className="aspect-[4/3] w-full rounded-3xl border border-dark-border object-cover" />
            </Reveal>
            <Reveal>
              <div className="logo-tile inline-flex h-20 items-center px-5">
                <img src={b.logo} alt={`${b.name} logo`} width={180} height={60} loading="lazy" className="max-h-14 w-auto object-contain" />
              </div>
              <h2 className="mt-6 text-4xl font-bold uppercase text-dark-foreground">{b.name}</h2>
              <p className="mt-4 leading-relaxed text-dark-muted">{b.text}</p>
              <p className="eyebrow mt-6">Focus</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {b.tags.map((t) => (
                  <li key={t} className="rounded-full border border-primary/40 px-3 py-1 text-xs font-semibold text-primary">
                    {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="section-pad">
        <div className="container-site">
          <SectionHeading tone="dark" align="center" eyebrow="One system" title="How the group" highlight="works together" />
          <div className="relative mx-auto mt-14 aspect-[4/3] max-w-3xl sm:aspect-[16/10]">
            <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" aria-hidden>
              {[
                [400, 250, 140, 90],
                [400, 250, 660, 90],
                [400, 250, 400, 440],
              ].map(([x1, y1, x2, y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--primary)" strokeWidth={1.5} strokeDasharray="4 6" className="opacity-70" style={{ filter: "drop-shadow(0 0 6px var(--primary))" }} />
              ))}
            </svg>
            <div className="logo-tile absolute left-1/2 top-1/2 flex h-16 w-28 -translate-x-1/2 sm:h-24 sm:w-44 -translate-y-1/2 items-center justify-center shadow-glow">
              <img src={LOGO_URL} alt="EIOZ Energy" width={150} height={68} className="h-12 w-auto" />
            </div>
            {BRANDS.map((b, i) => (
              <a
                key={b.id}
                href={`#${b.id}`}
                className={cn(
                  "glass-card absolute flex h-16 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-2xl text-center font-display text-xs font-semibold text-dark-foreground sm:h-20 sm:w-40 sm:text-base",
                )}
                style={{ left: `${[17.5, 82.5, 50][i]}%`, top: `${[18, 18, 88][i]}%` }}
              >
                {b.name}
              </a>
            ))}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}

export default GroupPage;
