import type { Metadata } from "next";

export const SITE_URL = "https://www.eiozenergy.com";
export const LOGO_URL = "https://eiozenergy.com/wp-content/uploads/2026/04/eioz-18-1.png";

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/group", label: "Group" },
  { to: "/our-approach", label: "Our Approach" },
  { to: "/our-expertise", label: "Our Expertise" },
  { to: "/projects", label: "Projects" },
  { to: "/careers", label: "Careers" },
  { to: "/contact-us", label: "Contact Us" },
] as const;

export const OFFICES = [
  {
    city: "Abu Dhabi, UAE",
    address: "Nahel Tower, Office Number M09, Najda St, Abu Dhabi, United Arab Emirates",
    phone: "+971 54 339 2233",
    email: "info@eiozenergy.com",
  },
  {
    city: "Doha, Qatar",
    address: "Office No. 612, Markaz Almana Tower, Old Airport Road, PO Box 91131, Doha, Qatar",
    phone: "+974 4001 3333",
    email: "info@eiozenergy.com",
  },
];

export const telHref = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const full = `${title} | EIOZ Energy`;
  const url = `${SITE_URL}${path}`;
  return {
    title: full,
    description,
    alternates: { canonical: url },
    openGraph: { title: full, description, type: "website", url },
    twitter: { card: "summary_large_image" },
  };
}
