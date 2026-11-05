import type { Metadata } from "next";
import PageContent from "@/components/pages/about";
import { pageMetadata } from "@/lib/site";
import { getSitePage } from "@/lib/strapi";

const description = 'Founded in 2010, EIOZ Energy delivers innovative, energy-efficient lighting with manufacturing partners across Europe, the USA, Turkey, India and China.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('about');
  const metadata = pageMetadata(page?.seoTitle ?? 'About Us', page?.seoDescription ?? description, '/about');
  metadata.openGraph = { ...metadata.openGraph, images: ['https://eiozenergy.com/wp-content/uploads/2026/05/Occhio_Mito_Raggio_Lusso_Bogenleuchte_LED-f920a1f128a595c76d3e3bb07d5ec2a4-1.webp'] };
  metadata.twitter = { ...metadata.twitter, images: ['https://eiozenergy.com/wp-content/uploads/2026/05/Occhio_Mito_Raggio_Lusso_Bogenleuchte_LED-f920a1f128a595c76d3e3bb07d5ec2a4-1.webp'] };
  return metadata;
}

export default async function Page() {
  const hero = await getSitePage('about');
  return <PageContent hero={hero} />;
}
