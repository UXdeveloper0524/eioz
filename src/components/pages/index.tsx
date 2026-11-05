"use client";
import { Link } from "@/components/site/Link";
import { ArrowRight, ArrowUpRight, Compass, Download, Target } from "lucide-react";
import { useCallback, useRef, type MouseEvent, type PointerEvent } from "react";
import { Button } from "@/components/ui/button";
import { JourneyOfLight } from "@/components/home/JourneyOfLight";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/Section";
import { CtaBanner, LogoTile, Magnetic, Marquee } from "@/components/site/kit";
import { CATEGORIES, CLIENTS_QATAR, CLIENTS_UAE_OMAN, FEATURES, PARTNERS } from "@/lib/home-data";
import type { Project } from "@/lib/projects-data";
import type { SitePage } from "@/lib/strapi";
import { attractToCard, emitParticles, releaseAttract, rippleAt, rippleFromEl } from "@/lib/particles/bus";


const SOLUTIONS_INTRO =
  "Discover our range of innovative lighting solutions designed to enhance any space. From energy-efficient LEDs to stylish architectural fixtures, our products combine advanced technology with sustainable design to create bright, comfortable, and beautifully lit environments.";

function HomePage({ featuredProjects, hero }: { featuredProjects: Project[]; hero: SitePage | null }) {
  return (
    <div className="home-dark">
      <Hero content={hero} />
      <div className="hairline" />
      <MissionVision />
      <JourneyOfLight />
      <div className="hairline" />
      <Solutions />
      <div className="hairline" />
      <Partners />
      <Clients />
      <div className="hairline" />
      <ProjectsTeaser projects={featuredProjects} />
      <CtaBanner />
    </div>
  );
}

