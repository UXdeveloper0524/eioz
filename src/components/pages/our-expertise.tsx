"use client";
import { Link } from "@/components/site/Link";
import { ArrowRight, Factory, Globe2, Leaf, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import type { SitePage } from "@/lib/strapi";
import { PageHero, SectionHeading } from "@/components/site/Section";
import { CtaBanner } from "@/components/site/kit";
import { attractToCard, releaseAttract } from "@/lib/particles/bus";

const UP = "https://eiozenergy.com/wp-content/uploads/2026/05/Gemini_Generated_Image_";


// ids also cover the Home page category anchors (aliases below).
const CATS = [
  { name: "Outdoor Lighting", id: "outdoor-lighting", alias: "outdoor-lightings", img: "sv2hwrsv2hwrsv2h" },
  { name: "Decorative Lighting", id: "decorative-lighting", alias: "decorative-lightings", img: "raxu8draxu8draxu" },
  { name: "Landscape Lighting", id: "landscape-lighting", alias: "landscape", img: "oqhz30oqhz30oqhz" },
  { name: "Decorative Poles", id: "decorative-poles", img: "o2w87wo2w87wo2w8" },
  { name: "Obstruction", id: "obstruction", img: "dfjp55dfjp55dfjp" },
  { name: "Facade Lighting", id: "facade-lighting", alias: "facade-lightings", img: "623wet623wet623w" },
  { name: "Indoor Lighting", id: "indoor-lighting", alias: "indoor-lights", img: "8kalyz8kalyz8kal" },
  { name: "Street Lighting", id: "street-lighting", alias: "street-lights", img: "6raw826raw826raw" },
  { name: "Industrial & Explosion Proof", id: "industrial-explosion-proof", alias: "industry", img: "1ivgr31ivgr31ivg" },
];

const WHY = [
  { icon: Factory, t: "Design, supply and installation under one roof" },
  { icon: Globe2, t: "Global manufacturing partnerships" },
  { icon: Leaf, t: "Energy-efficient and sustainable solutions" },
  { icon: ShieldCheck, t: "Testing and commissioning on every project" },
];

function ExpertisePage({ hero }: { hero: SitePage | null }) {
  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? 'EIOZ Lighting Solution'}
        title={hero?.title ?? 'Our'}
        highlight={hero?.highlight ?? 'Expertise'}
        intro={hero?.intro ?? 'EIOZ Energy offers a comprehensive range of high-quality LED lighting products and smart lighting solutions designed for residential, commercial, and infrastructure projects. Our portfolio includes architectural lighting, street lighting systems, lighting poles, and energy-efficient indoor and outdoor lighting, combining modern design, durability, and advanced technology to meet diverse project requirements across the UAE, Qatar, and international markets.'}
      />
      <section className="section-pad pt-0">
        <ul className="container-site grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {CATS.map((c, i) => (
            <li key={c.id} id={c.id} className="scroll-mt-28">
              {c.alias && <span id={c.alias} className="block scroll-mt-28" aria-hidden />}
              <Reveal delay={(i % 3) * 80}>
                <article onMouseEnter={attractToCard} onMouseLeave={releaseAttract} className="glass-card group relative flex h-full flex-col overflow-hidden rounded-3xl p-6">
                  <div className="relative aspect-square">
                    <div aria-hidden className="absolute inset-[15%] rounded-full bg-primary/25 blur-3xl transition-opacity group-hover:opacity-100 opacity-60" />
                    <img src={`${UP}${c.img}-removebg-preview.png`} alt={c.name} width={500} height={500} loading="lazy" className="relative h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-bold text-dark-foreground">{c.name}</h2>
                    <Link
                      to="/contact-us"
                      search={{ subject: c.name }}
                      className="inline-flex h-11 items-center gap-1.5 rounded-full border border-primary/50 px-4 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100"
                    >
                      Enquire <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </section>
      <section className="section-pad pt-0">
        <div className="container-site">
          <SectionHeading tone="dark" eyebrow="Why EIOZ" title="Built on" highlight="experience" />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w) => (
              <li key={w.t} className="glass-card rounded-2xl p-6">
                <w.icon className="h-7 w-7 text-primary" aria-hidden />
                <p className="mt-4 font-display font-semibold text-dark-foreground">{w.t}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}

export default ExpertisePage;
