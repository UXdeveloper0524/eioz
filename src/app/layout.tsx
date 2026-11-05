import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/SiteShell";
import { LOGO_URL, OFFICES, SITE_URL } from "@/lib/site";
import "@/styles.css";

export const metadata: Metadata = {
  title: "EIOZ Energy",
  authors: [{ name: "EIOZ Energy" }],
  icons: { icon: "/favicon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#07090d" };

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "EIOZ Energy",
  url: SITE_URL,
  logo: LOGO_URL,
  foundingDate: "2010",
  email: "info@eiozenergy.com",
  address: OFFICES.map((o) => ({ "@type": "PostalAddress", streetAddress: o.address })),
  contactPoint: OFFICES.map((o) => ({ "@type": "ContactPoint", telephone: o.phone, contactType: "sales" })),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@500;600;700;800&display=swap" />
      </head>
      <body id="top">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
