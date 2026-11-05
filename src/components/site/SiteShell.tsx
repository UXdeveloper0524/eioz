"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ParticleField } from "./ParticleField";
import { CustomCursor, FloatingPhone, SceneIndicator } from "./Overlays";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <ParticleField />
      <SiteHeader />
      <main className="relative z-10"><div key={pathname} className="page-fade">{children}</div></main>
      <SceneIndicator />
      <FloatingPhone />
      <CustomCursor />
      <div className="relative z-10"><SiteFooter /></div>
    </>
  );
}
