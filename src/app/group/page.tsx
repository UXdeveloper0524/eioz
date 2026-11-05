import type { Metadata } from "next";
import PageContent from "@/components/pages/group";
import { pageMetadata } from "@/lib/site";
import { getSitePage } from "@/lib/strapi";

const description = 'The EIOZ Energy group: Insight Lighting, Roveoz and Glandro — architectural lighting, LED products and street lighting infrastructure.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('group');
  const metadata = pageMetadata(page?.seoTitle ?? 'Group', page?.seoDescription ?? description, '/group');
  return metadata;
}

export default async function Page() {
  const hero = await getSitePage('group');
  return <PageContent hero={hero} />;
}
