"use client";
import { Lightbulb, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PageHero } from "@/components/site/Section";
import { CtaBanner } from "@/components/site/kit";
import { emitParticles } from "@/lib/particles/bus";
import { SECTORS, type Project, type Sector } from "@/lib/projects-data";
import type { SitePage } from "@/lib/strapi";
import { cn } from "@/lib/utils";


function ProjectsPage({ projects, hero }: { projects: Project[]; hero: SitePage | null }) {
  const [q, setQ] = useState("");
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [year, setYear] = useState<number | null>(null);
  const yearBtns = useRef<Record<number, HTMLButtonElement | null>>({});

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return projects.filter((p) => (!s || p.title.toLowerCase().includes(s)) && (!sectors.length || sectors.includes(p.sector)));
  }, [projects, q, sectors]);
  const years = Array.from(new Set(projects.map((p) => p.year))).sort();
  const byYear = years.map((y) => ({ y, items: filtered.filter((p) => p.year === y) })).filter((g) => g.items.length);

  // Particle trail follows the selected year button.
  useEffect(() => {
    const b = year != null ? yearBtns.current[year] : null;
    if (!b) return emitParticles("particles:attract", null);
    const r = b.getBoundingClientRect();
    emitParticles("particles:attract", { x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }, [year]);
  useEffect(() => () => emitParticles("particles:attract", null), []);

  const goYear = (y: number) => {
    setYear(y);
    document.getElementById(`year-${y}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const toggle = (s: Sector) => setSectors((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));

  return (
    <>
      <PageHero
        eyebrow={hero?.eyebrow ?? "Our portfolio"}
        title={hero?.title ?? "EIOZ ENERGY"}
        highlight={hero?.highlight ?? "Projects"}
        intro={hero?.intro ?? "EIOZ Energy has successfully completed a wide range of lighting projects across residential, commercial, and public infrastructure sectors. Our portfolio highlights both completed projects and recent installations, showcasing our expertise in delivering reliable, energy-efficient lighting solutions for modern developments across the Middle East and global markets."}
      />
      <div className="sticky top-[72px] z-30 border-y border-dark-border bg-dark/75 backdrop-blur-md">
        <nav aria-label="Project years" className="container-site flex gap-1 overflow-x-auto py-2">
          {years.map((y) => (
            <button
              key={y}
              ref={(el) => {
                yearBtns.current[y] = el;
              }}
              type="button"
              onClick={() => goYear(y)}
              aria-current={year === y ? "true" : undefined}
              className={cn(
                "h-11 shrink-0 rounded-full px-4 font-display text-sm font-bold transition-colors",
                year === y ? "bg-primary text-primary-foreground" : "text-dark-muted hover:text-primary",
              )}
            >
              {y}
            </button>
          ))}
        </nav>
      </div>
      <section className="section-pad pt-10">
        <div className="container-site">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <label className="relative block w-full lg:max-w-sm">
              <span className="sr-only">Search projects</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-muted" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search projects"
                className="h-12 w-full rounded-full border border-dark-border bg-dark/60 pl-11 pr-4 text-dark-foreground placeholder:text-dark-muted focus:border-primary focus:outline-none"
              />
            </label>
            <ul className="flex flex-wrap gap-2" aria-label="Filter by sector">
              {SECTORS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    aria-pressed={sectors.includes(s)}
                    onClick={() => toggle(s)}
                    className={cn(
                      "h-11 rounded-full border px-4 text-sm font-medium transition-colors",
                      sectors.includes(s) ? "border-primary bg-primary/20 text-primary" : "border-dark-border text-dark-foreground hover:border-primary",
                    )}
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-6 text-sm text-dark-muted" aria-live="polite">
            <span className="font-semibold text-dark-foreground">{filtered.length}</span> projects shown
          </p>

          <div className="mt-8 space-y-10">
            {byYear.map(({ y, items }) => (
              <section key={y} id={`year-${y}`} aria-labelledby={`h-${y}`} className="scroll-mt-40">
                <h2 id={`h-${y}`} className="outline-num font-display text-6xl font-extrabold">
                  {y}
                </h2>
                <ul className="mt-4 grid gap-3 md:grid-cols-2">
                  {items.map((p) => (
                    <li key={p.title} className="glass-card flex gap-4 rounded-2xl p-5">
                      <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                        <Lightbulb className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="font-display font-semibold leading-snug text-dark-foreground">{p.title}</h3>
                        <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                          <span className="rounded-full bg-primary px-2 py-0.5 font-bold text-primary-foreground">{p.year}</span>
                          <span className="rounded-full border border-primary/40 px-2 py-0.5 text-primary">{p.sector}</span>
                          {p.scope.map((s) => (
                            <span key={s} className="rounded-full border border-dark-border px-2 py-0.5 text-dark-muted">
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {!byYear.length && <p className="text-dark-muted">No projects match your filters.</p>}
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}

export default ProjectsPage;
