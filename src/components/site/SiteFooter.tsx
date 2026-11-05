"use client";
import { Link } from "@/components/site/Link";
import { ArrowUp, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Logo } from "./SiteHeader";
import { NAV, OFFICES, telHref } from "@/lib/site";
import { ParticleToggle } from "./ParticleToggle";

const SOCIAL = [
  { label: "Facebook", icon: Facebook },
  { label: "X", icon: Twitter },
  { label: "Instagram", icon: Instagram },
  { label: "LinkedIn", icon: Linkedin },
];

export function SiteFooter() {
  return (
    <footer data-scene="footer" className="relative border-t border-dark-border bg-dark/70 text-dark-muted backdrop-blur-md">
      <div className="container-site grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_0.8fr]">
        <div>
          <Logo />
          <p className="mt-6 max-w-sm text-sm leading-relaxed">
            EIOZ Energy delivers engineered lighting solutions focused on sustainability, energy
            efficiency, and innovation. We specialize in lighting design, supply, installation, and
            energy saving solutions for commercial, industrial, and infrastructure projects across
            Qatar, the UAE and international markets.
          </p>
          <ul className="mt-6 flex gap-3">
            {SOCIAL.map(({ label, icon: Icon }) => (
              <li key={label}>
                {/* Placeholder social links — replace with real profiles */}
                <a
                  href="#"
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-dark-border text-dark-foreground transition-colors hover:border-primary hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
        {OFFICES.map((o) => (
          <address key={o.city} className="not-italic">
            <h3 className="eyebrow">{o.city}</h3>
            <ul className="mt-5 space-y-3 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {o.address}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={telHref(o.phone)} className="hover:text-primary">{o.phone}</a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${o.email}`} className="hover:text-primary">{o.email}</a>
              </li>
            </ul>
          </address>
        ))}
        <nav aria-label="Footer">
          <h3 className="eyebrow">Quick Links</h3>
          <ul className="mt-5 space-y-2.5 text-sm">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link to={n.to} className="hover:text-primary">
                  {n.to === "/contact-us" ? "Contact" : n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-dark-border">
        <div className="container-site flex flex-wrap items-center justify-between gap-4 py-6 text-xs">
          <p>Copyright © 2026 EIOZ Energy</p>
          <ParticleToggle />
          <a href="#top" className="inline-flex items-center gap-1.5 hover:text-primary">
            Back to top <ArrowUp className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
