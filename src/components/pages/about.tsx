"use client";
import { useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import type { SitePage } from "@/lib/strapi";
import { PageHero, SectionHeading } from "@/components/site/Section";
import { Counter, CtaBanner, LogoTile } from "@/components/site/kit";
import { cn } from "@/lib/utils";

const UP = "https://eiozenergy.com/wp-content/uploads/2026/05";
const HERO_IMG = `${UP}/Occhio_Mito_Raggio_Lusso_Bogenleuchte_LED-f920a1f128a595c76d3e3bb07d5ec2a4-1.webp`;


// Client logo walls from the live site (CLIENT-n = Qatar, UAE-CLIENT-n = UAE & Oman).
const QATAR = Array.from({ length: 33 }, (_, i) => ({ src: `${UP}/CLIENT-${i + 1}.png`, name: `Qatar client ${i + 1}`, region: "Qatar" }));
const UAE = Array.from({ length: 14 }, (_, i) => ({ src: `${UP}/UAE-CLIENT-${i + 1}.png`, name: `UAE and Oman client ${i + 1}`, region: "UAE and Oman" }));
const TABS = ["All", "Qatar", "UAE and Oman"] as const;

function AboutPage({ hero }: { hero: SitePage | null }) {
  const [tab, setTab] = useState<(typeof TABS)[number]>("All");
  const logos = tab === "All" ? [...QATAR, ...UAE] : tab === "Qatar" ? QATAR : UAE;
  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? 'Building Trust'}
        title={hero?.title ?? 'About'}
        highlight={hero?.highlight ?? 'EIOZ Energy'}
        intro={hero?.intro ?? 'Eioz Energy is a leading lighting solutions provider based in the Middle East, delivering innovative and energy-efficient lighting for residential and commercial spaces. We specialize in modern, elegant, and industrial lighting designs, combining quality, performance, and value for clients across the region and expanding international markets.'}
        aside={
          <div className="relative overflow-hidden rounded-3xl border border-dark-border">
            <img src={HERO_IMG} alt="EIOZ Energy architectural floor lamp" width={720} height={860} loading="eager" className="aspect-[5/6] w-full object-cover" />
          </div>
        }
      />

      <section data-scene="story" className="section-pad">
        <div className="container-site grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">Established in 2010</p>
            <p className="outline-num mt-4 font-display text-[8rem] font-extrabold leading-none lg:text-[11rem]" aria-hidden>
              <Counter to={2010} />
            </p>
          </Reveal>
          <Reveal className="space-y-6 text-lg leading-relaxed text-dark-muted">
            <h2 className="text-3xl font-bold text-dark-foreground md:text-4xl">
              Our <span className="text-primary">story</span>
            </h2>
            <p>
              Founded in 2010, EIOZ has grown into a trusted provider of innovative lighting solutions, delivering designs that meet the evolving needs of residential, commercial, and industrial clients. Over the years, we have illuminated thousands of spaces through our diverse portfolio of modern and energy-efficient lighting products. Our manufacturing partners, recommended by the Turkish Lighting Equipment Manufacturers Association (AGID), are based across Europe, the USA, Turkey, and key Asian markets including India and China.
            </p>
            <p>
              Looking ahead, sustainability remains at the heart of our vision. With design and procurement teams operating across more than 70 global locations, EIOZ is committed to reducing carbon footprints and integrating green energy principles into our lighting solutions for a brighter and more sustainable future.
            </p>
            <ul className="grid gap-4 pt-4 sm:grid-cols-3">
              <li className="glass-card rounded-xl p-5">
                <p className="font-display text-3xl font-bold text-primary">2010</p>
                <p className="mt-1 text-sm">Since 2010</p>
              </li>
              <li className="glass-card rounded-xl p-5">
                <p className="font-display text-3xl font-bold text-primary">
                  <Counter to={70} suffix="+" />
                </p>
                <p className="mt-1 text-sm">70+ global locations</p>
              </li>
              <li className="glass-card rounded-xl p-5">
                <p className="font-display text-3xl font-bold text-primary">5</p>
                <p className="mt-1 text-sm">Partners across Europe, USA, Turkey, India and China</p>
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section data-scene="mission" className="section-pad">
        <div className="container-site grid gap-6 md:grid-cols-2">
          {[
            { label: "Mission", icon: `${UP}/163875482737-Converted-03-1-1.svg`, text: "At EIOZ Energy, our mission is to deliver reliable and innovative lighting solutions that meet the evolving needs of our customers. Since 2010, we have been committed to creating energy-efficient and sustainable lighting designs that enhance spaces and improve lives. As we grow globally, we continue to focus on smart lighting technologies, optimized energy use, and environmentally responsible solutions." },
            { label: "Vision", icon: `${UP}/163875482737-Converted-02-1.svg`, text: "To become a globally recognized lighting brand delivering innovative, energy-efficient, and sustainable lighting solutions. EIOZ Energy aims to lead the future of smart lighting by combining advanced technology, green energy, and modern design to illuminate spaces worldwide." },
          ].map((m, i) => (
            <Reveal key={m.label} delay={i * 100}>
              <article className="glass-card h-full rounded-3xl p-8 lg:p-12">
                <div className="logo-tile flex h-16 w-16 items-center justify-center p-3">
                  <img src={m.icon} alt="" width={48} height={48} loading="lazy" />
                </div>
                <h2 className="mt-6 text-3xl font-bold text-dark-foreground">
                  Our <span className="text-primary">{m.label}</span>
                </h2>
                <p className="mt-4 leading-relaxed text-dark-muted">{m.text}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section data-scene="clients" className="section-pad">
        <div className="container-site">
          <SectionHeading tone="dark" align="center" eyebrow="Trusted partners" title="Our" highlight="Clients" />
          <div role="tablist" aria-label="Filter clients by region" className="mt-10 flex flex-wrap justify-center gap-2">
            {TABS.map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={cn(
                  "h-11 rounded-full border px-5 text-sm font-semibold transition-colors",
                  tab === t ? "border-primary bg-primary text-primary-foreground" : "border-dark-border text-dark-foreground hover:border-primary",
                )}
              >
                {t}
              </button>
            ))}
          </div>
          <div role="tabpanel" className="mt-12 flex flex-wrap justify-center gap-y-6">
            {logos.map((l) => (
              <LogoTile key={l.src} src={l.src} name={l.name} />
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}

export default AboutPage;
