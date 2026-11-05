import type { Metadata } from "next";
import PageContent from "@/components/pages/our-expertise";
import { pageMetadata } from "@/lib/site";
import { getSitePage } from "@/lib/strapi";

const description = 'Outdoor, decorative, landscape, facade, indoor, street and industrial explosion-proof lighting plus decorative poles and obstruction lights from EIOZ Energy.';

export async function generateMetadata(): Promise<Metadata> {
  const page = await getSitePage('our-expertise');
  const metadata = pageMetadata(page?.seoTitle ?? 'Our Expertise', page?.seoDescription ?? description, '/our-expertise');
  return metadata;
}

export default async function Page() {
  const hero = await getSitePage('our-expertise');
  return <PageContent hero={hero} />;
}