function Hero({ content }: { content: SitePage | null }) {
  return (
    <section
      data-scene="hero"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("a,button")) return;
        rippleAt(e, 1.4);
      }}
    >
      <div aria-hidden className="hero-overlay absolute inset-0" />
      <div className="container-site relative pb-16 pt-36 lg:pb-24">
        <Reveal className="max-w-3xl">
          <p className="eyebrow">{content?.eyebrow ?? "Middle East Lighting Solutions"}</p>
          <h1 className="mt-5 text-5xl font-extrabold leading-[1.02] text-dark-foreground md:text-6xl lg:text-7xl">
            {content?.title ?? "Lighting the Future with"} <span className="text-primary">{content?.highlight ?? "EIOZ ENERGY"}</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-dark-muted">
            {content?.intro ?? "Eioz Energy is a leading lighting solutions provider based in the Middle East, delivering innovative and energy-efficient lighting for residential and commercial spaces. We specialize in modern, elegant, and industrial lighting designs, combining quality, performance, and value for clients across the region and expanding international markets."}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Magnetic>
              <Button asChild variant="hero" size="lg">
                {/* REPLACE ME: placeholder portfolio PDF path */}
                <a href="/eioz-energy-portfolio.pdf" download>
                  <Download /> Download Portfolio
                </a>
              </Button>
            </Magnetic>
            <Button asChild variant="outline-dark" size="lg">
              <Link to="/contact-us">Contact Us</Link>
            </Button>
          </div>
        </Reveal>
        <ul className="mt-16 grid gap-4 border-t border-dark-border pt-6 text-sm text-dark-muted sm:grid-cols-3">
          {["Est. 2010", "Qatar · UAE · Oman", "70+ global design and procurement locations"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-primary shadow-glow" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function tilt(e: MouseEvent<HTMLElement>) {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width - 0.5;
  const y = (e.clientY - r.top) / r.height - 0.5;
  el.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
}
const untilt = (e: MouseEvent<HTMLElement>) => (e.currentTarget.style.transform = "");

function MissionVision() {
  const items = [
    { label: "Mission", icon: Target, text: "To deliver reliable and innovative lighting solutions that meet the evolving needs of our customers." },
    { label: "Vision", icon: Compass, text: "To become a globally recognized lighting brand delivering innovative, energy-efficient, and sustainable lighting solutions." },
  ];
  return (
    <section data-scene="mission" className="section-pad">
      <div className="container-site grid gap-6 md:grid-cols-2">
        {items.map(({ label, icon: Icon, text }, i) => (
          <Reveal key={label} delay={i * 100}>
            <article
              onMouseMove={tilt}
              onMouseEnter={() => emitParticles("particles:ring", i === 0 ? 1 : 1.6)}
              onMouseLeave={(e) => {
                untilt(e);
                emitParticles("particles:ring", 0);
              }}
              className="glass-card h-full p-8 lg:p-10"
              style={{ borderRadius: 20 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <Icon className="h-6 w-6" />
              </div>
              <p className="eyebrow mt-6">{label}</p>
              <p className="mt-3 font-display text-2xl font-semibold leading-snug text-dark-foreground lg:text-3xl">{text}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function glowFollow(e: MouseEvent<HTMLElement>) {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
}

function Solutions() {
  return (
    <section data-scene="solutions" className="section-pad">
      <div className="container-site">
        <SectionHeading tone="dark" eyebrow="What we offer" title="EIOZ" highlight="Energy Solutions" intro={SOLUTIONS_INTRO} />
        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.map((c, i) => (
            <li key={c.slug}>
              <Reveal delay={(i % 4) * 60}>
                <Link
                  to="/our-expertise"
                  hash={c.slug}
                  onMouseEnter={attractToCard}
                  onMouseMove={glowFollow}
                  onMouseLeave={releaseAttract}
                  className="glass-card glow-border group relative flex aspect-[4/5] flex-col overflow-hidden rounded-xl p-4"
                >
                  <img src={c.img} alt={c.name} loading="lazy" width={400} height={400} className="h-3/4 w-full rounded-lg object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="mt-auto flex items-center justify-between gap-2">
                    <span className="font-display font-semibold text-dark-foreground">{c.name}</span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                      Explore <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.name} delay={i * 100}>
              <Link to="/our-expertise" hash={f.slug} onMouseEnter={attractToCard} onMouseLeave={releaseAttract} className="group relative block aspect-[3/4] overflow-hidden rounded-2xl border border-dark-border bg-dark">
                <img src={f.img} alt={f.name} loading="lazy" width={600} height={800} className="h-full w-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
                  <h3 className="text-2xl font-bold text-dark-foreground">{f.name}</h3>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="h-5 w-5" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Partners() {
  const onPause = useCallback((p: boolean) => emitParticles("particles:flow", p ? 0 : -0.35), []);
  return (
    <section data-scene="partners" className="section-pad">
      <div className="container-site">
        <SectionHeading tone="dark" eyebrow="Our partners" title="Powered by International" highlight="Lighting Expertise" intro={SOLUTIONS_INTRO} />
        <div className="mt-20">
          <Marquee label="partner logos" onPauseChange={onPause}>
            {PARTNERS.map((p) => (
              <LogoTile key={p.src} src={p.src} name={p.name} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}

function Clients() {
  const spark = (e: MouseEvent<HTMLElement>) => rippleFromEl(e.currentTarget, 0.35);
  return (
    <section data-scene="clients" className="section-pad">
      <div className="container-site">
        <SectionHeading
          align="center"
          tone="dark"
          eyebrow="Our clients"
          title="TRUSTED BY EIOZ ENERGY"
          highlight="CLIENTS"
          intro="Delivering refined lighting solutions for leading brands and contemporary spaces through innovation, precision, and design excellence"
        />
        <div className="mt-20 space-y-16">
          <div>
            <p className="eyebrow mb-6">Qatar</p>
            <Marquee label="Qatar client logos">
              {CLIENTS_QATAR.map((c) => <LogoTile key={c.src} {...c} caption onHover={spark} />)}
            </Marquee>
          </div>
          <div>
            <p className="eyebrow mb-6">UAE and Oman</p>
            <Marquee label="UAE and Oman client logos" reverse>
              {CLIENTS_UAE_OMAN.map((c) => <LogoTile key={c.src} {...c} caption onHover={spark} />)}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProjectsTeaser({ projects }: { projects: Project[] }) {
  const drag = useRef<{ x: number; left: number; last: number; t: number } | null>(null);
  const list = useRef<HTMLUListElement>(null);
  const onScroll = useRef(0);
  const down = (e: PointerEvent<HTMLUListElement>) => {
    if (e.pointerType !== "mouse" || !list.current) return;
    drag.current = { x: e.clientX, left: list.current.scrollLeft, last: e.clientX, t: performance.now() };
  };
  const move = (e: PointerEvent<HTMLUListElement>) => {
    const d = drag.current;
    if (!d || !list.current) return;
    list.current.scrollLeft = d.left - (e.clientX - d.x);
    const now = performance.now();
    const v = (e.clientX - d.last) / Math.max(1, now - d.t);
    emitParticles("particles:stretch", v * 0.4);
    d.last = e.clientX;
    d.t = now;
  };
  const up = () => (drag.current = null);
  return (
    <section data-scene="projects" className="section-pad">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading tone="dark" eyebrow="Featured work" title="EIOZ ENERGY" highlight="Projects" />
          <Button asChild variant="outline-dark">
            <Link to="/projects">
              View all projects <ArrowRight />
            </Link>
          </Button>
        </div>
        <ul
          ref={list}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          onScroll={(e) => {
            const x = e.currentTarget.scrollLeft;
            emitParticles("particles:stretch", (x - onScroll.current) * 0.01);
            onScroll.current = x;
          }}
          className="-mx-5 mt-14 flex cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 active:cursor-grabbing md:mx-0 md:px-0"
        >
          {projects.map((p) => (
            <li key={p.title} className="w-[78%] shrink-0 snap-start sm:w-[45%] lg:w-[31%]">
              <article className="glass-card flex h-full flex-col rounded-2xl p-6">
                <div className="flex items-center justify-between text-xs">
                  <span className="rounded-full border border-primary/40 px-3 py-1 font-semibold text-primary">{p.sector}</span>
                  <span className="font-display font-bold text-dark-foreground">{p.year}</span>
                </div>
                <h3 className="mt-6 text-xl font-bold leading-snug text-dark-foreground">{p.title}</h3>
                <p className="mt-auto pt-6 text-xs text-dark-muted">{p.scope.join(" · ")}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default HomePage;
