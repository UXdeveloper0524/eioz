"use client";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Eyebrow + large title with one highlighted word (e.g. "EIOZ ENERGY <Projects>"). */
export function SectionHeading({
  eyebrow,
  title,
  highlight,
  intro,
  as: Tag = "h2",
  align = "left",
  tone = "light",
  id,
}: {
  id?: string | undefined;
  eyebrow: string;
  title: string;
  highlight?: string | undefined;
  intro?: ReactNode | undefined;
  as?: "h1" | "h2";
  align?: "left" | "center";
  tone?: "light" | "dark";
}) {
  return (
    <div className={cn("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <Tag
        id={id}
        className={cn(
          "mt-4 text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl",
          tone === "dark" ? "text-dark-foreground" : "text-foreground",
        )}
      >
        {title} {highlight && <span className="text-primary">{highlight}</span>}
      </Tag>
      {intro && (
        <p className={cn("mt-5 text-lg leading-relaxed", tone === "dark" ? "text-dark-muted" : "text-muted-foreground")}>
          {intro}
        </p>
      )}
    </div>
  );
}

/** Dark cinematic page hero shell used by every inner page. */
export function PageHero({
  eyebrow,
  title,
  highlight,
  intro,
  aside,
  before,
}: {
  eyebrow: string;
  title: string;
  highlight?: string;
  intro?: ReactNode;
  aside?: ReactNode;
  /** Render highlight before the title (e.g. "<EIOZ ENERGY> GROUP"). */
  before?: boolean;
}) {
  return (
    <section data-scene="page-hero" className="relative overflow-hidden pb-20 pt-36 lg:pb-28 lg:pt-44">
      <div aria-hidden className="bg-glow pointer-events-none absolute inset-0 opacity-60" />
      <div className={cn("container-site relative grid items-center gap-12", aside && "lg:grid-cols-[1.1fr_0.9fr]")}>
        <div className="max-w-3xl">
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-dark-foreground md:text-5xl lg:text-6xl">
            {before ? (
              <>
                <span className="text-primary">{highlight}</span> {title}
              </>
            ) : (
              <>
                {title} {highlight && <span className="text-primary">{highlight}</span>}
              </>
            )}
          </h1>
          {intro && <p className="mt-6 text-lg leading-relaxed text-dark-muted">{intro}</p>}
        </div>
        {aside}
      </div>
    </section>
  );
}

export function FeatureCard({ icon, title, children }: { icon?: ReactNode; title: string; children: ReactNode }) {
  return (
    <article className="card-lift rounded-xl border bg-card p-7 shadow-card">
      {icon && <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-primary">{icon}</div>}
      <h3 className="text-xl font-bold">{title}</h3>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </article>
  );
}

export function PlaceholderSection({ label }: { label: string }) {
  return (
    <section className="section-pad surface-glass">
      <div className="container-site">
        <div className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">
          {label} — content coming in the next build.
        </div>
      </div>
    </section>
  );
}
