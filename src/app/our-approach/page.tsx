import type { Metadata } from "next";
import PageContent from "@/components/pages/our-approach";
import { pageMetadata } from "@/lib/site";
import { getSitePage } from "@/lib/strapi";

const description = 'From design and engineering to installation and commissioning: the structured EIOZ Energy approach to reliable, energy-efficient lighting.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('our-approach');
  const metadata = pageMetadata(page?.seoTitle ?? 'Our Approach', page?.seoDescription ?? description, '/our-approach');
  return metadata;
}

export default async function Page() {
  const hero = await getSitePage('our-approach');
  return <PageContent hero={hero} />;
}
